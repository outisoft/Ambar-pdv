<?php

use App\Http\Controllers\AccountsReceivableController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CashMovementController;
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Report\ProfitController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SuspendedSaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TrialRequestController;
use Illuminate\Support\Facades\Route;
use App\Models\Plan;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $plans = Plan::all();

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'plans' => $plans,
    ]);
})->name('home');

Route::post('/trial-requests', [TrialRequestController::class, 'store'])
    ->name('trial-requests.store');

Route::middleware(['auth', 'verified', 'check_register'])->group(function () {

    // --- RUTAS PÚBLICAS PARA EMPLEADOS (Cajero y Admin) ---
    // No necesitan middleware de rol específico, o podrías poner 'role:cajero|admin'
    Route::get('/pos', [POSController::class, 'index'])->name('pos');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/{sale}/ticket', [SaleController::class, 'ticket'])->name('sales.ticket');
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
    Route::post('/sales/{sale}/cancel', [SaleController::class, 'cancel'])->name('sales.cancel');
    Route::post('/suspended-sales', [SuspendedSaleController::class, 'store'])->name('suspended_sales.store');
    Route::delete('/suspended-sales/{suspendedSale}', [SuspendedSaleController::class, 'destroy'])->name('suspended_sales.destroy');
    Route::get('products/export', [ProductController::class, 'export'])->name('products.export');

    // ... (Perfil, etc.)
});

Route::get('/subscription-expired', function () {
    return Inertia::render('Subscription/Expired');
})->name('subscription.expired')->middleware('auth');

Route::middleware(['auth', 'verified', 'check_subscription'])->group(function () {
    Route::get('/accounts-receivable', [AccountsReceivableController::class, 'index'])
        ->name('accounts_receivable.index');

    Route::get('/accounts-receivable/{client}', [AccountsReceivableController::class, 'show'])
        ->name('accounts_receivable.show');

    Route::post('/accounts-receivable/{client}/pay', [AccountsReceivableController::class, 'storePayment'])
        ->name('accounts_receivable.store_payment');

    Route::get('/cash-register/open', [CashRegisterController::class, 'create'])->name('cash_register.create');
    Route::post('/cash-register/open', [CashRegisterController::class, 'store'])->name('cash_register.store');

    Route::get('/cash-register/close', [CashRegisterController::class, 'close'])->name('cash_register.close');
    Route::post('/cash-register/close', [CashRegisterController::class, 'storeClose'])
        ->name('cash_register.close_store'); // Nombre distinto para no chocar con el GET
    Route::post('/cash-register/close/{id}', [CashRegisterController::class, 'update'])->name('cash_register.update');
    Route::get('/cash-registers/history', [CashRegisterController::class, 'history'])->name('cash_registers.history');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/cash-movements', [CashMovementController::class, 'store'])->name('cash_movements.store');
    Route::resource('clients', ClientController::class);
    Route::get('/configuracion', [SettingController::class, 'edit'])->name('configuracion.edit');
    Route::post('/configuracion', [SettingController::class, 'update'])->name('configuracion.update');
    Route::resource('companies', CompanyController::class);
    Route::post('companies/{company}/renew', [CompanyController::class, 'renew'])->name('companies.renew');
    Route::resource('branches', BranchController::class);
    Route::post('/import/products', [ImportController::class, 'store'])->name('import.products');
    Route::get('/import/template', [ImportController::class, 'downloadTemplate'])->name('import.template');
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('/inventory/{product}/update', [InventoryController::class, 'update'])->name('inventory.update');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.readAll');
    Route::resource('permissions', PermissionController::class);
    Route::resource('products', ProductController::class);
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/shifts-pdf', [ReportController::class, 'shiftsPdf'])->name('reports.shifts_pdf');
    Route::get('/reports/z-cut-pdf', [ReportController::class, 'zCutPdf'])->name('reports.z_cut_pdf');
    Route::get('/reports/profit', [ProfitController::class, 'index'])
        ->name('reports.profit')
        ->middleware(['auth', 'verified', 'role:gerente|super-admin']); // Protegido!
    Route::resource('roles', RoleController::class);
    Route::resource('users', UserController::class);
});

require __DIR__ . '/settings.php';
