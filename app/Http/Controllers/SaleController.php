<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
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
        // Traemos las ventas + los items vendidos + el nombre del producto original
        $sales = Sale::with(['items.product']) 
            ->latest() // Ordenamos por la más reciente
            ->paginate(10); // Paginamos de 10 en 10

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

        // ¡¡CLAVE!! Usamos una transacción de BD.
        // Si algo falla (ej. no hay stock), se revierte TODO.
        // No se creará la venta, ni se descontará stock parcial.
        try {
            return DB::transaction(function () use ($cartItems, $register, $request) {
                
                $serverTotal = 0;
                $itemsToCreate = [];

                foreach ($cartItems as $item) {
                    $product = Product::find($item['id']);

                    // 2. Comprobar el stock
                    if ($product->stock < $item['quantity']) {
                        // Si no hay stock, lanzamos una excepción para revertir la transacción
                        throw ValidationException::withMessages([
                            'stock' => 'No hay suficiente stock para: ' . $product->name,
                        ]);
                    }

                    // 3. Calcular el total (del lado del servidor, NUNCA confiar en el cliente)
                    $itemTotal = $product->price * $item['quantity'];
                    $serverTotal += $itemTotal;

                    // 4. Preparar el 'SaleItem'
                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price, // Precio del producto en ESE momento
                    ];

                    // 5. Descontar el stock
                    $product->stock -= $item['quantity'];
                    $product->save();
                }

                // 6. Crear la Venta
                $sale = Sale::create([
                    'cash_register_id' => $register->id,
                    'total' => $serverTotal,
                    'payment_method' => $request->payment_method,
                    'client_id' => $request->client_id,
                ]);

                // 7. Insertar los SaleItems en la BD
                $sale->items()->createMany($itemsToCreate);

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
        return $pdf->stream('ticket-'.$sale->id.'.pdf');
    }

    public function destroy(Sale $sale)
    {
        // 1. Validaciones de seguridad
        if ($sale->status === 'cancelled') {
            return redirect()->back()->with('error', 'Esta venta ya fue anulada.');
        }

        // Opcional: Impedir anular ventas de cajas cerradas
        // if ($sale->cashRegister->status === 'closed') { ... }

        try {
            DB::transaction(function () use ($sale) {
                
                // 2. Devolver Stock
                // Recorremos los items de la venta
                foreach ($sale->items as $item) {
                    $product = $item->product;
                    if ($product) {
                        $product->stock += $item->quantity; // Sumamos lo que se vendió
                        $product->save();
                    }
                }

                // 3. Marcar venta como anulada
                $sale->update(['status' => 'cancelled']);

                // Opcional: Si quieres guardar QUIÉN la anuló, podrías tener una columna 'cancelled_by'
            });

            return redirect()->back()->with('success', 'Venta anulada y stock restaurado.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al anular la venta: ' + $e->getMessage());
        }
    }
}