<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashRegister extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'branch_id', 'initial_amount', 'final_amount', 'total_sales', 
        'status', 'opened_at', 'closed_at'
    ];

    // Relación: Una caja tiene muchas ventas
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    // Relación: Una caja pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Una caja pertenece a una sucursal
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}