<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaryMessage extends Model
{
    protected $fillable = [
        'number',
        'title',
        'summary',
        'body',
        'date_context',
        'theme',
        'image',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'number' => 'integer',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];
}
