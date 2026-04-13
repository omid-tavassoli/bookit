import api from './axios'
import { Booking, Business, AvailabilityRule, User } from '@/types'

export async function getSlots(
  businessId: number,
  date: string,
  duration: number = 60
): Promise<string[]> {
  const response = await api.get(`/businesses/${businessId}/slots`, {
    params: { date, duration }
  })
  return response.data.slots
}

export async function createBooking(
  businessId: number, 
  data: {
    client_name: string
    client_email: string
    booking_date: string
    booking_time: string
    duration_minutes: number
    notes?: string
  }
): Promise<Booking> {
  const response = await api.post(`/businesses/${businessId}/bookings`, data)
  return response.data
}

export async function getBookings(
  businessId: number,
  status?: string
): Promise<Booking[]> {
  const response = await api.get(`/businesses/${businessId}/bookings`, {
    params: status ? { status } : {}
  })
  return response.data
}

export async function confirmBooking(bookingId: number): Promise<Booking> {
  const response = await api.put(`/bookings/${bookingId}/confirm`)
  return response.data
}

export async function completeBooking(bookingId: number): Promise<Booking> {
  const response = await api.put(`/bookings/${bookingId}/complete`)
  return response.data
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  const response = await api.delete(`/bookings/${bookingId}`)
  return response.data
}

export async function rescheduleBooking(
  bookingId: number,
  bookingDate: string,
  bookingTime: string
): Promise<Booking> {
  const response = await api.put(`/bookings/${bookingId}/reschedule`, {
    booking_date: bookingDate,
    booking_time: bookingTime,
  })
  return response.data
}

export async function getMyPermissions(
  businessId: number,
  userId: number
): Promise<string[]> {
  const response = await api.get(`/businesses/${businessId}/my-permissions`)
  return response.data.permissions
}

export async function getMyBusiness(): Promise<Business> {
  const response = await api.get('/my-businesses')
  const businesses = response.data
  if (!businesses || businesses.length === 0) {
    throw new Error('No business found')
  }
  return businesses[0]
}

export async function getAvailabilityRules(
  businessId: number
): Promise<AvailabilityRule[]> {
  const response = await api.get(`/businesses/${businessId}/availability-rules`)
  return response.data
}

export async function setAvailabilityRules(
  businessId: number,
  rules: { day_of_week: number; start_time: string; end_time: string; is_active: boolean }[]
): Promise<void> {
  await api.put(`/businesses/${businessId}/availability-rules`, { rules })
}

export async function grantPermission(
  businessId: number,
  userId: number,
  permission: string
): Promise<void> {
  await api.post(`/businesses/${businessId}/staff/${userId}/permissions`, { permission })
}

export async function revokePermission(
  businessId: number,
  userId: number,
  permission: string
): Promise<void> {
  await api.delete(`/businesses/${businessId}/staff/${userId}/permissions/${permission}`)
}

export async function getStaffList(businessId: number): Promise<{
  id: number
  name: string
  email: string
  permissions: string[]
}[]> {
  const response = await api.get(`/businesses/${businessId}/staff`)
  return response.data
}

export async function searchStaffByEmail(
  email: string
): Promise<{ id: number; name: string; email: string }> {
  const response = await api.get('/users/search', { params: { email } })
  return response.data
}

export async function getBusinessBySlug(slug: string): Promise<Business> {
  const response = await api.get(`/businesses/slug/${slug}`)
  return response.data
}

export async function createBusiness(data: {
  name: string
  slug: string
  timezone?: string
  phone?: string
  email?: string
  description?: string
}): Promise<Business> {
  const response = await api.post('/businesses', data)
  return response.data
}