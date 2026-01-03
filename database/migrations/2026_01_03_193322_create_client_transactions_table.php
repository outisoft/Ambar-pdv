<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('client_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Cajero que registró
            $table->foreignId('sale_id')->nullable()->constrained(); // Si viene de una venta

            $table->enum('type', ['charge', 'payment']); // 'charge' = Deuda (Venta), 'payment' = Abono
            $table->decimal('amount', 10, 2);
            $table->decimal('previous_balance', 10, 2); // Saldo antes del movimiento (Auditoría)
            $table->decimal('new_balance', 10, 2);      // Saldo después (Auditoría)
            $table->string('description')->nullable();  // "Abono a cuenta", "Venta #50"

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_transactions');
    }
};
