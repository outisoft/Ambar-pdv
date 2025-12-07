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
            $hasOpenRegister = \App\Models\CashRegister::where('user_id', Auth::id())
                ->where('status', 'open')
                ->exists();

            if (!$hasOpenRegister) {
                // Si no tiene caja abierta, lo mandamos a abrirla
                return redirect()->route('cash_register.create');
            }
        }

        return $next($request);
    }
}
