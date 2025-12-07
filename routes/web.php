<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'check_register'])->group(function () {
    
    // --- RUTAS PÚBLICAS PARA EMPLEADOS (Cajero y Admin) ---
    // No necesitan middleware de rol específico, o podrías poner 'role:cajero|admin'
    Route::get('/pos', [POSController::class, 'index'])->name('pos');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/{sale}/ticket', [SaleController::class, 'ticket'])->name('sales.ticket');
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
    Route::get('products/export', [ProductController::class, 'export'])->name('products.export');
    
    // ... (Perfil, etc.)
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cash-register/open', [CashRegisterController::class, 'create'])->name('cash_register.create');
    Route::post('/cash-register/open', [CashRegisterController::class, 'store'])->name('cash_register.store');
    
    Route::get('/cash-register/close', [CashRegisterController::class, 'close'])->name('cash_register.close');
    Route::post('/cash-register/close/{id}', [CashRegisterController::class, 'update'])->name('cash_register.update');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('clients', ClientController::class);
    Route::resource('products', ProductController::class);
    Route::get('/configuracion', [SettingController::class, 'edit'])->name('configuracion.edit');
    Route::post('/configuracion', [SettingController::class, 'update'])->name('configuracion.update');
    
});

require __DIR__.'/settings.php';
