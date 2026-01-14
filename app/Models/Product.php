<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id', // Empresa propietaria del producto
        'barcode',
        'name',
        'description',
        'price',
        'cost_price', // Costo unitario del producto
    ];

    protected $casts = [
        'price' => 'float',
        'cost_price' => 'float',
    ];

    // Un producto pertenece al catálogo de una empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Un producto existe en muchas sucursales con diferente stock
    public function branches()
    {
        return $this->belongsToMany(Branch::class)
            ->withPivot('stock', 'min_stock')
            ->withTimestamps();
    }

    // Un producto puede estar presente en muchos items de venta
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
