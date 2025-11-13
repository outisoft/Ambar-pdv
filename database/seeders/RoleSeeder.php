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
        // 1. Limpiar caché de permisos (recomendado por Spatie)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Crear Permisos (Acciones específicas)
        Permission::create(['name' => 'ver dashboard']);
        Permission::create(['name' => 'gestionar productos']); // Crear, editar, borrar
        Permission::create(['name' => 'realizar ventas']);
        
        // 3. Crear Roles y asignar permisos
        
        // Rol Cajero: Solo ventas
        $roleCajero = Role::create(['name' => 'cajero']);
        $roleCajero->givePermissionTo(['realizar ventas']);

        // Rol Admin: Todo
        $roleAdmin = Role::create(['name' => 'admin']);
        // El admin tiene TODOS los permisos
        $roleAdmin->givePermissionTo(Permission::all());

        // 4. (Opcional) Asignar rol Admin al primer usuario (TÚ)
        // Si ya tienes un usuario creado (ID 1), hazlo admin automáticamente
        $user = User::find(1);
        if ($user) {
            $user->assignRole('admin');
        }
    }
}