<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Role extends SpatieRole
{
    protected $fillable = ['name', 'guard_name'];

    public function users(): MorphToMany
    {
        return $this->morphedByMany(User::class, 'model', config('permission.table_names.model_has_roles'), 'role_id', 'model_id');
    }
}
