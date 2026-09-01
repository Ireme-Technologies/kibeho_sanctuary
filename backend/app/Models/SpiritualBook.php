<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpiritualBook extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'author',
        'description',
        'cover_image',
        'purchase_url',
        'availability_note',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];
}
