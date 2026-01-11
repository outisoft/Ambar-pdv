<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            // Precio al que se vendió (Unitario)
            //$table->decimal('price', 10, 2)->after('quantity');

            // Costo del producto en ese momento (Unitario) - VITAL PARA UTILIDAD
            //$table->decimal('cost', 10, 2)->default(0)->after('price');

            // Total de la línea (Cantidad * Precio)
            $table->decimal('total', 10, 2)->after('cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            //
        });
    }
};
