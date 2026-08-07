<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'short_description',
        'description',
        'image',
        'sort_order',
        'show_in_menu',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'show_in_menu' => 'boolean',
        'translations' => 'array',
        'is_published' => 'boolean',
    ];
}
