<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficialPrayer extends Model
{
    protected $fillable = [
        'title',
        'time_label',
        'description',
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
