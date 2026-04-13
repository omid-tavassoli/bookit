@component('mail::message')
# Booking Rescheduled

Hello {{ $booking->client_name }},

Your appointment has been moved to a new date and time.

@component('mail::table')
| | |
|:--|:--|
| **Business** | {{ $business->name }} |
| **New date** | {{ $booking->booking_date->format('l, F j, Y') }} |
| **New time** | {{ $booking->booking_time }} |
| **Duration** | {{ $booking->duration_minutes }} minutes |
@endcomponent

If this does not work for you, please contact us to arrange a different time.

{{ $business->name }}
@endcomponent