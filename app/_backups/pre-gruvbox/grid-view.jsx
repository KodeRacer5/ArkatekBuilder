'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, BookOpen, Lock } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function IssueCard({ issue, selectedId, onPreview }) {
  const router = useRouter()
  const [flipped, setFlipped] = useState(false)
  const title = issue.title || 'Untitled Issue'
  const date = formatDate(issue.issueDate || issue.createdAt)
  const tag = issue.tags?.[0] || 'JOURNAL'
  const isLocked = issue.status !== 'published'

  return (
    <div
      style={{ perspective: 1000, cursor: 'pointer', height: 320 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => router.push(`/issue/${issue.id}`)}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* FRONT */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          borderRadius: 12, overflow: 'hidden',
          background: 'var(--gb-bg-soft)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{tag}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{date}</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {issue.coverPath
              ? <img src={issue.coverPath} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
              : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={32} color="rgba(255,255,255,0.15)" />
                </div>
            }
          </div>
          <div style={{ padding: '8px 12px 10px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</div>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 12, overflow: 'hidden',
          background: 'linear-gradient(160deg, #0d1b2a 0%, #1a2744 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          padding: 18, gap: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{tag}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.4, flex: 1 }}>{title}</div>
          {issue.volume && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{issue.volume}</div>}
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{date}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{issue.totalPages} pages</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
            Read Issue <ArrowUpRight size={12} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default function GridView({ issues, onPreview, selectedId }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 24,
      padding: '24px 24px',
    }}>
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} selectedId={selectedId} onPreview={onPreview} />
      ))}
    </div>
  )
}


