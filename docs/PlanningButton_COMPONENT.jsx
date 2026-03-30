'use client'
/**
 * PlanningButton — Wide Glass HUD Component
 * ------------------------------------------
 * A full-width translucent glass pill that acts as a futuristic
 * HUD screen in the TopBar. Click to open frosted glass nav menu.
 *
 * Dependencies: framer-motion, lucide-react
 * Usage: <PlanningButton />
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Syringe, FlaskConical, Atom, Infinity, ClipboardList } from 'lucide-react'

const PLANNING_ITEMS = [
  { label: 'Protocols', icon: <Syringe size={22} strokeWidth={1.6} />,       href: '/protocols' },
  { label: 'Lab',       icon: <FlaskConical size={22} strokeWidth={1.6} />,  href: '/lab' },
  { label: 'Molecular', icon: <Atom size={22} strokeWidth={1.6} />,          href: '/research' },
  { label: 'Longevity', icon: <Infinity size={22} strokeWidth={1.6} />,      href: '/' },
  { label: 'My Lab',    icon: <ClipboardList size={22} strokeWidth={1.6} />, href: '/lab' },
]

export default function PlanningButton() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: 64 }}>

      {/* Wide glass HUD pill — full width version */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.98 }}
        style={{
          height: 42,
          width: 600,          /* ← control pill width here */
          borderRadius: 16,
          marginBottom: 11,
          background: open ? 'rgba(80,90,120,0.85)' : 'rgba(30,35,45,0.72)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${open ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)'}`,
          boxShadow: open
            ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.85)',
          transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
        }}
      >
        <Atom size={24} strokeWidth={1.4} style={{ opacity: 0.7 }} />
      </motion.button>

      {/* Frosted glass pop-up nav menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 560,        /* ← control popup width here */
              borderRadius: 20,
              background: 'rgba(18,22,32,0.95)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
              padding: '12px 10px',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            {PLANNING_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ background: 'rgba(255,255,255,0.07)', y: -2 }}
                onClick={() => { setOpen(false); window.location.href = item.href }}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  padding: '14px 20px', borderRadius: 14,
                  cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.6)', display: 'flex' }}>{item.icon}</span>
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
