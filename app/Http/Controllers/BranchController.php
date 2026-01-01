<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BranchController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_branches', only: ['index', 'show']),
            new Middleware('permission:create_branches', only: ['create', 'store']),
            new Middleware('permission:edit_branches', only: ['edit', 'update']),
            new Middleware('permission:delete_branches', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Branch::with('company')->latest();

        // Si el usuario está asociado a una empresa, solo ver sus sucursales
        if ($user && $user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        $canCreateBranch = true;
        $planName = null;

        // Validar límite de sucursales solo si el usuario tiene empresa y plan
        $company = $user ? $user->company : null;

        // Cargar explícitamente la empresa y su plan para evitar problemas de relación
        if ($user && $user->company_id) {
            $company = Company::with('plan')->find($user->company_id);
        }

        if ($company && $company->plan) {
            $plan = $company->plan;
            $planName = $plan->name;

            $count = Branch::where('company_id', $company->id)->count();

            if ($plan->max_branches !== null && $count >= $plan->max_branches) {
                $canCreateBranch = false;
            }
        }

        return Inertia::render('branches/index', [
            'branches' => $query->get(),
            'canCreateBranch' => $canCreateBranch,
            'planName' => $planName,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = $request->user();

        // Si el usuario pertenece a una empresa, solo mostramos esa
        // Si es super usuario (sin company_id), mostramos todas
        if ($user && $user->company_id) {
            $companies = Company::where('id', $user->company_id)->get();
        } else {
            $companies = Company::all();
        }
        return Inertia::render('branches/create', [
            'companies' => $companies,
            'company_id' => $request->query('company_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        $user = $request->user();

        // Si el usuario tiene company_id, evitar que cree sucursales para otra empresa
        if ($user && $user->company_id && (int) $request->input('company_id') !== (int) $user->company_id) {
            abort(403, 'No tienes permiso para crear sucursales en otra empresa.');
        }

        // Obtener la empresa seleccionada y su plan
        $company = Company::with('plan')->findOrFail($request->input('company_id'));
        $plan = $company->plan;

        // --- VALIDACIÓN DEL PLAN ---
        // Si la empresa tiene plan configurado, respetar el límite de sucursales
        if ($plan) {
            $currentBranchesCount = Branch::where('company_id', $company->id)->count();

            // Nota: Si max_branches es null, significa "Ilimitado"
            if ($plan->max_branches !== null && $currentBranchesCount >= $plan->max_branches) {
                return back()->with('error', "🚫 Has alcanzado el límite de sucursales ({$plan->max_branches}) del plan '{$plan->name}' de esta empresa. Actualiza tu suscripción para agregar más.");
            }
        }

        Branch::create($request->all());

        return redirect()->route('branches.index')->with('success', 'Sucursal creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch)
    {
        return Inertia::render('branches/show', [
            'branch' => $branch->load('company'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        $user = Auth::user();

        if ($user && $user->company_id) {
            $companies = Company::where('id', $user->company_id)->get();
        } else {
            $companies = Company::all();
        }
        return Inertia::render('branches/edit', [
            'branch' => $branch,
            'companies' => $companies,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        $user = $request->user();

        // Si el usuario pertenece a una empresa, solo puede actualizar sucursales de su propia empresa
        if ($user && $user->company_id && ((int) $branch->company_id !== (int) $user->company_id || (int) $request->input('company_id') !== (int) $user->company_id)) {
            abort(403, 'No tienes permiso para actualizar sucursales de otra empresa.');
        }

        $branch->update($request->all());

        return redirect()->route('branches.index')->with('success', 'Sucursal actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();
        return redirect()->back()->with('success', 'Sucursal eliminada correctamente.');
    }
}
