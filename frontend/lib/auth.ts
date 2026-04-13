import api from './axios'
import { User } from '@/types'

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
    ?.split('=')[1]

  if (!userCookie) return null

  try {
    return JSON.parse(decodeURIComponent(userCookie))
  } catch {
    return null
  }
}

export function setAuthCookies(token: string, user: User): void {
  // Token cookie — 7 days, httpOnly cannot be set from JS so we use regular cookie
  // In production this would be set server-side
  document.cookie = `auth_token=${token}; Max-Age=${7 * 24 * 60 * 60}; path=/; SameSite=Strict`
  
  // User info cookie — for UI state only, not sensitive
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; Max-Age=${7 * 24 * 60 * 60}; path=/; SameSite=Strict`
}

export function clearAuthCookies(): void {
  document.cookie = 'auth_token=; Max-Age=0; path=/'
  document.cookie = 'user=; Max-Age=0; path=/'
}

export async function login(email: string, password: string): Promise<User> {
  const response = await api.post('/login', { email, password })
  const { token, user } = response.data
  setAuthCookies(token, user)
  return user
}

export async function logout(): Promise<void> {
  try {
    await api.post('/logout')
  } finally {
    clearAuthCookies()
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'owner' | 'staff' | 'client'
): Promise<User> {
  const response = await api.post('/register', {
    name,
    email,
    password,
    password_confirmation: password,
    role,
  })
  const { token, user } = response.data
  setAuthCookies(token, user)
  return user
}