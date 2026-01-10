<?php

namespace App\Mail;

use App\Models\CashRegister;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailyCashReport extends Mailable
{
    use Queueable, SerializesModels;

    public $cashRegister;
    public $summary;

    public function __construct($cashRegister, $summary)
    {
        $this->cashRegister = $cashRegister;
        $this->summary = $summary;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '📊 Corte de Caja - ' . $this->cashRegister->created_at->format('d/m/Y'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily_report', // Crearemos esta vista ahora
        );
    }
}
