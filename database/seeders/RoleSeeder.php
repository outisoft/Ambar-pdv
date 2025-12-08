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
        $roleSuperAdmin = Role::firstOrCreate(['name' => 'super-admin']); // Tú
        $roleGerente = Role::firstOrCreate(['name' => 'gerente']);       // Tu Cliente
        $roleCajero = Role::firstOrCreate(['name' => 'cajero']);
    }
}