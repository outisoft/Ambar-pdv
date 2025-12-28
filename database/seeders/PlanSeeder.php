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
    }
}
