<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $table = 'facilities';

    protected $fillable = [
        'slug',
        'title',
        'category',
        'year',
        'location',
        'managed_by',
        'capacity',
        'status',
        'rating',
        'booking_url',
        'featured',
        'short_description',
        'description',
        'cover_image',
        'featured_image',
        'gallery',
        'related_programs',
        'specs',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'translations' => 'array',
        'is_published' => 'boolean',
        'rating' => 'float',
        'gallery' => 'array',
        'related_programs' => 'array',
        'specs' => 'array',
    ];
}
