<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SacredPlace extends Model
{
    protected $fillable = [
        'slug',
        'type',
        'category',
        'name',
        'short_description',
        'description',
        'why_visit',
        'key_points',
        'cover_image',
        'gallery',
        'location',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'gallery' => 'array',
        'key_points' => 'array',
        'translations' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
