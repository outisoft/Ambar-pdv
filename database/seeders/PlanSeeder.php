<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // database/seeders/PlanSeeder.php

    public function run(): void
    {
        Plan::create([
            'name' => 'Básico (Mensual)',
            'price' => 299.00,
            'currency' => 'MXN',
            'duration_in_days' => 30,
            'max_users' => 2,
            'max_branches' => 1,
            'max_products' => 500
        ]);

        Plan::create([
            'name' => 'Pro (Mensual)',
            'price' => 599.00,
            'currency' => 'MXN',
            'duration_in_days' => 30,
            'max_users' => 10,
            'max_branches' => 3,
            'max_products' => null // Ilimitado
        ]);

        // Nivel cadena
        Plan::create([
            'name' => 'Empresarial (Mensual)',
            'price' => 1299.00,
            'currency' => 'MXN',
            'duration_in_days' => 30,
            'max_users' => 50,
            'max_branches' => 10,
            'max_products' => null // Ilimitado
        ]);

        Plan::create([
            'name' => 'Básico (Anual)',
            'price' => 3588.00,
            'currency' => 'MXN',
            'duration_in_days' => 365, // <--- La clave es la duración
            'max_users' => 2,
            'max_branches' => 1,
            'max_products' => 500
        ]);

        // Precio Pro: 599 * 10 = 5990
        Plan::create([
            'name' => 'Pro (Anual)',
            'price' => 7188.00,
            'currency' => 'MXN',
            'duration_in_days' => 365,
            'max_users' => 10,
            'max_branches' => 3,
            'max_products' => null
        ]);

        // Precio Empresarial: 1299 * 10 = 12990
        Plan::create([
            'name' => 'Empresarial (Anual)',
            'price' => 15588.00,
            'currency' => 'MXN',
            'duration_in_days' => 365,
            'max_users' => 50,
            'max_branches' => 10,
            'max_products' => null
        ]);
    }
}
