'use client'

import { useEffect, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

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
      <nav style={{ background: '#1a1040' }} className="px-6 md:px-12 h-16 flex items-center justify-between relative">

        {/* Left: logo + desktop nav links */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard">
            <Image
              src="/brand/bookit_logo_transparent_light.svg"
              alt="BookIT"
              width={110}
              height={26}
              priority
            />
          </Link>
          <div className="hidden md:flex gap-1">
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

        {/* Right: desktop user info + sign out */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile: hamburger button */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-9 h-9 gap-[5px]"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.75px] bg-[#afa8ba] rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.75px]' : ''}`} />
          <span className={`block w-5 h-[1.75px] bg-[#afa8ba] rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-[1.75px] bg-[#afa8ba] rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.75px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown menu — always rendered, animated with max-height */}
      <div
        style={{ background: '#1a1040', borderTop: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {/* User info */}
          <div className="flex items-center gap-2 pb-3 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{user.name}</span>
            <span style={{ padding: '2px 10px', background: 'rgba(0,13,255,0.25)', color: '#818cf8', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize' }}>
              {user.role}
            </span>
          </div>

          {/* Nav links */}
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                background: pathname === link.href ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: pathname === link.href ? '#fff' : '#afa8ba',
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Sign out */}
          <button
            onClick={signOut}
            className="mt-2 text-left"
            style={{ background: 'transparent', color: '#afa8ba', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '7px', padding: '10px 12px', fontSize: '14px', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Page content */}
      <BusinessProvider>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </BusinessProvider>
    </div>
  )
}
