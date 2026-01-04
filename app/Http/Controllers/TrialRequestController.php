<?php

namespace App\Http\Controllers;

use App\Mail\TrialRequestMail;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TrialRequestController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'business_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'plan_id' => ['nullable', 'integer', 'exists:plans,id'],
        ]);

        $planName = null;

        if (! empty($validated['plan_id'] ?? null)) {
            $plan = Plan::find($validated['plan_id']);
            $planName = $plan?->name;
        }

        $recipient = env('TRIAL_REQUEST_EMAIL', config('mail.from.address'));

        if ($recipient) {
            Mail::to($recipient)->send(new TrialRequestMail(
                name: $validated['name'],
                email: $validated['email'],
                phone: $validated['phone'] ?? null,
                businessName: $validated['business_name'] ?? null,
                notes: $validated['notes'] ?? null,
                planName: $planName,
            ));
        }

        return back()->with('success', 'Tu solicitud de prueba ha sido enviada.');
    }
}
