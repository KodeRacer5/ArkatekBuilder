'use client'
import Link from 'next/link'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import dynamic from 'next/dynamic'
import { useShelfTheme } from '@/app/_providers/shelf-theme-context'
const AnalyticalChain = dynamic(() => import('@/app/_components/ui/dashboard/AnalyticalChain'), { ssr: false })

const THINK_TANKS = [
  {
    slug: 'cortix-engine',
    name: 'CortixEngine Longevity Research Division',
    badge: 'Private Research Consortium',
    focus: 'Bioactive peptide stack optimization, AI-assisted protocol design',
    count: 3,
    accent: '#00e5ff',
  },
  {
    slug: 'russian-university',
    name: 'Institute for Bioregulatory Peptide Research',
    badge: 'Academic Partner — Eastern European Network',
    focus: 'Khavinson peptide bioregulators, pineal peptides, longevity biomarkers',
    count: 3,
    accent: '#a78bfa',
  },
  {
    slug: 'longevity-institute',
    name: 'Applied Longevity Sciences Institute',
    badge: 'Clinical Research Partner',
    focus: 'Senolytic protocols, mTOR modulation, NAD+ pathway interventions',
    count: 3,
    accent: '#34d399',
  },
]

export default function ThinkTanksPage() {
  const { theme } = useShelfTheme()

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', marginTop: 8, position: 'relative' }}>
        <img src="/hero-banner4.png" alt="Peptide Journal" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <AnalyticalChain height="100%" />
        </div>
      </div>
      <TopBar />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.accent || '#00e5ff', marginBottom: 8 }}>Research Network</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: theme.text || '#f1f5f9', margin: 0 }}>Think Tanks</h1>
          <p style={{ fontSize: 14, color: theme.textMuted || '#94a3b8', marginTop: 8 }}>Partner research divisions contributing to the Peptide Journal protocol library.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {THINK_TANKS.map(tt => (
            <Link key={tt.slug} href={`/research/think-tanks/${tt.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: theme.card || '#0f172a', border: `1px solid ${tt.accent}22`, borderRadius: 12, padding: '24px 28px', cursor: 'pointer', transition: 'border-color 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tt.accent, background: `${tt.accent}18`, borderRadius: 6, padding: '2px 10px' }}>{tt.badge}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: theme.text || '#f1f5f9', marginBottom: 4 }}>{tt.name}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted || '#94a3b8' }}>{tt.focus}</div>
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted || '#64748b', whiteSpace: 'nowrap', marginLeft: 24 }}>{tt.count} publications</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}





