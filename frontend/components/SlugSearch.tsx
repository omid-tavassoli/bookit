'use client'

export default function SlugSearch() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const input = (e.currentTarget.elements.namedItem('slug') as HTMLInputElement).value.trim()
        if (input) window.location.href = `/book/${input}`
      }}
      style={{ background: '#fff', border: '2px solid #000dff', borderRadius: '12px', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', maxWidth: '460px', margin: '0 auto 12px' }}
    >
      <input
        name="slug"
        type="text"
        placeholder="Enter business name, e.g. dr-muller-physio"
        style={{ border: 'none', outline: 'none', fontSize: '15px', flex: 1, color: '#1a1040', background: 'transparent' }}
      />
      <button
        type="submit"
        style={{ background: '#000dff', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
      >
        Book now
      </button>
    </form>
  )
}