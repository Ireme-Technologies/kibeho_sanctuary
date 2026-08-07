<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SacredPlace extends Model
{
    protected $fillable = [
        'slug',
        'type',
        'name',
        'short_description',
        'description',
        'cover_image',
        'gallery',
        'location',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'gallery' => 'array',
        'translations' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
