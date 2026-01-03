<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'name',
        'email',
        'credit_limit',
        'current_balance',
        'phone',
        'tax_id',
        'address',
        'company_id',
    ];

    protected $casts = [
        'credit_limit' => 'float',
        'current_balance' => 'float',
    ];

    public function transactions()
    {
        return $this->hasMany(ClientTransaction::class)->orderBy('created_at', 'desc');
    }
}
