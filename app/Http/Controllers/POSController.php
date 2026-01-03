<?php

namespace App\Http\Controllers;

use App\Models\Product; // Importa el modelo
use App\Models\Client;
use App\Models\SuspendedSale;
use Illuminate\Http\Request;
use Inertia\Inertia; // Importa Inertia

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class POSController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_pos', only: ['index']),
        ];
    }
    // Un método 'index' para mostrar la página
    public function index()
    {
        $user = auth()->user();

        // 1. Validar acceso básico
        if (!$user->branch_id && !$user->hasRole(['gerente', 'super-admin'])) {
            abort(403, 'Usuario sin sucursal asignada.');
        }

        // 2. Determinar el ID de la Sucursal a consultar
        $targetBranchId = $user->branch_id;

        // CASO ESPECIAL: Si es Gerente/Admin y entra al POS, 
        // idealmente debería seleccionar una sucursal antes. 
        // Por simplicidad ahora: Si es gerente sin branch_id, tomamos la PRIMERA sucursal de su empresa.
        if (!$targetBranchId && $user->hasRole('gerente')) {
            $firstBranch = \App\Models\Branch::where('company_id', $user->company_id)->first();
            if ($firstBranch) $targetBranchId = $firstBranch->id;
        }

        // 3. Obtener Productos
        $productsQuery = Product::query();

        // Si es Gerente/Cajero, solo ver productos de SU empresa
        if ($user->company_id) {
            $productsQuery->where('company_id', $user->company_id);
        }

        // NUEVO: Mostrar ÚNICAMENTE productos vinculados a la sucursal actual (Stock local)
        if ($targetBranchId) {
            $productsQuery->whereHas('branches', function ($q) use ($targetBranchId) {
                $q->where('branches.id', $targetBranchId);
            });
        }

        $products = $productsQuery->with(['branches' => function ($q) use ($targetBranchId) {
            $q->where('branches.id', $targetBranchId);
        }])
            ->get()
            ->map(function ($product) {
                // Extraer el stock de la sucursal específica
                $branchPivot = $product->branches->first();
                $product->stock = $branchPivot ? $branchPivot->pivot->stock : 0;
                return $product;
            });

        // 4. Obtener Clientes
        if ($user->company_id) {
            $clients = Client::where('company_id', $user->company_id)->get();
        } else {
            // Fallback: si el usuario no tiene company_id, mostrar todos
            $clients = Client::all();
        }

        // 5. Obtener ventas suspendidas de la sucursal actual
        $suspendedSales = collect();
        if ($targetBranchId) {
            $suspendedSales = SuspendedSale::where('branch_id', $targetBranchId)
                ->with('user')
                ->orderByDesc('created_at')
                ->get();
        }

        return Inertia::render('POS', [
            'products' => $products,
            'clients' => $clients,
            'suspended_sales' => $suspendedSales,
        ]);
    }
}
