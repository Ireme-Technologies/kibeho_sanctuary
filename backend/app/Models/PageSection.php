<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'key',
        'label',
        'content',
        'translations',
    ];

    protected $casts = [
        'content' => 'array',
        'translations' => 'array',
    ];
}
