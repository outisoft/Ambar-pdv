<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientTransaction;
use App\Models\CashRegister;
use App\Models\CashMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // Asegúrate de importar esto

class AccountsReceivableController extends Controller
{
    // Listar clientes con deuda
    public function index()
    {
        $user = request()->user();

        $query = Client::query()
            ->where('current_balance', '>', 0)
            ->orderBy('current_balance', 'desc');

        if (! $user->hasRole('super-admin')) {
            $query->where('company_id', $user->company_id);
        }

        $debtors = $query->get();

        return Inertia::render('AccountsReceivable/Index', [
            'debtors' => $debtors,
        ]);
    }

    // Ver detalle de un cliente y su historial de crédito
    public function show(Client $client)
    {
        $user = request()->user();

        if (! $user->hasRole('super-admin') && $client->company_id !== $user->company_id) {
            abort(403);
        }

        return Inertia::render('AccountsReceivable/Show', [
            // Cargamos historial de transacciones con el usuario que registró cada una
            'client' => $client->load('transactions.user'),
        ]);
    }

    // Registrar Abono (Pago de deuda)
    public function storePayment(Request $request, Client $client)
    {
        $user = $request->user();

        if (! $user->hasRole('super-admin') && $client->company_id !== $user->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $client->current_balance,
            'notes' => 'nullable|string|max:500',
        ]);

        // 1. Capturamos el resultado de la transacción en una variable
        $transaction = DB::transaction(function () use ($validated, $client, $user) {
            $oldBalance = $client->current_balance;
            $newBalance = $oldBalance - $validated['amount'];

            // Buscar caja abierta para este usuario y sucursal
            $register = CashRegister::where('user_id', $user->id)
                ->where('branch_id', $user->branch_id)
                ->where('status', 'open')
                ->first();

            if (! $register) {
                throw ValidationException::withMessages([
                    'amount' => 'Debes tener una caja abierta para registrar abonos.',
                ]);
            }
            // Creamos la transacción
            $trx = ClientTransaction::create([
                'client_id' => $client->id,
                'user_id' => $user->id,
                'type' => 'payment',
                'amount' => $validated['amount'],
                'previous_balance' => $oldBalance,
                'new_balance' => $newBalance,
                'description' => $validated['notes'] ?? 'Abono a Cuenta',
            ]);

            $client->update(['current_balance' => $newBalance]);

            CashMovement::create([
                'cash_register_id' => $register->id,
                'type' => 'in',
                'amount' => $validated['amount'],
                'description' => 'Abono cliente: ' . $client->name,
            ]);

            // IMPORTANTE: Retornamos la transacción para usarla fuera de este bloque
            return $trx;
        });

        // 2. Retornamos con la URL del ticket en la sesión flash
        return back()->with([
            'success' => 'Abono registrado correctamente',
            'ticket_url' => route('receivable.print_ticket', $transaction->id) // Generamos la ruta aquí
        ]);
    }

    // app/Http/Controllers/AccountsReceivableController.php
    public function printTicket($transactionId)
    {
        // 0. Buscar la transacción manualmente por ID
        $transaction = ClientTransaction::findOrFail($transactionId);

        // 1. Seguridad: Verificar que el cliente pertenezca a la empresa del usuario
        $client = $transaction->client;
        if ($client->company_id !== Auth::user()->company_id) {
            abort(403, 'No autorizado');
        }

        // 2. Cálculos para el ticket
        // El "Disponible" se calcula: Límite de Crédito - El Saldo que quedó después del pago
        $availableCredit = $client->credit_limit - $transaction->new_balance;

        // 3. Generar PDF
        $pdf = Pdf::loadView('tickets.payment', [
            'transaction' => $transaction,
            'client' => $client,
            'company' => Auth::user()->company,
            'available_credit' => $availableCredit
        ]);

        // Configurar tamaño de papel (aprox 80mm de ancho térmico)
        $pdf->setPaper([0, 0, 226, 600], 'portrait');

        return $pdf->stream('ticket-abono-' . $transaction->id . '.pdf');
    }
}
