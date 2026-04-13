<?php

namespace Tests\Feature\Booking;

use App\Models\Booking;
use App\Models\Business;
use App\Models\User;
use App\Services\BookingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * BookingService::createBooking and rescheduleBooking use pg_try_advisory_xact_lock,
 * which is PostgreSQL-specific and unavailable in the SQLite test environment.
 * BookingService is therefore mocked so these tests exercise the HTTP contract
 * (routing, validation, status codes, role enforcement) without touching PG internals.
 */
class BookingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Creates an owner user and an associated business.
     *
     * @return array{0: User, 1: Business}
     */
    private function createOwnerWithBusiness(): array
    {
        $owner = User::create([
            'name'     => 'Owner',
            'email'    => 'owner@example.com',
            'password' => 'password123',
            'role'     => 'owner',
        ]);

        $business = Business::create([
            'user_id'  => $owner->id,
            'name'     => 'Test Business',
            'slug'     => 'test-business',
            'timezone' => 'UTC',
        ]);

        return [$owner, $business];
    }

    /**
     * Persists a booking record directly so it can be found via route model binding.
     */
    private function createBookingRecord(Business $business, array $overrides = []): Booking
    {
        return Booking::create(array_merge([
            'business_id'      => $business->id,
            'client_name'      => 'Test Client',
            'client_email'     => 'client@example.com',
            'booking_date'     => Carbon::tomorrow()->toDateString(),
            'booking_time'     => '10:00',
            'duration_minutes' => 60,
            'status'           => 'confirmed',
        ], $overrides));
    }

    private function validBookingPayload(array $overrides = []): array
    {
        return array_merge([
            'client_name'      => 'Test Client',
            'client_email'     => 'client@example.com',
            'booking_date'     => Carbon::tomorrow()->toDateString(),
            'booking_time'     => '10:00',
            'duration_minutes' => 60,
        ], $overrides);
    }

    // --- Create ---

    public function test_client_can_create_a_booking(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        $stubBooking = Booking::make([
            'business_id'      => $business->id,
            'client_name'      => 'Test Client',
            'client_email'     => 'client@example.com',
            'booking_date'     => Carbon::tomorrow()->toDateString(),
            'booking_time'     => '10:00',
            'duration_minutes' => 60,
            'status'           => 'confirmed',
        ]);

        $this->mock(BookingService::class)
            ->shouldReceive('createBooking')
            ->once()
            ->andReturn($stubBooking);

        $this->postJson("/api/businesses/{$business->id}/bookings", $this->validBookingPayload())
            ->assertStatus(201)
            ->assertJsonFragment(['client_email' => 'client@example.com', 'status' => 'confirmed']);
    }

    public function test_booking_same_slot_twice_returns_409(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        $this->mock(BookingService::class)
            ->shouldReceive('createBooking')
            ->once()
            ->andThrow(new \Exception('This slot has already been booked.'));

        $this->postJson("/api/businesses/{$business->id}/bookings", $this->validBookingPayload())
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'This slot has already been booked.']);
    }

    public function test_booking_outside_working_hours_returns_409(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        $this->mock(BookingService::class)
            ->shouldReceive('createBooking')
            ->once()
            ->andThrow(new \Exception('This time slot is not available.'));

        $this->postJson("/api/businesses/{$business->id}/bookings", $this->validBookingPayload([
            'booking_time' => '23:00',
        ]))
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'This time slot is not available.']);
    }

    // --- Cancel ---

    public function test_owner_can_cancel_a_booking(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $booking = $this->createBookingRecord($business);

        $this->mock(BookingService::class)
            ->shouldReceive('cancelBooking')
            ->once()
            ->andReturnUsing(function (Booking $b): Booking {
                $b->status = 'cancelled';

                return $b;
            });

        $this->actingAs($owner)
            ->deleteJson("/api/bookings/{$booking->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['status' => 'cancelled']);
    }

    // --- Reschedule ---

    public function test_owner_can_reschedule_a_booking_to_an_available_slot(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $booking = $this->createBookingRecord($business);

        $newDate = Carbon::now()->addDays(3)->toDateString();
        $newTime = '14:00';

        $this->mock(BookingService::class)
            ->shouldReceive('rescheduleBooking')
            ->once()
            ->andReturnUsing(function (Booking $b, string $date, string $time): Booking {
                $b->booking_date = $date;
                $b->booking_time = $time;

                return $b;
            });

        $this->actingAs($owner)
            ->putJson("/api/bookings/{$booking->id}/reschedule", [
                'booking_date' => $newDate,
                'booking_time' => $newTime,
            ])
            ->assertStatus(200)
            ->assertJsonFragment(['booking_time' => $newTime]);
    }
}
