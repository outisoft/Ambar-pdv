<?php

namespace App\Http\Controllers;

use App\Models\Client;
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
        return Inertia::render('Clients/Index', [
            'clients' => Client::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        Client::create($validated);

        return redirect()->back()->with('success', 'Cliente creado.');
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            // ... resto de validaciones iguales ...
        ]);

        $client->update($validated);

        return redirect()->back()->with('success', 'Cliente actualizado.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('success', 'Cliente eliminado.');
    }
}