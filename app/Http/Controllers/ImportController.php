<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\ProductImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Response;

class ImportController extends Controller
{
    // 1. Procesar el archivo subido
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048', // Máx 2MB
        ]);

        try {
            Excel::import(new ProductImport, $request->file('file'));

            return back()->with('success', '¡Inventario importado correctamente!');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            // Podrías devolver los errores específicos de cada fila
            return back()->with('error', 'Error en el archivo. Revisa que los códigos de barras no estén duplicados.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al importar: ' . $e->getMessage());
        }
    }

    // 2. Descargar Plantilla de Ejemplo
    // En ImportController.php

    // app/Http/Controllers/ImportController.php

    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="plantilla_inventario.csv"',
        ];

        // DEFINIMOS LAS COLUMNAS EXACTAS QUE ESPERA EL CÓDIGO
        $columns = [
            'nombre',
            'codigo_barras',
            'descripcion', // Opcional
            'precio',      // Precio de venta (obligatorio)
            'costo',       // Costo unitario (opcional)
            'stock_inicial',
            'stock_minimo',
        ];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns); // Encabezados

            // Ejemplo actualizado
            fputcsv($file, [
                'Paracetamol 500mg', // nombre
                '7501000001',        // codigo_barras
                'Caja con 10 tabletas', // descripcion
                '45.00',             // precio de venta
                '30.00',             // costo unitario (opcional)
                '100',               // stock_inicial
                '10',                // stock_minimo
            ]);

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
