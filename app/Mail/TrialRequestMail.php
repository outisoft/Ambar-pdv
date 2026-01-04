<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class TrialRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone = null,
        public ?string $businessName = null,
        public ?string $notes = null,
        public ?string $planName = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva solicitud de prueba - Ambar',
            replyTo: [
                new Address($this->email, $this->name),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.trial-request',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
