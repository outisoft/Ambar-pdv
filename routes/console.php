<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    // Buscar empresas activas que ya vencieron
    \App\Models\Company::where('subscription_status', 'active')
        ->where('subscription_ends_at', '<', now())
        ->update(['subscription_status' => 'expired']);
})->daily();
