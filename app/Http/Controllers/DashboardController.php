<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Total vendido HOY
        $todaySales = Sale::whereDate('created_at', $today)->sum('total');

        // 2. Cantidad de ventas HOY
        $todayTransactions = Sale::whereDate('created_at', $today)->count();

        // 3. Datos para el gráfico (Últimos 7 días)
        // Esto agrupa las ventas por fecha y suma los totales
        $salesLast7Days = Sale::select(
                DB::raw('DATE(created_at) as date'), 
                DB::raw('SUM(total) as total')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Formateamos los datos para que Chart.js los entienda fácilmente
        // Creamos dos arrays: uno de etiquetas (fechas) y otro de datos (dineros)
        $chartLabels = [];
        $chartData = [];

        // Rellenamos los últimos 7 días (incluso si hubo 0 ventas)
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartLabels[] = Carbon::now()->subDays($i)->format('d/m'); // Formato visual (ej: 12/11)
            
            // Buscamos si hubo ventas ese día en nuestra consulta
            $daySale = $salesLast7Days->firstWhere('date', $date);
            $chartData[] = $daySale ? $daySale->total : 0;
        }

        return Inertia::render('dashboard', [
            'todaySales' => $todaySales,
            'todayTransactions' => $todayTransactions,
            'chartLabels' => $chartLabels,
            'chartData' => $chartData,
        ]);
    }
}