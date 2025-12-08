<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => 'admin',
            'company_id' => null, 
            'branch_id' => null,
        ]);

        User::create([
            'name' => 'Gerente',
            'email' => 'gerente@gerente.com',
            'password' => 'gerente',
            'company_id' => 1, 
            'branch_id' => null,
        ]);

        User::create([
            'name' => 'Cajero',
            'email' => 'cajero@cajero.com',
            'password' => 'cajero',
            'company_id' => 1, 
            'branch_id' => 1,
        ]);
    }
}
