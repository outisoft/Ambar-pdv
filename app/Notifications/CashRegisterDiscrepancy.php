<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CashRegisterDiscrepancy extends Notification
{
    use Queueable;

    public $branchName;
    public $userName;
    public $difference;
    public $type; // 'Faltante' o 'Sobrante'

    public function __construct($branchName, $userName, $difference, $type)
    {
        $this->branchName = $branchName;
        $this->userName = $userName;
        $this->difference = $difference;
        $this->type = $type;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        // Formateamos el dinero
        $amount = number_format(abs($this->difference), 2);

        // Color rojo si falta dinero (grave), amarillo si sobra (cuidado)
        $color = $this->type === 'Faltante' ? 'text-red-600' : 'text-yellow-600';
        $icon = $this->type === 'Faltante' ? 'exclamation-triangle' : 'information-circle';

        return [
            'title' => "⚠️ Descuadre de Caja: {$this->type}",
            'message' => "En {$this->branchName} (Cajero: {$this->userName}). Diferencia de \${$amount}",
            'icon' => $icon,
            'color' => $color,
            // Podrías redirigir al reporte de cortes de caja si tienes esa vista
            'action_url' => route('cash_registers.history'),
        ];
    }
}
