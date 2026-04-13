<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Business;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendBookingConfirmation;
use App\Jobs\SendBookingReminder;
use Carbon\Carbon;
use App\Jobs\SendBookingCancelled;
use App\Jobs\SendBookingRescheduled;
use App\Jobs\SendBookingAccepted;

class BookingService
{
    public function __construct(
        protected AvailabilityService $availabilityService
    ) {}


    // Convert business_id + date + time into a unique integer for advisory lock.
    private function generateLockKey(int $businessId, string $date, string $time): int
    {
        $str = "business:{$businessId}:date:{$date}:time:{$time}";

        // crc32 returns a signed 32-bit integer — safe for pg advisory locks
        return crc32($str);
    }

    /**
     * Create a booking with advisory lock protection against race conditions.
     *
     * @throws \Exception if slot is unavailable or lock cannot be acquired
     */
    public function createBooking(Business $business, array $data): Booking
    {
        $lockKey = $this->generateLockKey(
            $business->id,
            $data['booking_date'],
            $data['booking_time']
        );

        return DB::transaction(function () use ($business, $data, $lockKey) {

            $locked = DB::selectOne('SELECT pg_try_advisory_xact_lock(?) AS locked', [$lockKey]);

            if (!$locked->locked) {
                throw new \Exception('This slot is currently being booked. Please try again later.');
            }

            $availableSlots = $this->availabilityService->getAvailableSlots(
                $business,
                $data['booking_date'],
                $data['duration_minutes'] ?? 60
            );

            if (!in_array($data['booking_time'], $availableSlots)) {
                throw new \Exception('This time slot is not available.');
            }

            $existingBooking = Booking::where('business_id', $business->id)
                ->where('booking_date', $data['booking_date'])
                ->where('booking_time', $data['booking_time'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->first();

            if ($existingBooking) {
                throw new \Exception('This slot has already been booked.');
            }

            $booking =  Booking::create([
                'business_id'      => $business->id,
                'service_id'       => $data['service_id'] ?? null,
                'client_name'      => $data['client_name'],
                'client_email'     => $data['client_email'],
                'booking_date'     => $data['booking_date'],
                'booking_time'     => $data['booking_time'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'status'           => 'pending',
                'notes'            => $data['notes'] ?? null,
            ]);

            // Dispatch confirmation email immediately
            SendBookingConfirmation::dispatch($booking);

            // Dispatch reminder 24 hours before the appointment
            $appointmentDateTime = Carbon::parse(
                $data['booking_date'] . ' ' . $data['booking_time'],
                $business->timezone
            );
            $reminderTime = $appointmentDateTime->subHours(24);

            // Only schedule reminder if appointment is more than 24 hours away
            if ($reminderTime->isFuture()) {
                SendBookingReminder::dispatch($booking)->delay($reminderTime);
            }

            return $booking;
            
        });
    }

    /**
     * Cancel a booking.
     *
     * @throws \Exception if booking cannot be cancelled
     */
    public function cancelBooking(Booking $booking): Booking
    {
        if ($booking->isCancelled()) {
            throw new \Exception('This booking is already cancelled.');
        }

        if ($booking->isCompleted()) {
            throw new \Exception('A completed booking cannot be cancelled.');
        }

        $booking->update(['status' => 'cancelled']);

        SendBookingCancelled::dispatch($booking);

        return $booking->fresh();
    }

    /**
     * Reschedule a booking to a new date and time.
     *
     * @throws \Exception if new slot is unavailable
     */
    public function rescheduleBooking(Booking $booking, string $newDate, string $newTime): Booking
    {
        if ($booking->isCancelled() || $booking->isCompleted()) {
            throw new \Exception('This booking cannot be rescheduled.');
        }

        $lockKey = $this->generateLockKey(
            $booking->business_id,
            $newDate,
            $newTime
        );

        return DB::transaction(function () use ($booking, $newDate, $newTime, $lockKey) {

            $locked = DB::selectOne('SELECT pg_try_advisory_xact_lock(?) AS locked', [$lockKey]);

            if (!$locked->locked) {
                throw new \Exception('This slot is currently being booked. Please try again.');
            }

            $availableSlots = $this->availabilityService->getAvailableSlots(
                $booking->business,
                $newDate,
                $booking->duration_minutes
            );

            if (!in_array($newTime, $availableSlots)) {
                throw new \Exception('The requested new time slot is not available.');
            }

            $existing = Booking::where('business_id', $booking->business_id)
                ->where('booking_date', $newDate)
                ->where('booking_time', $newTime)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('id', '!=', $booking->id)
                ->first();

            if ($existing) {
                throw new \Exception('This slot has already been booked.');
            }

            $booking->update([
                'booking_date' => $newDate,
                'booking_time' => $newTime,
            ]);

            SendBookingRescheduled::dispatch($booking);

            return $booking->fresh();
        });
    }

    /**
     * Confirm a pending booking.
     */
    public function confirmBooking(Booking $booking): Booking
    {
        if (!$booking->isPending()) {
            throw new \Exception(
                "Only pending bookings can be confirmed. Current status: {$booking->status}."
            );
        }

        $booking->update(['status' => 'confirmed']);

        SendBookingAccepted::dispatch($booking);

        return $booking->fresh();
    }

    /**
     * Mark a booking as completed.
     */
    public function completeBooking(Booking $booking): Booking
    {
        if (!$booking->isConfirmed()) {
            throw new \Exception(
                "Only confirmed bookings can be completed. Current status: {$booking->status}."
            );
        }

        $booking->update(['status' => 'completed']);
        return $booking->fresh();
    }

}