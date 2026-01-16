<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsController extends Controller
{
    /**
     * Muestra la página de Términos y Condiciones.
     */
    public function show()
    {
        return Inertia::render('terms/show');
    }

    // Agrega este método dentro de la clase
    public function privacy()
    {
        return Inertia::render('terms/privacy');
    }
}
