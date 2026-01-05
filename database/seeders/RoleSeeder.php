<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear Roles
        $roleSuperAdmin = Role::firstOrCreate(['name' => 'super-admin']); // Dueño del sistema (Tú)
        $roleGerente = Role::firstOrCreate(['name' => 'gerente']);       // Cliente (Dueño de negocio)
        $roleCajero = Role::firstOrCreate(['name' => 'cajero']);         // Empleado

        // 2. Definir permisos por módulo
        $modules = [
            'products' => ['view', 'create', 'edit', 'delete', 'export'],
            'clients' => ['view', 'create', 'edit', 'delete'],
            'users' => ['view', 'create', 'edit', 'delete'],
            'roles' => ['view', 'create', 'edit', 'delete'],
            'companies' => ['view', 'create', 'edit', 'delete'],
            'branches' => ['view', 'create', 'edit', 'delete'],
            'pos' => ['view'],
            'sales' => ['view', 'create', 'delete', 'cancel'],
            'cash_registers' => ['view', 'open', 'close'],
            'inventory' => ['view', 'update'],
            'reports' => ['view'],
            'settings' => ['view', 'edit'],
        ];

        $allPermissions = [];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                // Formato: action_module (ej: view_products)
                $permissionName = $action . '_' . $module;
                Permission::firstOrCreate(['name' => $permissionName]);
                $allPermissions[] = $permissionName;
            }
        }

        // 3. Asignar Permisos

        // --- Super Admin: Todo ---
        $roleSuperAdmin->givePermissionTo(Permission::all());

        // --- Gerente: Gestión de SU negocio ---
        // Excluimos cosas globales si es necesario, pero por defecto le damos casi todo
        // Menos: eliminar compañías (si es SaaS), gestionar roles system-level (aunque aquí se mezclan)
        // Por simplicidad, el Gerente tiene acceso a todo EXCEPTO borrar compañías o roles super-admin (logic handle in code)
        // Vamos a darle lista blanca mejor para ser explícitos.
        $gerentePermissions = [
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',
            'export_products',
            'view_clients',
            'create_clients',
            'edit_clients',
            'delete_clients',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
            'view_branches',
            'create_branches',
            'edit_branches',
            'delete_branches',
            'view_pos',
            'view_sales',
            'create_sales',
            'delete_sales',
            'cancel_sales',
            'view_cash_registers',
            'open_cash_registers',
            'close_cash_registers',
            'view_inventory',
            'update_inventory',
            'view_reports',
            'view_settings',
            'edit_settings',
        ];

        // Validamos que existan antes de asignar (aunque acabamos de crearlos)
        // Usamos whereIn para filtrar los que realmente creamos arriba
        $roleGerente->givePermissionTo(Permission::whereIn('name', $gerentePermissions)->get());


        // --- Cajero: Operativa diaria ---
        $cajeroPermissions = [
            'view_pos',
            'view_products', // Para buscar en el POS
            'create_sales',
            'view_sales', // Ver sus ventas (controlado por policy/query scope)
            'view_cash_registers',
            'open_cash_registers',
            'close_cash_registers',
        ];

        $roleCajero->givePermissionTo(Permission::whereIn('name', $cajeroPermissions)->get());
    }
}
