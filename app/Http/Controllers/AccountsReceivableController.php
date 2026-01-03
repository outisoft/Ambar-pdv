<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientTransaction;
use App\Models\CashRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
            'amount' => 'required|numeric|min:0.01|max:' . $client->current_balance, // No puede pagar más de lo que debe
            'notes' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($validated, $client, $user) {
            $oldBalance = $client->current_balance;
            $newBalance = $oldBalance - $validated['amount'];

            // Verificar que exista una caja abierta para este usuario y sucursal
            $register = CashRegister::where('user_id', $user->id)
                ->where('branch_id', $user->branch_id)
                ->where('status', 'open')
                ->firstOrFail();

            // Registrar Transacción (Abono)
            ClientTransaction::create([
                'client_id' => $client->id,
                'user_id' => $user->id,
                'type' => 'payment',
                'amount' => $validated['amount'],
                'previous_balance' => $oldBalance,
                'new_balance' => $newBalance,
                'description' => $validated['notes'] ?? 'Abono a Cuenta',
            ]);

            // Actualizar Saldo Cliente
            $client->update(['current_balance' => $newBalance]);

            \App\Models\CashMovement::create([
                'cash_register_id' => $register->id,
                'type' => 'in',
                'amount' => $validated['amount'],
                'description' => 'Abono cliente: ' . $client->name,
            ]);
        });

        return back()->with('success', 'Abono registrado correctamente');
    }
}
