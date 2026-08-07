<?php

namespace App\Mail;

use App\Models\PilgrimEnquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryAdminAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PilgrimEnquiry $enquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New '.$this->enquiry->channel.' enquiry from '.$this->enquiry->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: view('emails.enquiry-admin-alert', ['enquiry' => $this->enquiry])->render(),
        );
    }
}
