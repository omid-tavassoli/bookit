'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBusiness } from '@/lib/BusinessContext'
import { useAuth } from '@/lib/AuthContext'
import { getStaffList, grantPermission, revokePermission, searchStaffByEmail } from '@/lib/api'

const ALL_PERMISSIONS = [
  { key: 'view_bookings',    label: 'View bookings' },
  { key: 'confirm',          label: 'Confirm bookings' },
  { key: 'cancel',           label: 'Cancel bookings' },
  { key: 'reschedule',       label: 'Reschedule bookings' },
  { key: 'complete',         label: 'Complete bookings' },
  { key: 'manage_overrides', label: 'Manage availability overrides' },
]

interface StaffMember {
  id: number
  name: string
  email: string
  permissions: string[]
}

export default function StaffPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { business } = useBusiness()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResult, setSearchResult] = useState<{id: number; name: string; email: string} | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (user?.role === 'staff') router.replace('/dashboard')
  }, [user, router])

  useEffect(() => {
    if (!business) return
    getStaffList(business.id)
      .then(setStaff)
      .catch(() => setError('Failed to load staff.'))
      .finally(() => setLoading(false))
  }, [business])

  const togglePermission = async (
    staffMember: StaffMember,
    permission: string,
    currentlyGranted: boolean
  ) => {
    if (!business) return
    const key = `${staffMember.id}-${permission}`
    setToggling(key)
    try {
      if (currentlyGranted) {
        await revokePermission(business.id, staffMember.id, permission)
        setStaff(prev => prev.map(s =>
          s.id === staffMember.id
            ? { ...s, permissions: s.permissions.filter(p => p !== permission) }
            : s
        ))
      } else {
        await grantPermission(business.id, staffMember.id, permission)
        setStaff(prev => prev.map(s =>
          s.id === staffMember.id
            ? { ...s, permissions: [...s.permissions, permission] }
            : s
        ))
      }
    } catch {
      setError('Failed to update permission.')
    } finally {
      setToggling(null)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    setSearching(true)
    setSearchError('')
    setSearchResult(null)
    try {
      const user = await searchStaffByEmail(searchEmail)
      const alreadyAdded = staff.some(s => s.id === user.id)
      if (alreadyAdded) {
        setSearchError('This staff member is already in your list.')
      } else {
        setSearchResult(user)
      }
    } catch {
      setSearchError('No staff member found with that email.')
    } finally {
      setSearching(false)
    }
  }

  const handleAddStaff = async () => {
    if (!business || !searchResult) return
    try {
      await grantPermission(business.id, searchResult.id, 'view_bookings')
      setStaff(prev => [...prev, { ...searchResult, permissions: ['view_bookings'] }])
      setSearchResult(null)
      setSearchEmail('')
    } catch {
      setSearchError('Failed to add staff member.')
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Staff</h1>
        <p className="text-sm text-gray-500 mt-1">Manage what your staff members can do</p>
      </div>

      {/* ── Add staff member ── */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add staff member</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="email"
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
            placeholder="staff@example.com"
            required
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {searching ? 'Searching...' : 'Find'}
          </button>
        </form>

        {searchError && (
          <p className="text-sm text-red-500 mt-2">{searchError}</p>
        )}

        {searchResult && (
          <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{searchResult.name}</p>
              <p className="text-xs text-gray-500">{searchResult.email}</p>
            </div>
            <button
              onClick={handleAddStaff}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Add to staff
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {staff.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-sm">No staff members yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Search for a staff member above to add them.
          </p>
        </div>
      )}

      {/* ── Staff list ── */}
      <div className="space-y-4">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-xl border p-5">
            <div className="mb-4">
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_PERMISSIONS.map(perm => {
                const granted = member.permissions.includes(perm.key)
                const key = `${member.id}-${perm.key}`
                return (
                  <button
                    key={perm.key}
                    onClick={() => togglePermission(member, perm.key, granted)}
                    disabled={toggling === key}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                      granted
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                      granted ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {granted && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {perm.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}