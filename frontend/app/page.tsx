import Image from 'next/image'
import Link from 'next/link'
import SlugSearch from '@/components/SlugSearch'

export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-[#1a1040]">

      {/* NAV */}
      <nav className="bg-[#1a1040] px-6 md:px-12 h-16 flex items-center justify-between">
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
        <div className="flex items-center gap-4 md:gap-7">
          <a href="#features" className="hidden md:block text-sm text-[#afa8ba] no-underline">Features</a>
          <a href="#for-whom" className="hidden md:block text-sm text-[#afa8ba] no-underline">For businesses</a>
          <a href="#how" className="hidden md:block text-sm text-[#afa8ba] no-underline">How it works</a>
          <Link href="/login">
            <button className="bg-transparent text-white border border-white/35 rounded-lg px-4 py-1.5 text-sm font-semibold cursor-pointer mr-1">
              Log in
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-[#000dff] text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[#f7f6ff] px-6 md:px-12 pt-16 pb-14 md:pt-[88px] md:pb-[72px] text-center">
        <div className="inline-block bg-[#eeeeff] text-[#000dff] text-xs font-bold px-3.5 py-1 rounded-full mb-6 tracking-wider">
          Online appointment booking
        </div>
        <h1 className="text-4xl md:text-[50px] font-black leading-tight text-[#1a1040] max-w-[680px] mx-auto mb-5 font-serif">
          The smarter way to manage{' '}
          <span className="text-[#000dff]">your bookings</span>
        </h1>
        <p className="text-[17px] text-[#4a4453] max-w-[500px] mx-auto mb-9 leading-relaxed">
          BookIT gives businesses a beautiful booking page, a powerful dashboard, and a staff permission system — all in one place.
        </p>

        <SlugSearch />

        <p className="text-[13px] text-[#afa8ba] mb-10">
          Have a booking link? Enter the business slug above — e.g.{' '}
          <span className="text-[#000dff] font-semibold">test-physio</span>
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register">
            <button className="bg-[#000dff] text-white border-none rounded-[10px] px-7 py-3 text-[15px] font-bold cursor-pointer">
              Get started free
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-transparent text-[#000dff] border border-[#000dff] rounded-[10px] px-7 py-3 text-[15px] font-semibold cursor-pointer">
              Log in
            </button>
          </Link>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="bg-white px-6 md:px-12 py-16 md:py-[72px]">
        <h2 className="text-[30px] font-extrabold text-center text-[#1a1040] mb-2 font-serif">
          Everything your business needs
        </h2>
        <p className="text-center text-[#4a4453] text-[15px] mb-11">
          From public booking pages to a full management dashboard — BookIT has it all.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[880px] mx-auto">
          {[
            { label: 'Public booking page — clients book in seconds', content: <BookingPagePreview /> },
            { label: 'Owner dashboard — manage all bookings', content: <DashboardPreview /> },
            { label: 'Granular staff permissions — control who does what', content: <StaffPreview /> },
            { label: 'Weekly availability — set your hours once', content: <AvailabilityPreview /> },
          ].map((item, i) => (
            <div key={i} className="border border-[#e5e3ea] rounded-2xl overflow-hidden">
              {item.content}
              <div className="px-4 py-3 text-[13px] font-semibold text-[#4a4453] bg-[#fafafa] border-t border-[#e5e3ea]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHOM */}
      <section id="for-whom" className="bg-[#f7f6ff] px-6 md:px-12 py-16 md:py-[72px]">
        <h2 className="text-[30px] font-extrabold text-center text-[#1a1040] mb-2 font-serif">
          Built for service businesses
        </h2>
        <p className="text-center text-[#4a4453] text-[15px] mb-11">
          If clients book time with you, BookIT is for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[860px] mx-auto">
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
            <div key={i} className="bg-white border border-[#e5e3ea] rounded-2xl p-7">
              <div className="w-11 h-11 bg-[#eeeeff] rounded-[10px] flex items-center justify-center mb-3.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#000dff" strokeWidth="2" width="22" height="22">
                  {card.icon}
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#1a1040] mb-2">{card.title}</h3>
              <p className="text-[13px] text-[#4a4453] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white px-6 md:px-12 py-16 md:py-[72px]">
        <h2 className="text-[30px] font-extrabold text-center text-[#1a1040] mb-2 font-serif">
          Up and running in minutes
        </h2>
        <p className="text-center text-[#4a4453] text-[15px] mb-12">
          Three steps from signup to your first booking.
        </p>
        <div className="flex flex-col sm:flex-row max-w-[780px] mx-auto gap-8 sm:gap-0">
          {[
            { n: '1', title: 'Create your business', desc: 'Sign up, name your business, get your booking URL instantly.', line: true },
            { n: '2', title: 'Set your hours', desc: 'Configure weekly availability. BookIT handles the rest automatically.', line: true },
            { n: '3', title: 'Share your link', desc: 'Send clients to your booking page. Manage everything from the dashboard.', line: false },
          ].map((step) => (
            <div key={step.n} className="flex-1 text-center px-4 relative">
              <div className="w-11 h-11 bg-[#000dff] text-white rounded-full flex items-center justify-center text-lg font-black mx-auto mb-4 relative z-10">
                {step.n}
              </div>
              {step.line && (
                <div className="hidden sm:block absolute top-[22px] left-1/2 right-[-50%] h-0.5 bg-[#e5e3ea] z-0" />
              )}
              <h4 className="text-[15px] font-bold text-[#1a1040] mb-1.5">{step.title}</h4>
              <p className="text-[13px] text-[#4a4453] leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#f7f6ff] px-6 md:px-12 py-16 md:py-[72px]">
        <h2 className="text-[30px] font-extrabold text-center text-[#1a1040] mb-2 font-serif">
          Powerful under the hood
        </h2>
        <p className="text-center text-[#4a4453] text-[15px] mb-11">
          Built with technology that scales with your business.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[860px] mx-auto">
          {[
            { title: 'Conflict-free scheduling', desc: 'PostgreSQL advisory locks ensure two clients can never book the same slot — even under high load.' },
            { title: 'Staff permission system', desc: 'Granular per-staff permissions. Control exactly who can confirm, cancel, or reschedule.' },
            { title: 'Automatic email reminders', desc: 'Confirmation emails sent instantly. Reminders dispatched 24 hours before every appointment.' },
            { title: 'Calendar & list view', desc: 'Switch between a calendar grid and a filterable list. Click any booking to take action.' },
            { title: 'Availability overrides', desc: 'Going on holiday? Mark specific dates as closed without touching your weekly schedule.' },
            { title: 'No account needed to book', desc: 'Clients book with just a name and email. No signup friction, higher conversion.' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#e5e3ea]">
              <div className="w-2.5 h-2.5 bg-[#000dff] rounded-full mb-3" />
              <h3 className="text-[15px] font-bold text-[#1a1040] mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-[#4a4453] leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#000dff] px-6 md:px-12 py-16 md:py-[72px] text-center">
        <h2 className="text-[34px] font-black text-white mb-3.5 font-serif">
          Ready to take back your schedule?
        </h2>
        <p className="text-[#b3b8ff] text-base mb-8">
          Join businesses already using BookIT to manage their appointments.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register">
            <button className="bg-white text-[#000dff] border-none rounded-[10px] px-7 py-3 text-[15px] font-bold cursor-pointer">
              Start for free
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-transparent text-white border-2 border-white/45 rounded-[10px] px-7 py-3 text-[15px] font-semibold cursor-pointer">
              Log in
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1040] px-6 md:px-12 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/brand/bookit_logo_transparent_light.svg"
              alt="BookIT"
              width={110}
              height={26}
            />
            <p className="text-[13px] text-[#afa8ba] leading-relaxed mt-3 max-w-[240px]">
              A modern appointment booking system for service businesses. Built with Laravel and Next.js.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Dashboard', 'Booking page', 'Staff management'] },
            { title: 'For businesses', links: ['Medical', 'Consulting', 'Beauty & wellness', 'Education'] },
            { title: 'Account', links: ['Log in', 'Register', 'Get a demo'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-white mb-4 tracking-widest uppercase">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <a key={link} href={link === 'Log in' ? '/login' : link === 'Register' ? '/register' : '#'}
                  className="block text-[13px] text-[#afa8ba] no-underline mb-2.5">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#afa8ba]">© 2026 BookIT. All rights reserved.</p>
          <div className="flex gap-4">
            {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
              <a key={s} href="#" className="text-xs text-[#afa8ba] no-underline">{s}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

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
