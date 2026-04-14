'use client'

import { useMemo, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Booking } from '@/types'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS },
})

const STATUS_COLORS: Record<string, string> = {
  pending:   '#F59E0B',
  confirmed: '#3B82F6',
  completed: '#10B981',
  cancelled: '#9CA3AF',
}

interface Props {
  bookings: Booking[]
  onSelectBooking: (booking: Booking) => void
}

export default function BookingCalendar({ bookings, onSelectBooking }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>('month')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
      setCurrentView(e.matches ? 'agenda' : 'month')
    }
    update(mq)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const events = useMemo(() => bookings.map(booking => {
    const dateOnly = booking.booking_date.slice(0, 10)
    const timeOnly = booking.booking_time.slice(0, 5)
    return {
      id:       booking.id,
      title:    `${timeOnly} — ${booking.client_name}`,
      start:    new Date(`${dateOnly}T${timeOnly}`),
      end:      new Date(new Date(`${dateOnly}T${timeOnly}`).getTime() + booking.duration_minutes * 60000),
      resource: booking,
      color:    STATUS_COLORS[booking.status] || '#3B82F6',
    }
  }), [bookings])

  const eventStyleGetter = (event: typeof events[0]) => ({
    style: {
      backgroundColor: event.color,
      border: 'none',
      borderRadius: '4px',
      color: 'white',
      fontSize: '12px',
      padding: '2px 6px',
    }
  })

  return (
    <div style={{ height: 520 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={event => onSelectBooking(event.resource)}
        views={isMobile ? ['day', 'agenda'] : ['month', 'week']}
        view={currentView}
        onView={view => setCurrentView(view)}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        popup
        style={{ fontFamily: 'inherit' }}
      />
    </div>
  )
}