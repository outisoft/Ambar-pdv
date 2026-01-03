<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Notifications\LowStockAlert;
use App\Notifications\CashRegisterDiscrepancy;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

class CashRegisterController extends Controller
{
    // 1. Mostrar formulario de apertura (si no hay caja abierta)
    public function create()
    {
        $user = Auth::user();

        // VALIDACIÓN: El usuario debe tener sucursal asignada para abrir caja
        if (!$user->branch_id) {
            abort(403, 'No tienes una sucursal asignada para abrir caja.');
        }

        // VERIFICAR SI YA TIENE CAJA ABIERTA EN *ESTA* SUCURSAL
        $openRegister = CashRegister::where('user_id', $user->id)
            ->where('branch_id', $user->branch_id) // <-- FILTRO CLAVE
            ->where('status', 'open')
            ->first();

        if ($openRegister) {
            return redirect()->route('pos');
        }

        return Inertia::render('CashRegister/Open');
    }

    // 2. Guardar la apertura (STORE)
    public function store(Request $request)
    {
        $request->validate([
            'initial_amount' => 'required|numeric|min:0',
        ]);

        CashRegister::create([
            'user_id' => Auth::id(),
            'branch_id' => Auth::user()->branch_id,
            'initial_amount' => $request->initial_amount,
            'opened_at' => Carbon::now(),
            'status' => 'open',
        ]);

        return redirect()->route('pos');
    }

    // 3. Cerrar Caja (GET: mostrar resumen y formulario de conteo)
    public function close()
    {
        $user = Auth::user();

        // Buscar la caja abierta del usuario en su sucursal
        $register = CashRegister::where('user_id', $user->id)
            ->where('branch_id', $user->branch_id)
            ->where('status', 'open')
            ->firstOrFail();

        // Cálculos para mostrar en la pantalla de cierre
        $cashSales = $register->sales()
            ->where('payment_method', 'cash')
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $nonCashSales = $register->sales()
            ->whereIn('payment_method', ['card', 'transfer'])
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        // Ventas a crédito (no afectan efectivo esperado, pero se muestran para informar)
        $creditSales = $register->sales()
            ->where('payment_method', 'credit')
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $totalSystemSales = $cashSales + $nonCashSales + $creditSales;

        // --- NUEVO: Sumar Entradas y Restar Salidas ---
        $cashIn = $register->movements()->where('type', 'in')->sum('amount');
        $cashOut = $register->movements()->where('type', 'out')->sum('amount');

        // Detalle de entradas: distinguir abonos de crédito de otras entradas
        $creditPaymentsIn = $register->movements()
            ->where('type', 'in')
            ->where('description', 'like', 'Abono cliente:%')
            ->sum('amount');

        $otherInputs = $cashIn - $creditPaymentsIn;

        // 4. ARQUEO DE CAJA CORREGIDO
        // Esperado = (Inicio + Ventas Efectivo + Entradas) - Salidas
        $expectedCash = ($register->initial_amount + $cashSales + $cashIn) - $cashOut;
        return Inertia::render('CashRegister/Close', [
            'auth' => [
                'user' => $user,
            ],
            'register' => $register,
            'systemSales' => $totalSystemSales,
            'cashSales' => $cashSales,
            'nonCashSales' => $nonCashSales,
            'creditSales' => $creditSales,
            'cashIn' => $cashIn,
            'cashOut' => $cashOut,
            'creditPayments' => $creditPaymentsIn,
            'otherInputs' => $otherInputs,
            'expectedTotal' => $expectedCash,
        ]);
    }

