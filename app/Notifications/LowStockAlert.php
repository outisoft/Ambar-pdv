<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockAlert extends Notification
{
    use Queueable;

    public $product;
    public $branch;
    public $currentStock;

    // Recibimos los datos al crear la alerta
    public function __construct($product, $branch, $currentStock)
    {
        $this->product = $product;
        $this->branch = $branch;
        $this->currentStock = $currentStock;
    }

    // Definimos los canales (base de datos por ahora, podría ser mail también)
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    // Estructura de datos que se guardará en la tabla
    public function toArray(object $notifiable): array
    {
        return [
            'title' => '⚠️ Stock Bajo Detectado',
            'message' => "El producto '{$this->product->name}' en '{$this->branch->name}' tiene pocas unidades.",
            'stock' => $this->currentStock,
            'product_id' => $this->product->id,
            'branch_id' => $this->branch->id,
            'action_url' => route('inventory.index', ['branch_id' => $this->branch->id]),
            'icon' => 'exclamation-circle', // Para el frontend
            'color' => 'text-orange-500',   // Para el frontend
        ];
    }
}
