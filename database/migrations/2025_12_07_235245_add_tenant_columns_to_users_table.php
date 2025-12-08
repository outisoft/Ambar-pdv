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
        Schema::table('users', function (Blueprint $table) {
            // company_id: Obligatorio (todo usuario debe pertenecer a una empresa)
            $table->foreignId('company_id')->nullable()->after('id')->constrained();
            
            // branch_id: Opcional (El dueño puede no tener una fija, el cajero sí)
            $table->foreignId('branch_id')->nullable()->after('company_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
