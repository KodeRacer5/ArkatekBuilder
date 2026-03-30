'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MagicRings = dynamic(() => import('@/app/_components/ui/MagicRings'), { ssr: false })
const GeodesicOrbRow = dynamic(() => import('@/app/_components/ui/GeodesicOrb'), { ssr: false })

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { setMounted(true) }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/bookshelf')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#04050d' }}>

      {/* MagicRings — full bleed */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {mounted && (
          <MagicRings
            color="#ffffff"
            colorTwo="#aaaacc"
            ringCount={6}
            speed={0.45}
            attenuation={4}
            lineThickness={2}
            baseRadius={0.72}
            radiusStep={0.10}
            scaleRate={0.15}
            opacity={0.75}
            blur={0}
            noiseAmount={0.05}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={true}
            mouseInfluence={0.06}
            hoverScale={1.08}
            parallax={0.02}
            clickBurst={true}
          />
        )}
      </div>

      {/* Form — floats at center, no card/box */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>

        {/* Orbs */}
        <div style={{ marginBottom: 24 }}>
          {mounted && <GeodesicOrbRow size={186} />}
        </div>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
            fontFamily: 'sans-serif', marginBottom: 8,
          }}>
            Peptide Journal
          </div>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif',
          }}>
            Intelligence Platform
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '11px 16px',
              color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '11px 16px',
              color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          />

          {error && <div style={{ color: 'rgba(255,120,120,0.9)', fontSize: 12, textAlign: 'center', letterSpacing: '0.05em' }}>{error}</div>}
          {message && <div style={{ color: 'rgba(200,255,200,0.8)', fontSize: 12, textAlign: 'center', letterSpacing: '0.05em' }}>{message}</div>}

          <button type="submit" disabled={loading} style={{
            marginTop: 4,
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, padding: '12px',
            color: 'rgba(255,255,255,0.9)', fontSize: 13,
            fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            fontFamily: 'sans-serif',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>
            {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 300, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'sans-serif' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: 300,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '11px',
          color: 'rgba(255,255,255,0.55)', fontSize: 13,
          cursor: 'pointer', fontFamily: 'sans-serif',
          letterSpacing: '0.05em',
          backdropFilter: 'blur(8px)',
        }}>
          Continue with Google
        </button>

        {/* Toggle */}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
          style={{
            marginTop: 20, background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.25)', fontSize: 12,
            cursor: 'pointer', fontFamily: 'sans-serif', letterSpacing: '0.05em',
          }}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Get Started"}
        </button>
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute', bottom: 20, right: 24, zIndex: 10,
        color: 'rgba(255,255,255,0.12)', fontSize: 11,
        fontFamily: 'sans-serif', letterSpacing: '0.1em',
      }}>
        v0.1
      </div>
    </div>
  )
}



