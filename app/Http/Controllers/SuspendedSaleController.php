<?php

namespace App\Http\Controllers;

use App\Models\SuspendedSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuspendedSaleController extends Controller
{
    // Guardar (Suspender)
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'total' => 'required|numeric',
        ]);

        $user = Auth::user();

        SuspendedSale::create([
            'branch_id' => $user->branch_id, // Asumiendo que el usuario tiene branch_id
            'user_id' => $user->id,
            'client_id' => $request->client_id,
            'items' => $request->items, // Laravel lo convierte a JSON solo
            'note' => $request->note, // "Olvidó cartera", etc.
            'total' => $request->total,
        ]);

        return back()->with('success', 'Venta suspendida correctamente ⏸️');
    }

    // Recuperar (Eliminar de suspendidas y devolver al front)
    public function destroy(SuspendedSale $suspendedSale)
    {
        // Validar que sea de la misma sucursal
        if ($suspendedSale->branch_id !== Auth::user()->branch_id) {
            abort(403);
        }

        // Obtenemos los datos antes de borrar
        $data = $suspendedSale->toArray();

        // Borramos de la tabla temporal
        $suspendedSale->delete();

        // Devolvemos los datos para que el Front los cargue al carrito
        return back()->with([
            'success' => 'Venta recuperada 🛒',
            'restoredSale' => $data // Esta variable la usaremos en React
        ]);
    }
}
