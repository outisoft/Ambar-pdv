<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Company;

class SettingController extends Controller
{
    public function edit()
    {
        // 1. OBTENEMOS LA EMPRESA DEL USUARIO LOGUEADO
        $user = Auth::user();

        // Validar que sea Gerente o Admin con empresa asignada
        if (!$user->company_id) {
            abort(403, 'No tienes una empresa asignada para configurar.');
        }

        // OJO: el middleware de Inertia carga la relación company solo con algunos campos
        // (id, name, subscription_status, subscription_ends_at). Aquí necesitamos TODOS
        // los campos y también el plan asociado, así que recargamos la empresa
        // directamente desde la BD incluyendo la relación 'plan'.

        $company = Company::with('plan')->findOrFail($user->company_id);

        return Inertia::render('settings/Edit', [
            'company' => $company,
            'logoUrl' => $company->logo_path ? Storage::url($company->logo_path) : null,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        if (!$user->company_id) abort(403);

        $company = $user->company;

        $validated = $request->validate([
            'name' => 'required|string|max:255', // Antes era shop_name
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'ticket_footer_message' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        // Subida de Logo
        if ($request->hasFile('logo')) {
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            // Guardamos en carpeta por ID de empresa para orden
            $path = $request->file('logo')->store('companies/' . $company->id, 'public');
            $company->logo_path = $path;
        }

        $company->update([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'tax_id' => $validated['tax_id'],
            'ticket_footer_message' => $validated['ticket_footer_message'],
            // logo_path se actualizó arriba
        ]);

        return back()->with('success', 'Datos de la empresa actualizados.');
    }
}
