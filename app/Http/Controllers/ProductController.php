<?php

namespace App\Http\Controllers;

use App\Models\Product; // <-- Importa el modelo
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;

use Illuminate\Validation\ValidationException;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProductController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_products', only: ['index', 'show', 'export']),
            new Middleware('permission:create_products', only: ['create', 'store']),
            new Middleware('permission:edit_products', only: ['edit', 'update']),
            new Middleware('permission:delete_products', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Filtrar productos por la compañía del usuario
        $query = Product::with('branches')->latest();

        if ($user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        // NUEVO: Si el usuario tiene sucursal (Cajero), SOLO mostrar productos de ESA sucursal.
        if ($user->branch_id) {
            $query->whereHas('branches', function ($q) use ($user) {
                $q->where('branches.id', $user->branch_id);
            });
        }

        $products = $query->get()->map(function ($product) use ($user) {
            // LOGICA DE STOCK SEGÚN ROL
            if ($user->branch_id) {
                // Si es CAJERO (tiene sucursal), solo mostrar stock de SU sucursal
                $branchPivot = $product->branches->where('id', $user->branch_id)->first();
                $product->stock = $branchPivot ? $branchPivot->pivot->stock : 0;
            } else {
                // Si es GERENTE/ADMIN (sin sucursal fija), mostrar stock TOTAL de la empresa
                $product->stock = $product->branches->sum('pivot.stock');
            }

            return $product;
        });

        // 2. Renderizamos el componente
        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $companies = [];
        $branches = []; // NUEVO: Para que el gerente elija sucursal

        // Si es Global Admin (sin company_id), cargar todas las empresas y sus sucursales
        if (!$user->company_id) {
            $companies = \App\Models\Company::with('branches')->get();
        } else {
            // Si es Gerente/Usuario normal, cargar sus sucursales para que elija
            $branches = \App\Models\Branch::where('company_id', $user->company_id)->get();
        }

        return Inertia::render('products/create', [
            'companies' => $companies,
            'userBranches' => $branches, // Pasamos las sucursales del usuario
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $isGlobalAdmin = !$user->company_id;

        // 1. Validar los datos
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0', // Stock inicial
        ];

        // Validaciones extra para Global Admin
        if ($isGlobalAdmin) {
            $rules['company_id'] = 'required|exists:companies,id';
            $rules['branch_id'] = 'required|exists:branches,id'; // Obligatorio elegir sucursal de destino si eres admin
        }

        // Validación de barcode único
        if ($request->filled('barcode')) {
            $rules['barcode'] = 'string|unique:products,barcode';
        }

        $validatedData = $request->validate($rules);

        // 2. Asignar company_id y separar stock
        $productData = collect($validatedData)->except(['stock', 'branch_id'])->toArray();

        if ($isGlobalAdmin) {
            // El admin decide de quién es el producto
            $productData['company_id'] = $validatedData['company_id'];
        } else {
            // El usuario normal asigna su propia compañía
            $productData['company_id'] = $user->company_id;
        }

        // 3. Crear el producto
        $product = Product::create($productData);

        // 4. ATTACH A LA SUCURSAL (STOCK SYNC)
        $targetBranchId = null;

        if ($isGlobalAdmin) {
            // Usar la sucursal seleccionada por el Admin
            $targetBranchId = $validatedData['branch_id'];
        } else {
            // Para usuarios normales (Gerentes), ver si mandaron una sucursal específica
            if ($request->has('branch_id') && $request->branch_id) {
                // Verificar que pertenezca a su empresa
                $requestedBranch = \App\Models\Branch::where('id', $request->branch_id)
                    ->where('company_id', $user->company_id)->first();

                if ($requestedBranch) {
                    $targetBranchId = $requestedBranch->id;
                }
            }

            // Si no se seleccionó (o falló validación), fallback a sucursal del usuario o primera
            if (!$targetBranchId) {
                $targetBranchId = $user->branch_id;
                if (!$targetBranchId && $user->company_id) {
                    $firstBranch = \App\Models\Branch::where('company_id', $user->company_id)->first();
                    if ($firstBranch) {
                        $targetBranchId = $firstBranch->id;
                    }
                }
            }
        }

        if ($targetBranchId) {
            $product->branches()->attach($targetBranchId, [
                'stock' => $validatedData['stock'],
                'min_stock' => 0
            ]);
        }

        return redirect()->route('products.index')->with('success', 'Producto creado e inventariado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $user = auth()->user();

        // Contexto para Global Admin
        $companies = [];
        $userBranches = [];

        if (!$user->company_id) {
            $companies = \App\Models\Company::with('branches')->get();
        } elseif ($product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para editar este producto.');
        } else {
            // Si es Gerente/Usuario normal, cargar sus sucursales
            $userBranches = \App\Models\Branch::where('company_id', $user->company_id)->get();
        }

        // Cargar stock de la sucursal actual si existe, para mostrarlo en el form
        // Si es Admin Global, intentamos cargar el stock de pivot de la primera sucursal que encontremos vinculada
        // O idealmente deberíamos dejarle elegir qué stock ver, pero por simplicidad:

        $stock = 0;
        $currentBranchId = $user->branch_id;

        if ($currentBranchId) {
            // Usuario de sucursal
            $pivot = $product->branches()->where('branch_id', $currentBranchId)->first();
            if ($pivot) $stock = $pivot->pivot->stock;
        } else {
            // Admin o Gerente sin sucursal fija: mostrar stock de la primera vinculación
            $firstBranch = $product->branches()->first();
            if ($firstBranch) $stock = $firstBranch->pivot->stock;
        }

        // Inyectamos el stock 'virtual'
        $product->stock = $stock;

        return Inertia::render('products/edit', [
            'product' => $product,
            'companies' => $companies, // Datos extra para el form
            'userBranches' => $userBranches,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->company_id && $product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para actualizar este producto.');
        }

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ];

        if ($request->filled('barcode')) {
            $rules['barcode'] = 'string|unique:products,barcode,' . $product->id;
        }

        $validatedData = $request->validate($rules);

        // Separar datos del producto de datos de stock
        $productData = collect($validatedData)->except('stock')->toArray();

        $product->update($productData);

        // Actualizar stock en la sucursal actual
        $targetBranchId = $user->branch_id;
        if (!$targetBranchId && $user->company_id) {
            $firstBranch = \App\Models\Branch::where('company_id', $user->company_id)->first();
            if ($firstBranch) {
                $targetBranchId = $firstBranch->id;
            }
        }

        if ($targetBranchId) {
            // syncWithoutDetaching para actualizar o crear si no existe
            $product->branches()->syncWithoutDetaching([
                $targetBranchId => ['stock' => $validatedData['stock']]
            ]);
        }

        return redirect()->route('products.index')->with('success', 'Producto actualizado correctamente.');
    }

    public function export()
    {
        return Excel::download(new ProductsExport, 'inventario.xlsx');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $user = auth()->user();
        if ($user->company_id && $product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para eliminar este producto.');
        }

        // Verificar si el producto tiene ventas asociadas
        $hasSales = $product->saleItems()->exists();

        if ($hasSales) {
            // Lanzamos una validación para que Inertia capture el error en onError
            throw ValidationException::withMessages([
                'delete' => 'No se puede eliminar este producto porque ya tiene ventas registradas. Puedes desactivarlo o dejarlo con stock en cero.',
            ]);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Producto eliminado correctamente.');
    }
}
