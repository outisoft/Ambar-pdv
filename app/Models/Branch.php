<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    // Relación muchos a muchos con productos, incluyendo el stock
    public function products() {
        return $this->belongsToMany(Product::class)
                    ->withPivot('stock', 'min_stock')
                    ->withTimestamps();
    }
    public function company() { return $this->belongsTo(Company::class); }
    public function users() { return $this->hasMany(User::class); }
}
