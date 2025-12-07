<?php
namespace App\Http\Controllers;

use App\Models\Product; // Importa el modelo
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia; // Importa Inertia

class POSController extends Controller
{
    // Un método 'index' para mostrar la página
    public function index()
    {
        // 1. Obtiene los productos de la BD
        $products = Product::all();
        $clients = Client::all();

        // 2. Renderiza el componente de React (el archivo POS.tsx)
        //    y le pasa los productos como 'props'
        return Inertia::render('POS', [
            'products' => $products,
            'clients' => $clients
        ]);
    }
}