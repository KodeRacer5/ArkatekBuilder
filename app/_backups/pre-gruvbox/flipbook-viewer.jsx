'use client';
import React, { useCallback, useRef, useState, useEffect } from "react";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { TransformWrapper } from "react-zoom-pan-pinch";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Maximize, Minimize, Share2, ArrowLeft, Search, RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import keyboardjs from 'keyboardjs';
import TopBar from '@/app/_components/ui/dashboard/top-bar';
import { useShelfTheme } from '@/app/_providers/shelf-theme-context';

function ToolBtn({ icon: Icon, label, onClick, disabled, active }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled} title={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        background: hov && !disabled ? 'rgba(255,255,255,0.1)' : 'transparent',
        border: 'none', cursor: disabled ? 'default' : 'pointer',
        padding: '6px 10px', borderRadius: 6,
        opacity: disabled ? 0.3 : 1, transition: 'background 0.15s',
        minWidth: 44,
      }}>
      <Icon size={16} color={active ? '#fff' : 'rgba(255,255,255,0.7)'} strokeWidth={1.5} />
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

function SideArrow({ direction, onClick, disabled }) {
  const [hov, setHov] = useState(false)
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [direction]: 24, zIndex: 10,
        width: 44, height: 80, borderRadius: 8,
        background: hov && !disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.25 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s, opacity 0.2s',
        backdropFilter: 'blur(4px)',
      }}>
      <Icon size={22} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
    </button>
  )
}

const FlipbookViewer = ({ pdfUrl, pagesPath, totalPages, shareUrl, title, volume }) => {
  const router = useRouter()
  const { theme } = useShelfTheme()
  const containerRef = useRef()
  const flipbookRef = useRef()
  const [ready, setReady] = useState(false)
  const [pdfDetails, setPdfDetails] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewerStates, setViewerStates] = useState({ currentPageIndex: 0, zoomScale: 1 })

  useEffect(() => {
    if (!pagesPath || !totalPages) return
    const img = new window.Image()
    img.onload = () => { setPdfDetails({ totalPages, width: img.naturalWidth, height: img.naturalHeight }); setReady(true) }
    img.onerror = () => { setPdfDetails({ totalPages, width: 595, height: 842 }); setReady(true) }
    img.src = `${pagesPath}/1.webp`
  }, [pagesPath, totalPages])

  // Keyboard nav
  useEffect(() => {
    if (!ready) return
    const next = () => flipbookRef.current?.pageFlip().flipNext()
    const prev = () => flipbookRef.current?.pageFlip().flipPrev()
    keyboardjs.bind('right', null, next)
    keyboardjs.bind('left', null, prev)
    return () => { keyboardjs.unbind('right', null, next); keyboardjs.unbind('left', null, prev) }
  }, [ready])

  const flipNext = () => flipbookRef.current?.pageFlip().flipNext()
  const flipPrev = () => flipbookRef.current?.pageFlip().flipPrev()
  const atStart = viewerStates.currentPageIndex === 0
  const atEnd = viewerStates.currentPageIndex >= (pdfDetails?.totalPages ?? 1) - 2

  const pageLabel = (() => {
    const p = viewerStates.currentPageIndex + 1
    const total = pdfDetails?.totalPages ?? 0
    if (p % 2 === 0 && p < total) return `${p} - ${p + 1} / ${total}`
    return `${p} / ${total}`
  })()

  const handleFullscreen = () => {
    if (!screenfull.isEnabled) return
    screenfull.toggle(containerRef.current)
    screenfull.on('change', () => setIsFullscreen(screenfull.isFullscreen))
  }

  const handleShare = () => { navigator.clipboard.writeText(window.location.href) }

  // Progress percent
  const progress = pdfDetails ? (viewerStates.currentPageIndex / Math.max(pdfDetails.totalPages - 1, 1)) * 100 : 0

  return (
    <div ref={containerRef} style={{
      width: '100vw', height: '100vh', background: theme.bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif', position: 'relative',
    }}>
      <TopBar view="list" setView={() => {}} onUpload={null} searchQuery="" setSearchQuery={() => {}} />

      {/* Book area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

        {!ready && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Loading...</div>
        )}

        {ready && pdfDetails && (
          <>
            <SideArrow direction="left" onClick={flipPrev} disabled={atStart} />

            <TransformWrapper doubleClick={{ disabled: true }} pinch={{ step: 2 }}
              disablePadding={viewerStates.zoomScale <= 1} initialScale={1} minScale={1} maxScale={5}
              onTransformed={({ state }) => setViewerStates(p => ({ ...p, zoomScale: state.scale }))}>
              <Flipbook
                viewerStates={viewerStates} setViewerStates={setViewerStates}
                flipbookRef={flipbookRef} screenfull={screenfull}
                pdfDetails={pdfDetails} pagesPath={pagesPath}
              />
            </TransformWrapper>

            <SideArrow direction="right" onClick={flipNext} disabled={atEnd} />
          </>
        )}
      </div>

      {/* BOTTOM TOOLBAR */}
      <div style={{
        height: 64, background: '#3a3a3a', borderTop: '1px solid rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', flexShrink: 0, position: 'relative',
      }}>
        {/* Progress bar — very top of toolbar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(255,255,255,0.5)', transition: 'width 0.3s ease' }} />
        </div>

        {/* Left group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToolBtn icon={ZoomOut} label="Zoom Out" onClick={() => {}} />
          <ToolBtn icon={ZoomIn} label="Zoom In" onClick={() => {}} />
          <ToolBtn icon={RotateCcw} label="Reset" onClick={() => {}} />
          <ToolBtn icon={Search} label="Search" onClick={() => {}} />
        </div>

        {/* Center — page counter */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button onClick={flipPrev} disabled={atStart} style={{
            background: 'none', border: 'none', cursor: atStart ? 'default' : 'pointer',
            color: 'rgba(255,255,255,0.5)', opacity: atStart ? 0.3 : 1, padding: 4,
          }}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontVariantNumeric: 'tabular-nums', minWidth: 80, textAlign: 'center' }}>
            {pageLabel}
          </span>
          <button onClick={flipNext} disabled={atEnd} style={{
            background: 'none', border: 'none', cursor: atEnd ? 'default' : 'pointer',
            color: 'rgba(255,255,255,0.5)', opacity: atEnd ? 0.3 : 1, padding: 4,
          }}><ChevronRight size={16} /></button>
        </div>

        {/* Right group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToolBtn icon={Share2} label="Share" onClick={handleShare} />
          <ToolBtn icon={isFullscreen ? Minimize : Maximize} label={isFullscreen ? 'Exit' : 'Full'} onClick={handleFullscreen} />
        </div>
      </div>
    </div>
  )
}

export default FlipbookViewer;


