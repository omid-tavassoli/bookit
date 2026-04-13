@component('mail::message')
# Booking Confirmed

Hello {{ $booking->client_name }},

Your appointment has been confirmed. Here are the details:

@component('mail::table')
| | |
|:--|:--|
| **Business** | {{ $business->name }} |
| **Date** | {{ $booking->booking_date->format('l, F j, Y') }} |
| **Time** | {{ $booking->booking_time }} |
| **Duration** | {{ $booking->duration_minutes }} minutes |
@endcomponent

If you need to cancel or reschedule, please contact us directly.

Thanks,
{{ $business->name }}
@endcomponent