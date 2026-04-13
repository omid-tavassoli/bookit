<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BusinessController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:businesses,slug|regex:/^[a-z0-9-]+$/',
            'timezone'    => 'string|max:100',
            'phone'       => 'nullable|string|max:50',
            'email'       => 'nullable|email',
            'description' => 'nullable|string|max:1000',
        ]);

        $business = \App\Models\Business::create([
            ...$validated,
            'user_id'  => $request->user()->id,
            'timezone' => $validated['timezone'] ?? 'Europe/Berlin',
        ]);

        // Seed default availability — Monday to Friday, 09:00–17:00
        $defaultRules = [];
        foreach (range(0, 4) as $dayOfWeek) {
            $defaultRules[] = [
                'business_id' => $business->id,
                'day_of_week' => $dayOfWeek,
                'start_time'  => '09:00:00',
                'end_time'    => '17:00:00',
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        \App\Models\AvailabilityRule::insert($defaultRules);

        return response()->json($business, 201);
    }
    public function show(Request $request)
    {
        $business = $request->user()
            ->businesses()
            ->first();

        if (!$business) {
            return response()->json(['message' => 'No business found.'], 404);
        }

        return response()->json($business);
    }

    public function myBusinesses(Request $request)
    {
        $user = $request->user();

        // Owners get their own businesses
        if ($user->isOwner()) {
            return response()->json($user->businesses()->get());
        }

        // Staff get businesses where they have at least one permission
        if ($user->isStaff()) {
            $businesses = \App\Models\Business::whereHas('staffPermissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->get();

            return response()->json($businesses);
        }

        return response()->json([]);
    }

    public function findBySlug(string $slug)
    {
        $business = \App\Models\Business::where('slug', $slug)->first();

        if (!$business) {
            return response()->json(['message' => 'Business not found.'], 404);
        }

        return response()->json($business);
    }
}