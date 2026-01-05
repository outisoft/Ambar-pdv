<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CompanyController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_companies', only: ['index', 'show']),
            new Middleware('permission:create_companies', only: ['create', 'store']),
            new Middleware('permission:edit_companies', only: ['edit', 'update']),
            new Middleware('permission:delete_companies', only: ['destroy']),
        ];
    }
    public function index()
    {
        $companies = Company::with('plan')->latest()->get();

        return Inertia::render('companies/index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        $plans = Plan::all();

        return Inertia::render('companies/create', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'plan_id' => 'required|exists:plans,id',
            'phone' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'ticket_footer_message' => 'nullable|string',
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
                    'phone' => $request->phone,
                    'tax_id' => $request->tax_id,
                    'address' => $request->address,
                    'ticket_footer_message' => $request->ticket_footer_message,
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

    public function show(Company $company)
    {
        return Inertia::render('companies/show', [
            'company' => $company->load('branches', 'plan'),
        ]);
    }

    public function edit(Company $company)
    {
        return Inertia::render('companies/edit', [
            'company' => $company,
            'plans' => Plan::all(),
        ]);
    }

    public function update(Request $request, Company $company)
    {
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'plan_id' => 'required|exists:plans,id',
            'phone' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'ticket_footer_message' => 'nullable|string',
            'remove_logo' => 'nullable|boolean',
        ]);

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($company->logo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($company->logo_path);
            }
            $company->logo_path = $request->file('logo')->store('companies', 'public');
        } elseif ($request->boolean('remove_logo')) {
            if ($company->logo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($company->logo_path);
            }
            $company->logo_path = null;
        }

        $company->name = $request->name;
        $company->phone = $request->phone;
        $company->tax_id = $request->tax_id;
        $company->address = $request->address;
        $company->ticket_footer_message = $request->ticket_footer_message;

        // Actualizar plan y fecha de suscripción si cambió el plan
        if ($request->filled('plan_id') && (int) $request->plan_id !== (int) $company->plan_id) {
            $plan = Plan::findOrFail($request->plan_id);
            $company->plan_id = $plan->id;
            $company->subscription_status = 'active';
            $company->subscription_ends_at = Carbon::now()->addDays($plan->duration_in_days);
        }

        $company->save();

        return redirect()->route('companies.index')->with('success', 'Empresa actualizada correctamente.');
    }

    public function destroy(Company $company)
    {
        if ($company->logo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($company->logo_path);
        }
        $company->delete();
        return redirect()->route('companies.index')->with('success', 'Empresa eliminada correctamente.');
    }

    // Método para renovar manualmente
    public function renew(Request $request, Company $company)
    {
        $request->validate([
            'months' => 'required|integer|min:1', // Cuántos meses pagó
        ]);

        // Lógica de fecha:
        // Si ya venció hace mucho, la renovación empieza HOY.
        // Si vence mañana, la renovación empieza DESPUÉS de mañana (se suma).
        $currentEnd = Carbon::parse($company->subscription_ends_at);

        if ($currentEnd->isPast()) {
            $newEnd = Carbon::now()->addMonths($request->months);
        } else {
            $newEnd = $currentEnd->copy()->addMonths($request->months);
        }

        $company->update([
            'subscription_ends_at' => $newEnd,
            'subscription_status' => 'active'
        ]);

        return back()->with('success', "Empresa renovada hasta: " . $newEnd->format('d/m/Y'));
    }
}
