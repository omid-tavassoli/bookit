<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingRescheduled extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your booking has been rescheduled');
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking.rescheduled',
            with: ['booking' => $this->booking, 'business' => $this->booking->business]
        );
    }
}