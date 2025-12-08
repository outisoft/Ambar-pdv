<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            // Añadimos company_id para saber de quién es el catálogo
            $table->foreignId('company_id')->after('id')->constrained(); 
            
            // Borramos las columnas que movimos
            $table->dropColumn(['stock', 'min_stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
