<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Sale::query();

        // 1. FILTRADO POR JERARQUÍA (SaaS)
        // ---------------------------------------------------
        if ($user->hasRole('super-admin')) {
            // Ve todo, no aplicamos filtros
        } elseif ($user->hasRole('gerente')) {
            // Filtramos por su empresa
            $query->whereHas('cashRegister.user', function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
        } elseif ($user->hasRole('cajero')) {
            // Filtramos por su sucursal
            $query->whereHas('cashRegister.user', function ($q) use ($user) {
                $q->where('branch_id', $user->branch_id);
            });
        }

        // 2. EJECUCIÓN DE CONSULTAS (Usando clone para no ensuciar la query base)
        // ---------------------------------------------------
        $today = Carbon::today();

        // Totales de Hoy
        $todaySales = (clone $query)
            ->whereDate('created_at', $today)
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $todayTransactions = (clone $query)
            ->whereDate('created_at', $today)
            ->where('status', '!=', 'cancelled')
            ->count();

        // 3. DATOS DEL GRÁFICO (Esta es la parte que faltaba)
        // ---------------------------------------------------
        $salesLast7Days = (clone $query)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // 4. PREPARACIÓN PARA CHART.JS
        // ---------------------------------------------------
        $chartLabels = [];
        $chartData = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartLabels[] = Carbon::now()->subDays($i)->format('d/m');

            $daySale = $salesLast7Days->firstWhere('date', $date);
            $chartData[] = $daySale ? $daySale->total : 0;
        }

        // 5. Transacciones recientes (para el panel lateral)
        // ---------------------------------------------------
        $recentSales = (clone $query)
            ->with('client')
            ->where('status', '!=', 'cancelled')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'client_name' => optional($sale->client)->name ?? 'Mostrador',
                    'created_at' => $sale->created_at->toIso8601String(),
                    'total' => $sale->total,
                    'status' => $sale->status,
                ];
            });

        // 6. RETORNO A LA VISTA
        // ---------------------------------------------------
        return Inertia::render('dashboard', [
            'todaySales' => $todaySales,
            'todayTransactions' => $todayTransactions,
            'chartLabels' => $chartLabels,
            'chartData' => $chartData,
            'recentSales' => $recentSales,
            'userRole' => $user->getRoleNames()->first(),
        ]);
    }
}
