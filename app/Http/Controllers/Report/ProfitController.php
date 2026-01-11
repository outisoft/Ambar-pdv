<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProfitController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::today()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));
        $companyId = Auth::user()->company_id;

        // Consultamos los detalles de ventas en el rango de fechas
        // Solo ventas completadas (status = completed)
        // Filtramos por empresa a través de la sucursal de la caja (cash_register -> branch -> company)
        $query = SaleItem::query()
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('cash_registers', 'sales.cash_register_id', '=', 'cash_registers.id')
            ->join('branches', 'cash_registers.branch_id', '=', 'branches.id')
            ->where('branches.company_id', $companyId)
            ->where('sales.status', 'completed')
            ->whereDate('sales.created_at', '>=', $startDate)
            ->whereDate('sales.created_at', '<=', $endDate);

        // --- CÁLCULOS GENERALES ---
        $totalSales = $query->sum(DB::raw('sale_items.quantity * sale_items.price'));
        $totalCost  = $query->sum(DB::raw('sale_items.quantity * sale_items.cost'));

        $grossProfit = $totalSales - $totalCost;

        // Margen de utilidad (%) = (Utilidad / Ventas) * 100
        $margin = $totalSales > 0 ? ($grossProfit / $totalSales) * 100 : 0;

        // --- TOP PRODUCTOS MÁS RENTABLES ---
        $topProducts = SaleItem::query()
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('cash_registers', 'sales.cash_register_id', '=', 'cash_registers.id')
            ->join('branches', 'cash_registers.branch_id', '=', 'branches.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('branches.company_id', $companyId)
            ->where('sales.status', 'completed')
            ->whereDate('sales.created_at', '>=', $startDate)
            ->whereDate('sales.created_at', '<=', $endDate)
            ->select(
                'products.name',
                DB::raw('SUM(sale_items.quantity) as total_sold'),
                DB::raw('SUM(sale_items.quantity * sale_items.price) as income'),
                DB::raw('SUM(sale_items.quantity * sale_items.cost) as total_cost'),
                DB::raw('SUM(sale_items.quantity * (sale_items.price - sale_items.cost)) as profit')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('profit') // Ordenar por ganancia, no por ventas
            ->limit(10)
            ->get();

        return Inertia::render('reports/profit', [
            'filters' => ['start_date' => $startDate, 'end_date' => $endDate],
            'kpi' => [
                'income' => $totalSales,
                'cost' => $totalCost,
                'profit' => $grossProfit,
                'margin' => round($margin, 2)
            ],
            'topProducts' => $topProducts
        ]);
    }
}
