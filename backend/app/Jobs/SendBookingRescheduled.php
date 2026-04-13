<?php

namespace App\Jobs;

use App\Mail\BookingRescheduled;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingRescheduled implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public Booking $booking) {}

    public function handle(): void
    {
        Mail::to($this->booking->client_email)
            ->send(new BookingRescheduled($this->booking));
    }
}