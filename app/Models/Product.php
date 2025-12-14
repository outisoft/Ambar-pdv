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
        'barcode',
        'name',
        'description',
        'price',
        'company_id', // Ensure this is also fillable as we are using it
    ];

    protected $casts = [
        'price' => 'float',
    ];

    // Un producto pertenece al catálogo de una empresa
    public function company() { return $this->belongsTo(Company::class); }

    // Un producto existe en muchas sucursales con diferente stock
    public function branches() {
        return $this->belongsToMany(Branch::class)
                    ->withPivot('stock', 'min_stock')
                    ->withTimestamps();
    }
}