<?php

namespace App\Mail;

use App\Models\PilgrimEnquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryReceivedThankYou extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PilgrimEnquiry $enquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank you for contacting Kibeho Sanctuary',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.enquiry-thank-you', ['enquiry' => $this->enquiry])->render(),
        );
    }
}
