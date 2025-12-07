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
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Quién abrió la caja
            
            $table->decimal('initial_amount', 10, 2); // Monto inicial (fondo de caja)
            $table->decimal('final_amount', 10, 2)->nullable(); // Monto contado al cierre (se llena al final)
            $table->decimal('total_sales', 10, 2)->default(0); // Total vendido por sistema (se llena al final)
            
            $table->enum('status', ['open', 'closed'])->default('open'); // Estado
            
            $table->timestamp('opened_at'); // Fecha inicio
            $table->timestamp('closed_at')->nullable(); // Fecha fin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_registers');
    }
};
