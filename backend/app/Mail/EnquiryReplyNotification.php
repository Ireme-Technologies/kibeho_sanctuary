<?php

namespace App\Mail;

use App\Models\PilgrimEnquiry;
use App\Models\PilgrimEnquiryMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryReplyNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PilgrimEnquiry $enquiry,
        public PilgrimEnquiryMessage $reply,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update on your Kibeho Sanctuary enquiry',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.enquiry-reply', [
                'enquiry' => $this->enquiry,
                'reply' => $this->reply,
            ])->render(),
        );
    }
}
