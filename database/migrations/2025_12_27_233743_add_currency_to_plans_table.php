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
        Schema::table('plans', function (Blueprint $table) {
            // Agregamos la columna de moneda después del precio
            // Usamos 3 caracteres (ISO 4217 standard: USD, MXN, EUR)
            $table->string('currency', 3)->default('MXN')->after('price');
        });
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('currency');
        });
    }
};
