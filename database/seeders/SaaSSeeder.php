<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use App\Models\Product;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SaaSSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear Empresa (Tenant)
        $company = Company::create(['name' => 'Farmacias Globales S.A.']);

        // 2. Crear Sucursales
        $sucursalCentro = Branch::create(['company_id' => $company->id, 'name' => 'Matriz Centro']);
        $sucursalNorte = Branch::create(['company_id' => $company->id, 'name' => 'Sucursal Norte']);

        // --- USUARIOS POR JERARQUÍA ---

        // NIVEL 1: SUPER ADMIN (TÚ)
        // No tiene company_id ni branch_id porque está "por encima" de todos
        $superAdmin = User::create([
            'name' => 'Super Admin SaaS',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'company_id' => null, 
            'branch_id' => null,
        ]);
        $superAdmin->assignRole('super-admin');

        // NIVEL 2: GERENTE (DUEÑO DE FARMACIA)
        // Tiene company_id, pero NO branch_id (porque supervisa todas)
        $gerente = User::create([
            'name' => 'Dueño Farmacia',
            'email' => 'gerente@farmacia.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'branch_id' => null, 
        ]);
        $gerente->assignRole('gerente');

        // NIVEL 3: CAJERO (SUCURSAL CENTRO)
        // Tiene company_id Y branch_id
        $cajero = User::create([
            'name' => 'Juan Cajero',
            'email' => 'cajero@farmacia.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'branch_id' => $sucursalCentro->id,
        ]);
        $cajero->assignRole('cajero');


        // 5. Crear Productos (El catálogo es global para la empresa)
        $paracetamol = Product::create([
            'company_id' => $company->id,
            'name' => 'Paracetamol 500mg',
            'description' => 'Caja con 20 tabletas',
            'price' => 50.00,
            'barcode' => 'PAR-001',
        ]);

        $aspirina = Product::create([
            'company_id' => $company->id,
            'name' => 'Aspirina Efervescente',
            'description' => 'Caja con 10 sobres',
            'price' => 80.00,
            'barcode' => 'ASP-002',
        ]);
        
        // 6. DISTRIBUIR STOCK (La magia del Pivote)

        // EN SUCURSAL CENTRO:
        // Tienen mucho Paracetamol (100) y poca Aspirina (5)
        $sucursalCentro->products()->attach($paracetamol->id, ['stock' => 100, 'min_stock' => 10]);
        $sucursalCentro->products()->attach($aspirina->id,    ['stock' => 5,   'min_stock' => 20]); // ¡Alerta de stock bajo!

        // EN SUCURSAL NORTE:
        // No tienen Paracetamol (0) y mucha Aspirina (50)
        // Nota: Si un producto no se hace 'attach', el sistema asume que no existe en esa sucursal o stock 0.
        $sucursalNorte->products()->attach($paracetamol->id, ['stock' => 0,  'min_stock' => 10]);
        $sucursalNorte->products()->attach($aspirina->id,    ['stock' => 50, 'min_stock' => 10]);
    }
}