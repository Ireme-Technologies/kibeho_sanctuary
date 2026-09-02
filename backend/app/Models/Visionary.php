<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visionary extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'photo',
        'period_label',
        'period_start',
        'period_end',
        'summary',
        'description',
        'is_approved',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];
}
