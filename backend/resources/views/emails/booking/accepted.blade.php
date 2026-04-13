@component('mail::message')
# Booking Confirmed

Hello {{ $booking->client_name }},

Great news — your appointment has been confirmed.

@component('mail::table')
| | |
|:--|:--|
| **Business** | {{ $business->name }} |
| **Date** | {{ $booking->booking_date->format('l, F j, Y') }} |
| **Time** | {{ $booking->booking_time }} |
| **Duration** | {{ $booking->duration_minutes }} minutes |
@endcomponent

We look forward to seeing you.

{{ $business->name }}
@endcomponent