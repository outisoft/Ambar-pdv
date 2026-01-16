<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Si el usuario está logueado, tiene la bandera activa y NO es super admin
        if ($user && $user->must_change_password && ! $user->hasRole('super-admin')) {

            // Lista de rutas permitidas (Para que no entre en un bucle infinito)
            $allowedRoutes = [
                'password.force_change', // Ver el formulario
                'password.force_update', // Enviar el formulario
                'logout',                // Permitirle salir
            ];

            // Si intenta ir a cualquier otra ruta, lo mandamos al formulario
            $routeName = $request->route() ? $request->route()->getName() : null;

            if (! $routeName || ! in_array($routeName, $allowedRoutes, true)) {
                return redirect()->route('password.force_change');
            }
        }

        return $next($request);
    }
}
