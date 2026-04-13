'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { register } from '@/lib/auth'
import { useAuth } from '@/lib/AuthContext'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'owner' | 'staff' | 'client'>('owner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await register(name, email, password, role)
      setUser(user)
      router.push('/dashboard')
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      const errors = axiosError.response?.data?.errors
      if (errors) {
        setError(Object.values(errors).flat().join(' '))
      } else {
        setError(axiosError.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <nav style={{ background: '#1a1040', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center' }}>
        <Link href="/">
          <Image src="/brand/bookit_logo_transparent_light.svg" alt="BookIT" width={110} height={26} priority />
        </Link>
      </nav>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Get started with BookIt</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'owner' | 'staff' | 'client')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="owner">Business Owner</option>
              <option value="staff">Staff Member</option>
              <option value="client">Client</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000dff] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#0009d6] disabled:opacity-50 transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}