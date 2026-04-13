'use client'

import { useState, useEffect } from 'react'
import { getSlots, rescheduleBooking } from '@/lib/api'
import { Booking } from '@/types'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

interface Props {
  booking: Booking
  businessId: number
  onSuccess: (updated: Booking) => void
  onClose: () => void
}

export default function RescheduleModal({ booking, businessId, onSuccess, onClose }: Props) {
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!date) return
    setSlotsLoading(true)
    setSlots([])
    setSelectedSlot('')
    getSlots(businessId, date, booking.duration_minutes)
      .then(setSlots)
      .catch(() => setError('Failed to load slots'))
      .finally(() => setSlotsLoading(false))
  }, [date])

  const handleSubmit = async () => {
    if (!date || !selectedSlot) return
    setSubmitting(true)
    setError('')
    try {
      const updated = await rescheduleBooking(booking.id, date, selectedSlot)
      onSuccess(updated)
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      setError(axiosError.response?.data?.message || 'Reschedule failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h3 className="font-semibold text-gray-900 mb-1">Reschedule booking</h3>
        <p className="text-sm text-gray-500 mb-4">
          Currently: {booking.booking_date} at {booking.booking_time}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {slotsLoading && <p className="text-sm text-gray-400">Loading slots...</p>}

          {!slotsLoading && slots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New time</label>
              <div className="grid grid-cols-4 gap-2">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-1.5 px-2 rounded-lg text-sm border transition ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !selectedSlot || submitting}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : 'Confirm reschedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}