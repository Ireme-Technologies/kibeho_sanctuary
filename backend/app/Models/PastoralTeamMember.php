<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PastoralTeamMember extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'role',
        'bio',
        'photo',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'translations' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
