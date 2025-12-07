<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Product::all();
    }

    public function headings(): array
    {
        return ['ID', 'Código', 'Nombre', 'Precio', 'Stock', 'Mínimo', 'Estado', 'Valor Total'];
    }

    public function map($product): array
    {
        $status = 'Normal';
        if ($product->stock == 0) $status = 'AGOTADO';
        elseif ($product->stock <= $product->min_stock) $status = 'BAJO';

        return [
            $product->id,
            $product->barcode,
            $product->name,
            $product->price,
            $product->stock,
            $product->min_stock,
            $status,
            $product->stock * $product->price, // Valor del inventario
        ];
    }
}