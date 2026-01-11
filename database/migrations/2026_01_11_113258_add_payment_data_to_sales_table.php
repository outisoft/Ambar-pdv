<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            // Cuánto dinero entregó el cliente
            $table->decimal('amount_tendered', 10, 2)->nullable()->after('total');
            // Cuánto se le devolvió
            $table->decimal('change', 10, 2)->default(0)->after('amount_tendered');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            //
        });
    }
};
