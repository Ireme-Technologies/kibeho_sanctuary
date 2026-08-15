<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'location',
        'description',
        'cover_image',
        'gallery',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'translations' => 'array',
        'gallery' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
