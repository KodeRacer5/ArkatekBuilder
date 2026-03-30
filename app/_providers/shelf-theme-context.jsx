'use client'
import { createContext, useContext, useState, useEffect } from 'react'

export const SHELF_THEMES = [
  {
    key: 'navy', label: 'Navy', dot: '#1e2d44',
    bg: 'var(--canvas-bg, #0d1117)', headerBg: '#0a0e14', headerBorder: 'rgba(255,255,255,0.06)',
    shelfBg: 'rgba(255,255,255,0.03)', shelfBorder: 'rgba(255,255,255,0.07)',
    shelfTop: 'linear-gradient(to bottom,#2a3a52,#1e2d44)',
    shelfFace: 'linear-gradient(to bottom,#162030,#0e1624)',
    titleColor: '#fff', labelColor: 'rgba(255,255,255,0.35)',
    textColor: 'rgba(255,255,255,0.8)', mutedColor: 'rgba(255,255,255,0.35)',
    searchBg: 'rgba(255,255,255,0.05)', searchBorder: 'rgba(255,255,255,0.1)',
  },
  {
    key: 'walnut', label: 'Walnut', dot: '#5c3317',
    bg: '#1a0e06', headerBg: '#120a04', headerBorder: 'rgba(180,120,60,0.2)',
    shelfBg: 'rgba(180,120,60,0.05)', shelfBorder: 'rgba(180,120,60,0.15)',
    shelfTop: 'linear-gradient(to bottom,#7a4a24,#5c3317)',
    shelfFace: 'linear-gradient(to bottom,#4a2810,#2e1808)',
    titleColor: '#e8c898', labelColor: 'rgba(220,180,120,0.5)',
    textColor: 'rgba(240,200,150,0.85)', mutedColor: 'rgba(200,150,90,0.5)',
    searchBg: 'rgba(180,120,60,0.08)', searchBorder: 'rgba(180,120,60,0.2)',
  },
  {
    key: 'oak', label: 'Oak', dot: '#8c6828',
    bg: '#1e1608', headerBg: '#161004', headerBorder: 'rgba(200,160,80,0.2)',
    shelfBg: 'rgba(200,160,80,0.05)', shelfBorder: 'rgba(200,160,80,0.15)',
    shelfTop: 'linear-gradient(to bottom,#a07838,#7a5820)',
    shelfFace: 'linear-gradient(to bottom,#5a3e14,#3a2808)',
    titleColor: '#f0d8a0', labelColor: 'rgba(230,190,120,0.5)',
    textColor: 'rgba(240,210,160,0.85)', mutedColor: 'rgba(210,170,100,0.5)',
    searchBg: 'rgba(200,160,80,0.08)', searchBorder: 'rgba(200,160,80,0.2)',
  },
  {
    key: 'ebony', label: 'Ebony', dot: '#282828',
    bg: '#080808', headerBg: '#040404', headerBorder: 'rgba(255,255,255,0.06)',
    shelfBg: 'rgba(255,255,255,0.02)', shelfBorder: 'rgba(255,255,255,0.06)',
    shelfTop: 'linear-gradient(to bottom,#2a2a2a,#1a1a1a)',
    shelfFace: 'linear-gradient(to bottom,#181818,#0e0e0e)',
    titleColor: '#c8c8c8', labelColor: 'rgba(200,200,200,0.35)',
    textColor: 'rgba(220,220,220,0.8)', mutedColor: 'rgba(180,180,180,0.35)',
    searchBg: 'rgba(255,255,255,0.04)', searchBorder: 'rgba(255,255,255,0.08)',
  },
  {
    key: 'steel', label: 'Steel', dot: '#2a4060',
    bg: '#0a1020', headerBg: '#060c18', headerBorder: 'rgba(80,140,200,0.15)',
    shelfBg: 'rgba(80,140,200,0.04)', shelfBorder: 'rgba(80,140,200,0.12)',
    shelfTop: 'linear-gradient(to bottom,#2a4a6a,#1e3550)',
    shelfFace: 'linear-gradient(to bottom,#142438,#0c1828)',
    titleColor: '#a0c8f0', labelColor: 'rgba(140,190,240,0.45)',
    textColor: 'rgba(180,215,250,0.85)', mutedColor: 'rgba(120,170,220,0.45)',
    searchBg: 'rgba(80,140,200,0.07)', searchBorder: 'rgba(80,140,200,0.18)',
  },
  {
    key: 'slate', label: 'Slate', dot: '#3a4050',
    bg: '#0e1018', headerBg: '#080a10', headerBorder: 'rgba(160,170,200,0.12)',
    shelfBg: 'rgba(160,170,200,0.04)', shelfBorder: 'rgba(160,170,200,0.1)',
    shelfTop: 'linear-gradient(to bottom,#3a4258,#2a3048)',
    shelfFace: 'linear-gradient(to bottom,#1e2234,#141828)',
    titleColor: '#c0c8e0', labelColor: 'rgba(180,190,220,0.4)',
    textColor: 'rgba(200,210,235,0.85)', mutedColor: 'rgba(160,170,200,0.4)',
    searchBg: 'rgba(160,170,200,0.06)', searchBorder: 'rgba(160,170,200,0.15)',
  },
  {
    key: 'gruvbox', label: 'Gruvbox', dot: '#d79921',
    bg: 'var(--gb-bg)', headerBg: 'var(--gb-bg-soft)', headerBorder: 'var(--gb-bg-2)',
    shelfBg: 'var(--gb-bg-1)', shelfBorder: 'var(--gb-bg-2)',
    shelfTop: 'linear-gradient(to bottom,var(--gb-bg-2),var(--gb-bg-1))',
    shelfFace: 'linear-gradient(to bottom,var(--gb-bg-1),var(--gb-bg))',
    titleColor: 'var(--gb-fg-0)', labelColor: 'var(--gb-fg-4)',
    textColor: 'var(--gb-fg-1)', mutedColor: 'var(--gb-fg-4)',
    searchBg: 'var(--gb-bg-1)', searchBorder: 'var(--gb-bg-3)',
  },
]

const ShelfThemeContext = createContext(null)

export function ShelfThemeProvider({ children }) {
  const [themeIdx, setThemeIdx] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pj_shelf_theme')
      if (saved !== null) {
        const idx = parseInt(saved)
        setThemeIdx(idx)
        document.body.setAttribute('data-theme', SHELF_THEMES[idx].key)
      } else {
        document.body.setAttribute('data-theme', SHELF_THEMES[0].key)
      }
    } catch {}
  }, [])

  const setTheme = (idx) => {
    setThemeIdx(idx)
    document.body.setAttribute('data-theme', SHELF_THEMES[idx].key)
    try { localStorage.setItem('pj_shelf_theme', String(idx)) } catch {}
  }

  return (
    <ShelfThemeContext.Provider value={{ theme: SHELF_THEMES[themeIdx], themeIdx, setTheme, themes: SHELF_THEMES }}>
      {children}
    </ShelfThemeContext.Provider>
  )
}

export function useShelfTheme() {
  const ctx = useContext(ShelfThemeContext)
  if (!ctx) throw new Error('useShelfTheme must be used inside ShelfThemeProvider')
  return ctx
}






