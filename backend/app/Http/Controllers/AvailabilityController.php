<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\AvailabilityRule;
use App\Models\AvailabilityOverride;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function __construct(protected AvailabilityService $availabilityService)
    {

    }

    public function getRules(Business $business)
    {
        $rules = $business->availabilityRules()->orderBy('day_of_week')->get();
        return response()->json($rules);
    }

    public function setRules(Request $request, Business $business)
    {
        $validated = $request->validate([
            'rules'               => 'required|array',
            'rules.*.day_of_week' => 'required|integer|between:0,6',
            'rules.*.start_time'  => 'required|date_format:H:i',
            'rules.*.end_time'    => 'required|date_format:H:i|after:rules.*.start_time',
            'rules.*.is_active'   => 'boolean',
        ]);

        foreach ($validated['rules'] as $ruleData) {
            AvailabilityRule::updateOrCreate(
                ['business_id' => $business->id, 'day_of_week' => $ruleData['day_of_week']],
                ['start_time' => $ruleData['start_time'], 'end_time' => $ruleData['end_time'], 'is_active' => $ruleData['is_active'] ?? true]
            );
        }

        return response()->json(['message' => 'Availability rules updated.']);
    }

    public function addOverride(Request $request, Business $business)
    {
        $validated = $request->validate([
            'date'       => 'required|date|after_or_equal:today',
            'is_closed'  => 'required|boolean',
            'start_time' => 'nullable|required_if:is_closed,false|date_format:H:i',
            'end_time'   => 'nullable|required_if:is_closed,false|date_format:H:i|after:start_time',
            'reason'     => 'nullable|string|max:255',
        ]);

        $override = AvailabilityOverride::updateOrCreate(
            ['business_id' => $business->id, 'date' => $validated['date']],
            $validated
        );

        return response()->json($override, 201);
    }

    public function getSlots(Request $request, Business $business)
    {
        $validated = $request->validate([
            'date'     => 'required|date|after_or_equal:today',
            'duration' => 'integer|in:30,45,60,90,120',
        ]);

        $slots = $this->availabilityService->getAvailableSlots(
            $business,
            $validated['date'],
            $validated['duration'] ?? 60
        );

        return response()->json(['date' => $validated['date'], 'slots' => $slots]);
    }

}
