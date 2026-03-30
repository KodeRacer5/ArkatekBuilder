'use client'
import { LayoutGrid, List, Home, Library, FlaskConical, Microscope, Info, Syringe, Atom, Infinity, ClipboardList, LogIn, LogOut } from 'lucide-react'
import { VscSettings } from 'react-icons/vsc'
import { cn } from '@/app/_lib/utils'
import ChatInput from './chat-input'
import Dock from './Dock'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const NAV_ITEMS = [
  { label: 'Journal',   icon: <Home size={20} strokeWidth={1.6} />,         href: '/' },
  { label: 'Bookshelf', icon: <Library size={20} strokeWidth={1.6} />,      href: '/bookshelf' },
  { label: 'Protocols', icon: <FlaskConical size={20} strokeWidth={1.6} />, href: '/protocols' },
  { label: 'Research',  icon: <Microscope size={20} strokeWidth={1.6} />,   href: '/research' },
  { label: 'About',     icon: <Info size={20} strokeWidth={1.6} />,         href: '/about' },
].map(item => ({ ...item, onClick: () => window.location.href = item.href }))

const RIGHT_DOCK_ITEMS = [
  { label: 'Protocols', icon: <Syringe size={20} strokeWidth={1.6} />,       href: '/protocols' },
  { label: 'Lab',       icon: <FlaskConical size={20} strokeWidth={1.6} />,  href: '/lab' },
  { label: 'Molecular', icon: <Atom size={20} strokeWidth={1.6} />,          href: '/research' },
  { label: 'Longevity', icon: <Infinity size={20} strokeWidth={1.6} />,      href: '/' },
  { label: 'My Lab',    icon: <ClipboardList size={20} strokeWidth={1.6} />, href: '/lab' },
].map(item => ({ ...item, onClick: () => window.location.href = item.href }))

export default function TopBar({ view, setView, onUpload, searchQuery, setSearchQuery, showSettings, onSettings }) {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="border-b border-border sticky top-0 z-10 px-6"
      style={{ height: 74, overflow: 'visible', background: 'var(--gb-bg-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', overflow: 'visible', gap: 4 }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 11px', height: 40, borderRadius: 12,
            background: 'var(--gb-bg-1)', border: '1px solid var(--gb-bg-2)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <button onClick={() => setView('list')} className={cn('p-1.5 rounded', view === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70')}>
              <List className="size-4" />
            </button>
            <button onClick={() => setView('grid')} className={cn('p-1.5 rounded', view === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70')}>
              <LayoutGrid className="size-4" />
            </button>
          </div>
          <ChatInput onSubmit={(msg) => console.log('chat:', msg)} />
        </div>

        {/* Left nav dock */}
        <div style={{ width: 310, height: 74, position: 'relative', flexShrink: 0, flexGrow: 0 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <Dock items={NAV_ITEMS} spring={{ mass: 0.05, stiffness: 800, damping: 18 }} magnification={75} distance={120} baseItemSize={42} />
          </div>
        </div>

        {/* Planning pill */}
        <div
          onClick={() => window.location.href = '/Meto_Engine'}
          className="planning-glass-pill"
          style={{
            position: 'relative', flex: '1 1 auto', maxWidth: 600, height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 20,
            background: 'rgba(80,73,69,0.6)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid var(--gb-bg-3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(235,219,178,0.08)',
            cursor: 'pointer', transition: 'all 0.3s ease', padding: '0 20px', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(102,92,84,0.7)'
            e.currentTarget.style.borderColor = 'var(--gb-bg-4)'
            e.currentTarget.querySelector('.glass-text').style.color = 'var(--gb-fg-0)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(80,73,69,0.6)'
            e.currentTarget.style.borderColor = 'var(--gb-bg-3)'
            e.currentTarget.querySelector('.glass-text').style.color = 'var(--gb-fg-2)'
          }}
        >
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1,
            background:'linear-gradient(90deg,transparent,rgba(235,219,178,0.15),transparent)', pointerEvents:'none' }}/>
          <span className="glass-text" style={{
            position: 'relative', zIndex: 1,
            color: 'var(--gb-fg-2)',
            fontSize: 42, fontWeight: 400, letterSpacing: '0.06em',
            whiteSpace: 'nowrap', userSelect: 'none',
            transition: 'color 0.3s ease',
            fontFamily: 'var(--font-tech), sans-serif',
          }}>
            Plan My Cycle Now
          </span>
        </div>

        {/* Right icon dock */}
        <div style={{ width: 310, height: 74, position: 'relative', flexShrink: 0, flexGrow: 0 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <Dock items={RIGHT_DOCK_ITEMS} spring={{ mass: 0.05, stiffness: 800, damping: 18 }} magnification={75} distance={120} baseItemSize={42} />
          </div>
        </div>

        {/* Settings + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {onSettings && (
            <button onClick={onSettings} style={{ background:'none', border:'none', cursor:'pointer', padding:4,
              color: showSettings ? 'var(--gb-fg-1)' : 'var(--gb-fg-4)', transition:'color 0.2s' }}>
              <VscSettings size={18} />
            </button>
          )}
          {user ? (
            <span onClick={handleSignOut}
              style={{ display:'flex', alignItems:'center', gap:7, color:'var(--gb-fg-4)', fontSize:15,
                fontWeight:300, cursor:'pointer', letterSpacing:'0.05em', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gb-fg-0)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gb-fg-4)'}>
              <LogOut size={16} style={{ strokeWidth: 0.5 }} />
              Sign Out
            </span>
          ) : (
            <span onClick={() => window.location.href = '/login'}
              style={{ display:'flex', alignItems:'center', gap:7, color:'var(--gb-fg-4)', fontSize:15,
                fontWeight:300, cursor:'pointer', letterSpacing:'0.05em', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gb-fg-0)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gb-fg-4)'}>
              <LogIn size={16} style={{ transform:'scaleY(1.25)', strokeWidth:0.5 }} />
              Sign In
            </span>
          )}
        </div>

      </div>
    </div>
  )
}


