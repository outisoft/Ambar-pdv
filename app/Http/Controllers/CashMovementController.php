<?php

namespace App\Http\Controllers;

use App\Models\CashMovement;
use App\Models\CashRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CashMovementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:in,out',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        // Buscar la caja ABIERTA del usuario actual
        $register = CashRegister::where('user_id', $user->id)
            ->where('status', 'open')
            ->first();

        if (!$register) {
            return back()->with('error', 'No tienes una caja abierta para registrar movimientos.');
        }

        // Crear el movimiento
        CashMovement::create([
            'cash_register_id' => $register->id,
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Movimiento registrado correctamente.');
    }
}
