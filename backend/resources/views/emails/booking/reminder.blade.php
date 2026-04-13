@component('mail::message')
# Appointment Reminder

Hello {{ $booking->client_name }},

This is a reminder that you have an appointment tomorrow.

@component('mail::table')
| | |
|:--|:--|
| **Business** | {{ $business->name }} |
| **Date** | {{ $booking->booking_date->format('l, F j, Y') }} |
| **Time** | {{ $booking->booking_time }} |
| **Duration** | {{ $booking->duration_minutes }} minutes |
@endcomponent

If you need to cancel, please contact us as soon as possible.

See you tomorrow,
{{ $business->name }}
@endcomponent