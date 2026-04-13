'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBusiness } from '@/lib/BusinessContext'
import { useAuth } from '@/lib/AuthContext'
import { getAvailabilityRules, setAvailabilityRules } from '@/lib/api'
import { AvailabilityRule } from '@/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_RULES = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: '09:00',
  end_time: '17:00',
  is_active: i < 5, // Mon-Fri active by default
}))

export default function AvailabilityPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { business } = useBusiness()
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role === 'staff') router.replace('/dashboard')
  }, [user, router])

  useEffect(() => {
    if (!business) return

    getAvailabilityRules(business.id)
      .then(data => {
        if (data.length > 0) {
          const merged = DEFAULT_RULES.map(def => {
            const existing = data.find(r => r.day_of_week === def.day_of_week)
            return existing ? {
              day_of_week: existing.day_of_week,
              start_time: existing.start_time.slice(0, 5),
              end_time: existing.end_time.slice(0, 5),
              is_active: existing.is_active,
            } : def
          })
          setRules(merged)
        }
      })
      .catch(() => setError('Failed to load availability rules.'))
      .finally(() => setLoading(false))
  }, [business])

  const updateRule = (dayIndex: number, field: string, value: string | boolean) => {
    setRules(prev => prev.map(r =>
      r.day_of_week === dayIndex ? { ...r, [field]: value } : r
    ))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!business) return
    setSaving(true)
    setError('')
    try {
      await setAvailabilityRules(business.id, rules)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Availability</h1>
          <p className="text-sm text-gray-500 mt-1">Set your weekly working hours</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#000dff] text-white text-sm font-medium rounded-lg hover:bg-[#0009d6] disabled:opacity-50 transition"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        {rules.map((rule, idx) => (
          <div
            key={rule.day_of_week}
            className={`flex items-center gap-4 px-5 py-4 ${
              idx < rules.length - 1 ? 'border-b' : ''
            } ${!rule.is_active ? 'opacity-50' : ''}`}
          >
            {/* Toggle */}
            <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
              <input
                type="checkbox"
                checked={rule.is_active}
                onChange={e => updateRule(rule.day_of_week, 'is_active', e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {DAYS[rule.day_of_week]}
              </span>
            </label>

            {/* Time inputs */}
            {rule.is_active ? (
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={rule.start_time}
                  onChange={e => updateRule(rule.day_of_week, 'start_time', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="time"
                  value={rule.end_time}
                  onChange={e => updateRule(rule.day_of_week, 'end_time', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}