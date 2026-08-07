<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PilgrimageService extends Model
{
    protected $table = 'pilgrimage_services';

    protected $fillable = [
        'slug',
        'title',
        'description',
        'image',
        'detail_image',
        'icon_key',
        'highlights',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'highlights' => 'array',
        'translations' => 'array',
        'is_published' => 'boolean',
    ];
}
