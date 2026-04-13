'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSlots, createBooking, getBusinessBySlug } from '@/lib/api'
import { AxiosError } from 'axios'
import { ApiError, Business } from '@/types'
import Image from 'next/image'



type Step = 'pick-date' | 'pick-slot' | 'fill-form' | 'confirmed'

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)
  const [businessError, setBusinessError] = useState('')

  const [step, setStep] = useState<Step>('pick-date')
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')


  // Load business from slug
  useEffect(() => {
    getBusinessBySlug(slug)
      .then(setBusiness)
      .catch(() => setBusinessError('Business not found.'))
      .finally(() => setBusinessLoading(false))
  }, [slug])


  // When date changes fetch slots
  useEffect(() => {
    if (!selectedDate || !business) return
    setSlotsLoading(true)
    setSlots([])
    setSelectedSlot('')
    setError('')
    getSlots(business.id, selectedDate, 60)
      .then(data => {
        setSlots(data)
        if (data.length === 0) {
          setError('No available slots on this date. Please pick another day.')
        }
      })
      .catch(() => setError('Failed to load slots. Please try again.'))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate, business])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setStep('pick-slot')
  }

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot)
    setStep('fill-form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await createBooking(business!.id, {
        client_name: name,
        client_email: email,
        booking_date: selectedDate,
        booking_time: selectedSlot,
        duration_minutes: 60,
        notes: notes || undefined,
      })
      setStep('confirmed')
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      setError(axiosError.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0]

  // Loading state
  if (businessLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  // Business not found
  if (businessError || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-medium">Business not found</p>
          <p className="text-gray-400 text-sm mt-1">Check the URL and try again.</p>
        </div>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking confirmed</h1>
          <p className="text-gray-500 mb-1">
            {selectedDate} at {selectedSlot}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            A confirmation email has been sent to {email}
          </p>
          <button
            onClick={() => {
              setStep('pick-date')
              setSelectedDate('')
              setSelectedSlot('')
              setName('')
              setEmail('')
              setNotes('')
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            Book another appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: '#1a1040', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <Image
            src="/brand/bookit_logo_transparent_light.svg"
            alt="BookIT"
            width={120}
            height={28}
            priority
          />
        </Link>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>{business.name}</p>
          <p style={{ fontSize: '13px', color: '#afa8ba', margin: 0 }}>Book an appointment online</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Step 1 — Date picker */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            1. Choose a date
          </h2>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Step 2 — Slot picker */}
        {selectedDate && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              2. Choose a time
            </h2>

            {slotsLoading && (
              <p className="text-sm text-gray-400">Loading available times...</p>
            )}

            {error && !slotsLoading && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {!slotsLoading && slots.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleSlotSelect(slot)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Booking form */}
        {selectedSlot && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
              3. Your details
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Booking for {selectedDate} at {selectedSlot}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Anna Schmidt"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="anna@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any relevant information..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#000dff] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#0009d6] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Confirming...' : `Confirm booking for ${selectedSlot}`}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}