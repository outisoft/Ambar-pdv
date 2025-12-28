<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'price',
        'currency', // <-- AGREGAR ESTO
        'duration_in_days',
        'max_users',
        'max_branches',
        'max_products'
    ];
}
