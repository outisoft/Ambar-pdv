<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductImport implements ToModel, WithHeadingRow, WithValidation
{
    private $company_id;
    private $branch_id;

    public function __construct()
    {
        $user = Auth::user();
        $this->company_id = $user->company_id;
        // Necesitamos saber a qué sucursal cargarle el inventario inicial
        $this->branch_id = $user->branch_id;
    }

    public function model(array $row)
    {
        // 1. Crear o Buscar el Producto en la tabla 'products'
        $product = Product::firstOrCreate(
            [
                'barcode'    => $row['codigo_barras'],
                'company_id' => $this->company_id
            ],
            [
                'name'        => $row['nombre'],
                'description' => $row['descripcion'] ?? null, // Campo opcional
                'price'       => $row['precio'], // Tu campo real en la BD
            ]
        );

        // 2. Asignar Stock a la Sucursal (Tabla Pivote)
        // Esto sigue igual, ya que el stock NO está en la tabla products
        if (!$product->branches()->where('branch_id', $this->branch_id)->exists()) {
            $product->branches()->attach($this->branch_id, [
                'stock'     => $row['stock_inicial'] ?? 0,
                'min_stock' => $row['stock_minimo'] ?? 5,
            ]);
        }

        return $product;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required',
            'codigo_barras' => 'required',
            'precio' => 'required|numeric|min:0', // Validamos 'precio'
        ];
    }
}
