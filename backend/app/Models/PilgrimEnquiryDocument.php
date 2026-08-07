<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PilgrimEnquiryDocument extends Model
{
    protected $table = 'pilgrim_enquiry_documents';

    protected $fillable = [
        'pilgrim_enquiry_id',
        'pilgrim_enquiry_message_id',
        'uploaded_by',
        'path',
        'url',
        'original_name',
        'mime_type',
        'size',
    ];

    public function pilgrimEnquiry(): BelongsTo
    {
        return $this->belongsTo(PilgrimEnquiry::class);
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(PilgrimEnquiryMessage::class, 'pilgrim_enquiry_message_id');
    }
}
