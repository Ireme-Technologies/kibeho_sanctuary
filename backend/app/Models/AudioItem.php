<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AudioItem extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'type',
        'audio_url',
        'cover_image',
        'duration',
        'published_at',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'published_at' => 'datetime',
        'translations' => 'array',
    ];
}
