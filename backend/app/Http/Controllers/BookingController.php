<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Business;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(protected BookingService $bookingService) {}

    // POST /api/businesses/{business}/bookings
    // Public — no auth required for clients to book
    public function store(Request $request, Business $business)
    {
        $validated = $request->validate([
            'client_name'      => 'required|string|max:255',
            'client_email'     => 'required|email',
            'booking_date'     => 'required|date|after_or_equal:today',
            'booking_time'     => 'required|date_format:H:i',
            'duration_minutes' => 'integer|in:30,45,60,90,120',
            'notes'            => 'nullable|string|max:500',
        ]);

        try {
            $booking = $this->bookingService->createBooking($business, $validated);
            return response()->json($booking, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }

    // GET /api/businesses/{business}/bookings
    // Owner and staff only
    public function index(Request $request, Business $business)
    {
        $query = $business->bookings();

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->whereIn('status', ['pending', 'confirmed']);
            } else {
                $query->where('status', $request->status);
            }
        }
        // No status param = return everything

        if ($request->has('from')) {
            $query->where('booking_date', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('booking_date', '<=', $request->to);
        }

        return response()->json(
            $query->orderBy('booking_date')->orderBy('booking_time')->get()
        );
    }

    // DELETE /api/bookings/{booking}
    // Owner only
    public function cancel(Booking $booking)
    {
        try {
            $booking = $this->bookingService->cancelBooking($booking);
            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // PUT /api/bookings/{booking}/reschedule
    // Owner only
    public function reschedule(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required|date_format:H:i',
        ]);

        try {
            $booking = $this->bookingService->rescheduleBooking(
                $booking,
                $validated['booking_date'],
                $validated['booking_time']
            );
            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }

    // PUT /api/bookings/{booking}/confirm
    public function confirm(Booking $booking)
    {
        try {
            $booking = $this->bookingService->confirmBooking($booking);
            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // PUT /api/bookings/{booking}/complete
    public function complete(Booking $booking)
    {
        try {
            $booking = $this->bookingService->completeBooking($booking);
            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    
}