<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuspendedSale extends Model
{
    protected $fillable = ['branch_id', 'user_id', 'client_id', 'items', 'note', 'total'];

    protected $casts = [
        'items' => 'array', // Casteo automático de JSON
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
