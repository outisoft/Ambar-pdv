<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientTransaction extends Model
{
    protected $fillable = [
        'client_id',
        'user_id',
        'sale_id',
        'type',
        'amount',
        'previous_balance',
        'new_balance',
        'description',
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
