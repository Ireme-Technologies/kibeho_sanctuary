<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MassSchedule extends Model
{
    protected $fillable = [
        'day_label',
        'title',
        'time_label',
        'starts_at_time',
        'ends_at_time',
        'is_recurring',
        'recurrence_type',
        'language',
        'location',
        'notes',
        'sort_order',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'translations' => 'array',
        'is_recurring' => 'boolean',
        'sort_order' => 'integer',
    ];
}
