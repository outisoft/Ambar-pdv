<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Notifications\LowStockAlert; // <-- IMPORTANTE
use Illuminate\Support\Facades\Notification;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException; // Para errores de stock
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class SaleController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Iniciamos la consulta cargando relaciones para evitar lentitud (N+1)
        // Cargamos 'cashRegister.branch' y 'cashRegister.user.company' para saber de dónde vino la venta
        $query = Sale::with(['cashRegister.branch', 'cashRegister.user.company', 'client', 'items']);

        // --- LÓGICA DE JERARQUÍA ---

        if ($user->hasRole('super-admin')) {
            // NIVEL 1: Ve todo. No aplicamos filtros.
        } elseif ($user->hasRole('gerente')) {
            // NIVEL 2: Ve solo ventas donde la caja pertenece a SU empresa
            $query->whereHas('cashRegister.user', function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
        } elseif ($user->hasRole('cajero')) {
            // NIVEL 3: Ve solo ventas de SU sucursal actual
            // (Usamos la sucursal de la caja registradora para filtrar)
            $query->whereHas('cashRegister', function ($q) use ($user) {
                $q->where('branch_id', $user->branch_id);
            });
        }

        // Ordenamos por fecha descendente
        $sales = $query->latest()->paginate(10);

        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validación de los datos recibidos (el carrito)
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'in:cash,card,transfer'],
            'client_id' => ['nullable', 'exists:clients,id'],
        ]);

        $cartItems = $request->input('items');

        // Verificar caja abierta ANTES de la transacción
        $register = \App\Models\CashRegister::where('user_id', Auth::id())
            ->where('branch_id', Auth::user()->branch_id)
            ->where('status', 'open')
            ->first();

        if (!$register) {
            return redirect()->back()->withErrors(['general' => 'No tienes una caja abierta. Por favor, abre caja antes de realizar ventas.']);
        }

        $user = Auth::user();

        // Validar que el usuario tenga sucursal (vital para saber de dónde restar)
        if (!$user->branch_id) {
            return back()->with('error', 'Error: No tienes una sucursal asignada para descontar inventario.');
        }

        try {
            DB::transaction(function () use ($request, $user) {

                // 1. Obtener/Crear Venta (Esto sigue igual, pero asegurando la caja correcta)
                $register = \App\Models\CashRegister::where('user_id', $user->id)
                    ->where('branch_id', $user->branch_id)
                    ->where('status', 'open')
                    ->firstOrFail();

                // Calculamos total (simplificado para el ejemplo)
                $total = collect($request->items)->sum(fn($i) => $i['price'] * $i['quantity']);

                $sale = \App\Models\Sale::create([
                    'user_id' => $user->id,
                    'branch_id' => $user->branch_id, // Si añadiste esta columna a sales (recomendado)
                    'cash_register_id' => $register->id,
                    'client_id' => $request->client_id,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                ]);

                // 2. PROCESAR ITEMS Y STOCK (AQUÍ ESTÁ EL CAMBIO IMPORTANTE)
                foreach ($request->items as $item) {

                    // A. Buscamos el registro de inventario en la SUCURSAL ACTUAL
                    // Usamos lockForUpdate para evitar que dos cajeros vendan el mismo último producto a la vez
                    $inventory = DB::table('branch_product')
                        ->where('branch_id', $user->branch_id)
                        ->where('product_id', $item['id'])
                        ->lockForUpdate()
                        ->first();

                    // B. Verificamos si existe el producto en esta sucursal
                    if (!$inventory) {
                        throw new \Exception("El producto '{$item['name']}' no está registrado en esta sucursal.");
                    }

                    // C. Verificamos cantidad suficiente
                    if ($inventory->stock < $item['quantity']) {
                        throw new \Exception("Stock insuficiente para '{$item['name']}'. Disponibles: {$inventory->stock}");
                    }

                    // D. RESTAMOS EL STOCK (En la tabla pivote)
                    DB::table('branch_product')
                        ->where('id', $inventory->id) // Usamos el ID de la fila pivote para ser exactos
                        ->decrement('stock', $item['quantity']);

                    $newStock = $inventory->stock - $item['quantity'];

                    if ($newStock <= $inventory->min_stock) {

                        // 1. Buscamos el Producto y Sucursal completos para la notificación
                        $productModel = \App\Models\Product::find($item['id']);
                        $branchModel = \App\Models\Branch::find($user->branch_id);

                        // 2. ¿A quién notificamos? 
                        // Al Gerente de ESTA empresa.
                        $gerentes = User::role('gerente')
                            ->where('company_id', $user->company_id)
                            ->get();

                        // Enviamos la notificación (Laravel se encarga de no duplicar si usas delay, 
                        // pero por ahora será directo)
                        Notification::send($gerentes, new LowStockAlert($productModel, $branchModel, $newStock));
                    }

                    // E. Guardamos el detalle de la venta
                    $sale->items()->create([
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                // 8. Si todo salió bien, Inertia redirige (o podemos devolver OK)
                // Redirigimos de vuelta al TPV con un mensaje de éxito.
                return redirect()->route('pos')
                    ->with('success', 'Venta procesada.')
                    ->with('last_sale_id', $sale->id);
            });
        } catch (ValidationException $e) {
            // Si atrapamos el error de stock, devolvemos el error a React
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Cualquier otro error: Logueamos y mostramos el mensaje real para depuración
            \Illuminate\Support\Facades\Log::error('Error en venta: ' . $e->getMessage());
            return redirect()->back()->withErrors(['general' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function ticket(Sale $sale)
    {
        // Cargamos las relaciones necesarias para la vista
        $sale->load(['items.product']); // (y 'user' si lo usas)

        // Cargamos la vista de Blade y le pasamos la venta
        $pdf = Pdf::loadView('sales.ticket', compact('sale'));

        // Configuración opcional del papel (ancho, alto).
        // 80mm de ancho (aprox 226pt). El alto 'auto' es difícil en PDF,
        // así que ponemos uno muy alto o usamos formato estándar.
        // Para simplicidad, usaremos un formato custom estrecho.
        $pdf->setPaper([0, 0, 226, 600], 'portrait');

        // 'stream' abre el PDF en el navegador en lugar de descargarlo ('download')
        return $pdf->stream('ticket-' . $sale->id . '.pdf');
    }

    public function destroy(Sale $sale)
    {
        $user = Auth::user();

        // 1. VALIDACIÓN DE SEGURIDAD POR JERARQUÍA

        // Si es CAJERO: Solo puede anular si la venta es de su sucursal
        if ($user->hasRole('cajero')) {
            // Accedemos a la sucursal a través de la caja registradora
            if ($sale->cashRegister->branch_id !== $user->branch_id) {
                abort(403, 'No tienes permiso para anular ventas de otra sucursal.');
            }
        }

        // Si es GERENTE: Solo puede anular si la venta es de su empresa
        if ($user->hasRole('gerente')) {
            if ($sale->cashRegister->user->company_id !== $user->company_id) {
                abort(403, 'No tienes permiso para anular ventas de otra empresa.');
            }
        }

        // 2. VALIDAR ESTADO
        if ($sale->status === 'cancelled') {
            return redirect()->back()->with('error', 'Esta venta ya fue anulada.');
        }

        try {
            DB::transaction(function () use ($sale) {
                // A. Devolver Stock (A LA SUCURSAL CORRECTA)
                // Necesitamos saber a qué sucursal devolver el stock.
                // Lo tomamos de la caja registradora donde se hizo la venta.
                $branchId = $sale->cashRegister->branch_id;

                foreach ($sale->items as $item) {
                    // Buscamos el inventario en esa sucursal específica
                    $inventory = DB::table('branch_product')
                        ->where('branch_id', $branchId)
                        ->where('product_id', $item->product_id)
                        ->first();

                    if ($inventory) {
                        // Devolvemos el stock
                        DB::table('branch_product')
                            ->where('id', $inventory->id)
                            ->increment('stock', $item->quantity);
                    }
                }

                // B. Marcar como anulada
                $sale->update(['status' => 'cancelled']);
            });

            return redirect()->back()->with('success', 'Venta anulada y stock restaurado a la sucursal de origen.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al anular: ' . $e->getMessage());
        }
    }
}
