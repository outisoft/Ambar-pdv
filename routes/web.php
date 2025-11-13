<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- RUTAS PÚBLICAS PARA EMPLEADOS (Cajero y Admin) ---
    // No necesitan middleware de rol específico, o podrías poner 'role:cajero|admin'
    Route::get('/pos', [POSController::class, 'index'])->name('pos');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/{sale}/ticket', [SaleController::class, 'ticket'])->name('sales.ticket');
    
    // ... (Perfil, etc.)
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class);
    
});

require __DIR__.'/settings.php';
