'use client'

import { Booking } from '@/types'
import StatusBadge from './StatusBadge'

interface Props {
  booking: Booking
  can: (permission: string) => boolean
  actionLoading: number | null
  onConfirm: () => void
  onComplete: () => void
  onCancel: () => void
  onReschedule: () => void
  onClose: () => void
}

export default function BookingDetailModal({
  booking,
  can,
  actionLoading,
  onConfirm,
  onComplete,
  onCancel,
  onReschedule,
  onClose,
}: Props) {
  const isLoading = actionLoading === booking.id

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{booking.client_name}</h3>
            <p className="text-sm text-gray-500">{booking.client_email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Booking details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <StatusBadge status={booking.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-medium text-gray-900">{booking.booking_date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Time</span>
            <span className="text-sm font-medium text-gray-900">{booking.booking_time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="text-sm font-medium text-gray-900">{booking.duration_minutes} min</span>
          </div>
          {booking.notes && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-500">Notes</span>
              <p className="text-sm text-gray-700 mt-1 italic">"{booking.notes}"</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {can('confirm') && booking.status === 'pending' && (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Confirm booking
            </button>
          )}
          {can('complete') && booking.status === 'confirmed' && (
            <button
              onClick={onComplete}
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              Mark as completed
            </button>
          )}
          {can('reschedule') && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={onReschedule}
              disabled={isLoading}
              className="w-full py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Reschedule
            </button>
          )}
          {can('cancel') && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
            >
              Cancel booking
            </button>
          )}
          {booking.status === 'completed' || booking.status === 'cancelled' ? (
            <p className="text-center text-sm text-gray-400 py-2">
              No actions available for {booking.status} bookings.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}