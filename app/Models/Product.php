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
        'stock',
    ];

    protected $casts = [
        'price' => 'float', // O 'decimal:2'
        'stock' => 'integer',
    ];
}