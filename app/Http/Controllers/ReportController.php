<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Sale;
use App\Models\CashRegister;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf; // Importar PDF
use Carbon\Carbon;

class ReportController extends Controller
{
    // 1. VISTA PRINCIPAL (EL DASHBOARD DE REPORTES)
    public function index()
    {
        $user = Auth::user();
        $branches = [];

        // Lógica de Sucursales (SaaS)
        if ($user->hasRole('super-admin')) {
            $branches = Branch::with('company')->get();
        } elseif ($user->hasRole('gerente')) {
            $branches = Branch::where('company_id', $user->company_id)->get();
        } elseif ($user->hasRole('cajero')) {
            $branches = Branch::where('id', $user->branch_id)->get();
        }

        return Inertia::render('reports/index', [
            'branches' => $branches,
        ]);
    }

    // 2. REPORTE DE TURNOS / HORARIOS (PDF)
    public function shiftsPdf(Request $request)
    {
        $user = Auth::user();

        // Validar Filtros
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'branch_id' => 'nullable|exists:branches,id'
        ]);

        $start = Carbon::parse($request->start_date)->startOfDay();
        $end = Carbon::parse($request->end_date)->endOfDay();
        $branchId = $request->branch_id;

        // Construir Consulta
        $query = CashRegister::with(['user', 'branch.company'])
            ->whereBetween('opened_at', [$start, $end]);

        // FILTROS DE SEGURIDAD (SaaS)
        if ($user->hasRole('gerente')) {
            // Asegurar que solo vea cajas de su empresa
            $query->whereHas('branch', function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
            // Si el gerente eligió una sucursal específica
            if ($branchId) {
                $query->where('branch_id', $branchId);
            }
        } elseif ($user->hasRole('cajero')) {
            // Cajero solo ve sus propios turnos
            $query->where('user_id', $user->id);
        }

        $registers = $query->orderBy('opened_at', 'desc')->get();

        // Generar PDF
        // Usamos una vista Blade normal para diseñar el PDF
        $pdf = Pdf::loadView('reports.shifts_pdf', [
            'registers' => $registers,
            'start_date' => $start->format('d/m/Y'),
            'end_date' => $end->format('d/m/Y'),
            'company_name' => $user->company ? $user->company->name : 'Reporte General',
            'generated_by' => $user->name,
        ]);

        return $pdf->stream('reporte_horarios.pdf');
    }

    public function zCutPdf(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'register_id' => 'required|exists:cash_registers,id',
        ]);

        // Buscar la caja con todas sus relaciones
        $register = CashRegister::with(['user', 'branch.company', 'sales', 'movements' => function ($q) {
            // Traemos ventas normales y canceladas para contarlas
            $q->orderBy('created_at', 'desc');
        }])->findOrFail($request->register_id);

        // SEGURIDAD SAAS
        if ($user->hasRole('gerente') && $register->branch->company_id !== $user->company_id) {
            abort(403);
        }
        if ($user->hasRole('cajero') && $register->user_id !== $user->id) {
            abort(403);
        }

        // --- CÁLCULOS FINANCIEROS ---

        // 1. Desglose por Método de Pago (Solo ventas válidas)
        $paymentMethods = $register->sales
            ->where('status', '!=', 'cancelled')
            ->groupBy('payment_method')
            ->map(function ($sales) {
                return $sales->sum('total');
            });

        // 2. Totales
        $totalSales = $paymentMethods->sum();
        $cancelledSales = $register->sales->where('status', 'cancelled')->sum('total');
        $cancelledCount = $register->sales->where('status', 'cancelled')->count();
        $salesCount = $register->sales->where('status', '!=', 'cancelled')->count();

        // 3. Dinero esperado en caja (Efectivo)
        $cashInSystem = $paymentMethods->get('cash', 0);

        // B. Obtener Entradas y Salidas de la relación 'movements'
        $totalInputs = $register->movements->where('type', 'in')->sum('amount');
        $totalOutputs = $register->movements->where('type', 'out')->sum('amount');

        // C. FÓRMULA FINAL: (Inicial + VentasEfectivo + Entradas) - Salidas
        $expectedCash = ($register->initial_amount + $cashInSystem + $totalInputs) - $totalOutputs;

        // D. Recalcular diferencia
        $difference = $register->final_amount - $expectedCash;

        $pdf = Pdf::loadView('reports.z_cut_pdf', [
            'register' => $register,
            'payment_methods' => $paymentMethods,
            'total_sales' => $totalSales,
            'cancelled_sales' => $cancelledSales,
            'cancelled_count' => $cancelledCount,
            'sales_count' => $salesCount,
            'expected_cash' => $expectedCash,
            'difference' => $difference,
            'company' => $register->branch->company,
            'generated_at' => now(),
        ]);

        return $pdf->stream("corte_z_{$register->id}.pdf");
    }
}
