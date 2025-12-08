<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $branches = Branch::with('company')->latest()->get();

        return Inertia::render('branches/index', [
            'branches' => $branches,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $companies = \App\Models\Company::all(); // Get all companies for dropdown
        return Inertia::render('branches/create', [
            'companies' => $companies,
            'company_id' => $request->query('company_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        Branch::create($request->all());

        return redirect()->route('branches.index')->with('success', 'Sucursal creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch)
    {
        return Inertia::render('branches/show', [
            'branch' => $branch->load('company'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        $companies = \App\Models\Company::all();
        return Inertia::render('branches/edit', [
            'branch' => $branch,
            'companies' => $companies,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        $branch->update($request->all());

        return redirect()->route('branches.index')->with('success', 'Sucursal actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();
        return redirect()->back()->with('success', 'Sucursal eliminada correctamente.');
    }
}
