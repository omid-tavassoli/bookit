@component('mail::message')
# Booking Cancelled

Hello {{ $booking->client_name }},

Unfortunately your appointment has been cancelled.

@component('mail::table')
| | |
|:--|:--|
| **Business** | {{ $business->name }} |
| **Date** | {{ $booking->booking_date->format('l, F j, Y') }} |
| **Time** | {{ $booking->booking_time }} |
@endcomponent

If you would like to book a new appointment, please visit our booking page.

{{ $business->name }}
@endcomponent