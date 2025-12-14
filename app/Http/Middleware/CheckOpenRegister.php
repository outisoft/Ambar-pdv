<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckOpenRegister
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Si el usuario no tiene sucursal (ej. Admin Global), 
            // técnicamente no puede vender, así que lo dejamos pasar 
            // (o lo bloqueamos según tu lógica de negocio).
            if (!$user->branch_id) {
                // Opción A: Dejar pasar al admin (pero no podrá guardar venta porque venta requiere caja)
                return $next($request); 
            }

            // Verificamos caja abierta EN LA SUCURSAL ACTUAL
            $hasOpenRegister = \App\Models\CashRegister::where('user_id', $user->id)
                ->where('branch_id', $user->branch_id) // <-- LA CLAVE
                ->where('status', 'open')
                ->exists();

            if (!$hasOpenRegister) {
                return redirect()->route('cash_register.create');
            }
        }

        return $next($request);
    }
}
