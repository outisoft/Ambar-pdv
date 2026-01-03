<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ClientController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_clients', only: ['index', 'show']),
            new Middleware('permission:create_clients', only: ['create', 'store']),
            new Middleware('permission:edit_clients', only: ['edit', 'update']),
            new Middleware('permission:delete_clients', only: ['destroy']),
        ];
    }
    public function index()
    {
        $user = request()->user();

        $query = Client::query()->latest();

        if (! $user->hasRole('super-admin')) {
            $query->where('company_id', $user->company_id);
        }

        return Inertia::render('Clients/Index', [
            'clients' => $query->get(),
        ]);
    }

    public function create()
    {
        $user = request()->user();

        $companies = [];
        if ($user->hasRole('super-admin')) {
            $companies = Company::orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('Clients/create', [
            'companies' => $companies,
        ]);
    }

    public function edit(Client $client)
    {
        $user = request()->user();

        if (! $user->hasRole('super-admin') && $client->company_id !== $user->company_id) {
            abort(403);
        }

        $companies = [];
        if ($user->hasRole('super-admin')) {
            $companies = Company::orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('Clients/edit', [
            'client' => $client,
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
            'company_id' => $user->hasRole('super-admin') ? 'required|exists:companies,id' : 'nullable',
        ]);

        if (! $user->hasRole('super-admin')) {
            $validated['company_id'] = $user->company_id;
        }
        $validated['current_balance'] = 0;

        Client::create($validated);

        return redirect()->route('clients.index')->with('success', 'Cliente creado.');
    }

    public function update(Request $request, Client $client)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
            'company_id' => $user->hasRole('super-admin') ? 'required|exists:companies,id' : 'nullable',
        ]);

        if (! $user->hasRole('super-admin')) {
            // For non super-admin, never allow changing company
            unset($validated['company_id']);
        }

        $client->update($validated);

        return redirect()->route('clients.index')->with('success', 'Cliente actualizado.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('success', 'Cliente eliminado.');
    }
}
