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

        $totalSystemSales = $cashSales + $nonCashSales;

        // Efectivo esperado en caja = fondo inicial + ventas en efectivo
        $expectedCash = $register->initial_amount + $cashSales;

        return Inertia::render('CashRegister/Close', [
            'auth' => [
                'user' => $user,
            ],
            'register' => $register,
            'systemSales' => $totalSystemSales,
            'cashSales' => $cashSales,
            'nonCashSales' => $nonCashSales,
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

        $expectedCash = $register->initial_amount + $cashSales;
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
                // Calculamos la diferencia al vuelo si no guardaste la columna 'discrepancy'
                // Diferencia = Lo que entregó - (Inicial + Ventas Totales)

                // OJO: Asegúrate de que 'total_sales' incluya lo que esperabas que hubiera en caja.
                // Si total_sales es todo (tarjeta+efectivo), el cálculo es:
                // Diferencia = final_amount - (initial + ventas_efectivo)
                // Como guardar ventas_efectivo histórico es complejo si no tienes la columna,
                // usaremos la lógica simple asumiendo que guardaste 'discrepancy' o calculamos aproximado.

                // Si seguiste mi consejo de agregar la columna 'discrepancy' en la migración pasada:
                $diff = $reg->discrepancy;

                // SI NO TIENES LA COLUMNA, usaremos esto (menos preciso si aceptas tarjeta):
                if ($diff === null) {
                    $diff = $reg->final_amount - ($reg->initial_amount + $reg->total_sales);
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
