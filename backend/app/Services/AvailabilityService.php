<?php

namespace App\Services;

use App\Models\Business;
use App\Models\AvailabilityRule;
use App\Models\AvailabilityOverride;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AvailabilityService
{
    public function getAvailableSlots(Business $business, string $date, int $durationMinutes = 60): array
    {
        $requestedDate = Carbon::parse($date, $business->timezone);

        $dayOfWeek = $requestedDate->dayOfWeekIso - 1; // ISO: Mon=1 ... Sun=7, we want 0...6

        // Check for an override on this specific date first
        $override = AvailabilityOverride::where('business_id', $business->id)
            ->where('date', $requestedDate->toDateString())
            ->first();

        if ($override) {
            // Business explicitly closed this day
            if ($override->is_closed) {
                return [];
            }
            // Business has modified hours this day
            $startTime = $override->start_time;
            $endTime   = $override->end_time;
        } else {
            // Use the normal weekly rule
            $rule = AvailabilityRule::where('business_id', $business->id)
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->first();

            // No rule means closed that day
            if (!$rule) {
                return [];
            }

            $startTime = $rule->start_time;
            $endTime   = $rule->end_time;
        }

        $allSlots = $this->generateSlots($date, $startTime, $endTime, $durationMinutes, $business->timezone);

        // Fetch already booked times for this date
        $bookedTimes = \App\Models\Booking::where('business_id', $business->id)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('booking_time')
            ->map(fn($t) => substr($t, 0, 5)) // normalize HH:MM:SS to HH:MM
            ->toArray();

        // Return only slots that are not already booked
        return array_values(array_filter($allSlots, fn($slot) => !in_array($slot, $bookedTimes)));
    }

   
    private function generateSlots(string $date, string $startTime, string $endTime, int $durationMinutes, string $timezone): array
    {
        $slots  = [];
        $cursor = Carbon::parse("$date $startTime", $timezone);
        $end    = Carbon::parse("$date $endTime", $timezone);

        while ($cursor->copy()->addMinutes($durationMinutes)->lessThanOrEqualTo($end)) {
            $slots[] = $cursor->format('H:i');
            $cursor->addMinutes($durationMinutes);
        }

        return $slots;
    }
}