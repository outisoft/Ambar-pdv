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
        Schema::create('suspended_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained(); // Sucursal donde se suspendió
            $table->foreignId('user_id')->constrained();   // Cajero que la suspendió
            $table->foreignId('client_id')->nullable()->constrained(); // Cliente (si se seleccionó)
            $table->json('items'); // Guardamos todo el carrito en formato JSON
            $table->string('note')->nullable(); // Ej: "Señora vestido rojo"
            $table->decimal('total', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suspended_sales');
    }
};
