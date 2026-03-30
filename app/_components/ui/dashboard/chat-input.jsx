'use client'
import React, { useState, useRef } from 'react'
import { Plus, Wrench, ArrowUp } from 'lucide-react'

export default function ChatInput({ onSubmit }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = () => {
    if (!value.trim()) return
    onSubmit?.(value.trim())
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%', maxWidth: 360,
      height: 42, padding: '0 10px 0 12px',
      borderRadius: 12,
      background: 'var(--widget-bg, rgba(30,35,45,0.72))',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.14)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
    }}>
      <button style={{
        width: 26, height: 26, borderRadius: 9999, flexShrink: 0,
        background: 'hsl(var(--muted))',
        border: '1px solid hsl(var(--border))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'hsl(var(--muted-foreground))',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'hsl(var(--accent))'}
      onMouseLeave={e => e.currentTarget.style.background = 'hsl(var(--muted))'}>
        <Plus size={13} strokeWidth={2} />
      </button>
      <Wrench size={13} strokeWidth={1.5} color="hsl(var(--muted-foreground))" style={{ flexShrink: 0, opacity: 0.6 }} />
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'inherit',
        }}
      />
      <button onClick={handleSubmit} style={{
        width: 26, height: 26, borderRadius: 9999, flexShrink: 0,
        background: value.trim() ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: value.trim() ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}>
        <ArrowUp size={13} strokeWidth={2.5}
          color={value.trim() ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'} />
      </button>
    </div>
  )
}


