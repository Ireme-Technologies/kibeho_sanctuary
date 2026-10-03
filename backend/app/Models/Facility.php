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
        'room_count',
        'distance_from_kibeho',
        'price_from',
        'status',
        'rating',
        'booking_url',
        'featured',
        'short_description',
        'description',
        'cover_image',
        'featured_image',
        'gallery',
        'amenities',
        'meeting_rooms',
        'review_links',
        'related_programs',
        'specs',
        'sort_order',
        'is_published',
        'translations',
        'website_url',
        'phone',
        'whatsapp',
        'email',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'translations' => 'array',
        'is_published' => 'boolean',
        'rating' => 'float',
        'gallery' => 'array',
        'amenities' => 'array',
        'meeting_rooms' => 'array',
        'review_links' => 'array',
        'room_count' => 'integer',
        'price_from' => 'integer',
        'related_programs' => 'array',
        'specs' => 'array',
    ];
}
