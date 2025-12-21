<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. OBTENER SUCURSALES DISPONIBLES (Dropdown)
        $branches = [];
        $selectedBranchId = $request->branch_id; // Filtro que viene del frontend

        if ($user->hasRole('super-admin')) {
            $branches = Branch::with('company')->get();
        } elseif ($user->hasRole('gerente')) {
            $branches = Branch::where('company_id', $user->company_id)->get();
        } elseif ($user->hasRole('cajero')) {
            // El cajero solo ve SU sucursal
            $branches = Branch::where('id', $user->branch_id)->get();
            $selectedBranchId = $user->branch_id;
        }

        // Default: Si no eligió ninguna, tomar la primera de la lista
        if (!$selectedBranchId && count($branches) > 0) {
            $selectedBranchId = $branches[0]->id;
        }

        // 2. OBTENER PRODUCTOS + STOCK DE LA SUCURSAL ELEGIDA
        $products = collect();

        if ($selectedBranchId) {
            // Consultamos TODOS los productos de la empresa
            // Y cargamos la relación con la sucursal seleccionada (si existe)
            $query = Product::query();

            // Filtrar por empresa (si no es super admin)
            if ($user->company_id) {
                $query->where('company_id', $user->company_id);
            }

            // Búsqueda (Opcional pero recomendada)
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('barcode', 'like', '%' . $request->search . '%');
                });
            }

            // Eager Loading condicional: Traeme la info de la tabla pivote SOLO para esta sucursal
            $products = $query->with(['branches' => function ($q) use ($selectedBranchId) {
                $q->where('branches.id', $selectedBranchId);
            }])
                ->paginate(15)
                ->through(function ($product) {
                    // Procesamos los datos para que el Frontend sufra menos
                    $pivot = $product->branches->first()?->pivot;

                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'barcode' => $product->barcode,
                        'price' => $product->price,
                        // Si hay pivote, usamos ese stock. Si no, es 0.
                        'stock' => $pivot ? $pivot->stock : 0,
                        'min_stock' => $pivot ? $pivot->min_stock : 0, // Alerta por defecto 0 si no existe
                    ];
                });
        }

        return Inertia::render('inventory/index', [
            'branches' => $branches,
            'selectedBranchId' => (int)$selectedBranchId,
            'products' => $products,
            'filters' => $request->only(['search', 'branch_id']),
            'canEdit' => $user->hasRole(['super-admin', 'gerente']), // Permiso para el frontend
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $user = Auth::user();

        // Validaciones
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
        ]);

        // SEGURIDAD: Validar que el usuario tenga derecho sobre esa sucursal
        if ($user->hasRole('gerente')) {
            $targetBranch = Branch::findOrFail($validated['branch_id']);
            if ($targetBranch->company_id !== $user->company_id) {
                abort(403, 'No puedes modificar una sucursal de otra empresa.');
            }
        }
        if ($user->hasRole('cajero')) {
            abort(403, 'Los cajeros no tienen permiso para ajustar inventario manualmente.');
        }

        // GUARDAR EN PIVOTE (Sync sin eliminar otros)
        // Esto crea la relación si no existe, o la actualiza si ya existe
        $product->branches()->syncWithoutDetaching([
            $validated['branch_id'] => [
                'stock' => $validated['stock'],
                'min_stock' => $validated['min_stock']
            ]
        ]);

        return back()->with('success', 'Inventario actualizado correctamente.');
    }
}
