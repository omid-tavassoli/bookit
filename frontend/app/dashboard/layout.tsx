'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { BusinessProvider } from '@/lib/BusinessContext'
import Image from 'next/image'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const navLinks = [
    { href: '/dashboard', label: 'Bookings' },
    ...(user.role !== 'staff' ? [
      { href: '/dashboard/availability', label: 'Availability' },
      { href: '/dashboard/staff', label: 'Staff' },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
        <nav style={{ background: '#1a1040', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Image
            src="/brand/bookit_logo_transparent_light.svg"
            alt="BookIT"
            width={110}
            height={26}
            priority
            />
            <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map(link => (
                <Link
                key={link.href}
                href={link.href}
                style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    background: pathname === link.href ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: pathname === link.href ? '#fff' : '#afa8ba',
                }}
                >
                {link.label}
                </Link>
            ))}
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#afa8ba' }}>
            {user.name}
            <span style={{ marginLeft: '8px', padding: '2px 10px', background: 'rgba(0,13,255,0.25)', color: '#818cf8', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize' }}>
                {user.role}
            </span>
            </span>
            <button
            onClick={signOut}
            style={{ background: 'transparent', color: '#afa8ba', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '7px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}
            >
            Sign out
            </button>
        </div>
        </nav>

      {/* Page content */}
      <BusinessProvider>
        <main className="max-w-5xl mx-auto px-6 py-8">
            {children}
        </main>
      </BusinessProvider>
    </div>
  )
}