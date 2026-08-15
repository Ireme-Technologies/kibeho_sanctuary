<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'slug',
        'author_name',
        'author_role',
        'author_location',
        'author_avatar',
        'title',
        'body',
        'rating',
        'featured',
        'related_event_slug',
        'sort_order',
        'is_published',
        'published_at',
        'translations',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'translations' => 'array',
        'is_published' => 'boolean',
        'rating' => 'integer',
        'sort_order' => 'integer',
        'published_at' => 'date',
    ];
}
