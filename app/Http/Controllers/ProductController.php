<?php

namespace App\Http\Controllers;

use App\Models\Product; // <-- Importa el modelo
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 1. Obtenemos todos los productos (puedes usar paginate() luego)
        $products = Product::latest()->get();

        // 2. Renderizamos el componente de React que AÚN NO HEMOS CREADO
        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Solo necesitamos renderizar el componente de React
        return Inertia::render('products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validar los datos del formulario
        $validatedData = $request->validate([
            'barcode' => 'nullable|string|unique:products,barcode',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        // 2. Crear el producto
        Product::create($validatedData);

        // 3. Redirigir de vuelta al índice de productos
        return redirect()->route('products.index')->with('success', 'Producto creado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product) // <-- Inyección automática del modelo
    {
        // Renderizamos la vista 'Edit' y le pasamos el producto que queremos editar
        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // 1. Validamos (igual que en store)
        $validatedData = $request->validate([
            'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        // 2. Actualizamos el producto con los nuevos datos
        $product->update($validatedData);

        // 3. Redirigimos
        return redirect()->route('products.index')->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // 1. Eliminar el producto
        $product->delete();

        // 2. Redirigir de vuelta con un mensaje (si usas notificaciones toast, esto lo activará)
        return redirect()->route('products.index')->with('success', 'Producto eliminado correctamente.');
    }
}
