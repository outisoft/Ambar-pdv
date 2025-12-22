<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SaleCancelledAlert extends Notification
{
    use Queueable;

    public $saleId;
    public $amount;
    public $userName;
    public $branchName;
    public $reason; // <-- NUEVO

    // Actualizar constructor
    public function __construct($saleId, $amount, $userName, $branchName, $reason)
    {
        $this->saleId = $saleId;
        $this->amount = $amount;
        $this->userName = $userName;
        $this->branchName = $branchName;
        $this->reason = $reason;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $formattedAmount = number_format($this->amount, 2);

        return [
            'title' => '🚫 Venta Anulada',
            // Agregamos el motivo al mensaje
            'message' => "Ticket #{$this->saleId} (\${$formattedAmount}) anulado por {$this->userName}. Motivo: \"{$this->reason}\"",
            'icon' => 'trash',
            'color' => 'text-red-600',
            'action_url' => route('sales.index'),
        ];
    }
}
