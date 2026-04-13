'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Business } from '@/types'
import { getMyBusiness } from './api'
import { useAuth } from './AuthContext'

interface BusinessContextType {
  business: Business | null
  loading: boolean
  reload: () => void
}

const BusinessContext = createContext<BusinessContextType | null>(null)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBusiness = () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    getMyBusiness()
      .then(setBusiness)
      .catch(() => setBusiness(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBusiness()
  }, [user])

  return (
    <BusinessContext.Provider value={{ business, loading, reload: fetchBusiness }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (!context) throw new Error('useBusiness must be used within BusinessProvider')
  return context
}