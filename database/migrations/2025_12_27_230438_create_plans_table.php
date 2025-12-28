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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ej: "Plan Emprendedor"
            $table->decimal('price', 10, 2); // Ej: 500.00
            $table->integer('duration_in_days'); // Ej: 30 (Mensual), 365 (Anual)

            // --- LÍMITES DEL PLAN (Esto es clave para el SaaS) ---
            $table->integer('max_users')->default(1);
            $table->integer('max_branches')->default(1);
            $table->integer('max_products')->nullable(); // Null = Ilimitado

            $table->timestamps();
        });

        // Agregamos la relación a la tabla COMPANIES
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('plan_id')->nullable()->after('id')->constrained();
            $table->timestamp('subscription_ends_at')->nullable()->after('plan_id');
            $table->enum('subscription_status', ['active', 'expired', 'cancelled'])->default('active')->after('subscription_ends_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
