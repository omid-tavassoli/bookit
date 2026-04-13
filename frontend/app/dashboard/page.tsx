'use client'

import { useState, useEffect, useCallback } from 'react'
import { getBookings, confirmBooking, completeBooking, cancelBooking, getMyPermissions } from '@/lib/api'
import { Booking } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import RescheduleModal from '@/components/RescheduleModal'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'
import { useAuth } from '@/lib/AuthContext'
import { useBusiness } from '@/lib/BusinessContext'
import '@/app/calendar.css'
import BookingCalendar from '@/components/BookingCalendar'
import BookingDetailModal from '@/components/BookingDetailModal'
import BusinessSetup from '@/components/BusinessSetup'


type FilterStatus = 'active' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('active')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [rescheduling, setRescheduling] = useState<Booking | null>(null)
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const { business, loading: businessLoading, reload } = useBusiness()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)




  useEffect(() => {
    if (user?.role === 'staff' && business) {
        getMyPermissions(business.id, user.id)
        .then(setPermissions)
        .catch(() => setPermissions([]))
    }
  }, [user, business])

  const fetchBookings = useCallback(async () => {
    if (!business) return
    setLoading(true)
    setError('')
    try {
        const status = view === 'calendar'
        ? undefined
        : filter 
        const data = await getBookings(business.id, status)
        setBookings(data)
    } catch {
        setError('Failed to load bookings.')
    } finally {
        setLoading(false)
    }
  }, [filter, business, view])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleAction = async (
    bookingId: number,
    action: 'confirm' | 'complete' | 'cancel'
  ) => {
    setActionLoading(bookingId)
    setError('')
    try {
      let updated: Booking
      if (action === 'confirm')  updated = await confirmBooking(bookingId)
      else if (action === 'complete') updated = await completeBooking(bookingId)
      else updated = await cancelBooking(bookingId)

      // Update the booking in the list without refetching
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b))
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      setError(axiosError.response?.data?.message || 'Action failed.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRescheduleSuccess = (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b))
    setRescheduling(null)
  }

  const can = (permission: string): boolean => {
    if (user?.role === 'owner') return true
    return permissions.includes(permission)
  }

  if (businessLoading) {
    return <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
  }

    if (!business) {
    return (
        <BusinessSetup
        onCreated={() => reload()}
        />
    )
    }

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: 'active',    label: 'Active' },
    { key: 'pending',   label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Bookings</h1>
        <div className="flex gap-1 bg-white border rounded-lg p-1">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              view === 'list'
                ? 'bg-[#000dff] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              view === 'calendar'
                ? 'bg-[#000dff] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Filter tabs — only show in list view */}
      {view === 'list' && (
        <div className="flex gap-1 mb-6 bg-white rounded-lg border p-1 w-fit">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                filter === tab.key
                  ? 'bg-[#000dff] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Calendar view */}
      {view === 'calendar' && !loading && (
        <div className="bg-white rounded-xl border p-4">
          <BookingCalendar
            bookings={bookings}
            onSelectBooking={booking => setSelectedBooking(booking)}
          />
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <>
          {loading && (
            <div className="text-center py-12 text-gray-400 text-sm">Loading bookings...</div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No bookings found.
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-3">
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl border p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-900">{booking.client_name}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-sm text-gray-500">{booking.client_email}</p>
                    <p className="text-sm text-gray-700 mt-2 font-medium">
                      {booking.booking_date} · {booking.booking_time} · {booking.duration_minutes} min
                    </p>
                    {booking.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">"{booking.notes}"</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {can('confirm') && booking.status === 'pending' && (
                      <button
                        onClick={() => handleAction(booking.id, 'confirm')}
                        disabled={actionLoading === booking.id}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        Confirm
                      </button>
                    )}
                    {can('complete') && booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleAction(booking.id, 'complete')}
                        disabled={actionLoading === booking.id}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        Complete
                      </button>
                    )}
                    {can('reschedule') && (booking.status === 'pending' || booking.status === 'confirmed') && (
                      <>
                        <button
                          onClick={() => setRescheduling(booking)}
                          disabled={actionLoading === booking.id}
                          className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleAction(booking.id, 'cancel')}
                          disabled={actionLoading === booking.id}
                          className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reschedule modal */}
      {rescheduling && (
        <RescheduleModal
          booking={rescheduling}
          businessId={business?.id ?? 0}
          onSuccess={handleRescheduleSuccess}
          onClose={() => setRescheduling(null)}
        />
      )}
      {/* Booking detail modal — used by calendar */}
        {selectedBooking && (
        <BookingDetailModal
            booking={selectedBooking}
            can={can}
            actionLoading={actionLoading}
            onConfirm={async () => {
            await handleAction(selectedBooking.id, 'confirm')
            setSelectedBooking(null)
            }}
            onComplete={async () => {
            await handleAction(selectedBooking.id, 'complete')
            setSelectedBooking(null)
            }}
            onCancel={async () => {
            await handleAction(selectedBooking.id, 'cancel')
            setSelectedBooking(null)
            }}
            onReschedule={() => {
            setRescheduling(selectedBooking)
            setSelectedBooking(null)
            }}
            onClose={() => setSelectedBooking(null)}
        />
        )}
    </div>
  )
}