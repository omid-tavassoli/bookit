<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Confirmation — ' . $this->booking->business->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking.confirmation',
            with: [
                'booking'  => $this->booking,
                'business' => $this->booking->business,
            ]
        );
    }
}