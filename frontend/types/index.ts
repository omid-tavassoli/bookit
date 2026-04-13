export interface User {
  id: number
  name: string
  email: string
  role: 'owner' | 'staff' | 'client'
}

export interface Business {
  id: number
  name: string
  slug: string
  timezone: string
  phone: string | null
  email: string | null
  description: string | null
}

export interface Booking {
  id: number
  business_id: number
  client_name: string
  client_email: string
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
}

export interface AvailabilityRule {
  id: number
  business_id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface StaffPermission {
  permission: 'view_bookings' | 'confirm' | 'cancel' | 'reschedule' | 'complete' | 'manage_overrides'
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}