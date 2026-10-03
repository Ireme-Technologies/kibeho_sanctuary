<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccommodationReservation extends Model
{
    protected $fillable = [
        'facility_id',
        'accommodation_name',
        'check_in',
        'check_out',
        'guests',
        'rooms',
        'guest_names',
        'country',
        'trip_reason',
        'organization',
        'additional_request',
        'whatsapp_number',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'guests' => 'integer',
        'rooms' => 'integer',
        'guest_names' => 'array',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
