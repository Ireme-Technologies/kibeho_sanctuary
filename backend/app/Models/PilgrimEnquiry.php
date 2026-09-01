<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PilgrimEnquiry extends Model
{
    protected $table = 'pilgrim_enquiries';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'enquiry_type',
        'upcoming_pilgrimage_id',
        'channel',
        'status',
        'user_id',
        'is_read',
        'mass_dates',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'mass_dates' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function upcomingPilgrimage(): BelongsTo
    {
        return $this->belongsTo(UpcomingPilgrimage::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(PilgrimEnquiryMessage::class)->orderBy('created_at');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PilgrimEnquiryDocument::class)->orderByDesc('created_at');
    }
}
