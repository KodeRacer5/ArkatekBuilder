'use client'

const PAGES = {
  protocols: { icon: '⬡', label: 'Protocols', description: 'Clinical peptide protocols, dosing frameworks, and administration guidelines.' },
  research:  { icon: '◎', label: 'Research',  description: 'Peer-reviewed studies, biomarker analysis, and longevity medicine research.' },
  about:     { icon: '◇', label: 'About',      description: 'Peptide Journal — advancing longevity medicine through clinical precision.' },
}

export default function ComingSoon({ slug }) {
  const page = PAGES[slug] || PAGES.protocols
  return (
    <div style={{
      minHeight: '100vh', background: 'hsl(var(--background))',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 40,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, color: 'rgba(255,255,255,0.8)',
      }}>
        {page.icon}
      </div>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 10, letterSpacing: '-0.03em' }}>
          {page.label}
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
          {page.description}
        </p>
        <p style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', opacity: 0.5, marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Coming Vol. 2
        </p>
      </div>
      <a href="/" style={{
        marginTop: 8, fontSize: 13, color: 'hsl(var(--muted-foreground))',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
        opacity: 0.6, transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
        ← Back to Journal
      </a>
    </div>
  )
}





