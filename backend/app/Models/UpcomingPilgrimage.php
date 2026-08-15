<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UpcomingPilgrimage extends Model
{
    protected $fillable = [
        'slug',
        'event_type',
        'title',
        'meta',
        'short_description',
        'description',
        'image',
        'archives',
        'location',
        'starts_on',
        'ends_on',
        'starts_at_time',
        'ends_at_time',
        'is_recurring',
        'recurrence_type',
        'sort_order',
        'registration_open',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'starts_on' => 'date',
        'archives' => 'array',
        'translations' => 'array',
        'ends_on' => 'date',
        'registration_open' => 'boolean',
        'is_published' => 'boolean',
        'is_recurring' => 'boolean',
    ];

    public function enquiries(): HasMany
    {
        return $this->hasMany(PilgrimEnquiry::class);
    }
}
