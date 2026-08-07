<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShrineProject extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'status',
        'phase',
        'short_description',
        'description',
        'cover_image',
        'gallery',
        'funding_goal',
        'funding_raised',
        'featured',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'gallery' => 'array',
        'translations' => 'array',
        'featured' => 'boolean',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
