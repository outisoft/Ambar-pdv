<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\Plan;
use App\Models\Branch; // Asumiendo que tienes modelo Branch
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompanyController extends Controller
{
    // Mostrar formulario de alta
    public function create()
    {
        $plans = Plan::all();
        return inertia('SuperAdmin/Companies/Create', ['plans' => $plans]);
    }

    // Guardar la nueva empresa
    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'plan_id' => 'required|exists:plans,id',
        ]);

        try {
            DB::transaction(function () use ($request) {

                // 1. Obtener detalles del plan seleccionado
                $plan = Plan::findOrFail($request->plan_id);

                // 2. Crear la EMPRESA
                $company = Company::create([
                    'name' => $request->company_name,
                    'plan_id' => $plan->id,
                    'subscription_status' => 'active',
                    // Calculamos fecha de vencimiento hoy + días del plan
                    'subscription_ends_at' => Carbon::now()->addDays($plan->duration_in_days),
                ]);

                // 3. Crear la SUCURSAL MATRIZ por defecto
                $branch = Branch::create([
                    'company_id' => $company->id,
                    'name' => 'Sucursal Matriz',
                    'address' => 'Dirección Principal',
                    'phone' => '0000000000'
                ]);

                // 4. Crear el USUARIO GERENTE (Dueño)
                $user = User::create([
                    'name' => $request->admin_name,
                    'email' => $request->admin_email,
                    'password' => Hash::make($request->password),
                    'company_id' => $company->id,
                    'branch_id' => $branch->id, // Lo asignamos a la matriz
                ]);

                // Asignar rol de Gerente (Spatie)
                $user->assignRole('gerente');
            });

            return redirect()->route('dashboard')->with('success', '¡Empresa y Cliente creados con éxito!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al crear empresa: ' . $e->getMessage());
        }
    }
}
