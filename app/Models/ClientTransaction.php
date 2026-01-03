<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientTransaction extends Model
{
    protected $fillable = ['client_id', 'user_id', 'sale_id', 'type', 'amount', 'previous_balance', 'new_balance', 'description'];
}
