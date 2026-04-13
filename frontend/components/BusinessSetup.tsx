'use client'

import { useState } from 'react'
import { createBusiness } from '@/lib/api'
import { Business } from '@/types'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

interface Props {
  onCreated: (business: Business) => void
}

export default function BusinessSetup({ onCreated }: Props) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(
      value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 50)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const business = await createBusiness({
        name,
        slug,
        phone: phone || undefined,
        email: email || undefined,
        description: description || undefined,
      })
      onCreated(business)
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      const errors = axiosError.response?.data?.errors
      if (errors) {
        setError(Object.values(errors).flat().join(' '))
      } else {
        setError(axiosError.response?.data?.message || 'Failed to create business.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Set up your business
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          This takes 30 seconds. You can update everything later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              required
              placeholder="Dr. Müller Physiotherapie"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                /book/
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                placeholder="dr-muller-physio"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Clients will book at: localhost:3000/book/{slug || 'your-slug'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+49 69 123456"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="info@yourpractice.de"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell clients what your business does..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Creating...' : 'Create business'}
          </button>
        </form>
      </div>
    </div>
  )
}