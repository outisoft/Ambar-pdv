<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ForcePasswordChangeController extends Controller
{
    // 1. Mostrar el formulario
    public function edit()
    {
        // Nombre de componente alineado con la ruta de React: resources/js/pages/auth/force-password-change.tsx
        return Inertia::render('auth/force-password-change');
    }

    // 2. Procesar el cambio
    public function update(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = Auth::user();

        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false, // ¡IMPORTANTE! Apagamos la bandera
        ]);

        return redirect()->route('dashboard')->with('success', 'Contraseña actualizada correctamente.');
    }
}
