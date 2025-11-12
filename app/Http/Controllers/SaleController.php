<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // ¡Importante! Para transacciones
use Illuminate\Validation\ValidationException; // Para errores de stock

class SaleController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validación de los datos recibidos (el carrito)
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItems = $request->input('items');

        // ¡¡CLAVE!! Usamos una transacción de BD.
        // Si algo falla (ej. no hay stock), se revierte TODO.
        // No se creará la venta, ni se descontará stock parcial.
        try {
            return DB::transaction(function () use ($cartItems) {
                
                $serverTotal = 0;
                $itemsToCreate = [];

                foreach ($cartItems as $item) {
                    $product = Product::find($item['id']);

                    // 2. Comprobar el stock
                    if ($product->stock < $item['quantity']) {
                        // Si no hay stock, lanzamos una excepción para revertir la transacción
                        throw ValidationException::withMessages([
                            'stock' => 'No hay suficiente stock para: ' . $product->name,
                        ]);
                    }

                    // 3. Calcular el total (del lado del servidor, NUNCA confiar en el cliente)
                    $itemTotal = $product->price * $item['quantity'];
                    $serverTotal += $itemTotal;

                    // 4. Preparar el 'SaleItem'
                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price, // Precio del producto en ESE momento
                    ];

                    // 5. Descontar el stock
                    $product->stock -= $item['quantity'];
                    $product->save();
                }

                // 6. Crear la Venta
                $sale = Sale::create([
                    'total' => $serverTotal,
                ]);

                // 7. Insertar los SaleItems en la BD
                $sale->items()->createMany($itemsToCreate);

                // 8. Si todo salió bien, Inertia redirige (o podemos devolver OK)
                // Redirigimos de vuelta al TPV con un mensaje de éxito.
                return redirect()->route('pos')->with('success', '¡Venta procesada con éxito!');
            });

        } catch (ValidationException $e) {
            // Si atrapamos el error de stock, devolvemos el error a React
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Cualquier otro error
            return redirect()->back()->withErrors(['general' => 'Ocurrió un error inesperado.']);
        }
    }
}