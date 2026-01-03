<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccountsReceivableController extends Controller
{
    // Listar clientes con deuda
    public function index()
    {
        // Traemos solo clientes que deben algo (> 0)
        $debtors = Client::where('current_balance', '>', 0)
            ->orderBy('current_balance', 'desc')
            ->get();

        return Inertia::render('AccountsReceivable/Index', [
            'debtors' => $debtors
        ]);
    }

    // Ver detalle y registrar abono
    public function show(Client $client)
    {
        return Inertia::render('AccountsReceivable/Show', [
            'client' => $client->load('transactions.user'), // Cargamos historial
        ]);
    }

    // Registrar Abono (Pago de deuda)
    public function storePayment(Request $request, Client $client)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $client->current_balance, // No puede pagar más de lo que debe
        ]);

        DB::transaction(function () use ($request, $client) {
            $oldBalance = $client->current_balance;
            $newBalance = $oldBalance - $request->amount;

            // Registrar Transacción (Abono)
            ClientTransaction::create([
                'client_id' => $client->id,
                'user_id' => Auth::id(),
                'type' => 'payment',
                'amount' => $request->amount,
                'previous_balance' => $oldBalance,
                'new_balance' => $newBalance,
                'description' => 'Abono a Cuenta',
            ]);

            // Actualizar Saldo Cliente
            $client->update(['current_balance' => $newBalance]);

            // OJO: AQUÍ DEBERÍAS REGISTRAR TAMBIÉN UN MOVIMIENTO DE CAJA (CashMovement)
            // Porque entró dinero físico a la caja.
            \App\Models\CashMovement::create([
                'cash_register_id' => Auth::user()->cashRegister->id, // Asumiendo relación
                'type' => 'in',
                'amount' => $request->amount,
                'description' => 'Abono cliente: ' . $client->name
            ]);
        });

        return back()->with('success', 'Abono registrado correctamente');
    }
}
