<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    /**
     * Muestra la lista de usuarios según el rol del que consulta.
     */
    public function index()
    {
        $currentUser = Auth::user();
        $query = User::with(['roles', 'branch', 'company']); // Eager loading

        // LOGICA DE VISIBILIDAD
        if ($currentUser->hasRole('gerente')) {
            // El gerente solo ve usuarios de SU empresa
            $query->where('company_id', $currentUser->company_id);
        } elseif (!$currentUser->hasRole('super-admin')) {
            // Si no es gerente ni super-admin, no debería estar aquí
            abort(403, 'Acceso no autorizado.');
        }
        // Si es super-admin, no aplicamos filtro (ve todo)

        $users = $query->latest()->paginate(10);

        // Validación de límite de usuarios según el plan de la empresa del usuario (si aplica)
        $canCreateUser = true;
        $planName = null;

        if ($currentUser->company_id) {
            $company = Company::with('plan')->find($currentUser->company_id);

            if ($company && $company->plan) {
                $plan = $company->plan;
                $planName = $plan->name;

                $currentUsersCount = User::where('company_id', $company->id)->count();

                if ($plan->max_users !== null && $currentUsersCount >= $plan->max_users) {
                    $canCreateUser = false;
                }
            }
        }

        return Inertia::render('users/index', [
            'users' => $users,
            'canCreateUser' => $canCreateUser,
            'planName' => $planName,
        ]);
    }

    /**
     * Muestra el formulario de creación.
     */
    public function create()
    {
        $currentUser = Auth::user();

        // LOGICA PARA DROPDOWNS (Sucursales y Roles)

        if ($currentUser->hasRole('gerente')) {
            // Gerente: Solo ve sus sucursales y solo puede crear 'cajeros'
            $branches = Branch::where('company_id', $currentUser->company_id)->get();
            $roles = Role::where('name', 'cajero')->get();
            $companies = []; // No necesita elegir empresa, es la suya automática
        } elseif ($currentUser->hasRole('super-admin')) {
            // Super Admin: Ve todas las sucursales, roles y empresas
            $branches = Branch::with('company')->get(); // Traemos empresa para identificar
            $roles = Role::all();
            $companies = Company::all();
        } else {
            abort(403, 'Acceso no autorizado.');
        }

        return Inertia::render('users/create', [
            'branches' => $branches,
            'roles' => $roles,
            'companies' => $companies,
        ]);
    }

    /**
     * Guarda el nuevo usuario.
     */
    public function store(Request $request)
    {
        $currentUser = Auth::user();

        // Determinar la empresa para validar contra el plan
        $companyIdForPlan = $currentUser->hasRole('super-admin')
            ? $request->company_id
            : $currentUser->company_id;

        $companyForPlan = $companyIdForPlan
            ? Company::with('plan')->find($companyIdForPlan)
            : null;

        if ($companyForPlan && $companyForPlan->plan) {
            $plan = $companyForPlan->plan;

            // 1. Contamos usuarios actuales de la empresa
            $currentUsersCount = User::where('company_id', $companyForPlan->id)->count();

            // 2. Verificamos límite (null = ilimitado)
            if ($plan->max_users !== null && $currentUsersCount >= $plan->max_users) {
                return back()->with('error', "🚫 Límite de usuarios alcanzado ({$plan->max_users}). El plan '{$plan->name}' de esta empresa no permite agregar más personal.");
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'branch_id' => 'nullable|exists:branches,id',
            // Si es super admin, puede mandar company_id. Si es gerente, no.
            'company_id' => $currentUser->hasRole('super-admin') ? 'required|exists:companies,id' : 'nullable',
        ]);

        // Determinar la empresa
        $companyId = $currentUser->hasRole('super-admin')
            ? $request->company_id
            : $currentUser->company_id; // Si es gerente, forzamos su ID

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => $companyId,
            'branch_id' => $request->branch_id,
        ]);

        // Asignar el rol seleccionado
        $user->assignRole($request->role);

        return redirect()->route('users.index')->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Muestra formulario de edición.
     */
    public function edit(User $user)
    {
        $currentUser = Auth::user();

        // Seguridad: Un gerente no puede editar a un usuario de otra empresa
        if ($currentUser->hasRole('gerente') && $user->company_id !== $currentUser->company_id) {
            abort(403);
        }

        // Reutilizamos la lógica de dropdowns (podrías extraerla a una función privada)
        if ($currentUser->hasRole('gerente')) {
            $branches = Branch::where('company_id', $currentUser->company_id)->get();
            $roles = Role::where('name', 'cajero')->get();
            $companies = [];
        } elseif ($currentUser->hasRole('super-admin')) {
            $branches = Branch::with('company')->get();
            $roles = Role::all();
            $companies = Company::all();
        } else {
            abort(403);
        }

        return Inertia::render('users/edit', [
            'userToEdit' => $user->load('roles'), // Cargamos roles actuales
            'branches' => $branches,
            'roles' => $roles,
            'companies' => $companies,
        ]);
    }

    /**
     * Actualiza el usuario.
     */
    public function update(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->hasRole('gerente') && $user->company_id !== $currentUser->company_id) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,name',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'branch_id' => $request->branch_id,
            'company_id' => $currentUser->hasRole('super-admin') ? $request->company_id : $currentUser->company_id,
        ]);

        // Sincronizar rol (quita el anterior y pone el nuevo)
        $user->syncRoles([$request->role]);

        return redirect()->route('users.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(User $user)
    {
        $currentUser = Auth::user();
        if ($currentUser->hasRole('gerente') && $user->company_id !== $currentUser->company_id) {
            abort(403);
        }

        $user->delete();
        return redirect()->route('users.index')->with('success', 'Usuario eliminado.');
    }
}
