<?php
namespace App\Http\Controllers;

use App\Models\Product; // Importa el modelo
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia; // Importa Inertia

class POSController extends Controller
{
    // Un método 'index' para mostrar la página
    public function index() {
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
        // Si es Super Admin, ve todos (o podrías forzarle a elegir empresa)

        $products = $productsQuery->with(['branches' => function($q) use ($targetBranchId) {
                $q->where('branches.id', $targetBranchId);
            }])
            ->get()
            ->map(function($product) {
                // Extraer el stock de la sucursal específica
                $branchPivot = $product->branches->first();
                $product->stock = $branchPivot ? $branchPivot->pivot->stock : 0;
                return $product;
            });

        return Inertia::render('POS', ['products' => $products]);
    }
}