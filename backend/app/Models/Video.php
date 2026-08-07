<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'youtube_url',
        'youtube_id',
        'thumbnail_url',
        'sort_order',
        'is_published',
        'published_at',
        'translations',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'translations' => 'array',
        'published_at' => 'datetime',
        'sort_order' => 'integer',
    ];
}
