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
        Schema::table('companies', function (Blueprint $table) {
            // Ya tenías 'name' y 'logo_path' (probablemente), agregamos el resto
            $table->string('tax_id')->nullable()->after('name'); // RFC/NIT
            $table->text('address')->nullable()->after('tax_id');
            $table->string('phone')->nullable()->after('address');
            $table->text('ticket_footer_message')->nullable(); // Mensaje "Gracias por su compra"
        });

        // Opcional: Eliminar la tabla antigua 'settings' para no confundirnos
        Schema::dropIfExists('settings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            //
        });
    }
};
