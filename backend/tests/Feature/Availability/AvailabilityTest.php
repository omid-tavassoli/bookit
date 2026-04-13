<?php

namespace Tests\Feature\Availability;

use App\Models\AvailabilityRule;
use App\Models\Business;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityTest extends TestCase
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

    private function createUser(string $role, string $email): User
    {
        return User::create([
            'name'     => ucfirst($role),
            'email'    => $email,
            'password' => 'password123',
            'role'     => $role,
        ]);
    }

    /**
     * Creates active availability rules for Monday–Friday (day_of_week 0–4).
     * In this schema: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6.
     */
    private function setupWeekdayRules(Business $business): void
    {
        foreach (range(0, 4) as $dayOfWeek) {
            AvailabilityRule::create([
                'business_id' => $business->id,
                'day_of_week' => $dayOfWeek,
                'start_time'  => '09:00',
                'end_time'    => '17:00',
                'is_active'   => true,
            ]);
        }
    }

    // --- Owner access ---

    public function test_owner_can_set_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        $response = $this->actingAs($owner)->putJson("/api/businesses/{$business->id}/availability-rules", [
            'rules' => [
                ['day_of_week' => 0, 'start_time' => '09:00', 'end_time' => '17:00', 'is_active' => true],
                ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '17:00', 'is_active' => true],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Availability rules updated.']);

        $this->assertDatabaseHas('availability_rules', [
            'business_id' => $business->id,
            'day_of_week' => 0,
            'start_time'  => '09:00',
            'end_time'    => '17:00',
        ]);
    }

    public function test_owner_can_get_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $this->setupWeekdayRules($business);

        $response = $this->actingAs($owner)->getJson("/api/businesses/{$business->id}/availability-rules");

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    // --- Staff access ---

    public function test_staff_cannot_set_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $staff = $this->createUser('staff', 'staff@example.com');

        $this->actingAs($staff)
            ->putJson("/api/businesses/{$business->id}/availability-rules", [
                'rules' => [
                    ['day_of_week' => 0, 'start_time' => '09:00', 'end_time' => '17:00'],
                ],
            ])
            ->assertStatus(403);
    }

    public function test_staff_cannot_get_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $staff = $this->createUser('staff', 'staff@example.com');

        $this->actingAs($staff)
            ->getJson("/api/businesses/{$business->id}/availability-rules")
            ->assertStatus(403);
    }

    // --- Client access ---

    public function test_client_cannot_set_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $client = $this->createUser('client', 'client@example.com');

        $this->actingAs($client)
            ->putJson("/api/businesses/{$business->id}/availability-rules", [
                'rules' => [
                    ['day_of_week' => 0, 'start_time' => '09:00', 'end_time' => '17:00'],
                ],
            ])
            ->assertStatus(403);
    }

    public function test_client_cannot_get_availability_rules(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();
        $client = $this->createUser('client', 'client@example.com');

        $this->actingAs($client)
            ->getJson("/api/businesses/{$business->id}/availability-rules")
            ->assertStatus(403);
    }

    // --- Public slots endpoint ---

    public function test_slots_endpoint_returns_correct_time_slots_for_valid_future_date(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        // Monday rule (day_of_week = 0): 09:00–11:00
        // With 60-minute slots this produces: ['09:00', '10:00']
        AvailabilityRule::create([
            'business_id' => $business->id,
            'day_of_week' => 0,
            'start_time'  => '09:00',
            'end_time'    => '11:00',
            'is_active'   => true,
        ]);

        $nextMonday = Carbon::now()->next(Carbon::MONDAY)->toDateString();

        $response = $this->getJson("/api/businesses/{$business->id}/slots?date={$nextMonday}&duration=60");

        $response->assertStatus(200)
            ->assertJson([
                'date'  => $nextMonday,
                'slots' => ['09:00', '10:00'],
            ]);
    }

    public function test_past_date_is_rejected(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        $yesterday = Carbon::yesterday()->toDateString();

        $this->getJson("/api/businesses/{$business->id}/slots?date={$yesterday}")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['date']);
    }

    public function test_weekend_returns_empty_slots_when_no_weekend_rules_exist(): void
    {
        [$owner, $business] = $this->createOwnerWithBusiness();

        // Only Mon–Fri rules exist (day_of_week 0–4); Saturday = 5, Sunday = 6 have no rules
        $this->setupWeekdayRules($business);

        $nextSaturday = Carbon::now()->next(Carbon::SATURDAY)->toDateString();

        $this->getJson("/api/businesses/{$business->id}/slots?date={$nextSaturday}")
            ->assertStatus(200)
            ->assertJson([
                'date'  => $nextSaturday,
                'slots' => [],
            ]);
    }
}
