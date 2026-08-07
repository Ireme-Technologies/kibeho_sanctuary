<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PilgrimEnquiryMessage extends Model
{
    protected $table = 'pilgrim_enquiry_messages';

    protected $fillable = [
        'pilgrim_enquiry_id',
        'user_id',
        'author_type',
        'body',
    ];

    public function pilgrimEnquiry(): BelongsTo
    {
        return $this->belongsTo(PilgrimEnquiry::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PilgrimEnquiryDocument::class);
    }
}
