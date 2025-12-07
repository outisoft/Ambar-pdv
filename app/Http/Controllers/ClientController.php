<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
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