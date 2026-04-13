<?php

namespace App\Jobs;

use App\Mail\BookingReminder;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public Booking $booking) {}

    public function handle(): void
    {
        // Do not send reminder if booking was cancelled after being queued
        if (!$this->booking || $this->booking->isCancelled()) {
            return;
        }

        Mail::to($this->booking->client_email)
            ->send(new BookingReminder($this->booking));
    }
}