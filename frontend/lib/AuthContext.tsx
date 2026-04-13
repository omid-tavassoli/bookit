'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { getStoredUser, clearAuthCookies } from './auth'
import api from './axios'

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On mount, restore user from cookie
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
    }
    setLoading(false)
  }, [])

  const signOut = async () => {
    try {
      await api.post('/logout')
    } finally {
      clearAuthCookies()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}