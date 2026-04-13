<?php

namespace Tests\Unit;

use App\Services\AvailabilityService;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionMethod;
use Tests\TestCase;

class BookingServiceTest extends TestCase
{
    use RefreshDatabase;

    private BookingService $service;

    private ReflectionMethod $generateLockKeyMethod;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new BookingService(new AvailabilityService());

        $this->generateLockKeyMethod = new ReflectionMethod(BookingService::class, 'generateLockKey');
        $this->generateLockKeyMethod->setAccessible(true);
    }

    private function generateLockKey(int $businessId, string $date, string $time): int
    {
        return $this->generateLockKeyMethod->invoke($this->service, $businessId, $date, $time);
    }

    public function test_generate_lock_key_produces_consistent_output_for_same_inputs(): void
    {
        $key1 = $this->generateLockKey(1, '2026-04-01', '09:00');
        $key2 = $this->generateLockKey(1, '2026-04-01', '09:00');

        $this->assertSame($key1, $key2);
    }

    public function test_different_business_ids_produce_different_keys(): void
    {
        $key1 = $this->generateLockKey(1, '2026-04-01', '09:00');
        $key2 = $this->generateLockKey(2, '2026-04-01', '09:00');

        $this->assertNotSame($key1, $key2);
    }

    public function test_different_dates_produce_different_keys(): void
    {
        $key1 = $this->generateLockKey(1, '2026-04-01', '09:00');
        $key2 = $this->generateLockKey(1, '2026-04-02', '09:00');

        $this->assertNotSame($key1, $key2);
    }

    public function test_different_times_produce_different_keys(): void
    {
        $key1 = $this->generateLockKey(1, '2026-04-01', '09:00');
        $key2 = $this->generateLockKey(1, '2026-04-01', '10:00');

        $this->assertNotSame($key1, $key2);
    }
}
