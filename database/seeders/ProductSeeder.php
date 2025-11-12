<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Coca-Cola 600ml',
            'price' => 18.50,
            'stock' => 100
        ]);
        Product::create([
            'name' => 'Sabritas Originales',
            'price' => 16.00,
            'stock' => 80
        ]);
        Product::create([
            'name' => 'Gansito',
            'price' => 14.00,
            'stock' => 120
        ]);
        Product::create([
            'name' => 'Agua Bonafont 500ml',
            'price' => 10.00,
            'stock' => 150
        ]);
        Product::create([
            'name' => 'Jugo Jumex Durazno 1L',
            'price' => 22.00,
            'stock' => 90
        ]);
    }
}
