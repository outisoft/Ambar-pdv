<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class CashRegisterController extends Controller
{
    // 1. Mostrar formulario de apertura (si no hay caja abierta)
    public function create()
    {
        // Verificar si YA tiene una abierta para no dejarle abrir otra
        $openRegister = CashRegister::where('user_id', Auth::id())
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
            'initial_amount' => $request->initial_amount,
            'opened_at' => Carbon::now(),
            'status' => 'open',
        ]);

        return redirect()->route('pos');
    }

    // 3. Cerrar Caja (Mostrar resumen y pedir conteo)
    public function close()
    {
        $register = CashRegister::where('user_id', Auth::id())
            ->where('status', 'open')
            ->firstOrFail();

        // AHORA SEPARAMOS LOS TOTALES
        $systemSales = $register->sales()
            ->where('status', '!=', 'cancelled') // <-- FILTRO CLAVE
            ->sum('total');

        $cashSales = $register->sales()
            ->where('payment_method', 'cash')
            ->where('status', '!=', 'cancelled') // <-- FILTRO CLAVE
            ->sum('total');

        $nonCashSales = $register->sales()
            ->whereIn('payment_method', ['card', 'transfer'])
            ->where('status', '!=', 'cancelled') // <-- FILTRO CLAVE
            ->sum('total');
        
        // 1. Ventas TOTALES (Sistema)
        $totalSystemSales = $register->sales()->sum('total');

        // 2. Ventas SOLO EFECTIVO (Esto es lo que debe haber en el cajón)
        $cashSales = $register->sales()->where('payment_method', 'cash')->sum('total');

        // 3. Ventas NO EFECTIVO (Tarjeta + Transferencia)
        $nonCashSales = $register->sales()->whereIn('payment_method', ['card', 'transfer'])->sum('total');

        // 4. ¿Cuánto dinero físico espero?
        // Fondo Inicial + Ventas en Efectivo
        $expectedCash = $register->initial_amount + $cashSales;

        return Inertia::render('CashRegister/Close', [
            'register' => $register,
            'systemSales' => $totalSystemSales, // Total general informativo
            'cashSales' => $cashSales,           // Total efectivo informativo
            'nonCashSales' => $nonCashSales,     // Total tarjetas informativo
            'expectedTotal' => $expectedCash,    // ESTE ES EL NÚMERO CLAVE PARA EL ARQUEO
        ]);
    }

    // 4. Guardar el cierre
    public function update(Request $request, $id)
    {
        $request->validate([
            'final_amount' => 'required|numeric|min:0', // Lo que contó el cajero
        ]);

        $register = CashRegister::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Calculamos ventas finales por seguridad
        $totalSales = $register->sales()->sum('total');

        $register->update([
            'final_amount' => $request->final_amount,
            'total_sales' => $totalSales,
            'status' => 'closed',
            'closed_at' => Carbon::now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Caja cerrada correctamente.');
    }
}