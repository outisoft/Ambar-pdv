<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    // Solo necesitamos edit (mostrar) y update (guardar)
    
    public function edit()
    {
        // Obtenemos la primera (y única) fila
        $setting = Setting::firstOrFail();

        return Inertia::render('settings/Edit', [
            'setting' => $setting,
            // Enviamos la URL pública del logo si existe
            'logoUrl' => $setting->logo_path ? Storage::url($setting->logo_path) : null,
        ]);
    }

    public function update(Request $request)
    {
        $setting = Setting::firstOrFail();

        $validated = $request->validate([
            'shop_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'logo' => 'nullable|image|max:1024', // Validamos que sea imagen max 1MB
        ]);

        // Manejo de subida de imagen
        if ($request->hasFile('logo')) {
            // 1. Borrar logo anterior si existe
            if ($setting->logo_path) {
                Storage::disk('public')->delete($setting->logo_path);
            }
            // 2. Guardar nuevo logo en carpeta 'logos' del disco público
            $path = $request->file('logo')->store('logos', 'public');
            $setting->logo_path = $path;
        }

        // Actualizamos el resto de campos
        $setting->update([
            'shop_name' => $validated['shop_name'],
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'tax_id' => $validated['tax_id'],
            // El logo ya lo asignamos arriba si hubo cambio
        ]);

        return redirect()->route('configuracion.edit')->with('success', 'Configuración actualizada.');
    }
}