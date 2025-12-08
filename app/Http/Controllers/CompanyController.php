<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::latest()->get();

        return Inertia::render('companies/index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        return Inertia::render('companies/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('companies', 'public');
        }

        Company::create([
            'name' => $request->name,
            'logo_path' => $logoPath,
        ]);

        return redirect()->route('companies.index')->with('success', 'Empresa creada correctamente.');
    }

    public function show(Company $company)
    {
        return Inertia::render('companies/show', [
            'company' => $company->load('branches'),
        ]);
    }

    public function edit(Company $company)
    {
        return Inertia::render('companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($company->logo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($company->logo_path);
            }
            $company->logo_path = $request->file('logo')->store('companies', 'public');
        }

        $company->name = $request->name;
        $company->save();

        return redirect()->route('companies.index')->with('success', 'Empresa actualizada correctamente.');
    }

    public function destroy(Company $company)
    {
        if ($company->logo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($company->logo_path);
        }
        $company->delete();
        return redirect()->route('companies.index')->with('success', 'Empresa eliminada correctamente.');
    }
}
