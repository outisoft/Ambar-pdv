<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // 1. Si no está logueado o es Super Admin, déjalo pasar
        if (!$user || $user->hasRole('super-admin')) {
            return $next($request);
        }

        // 2. Obtener la empresa
        $company = $user->company;

        if ($company) {
            // 3. Verificar si la fecha de vencimiento ya pasó
            // isPast() devuelve true si la fecha es anterior a "ahora"
            if (Carbon::parse($company->subscription_ends_at)->isPast()) {

                // IMPORTANTE: Permitir acceso a la ruta de "pago pendiente", "logout"
                // y "renovación manual" para evitar un bucle infinito de redirección.
                if (
                    !$request->routeIs('subscription.expired') &&
                    !$request->routeIs('logout') &&
                    !$request->routeIs('companies.renew')
                ) {
                    return redirect()->route('subscription.expired');
                }
            }
        }

        return $next($request);
    }
}
