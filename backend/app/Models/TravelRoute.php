<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelRoute extends Model
{
    protected $fillable = [
        'origin',
        'title',
        'description',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];
}
