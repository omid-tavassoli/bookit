import Image from 'next/image'
import Link from 'next/link'
import SlugSearch from '@/components/SlugSearch'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#fff', color: '#1a1040' }}>

      {/* NAV */}
      <nav style={{ background: '#1a1040', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link href="/">
            <Image
              src="/brand/bookit_logo_transparent_light.svg"
              alt="BookIT"
              width={120}
              height={28}
              priority
            />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: '14px', color: '#afa8ba', textDecoration: 'none' }}>Features</a>
          <a href="#for-whom" style={{ fontSize: '14px', color: '#afa8ba', textDecoration: 'none' }}>For businesses</a>
          <a href="#how" style={{ fontSize: '14px', color: '#afa8ba', textDecoration: 'none' }}>How it works</a>
          <Link href="/login">
            <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '8px', padding: '7px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginRight: '8px' }}>
              Log in
            </button>
          </Link>
          <Link href="/register">
            <button style={{ background: '#000dff', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#f7f6ff', padding: '88px 48px 72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#eeeeff', color: '#000dff', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', marginBottom: '22px', letterSpacing: '.05em' }}>
          Online appointment booking
        </div>
        <h1 style={{ fontSize: '50px', fontWeight: 900, lineHeight: 1.12, color: '#1a1040', maxWidth: '680px', margin: '0 auto 20px', fontFamily: 'Georgia, serif' }}>
          The smarter way to manage{' '}
          <span style={{ color: '#000dff' }}>your bookings</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#4a4453', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.65 }}>
          BookIT gives businesses a beautiful booking page, a powerful dashboard, and a staff permission system — all in one place.
        </p>

        {/* Business search */}
        <SlugSearch />

        <p style={{ fontSize: '13px', color: '#afa8ba', marginBottom: '40px' }}>
          Have a booking link? Enter the business slug above — e.g.{' '}
          <span style={{ color: '#000dff', fontWeight: 600 }}>test-physio</span>
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/register">
            <button style={{ background: '#000dff', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              Get started free
            </button>
          </Link>
          <Link href="/login">
            <button style={{ background: 'transparent', color: '#000dff', border: '1.5px solid #000dff', borderRadius: '10px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Log in
            </button>
          </Link>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section style={{ background: '#fff', padding: '72px 48px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, textAlign: 'center', color: '#1a1040', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          Everything your business needs
        </h2>
        <p style={{ textAlign: 'center', color: '#4a4453', fontSize: '15px', marginBottom: '44px' }}>
          From public booking pages to a full management dashboard — BookIT has it all.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '880px', margin: '0 auto' }}>
          {[
            { label: 'Public booking page — clients book in seconds', content: <BookingPagePreview /> },
            { label: 'Owner dashboard — manage all bookings', content: <DashboardPreview /> },
            { label: 'Granular staff permissions — control who does what', content: <StaffPreview /> },
            { label: 'Weekly availability — set your hours once', content: <AvailabilityPreview /> },
          ].map((item, i) => (
            <div key={i} style={{ border: '1.5px solid #e5e3ea', borderRadius: '14px', overflow: 'hidden' }}>
              {item.content}
              <div style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#4a4453', background: '#fafafa', borderTop: '1px solid #e5e3ea' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHOM */}
      <section id="for-whom" style={{ background: '#f7f6ff', padding: '72px 48px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, textAlign: 'center', color: '#1a1040', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          Built for service businesses
        </h2>
        <p style={{ textAlign: 'center', color: '#4a4453', fontSize: '15px', marginBottom: '44px' }}>
          If clients book time with you, BookIT is for you.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '860px', margin: '0 auto' }}>
          {[
            {
              icon: <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zM2 20c0-4 4-7 10-7s10 3 10 7"/>,
              title: 'Medical practices',
              desc: 'Doctors, physios, dentists — let patients book 24/7 without phone calls.',
            },
            {
              icon: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></>,
              title: 'Consultants',
              desc: 'Lawyers, coaches, advisors — replace back-and-forth emails with a booking link.',
            },
            {
              icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>,
              title: 'Beauty & wellness',
              desc: 'Salons, barbers, studios — manage a full team with granular staff permissions.',
            },
          ].map((card, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #e5e3ea', borderRadius: '14px', padding: '28px 22px' }}>
              <div style={{ width: '44px', height: '44px', background: '#eeeeff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#000dff" strokeWidth="2" width="22" height="22">
                  {card.icon}
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1040', marginBottom: '8px' }}>{card.title}</h3>
              <p style={{ fontSize: '13px', color: '#4a4453', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: '#fff', padding: '72px 48px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, textAlign: 'center', color: '#1a1040', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          Up and running in minutes
        </h2>
        <p style={{ textAlign: 'center', color: '#4a4453', fontSize: '15px', marginBottom: '52px' }}>
          Three steps from signup to your first booking.
        </p>
        <div style={{ display: 'flex', maxWidth: '780px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Create your business', desc: 'Sign up, name your business, get your booking URL instantly.', line: true },
            { n: '2', title: 'Set your hours', desc: 'Configure weekly availability. BookIT handles the rest automatically.', line: true },
            { n: '3', title: 'Share your link', desc: 'Send clients to your booking page. Manage everything from the dashboard.', line: false },
          ].map((step) => (
            <div key={step.n} style={{ flex: 1, textAlign: 'center', padding: '0 16px', position: 'relative' }}>
              <div style={{ width: '44px', height: '44px', background: '#000dff', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, margin: '0 auto 16px', position: 'relative', zIndex: 1 }}>
                {step.n}
              </div>
              {step.line && (
                <div style={{ position: 'absolute', top: '22px', left: '50%', right: '-50%', height: '2px', background: '#e5e3ea', zIndex: 0 }} />
              )}
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1040', marginBottom: '6px' }}>{step.title}</h4>
              <p style={{ fontSize: '13px', color: '#4a4453', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#f7f6ff', padding: '72px 48px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, textAlign: 'center', color: '#1a1040', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          Powerful under the hood
        </h2>
        <p style={{ textAlign: 'center', color: '#4a4453', fontSize: '15px', marginBottom: '44px' }}>
          Built with technology that scales with your business.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', maxWidth: '860px', margin: '0 auto' }}>
          {[
            { title: 'Conflict-free scheduling', desc: 'PostgreSQL advisory locks ensure two clients can never book the same slot — even under high load.' },
            { title: 'Staff permission system', desc: 'Granular per-staff permissions. Control exactly who can confirm, cancel, or reschedule.' },
            { title: 'Automatic email reminders', desc: 'Confirmation emails sent instantly. Reminders dispatched 24 hours before every appointment.' },
            { title: 'Calendar & list view', desc: 'Switch between a calendar grid and a filterable list. Click any booking to take action.' },
            { title: 'Availability overrides', desc: 'Going on holiday? Mark specific dates as closed without touching your weekly schedule.' },
            { title: 'No account needed to book', desc: 'Clients book with just a name and email. No signup friction, higher conversion.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '24px 20px', border: '1.5px solid #e5e3ea' }}>
              <div style={{ width: '10px', height: '10px', background: '#000dff', borderRadius: '50%', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1040', marginBottom: '6px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#4a4453', lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#000dff', padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#fff', marginBottom: '14px', fontFamily: 'Georgia, serif' }}>
          Ready to take back your schedule?
        </h2>
        <p style={{ color: '#b3b8ff', fontSize: '16px', marginBottom: '32px' }}>
          Join businesses already using BookIT to manage their appointments.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/register">
            <button style={{ background: '#fff', color: '#000dff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              Start for free
            </button>
          </Link>
          <Link href="/login">
            <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.45)', borderRadius: '10px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Log in
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1040', padding: '56px 48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          <div>
            <Image
              src="/brand/bookit_logo_transparent_light.svg"
              alt="BookIT"
              width={110}
              height={26}
            />
            <p style={{ fontSize: '13px', color: '#afa8ba', lineHeight: 1.7, marginTop: '12px', maxWidth: '240px' }}>
              A modern appointment booking system for service businesses. Built with Laravel and Next.js.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Dashboard', 'Booking page', 'Staff management'] },
            { title: 'For businesses', links: ['Medical', 'Consulting', 'Beauty & wellness', 'Education'] },
            { title: 'Account', links: ['Log in', 'Register', 'Get a demo'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {col.title}
              </h4>
              {col.links.map((link) => (
                <a key={link} href={link === 'Log in' ? '/login' : link === 'Register' ? '/register' : '#'}
                  style={{ display: 'block', fontSize: '13px', color: '#afa8ba', textDecoration: 'none', marginBottom: '10px' }}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', color: '#afa8ba' }}>© 2026 BookIT. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
              <a key={s} href="#" style={{ fontSize: '12px', color: '#afa8ba', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

// function SlugSearch() {
//   'use client'
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault()
//         const input = (e.currentTarget.elements.namedItem('slug') as HTMLInputElement).value.trim()
//         if (input) window.location.href = `/book/${input}`
//       }}
//       style={{ background: '#fff', border: '2px solid #000dff', borderRadius: '12px', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', maxWidth: '460px', margin: '0 auto 12px' }}
//     >
//       <input
//         name="slug"
//         type="text"
//         placeholder="Enter business name, e.g. dr-muller-physio"
//         style={{ border: 'none', outline: 'none', fontSize: '15px', flex: 1, color: '#1a1040', background: 'transparent' }}
//       />
//       <button
//         type="submit"
//         style={{ background: '#000dff', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
//       >
//         Book now
//       </button>
//     </form>
//   )
// }

function BookingPagePreview() {
  return (
    <div style={{ background: '#f0f4ff', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e3ea' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a4453', marginBottom: '8px' }}>1. CHOOSE A DATE</div>
        <div style={{ background: '#f7f6ff', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#1a1040', border: '1px solid #e5e3ea' }}>24.04.2026</div>
      </div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e3ea' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a4453', marginBottom: '8px' }}>2. CHOOSE A TIME</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
          {['09:00', '10:00', '11:00'].map(t => (
            <div key={t} style={{ border: '1px solid #e5e3ea', borderRadius: '6px', padding: '6px', textAlign: 'center', fontSize: '12px' }}>{t}</div>
          ))}
          <div style={{ background: '#000dff', borderRadius: '6px', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#fff', fontWeight: 700 }}>15:00</div>
        </div>
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div style={{ background: '#f7f6ff', padding: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1040', marginBottom: '12px' }}>Bookings</div>
      {[
        { name: 'Anna Schmidt', status: 'Confirmed', statusBg: '#eef2ff', statusColor: '#000dff', time: '2026-04-24 · 15:00 · 60 min' },
        { name: 'Klaus Weber', status: 'Pending', statusBg: '#fff8e6', statusColor: '#b45309', time: '2026-04-25 · 09:00 · 60 min' },
      ].map(b => (
        <div key={b.name} style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e3ea', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{b.name}</span>
            <span style={{ background: b.statusBg, color: b.statusColor, fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{b.status}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#4a4453' }}>{b.time}</div>
        </div>
      ))}
    </div>
  )
}

function StaffPreview() {
  return (
    <div style={{ background: '#f7f6ff', padding: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1040', marginBottom: '12px' }}>Staff permissions</div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e3ea' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Sara Müller</div>
        <div style={{ fontSize: '12px', color: '#4a4453', marginBottom: '10px' }}>sara@example.com</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            { label: '✓ View bookings', granted: true },
            { label: '✓ Confirm', granted: true },
            { label: 'Cancel', granted: false },
            { label: 'Reschedule', granted: false },
          ].map(p => (
            <div key={p.label} style={{ background: p.granted ? '#eef2ff' : 'transparent', border: `1px solid ${p.granted ? '#c7d2fe' : '#e5e3ea'}`, borderRadius: '6px', padding: '6px 8px', fontSize: '12px', color: p.granted ? '#000dff' : '#afa8ba', fontWeight: p.granted ? 600 : 400 }}>
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AvailabilityPreview() {
  return (
    <div style={{ background: '#f7f6ff', padding: '16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1040', marginBottom: '12px' }}>Availability</div>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '1px solid #e5e3ea', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { day: 'Monday', hours: '09:00 — 17:00', active: true },
          { day: 'Tuesday', hours: '09:00 — 17:00', active: true },
          { day: 'Saturday', hours: 'Closed', active: false },
        ].map(r => (
          <div key={r.day} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '16px', height: '16px', background: r.active ? '#000dff' : 'transparent', border: r.active ? 'none' : '1.5px solid #e5e3ea', borderRadius: '3px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {r.active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
            </div>
            <span style={{ fontSize: '13px', fontWeight: r.active ? 600 : 400, color: r.active ? '#1a1040' : '#afa8ba', width: '80px' }}>{r.day}</span>
            <span style={{ fontSize: '12px', color: r.active ? '#4a4453' : '#afa8ba', fontStyle: r.active ? 'normal' : 'italic' }}>{r.hours}</span>
          </div>
        ))}
      </div>
    </div>
  )
}