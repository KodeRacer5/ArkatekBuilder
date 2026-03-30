'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Maximize2, Minimize2, Share2 } from 'lucide-react'

function GlassIconBtn({ icon: Icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: hov
          ? danger ? 'linear-gradient(145deg,rgba(255,60,60,0.25),rgba(255,60,60,0.10))'
                   : 'linear-gradient(145deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))'
          : 'linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: hov ? '1px solid rgba(255,255,255,0.38)' : '1px solid rgba(255,255,255,0.18)',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.4)'
                       : '0 2px 6px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: hov ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <Icon size={16} color={hov ? (danger ? '#ff6060' : '#fff') : 'rgba(255,255,255,0.82)'} strokeWidth={1.6} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 500, color: hov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
        {label}
      </span>
    </button>
  )
}

export default function IssueHeader({ title, volume, issueId }) {
  const router = useRouter()
  const [fullscreen, setFullscreen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [timer, setTimer] = useState(null)

  // Auto-hide after 3s idle, show on mouse move
  useEffect(() => {
    const show = () => {
      setVisible(true)
      clearTimeout(timer)
      const t = setTimeout(() => setVisible(false), 3000)
      setTimer(t)
    }
    window.addEventListener('mousemove', show)
    window.addEventListener('keydown', show)
    const t = setTimeout(() => setVisible(false), 3000)
    setTimer(t)
    return () => {
      window.removeEventListener('mousemove', show)
      window.removeEventListener('keydown', show)
      clearTimeout(t)
    }
  }, [])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '10px 20px 8px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <GlassIconBtn icon={ChevronLeft} label="Back" onClick={() => router.push('/')} danger={false} />
      </div>

      {/* CENTER — title */}
      <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em' }}>{title}</div>
        {volume && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{volume}</div>}
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <GlassIconBtn icon={Share2} label="Share" onClick={handleShare} />
        <GlassIconBtn icon={fullscreen ? Minimize2 : Maximize2} label={fullscreen ? 'Exit' : 'Full'} onClick={handleFullscreen} />
      </div>
    </div>
  )
}