    // 4. Guardar el cierre (POST desde el formulario)
    public function update(Request $request, $id)
    {
        $request->validate([
            'final_amount' => 'required|numeric|min:0', // Lo que contó el cajero
        ]);

        $user = Auth::user();

        $register = CashRegister::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Recalcular ventas para seguridad
        $cashSales = $register->sales()
            ->where('payment_method', 'cash')
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $nonCashSales = $register->sales()
            ->whereIn('payment_method', ['card', 'transfer'])
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $totalSystemSales = $cashSales + $nonCashSales;

        // Incluir también movimientos de caja (entradas / salidas) igual que en close()
        $cashIn = $register->movements()->where('type', 'in')->sum('amount');
        $cashOut = $register->movements()->where('type', 'out')->sum('amount');

        // Esperado = (Inicio + Ventas Efectivo + Entradas) - Salidas
        $expectedCash = ($register->initial_amount + $cashSales + $cashIn) - $cashOut;
        $actualCash = $request->final_amount;
        $difference = $actualCash - $expectedCash;

        // Guardar cierre
        $register->update([
            'final_amount' => $actualCash,
            'total_sales' => $totalSystemSales,
            'status' => 'closed',
            'closed_at' => Carbon::now(),
            'discrepancy' => $difference,
        ]);

        // Notificación a gerentes si hay diferencia relevante
        $threshold = 10;

        if (abs($difference) > $threshold) {
            $type = $difference < 0 ? 'Faltante' : 'Sobrante';

            $gerentes = User::role('gerente')
                ->where('company_id', $user->company_id)
                ->get();

            if ($gerentes->count() > 0) {
                $branchName = $register->branch ? $register->branch->name : 'Sucursal Desconocida';

                Notification::send($gerentes, new CashRegisterDiscrepancy(
                    $branchName,
                    $user->name,
                    $difference,
                    $type
                ));
            }
        }

        return redirect()->route('dashboard')->with('success', 'Caja cerrada correctamente.');
    }

    public function history(Request $request)
    {
        $user = Auth::user();

        // 1. Iniciamos la consulta cargando relaciones
        $query = CashRegister::with(['user', 'branch'])
            ->where('status', 'closed') // Solo nos interesan las cerradas
            ->orderBy('closed_at', 'desc');

        // 2. FILTROS DE SEGURIDAD (SaaS)
        if ($user->hasRole('super-admin')) {
            // Ve todo
        } elseif ($user->hasRole('gerente')) {
            // Ve todas las cajas de SU empresa (a través de las sucursales)
            $query->whereHas('branch', function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
        } elseif ($user->hasRole('cajero')) {
            // Ve solo SUS propios cortes
            $query->where('user_id', $user->id);
        }

        // 3. Paginación y Transformación
        $registers = $query->paginate(15)
            ->through(function ($reg) {
                // Usamos la discrepancia guardada cuando exista.
                $diff = $reg->discrepancy;

                // Para registros antiguos sin discrepancia calculada,
                // recalculamos usando la misma fórmula que en close()/update():
                // Esperado = (Inicio + Ventas Efectivo + Entradas) - Salidas
                if ($diff === null) {
                    $cashSales = $reg->sales()
                        ->where('payment_method', 'cash')
                        ->where('status', '!=', 'cancelled')
                        ->sum('total');

                    $cashIn = $reg->movements()->where('type', 'in')->sum('amount');
                    $cashOut = $reg->movements()->where('type', 'out')->sum('amount');

                    $expectedCash = ($reg->initial_amount + $cashSales + $cashIn) - $cashOut;
                    $diff = $reg->final_amount - $expectedCash;
                }

                return [
                    'id' => $reg->id,
                    'branch' => $reg->branch ? $reg->branch->name : 'N/A',
                    'user' => $reg->user ? $reg->user->name : 'N/A',
                    'opened_at' => $reg->opened_at,
                    'closed_at' => $reg->closed_at,
                    'initial_amount' => $reg->initial_amount,
                    'final_amount' => $reg->final_amount, // Lo que entregó
                    'discrepancy' => $diff, // Faltante o Sobrante
                ];
            });

        return Inertia::render('CashRegister/History', [
            'registers' => $registers
        ]);
    }
}
