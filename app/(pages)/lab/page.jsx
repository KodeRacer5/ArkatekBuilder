'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FlaskConical, Activity, Scan, Dna, Watch, FileText, X, Plus } from 'lucide-react'
import { VscSettings } from 'react-icons/vsc'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import dynamic from 'next/dynamic'
const AnalyticalChain = dynamic(() => import('@/app/_components/ui/dashboard/AnalyticalChain'), { ssr: false })
import { useShelfTheme } from '@/app/_providers/shelf-theme-context'

const DATA_TYPES = [
  { key: 'blood',    label: 'Blood Panel',   color: '#6e1a1a', icon: FlaskConical, dot: '#ff6b6b' },
  { key: 'hormone',  label: 'Hormone Panel', color: '#4a1a6e', icon: Activity,     dot: '#c084fc' },
  { key: 'imaging',  label: 'Imaging',       color: '#1a3a6e', icon: Scan,         dot: '#60a5fa' },
  { key: 'genomic',  label: 'Genomic',       color: '#1a5a4a', icon: Dna,          dot: '#34d399' },
  { key: 'wearable', label: 'Wearable',      color: '#1a4a2a', icon: Watch,        dot: '#86efac' },
  { key: 'other',    label: 'Other',         color: '#2a3050', icon: FileText,     dot: '#94a3b8' },
]
const FOLDER_COLORS = ['#1e3a6e','#4a1a6e','#1a5a4a','#6e1a1a','#3a3010','#2a3050']

function ShelfPlank({ theme }) {
  return (
    <div>
      <div style={{ height: 10, background: theme.shelfTop, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }} />
      <div style={{ height: 18, background: theme.shelfFace, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }} />
    </div>
  )
}

function GhostFolder({ onCreate, folderFilter = 'none' }) {
  const [state, setState] = useState('icon')
  const [name, setName] = useState('')
  const [colorIdx, setColorIdx] = useState(0)
  const wrapperRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    if (state !== 'naming') return
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setState('icon'); setName('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [state])

  const handleConfirm = () => {
    if (name.trim()) { onCreate(name.trim(), FOLDER_COLORS[colorIdx]); setName(''); setState('icon') }
  }

  if (state === 'naming') return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, paddingBottom: 20 }}>
      <img src="/icons/folder-front-premium.png" alt="New Folder"
        style={{ width: 140, height: 110, objectFit: 'contain', filter: folderFilter }} />
      <input ref={inputRef} value={name} onChange={e => setName(e.target.value)} autoFocus
        onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') setState('icon') }}
        placeholder="Folder name"
        style={{ width: 90, fontSize: 10, background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '3px 6px',
          color: '#fff', outline: 'none', textAlign: 'center' }} />
      <div style={{ display: 'flex', gap: 4 }}>
        {FOLDER_COLORS.map((c, i) => (
          <button key={i} onClick={() => setColorIdx(i)} style={{
            width: 12, height: 12, borderRadius: '50%', background: c, padding: 0, cursor: 'pointer',
            border: colorIdx === i ? '2px solid #fff' : '2px solid transparent' }} />
        ))}
      </div>
    </div>
  )

  return (
    <div onClick={() => setState(s => s === 'naming' ? 'icon' : 'naming')}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, cursor: 'pointer', position: 'relative' }}>
      <div style={{ position: 'relative', width: 140, height: 110 }}>
        <img src="/icons/folder-front-premium.png" alt="New Folder"
          style={{ width: 140, height: 110, objectFit: 'contain', transition: 'transform 0.2s', filter: folderFilter }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'} />
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(30,80,180,0.85)', borderRadius: '50%', width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
          <Plus size={16} color="#fff" strokeWidth={2.5} />
        </div>
      </div>
      <div style={{ height: 34 }} />
    </div>
  )
}

// Upload folder — removed per user request

function DataCard({ item, onRemove, onAnalyze }) {
  const [hov, setHov] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const type = DATA_TYPES.find(t => t.key === item.type) || DATA_TYPES[5]
  const Icon = type.icon
  const h = [160, 174, 150, 168, 158, 172][item.id.length % 6]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}
      onMouseEnter={() => { setHov(true); setFlipped(true) }}
      onMouseLeave={() => { setHov(false); setFlipped(false) }}>
      {hov && <button onClick={() => onRemove(item.id)} style={{
        position: 'absolute', top: -8, right: -6, zIndex: 30, width: 18, height: 18,
        borderRadius: '50%', background: 'rgba(180,40,40,0.9)', border: '1px solid rgba(255,255,255,0.3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={9} color="#fff" /></button>}
      <div style={{ perspective: 800, width: 90, height: h, position: 'relative',
        transform: hov ? 'translateY(-10px)' : 'translateY(0)', transition: 'transform 0.22s ease' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer' }} onClick={() => onAnalyze(item)}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: 6, background: `${type.color}cc`, border: `1px solid ${type.dot}44`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon size={20} color={type.dot} strokeWidth={1.5} />
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textAlign: 'center',
              textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 6px', lineHeight: 1.4 }}>{item.name}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{item.uploadedAt}</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)', borderRadius: 6, background: 'linear-gradient(160deg,#111d30,#1a2a4a)',
            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column',
            padding: 10, gap: 6, justifyContent: 'space-between' }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: type.dot, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{type.label}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{item.name}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>{item.uploadedAt}</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, padding: '5px 0',
              fontSize: 8, fontWeight: 700, color: '#fff', textAlign: 'center', letterSpacing: '0.08em' }}>
              Analyze in Canvas
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 90,
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.name}</div>
    </div>
  )
}

function FolderCard({ folder, items, onRemove, onUpload, onOpen, folderFilter = 'none' }) {
  const [active, setActive] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}>
      {/* Action icons — appear on click */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 2 }}>
        {active && (<>
          <button onClick={() => { onRemove(folder.id); setActive(false) }} title="Delete"
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(180,40,40,0.9)',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color="#fff" strokeWidth={2.5} />
          </button>
          <button onClick={() => { onUpload(folder.id); setActive(false) }} title="Upload into folder"
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(30,80,180,0.9)',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </button>
          <button onClick={() => { onOpen(folder); setActive(false) }} title="Open folder"
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(40,140,80,0.9)',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </>)}
      </div>
      <img src="/icons/folder-dynamic-premium.png" alt={folder.name}
        onClick={() => setActive(p => !p)}
        style={{ width: 140, height: 110, objectFit: 'contain', filter: folderFilter,
          cursor: 'pointer', transition: 'transform 0.2s',
          transform: active ? 'translateY(-4px) scale(1.05)' : 'scale(1)' }} />
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 130,
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{folder.name}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{items.length} file{items.length !== 1 ? 's' : ''}</div>
    </div>
  )
}

export default function LabPage() {
  const router = useRouter()
  const { theme } = useShelfTheme()
  const [dataItems, setDataItems] = useState([])
  const [folders, setFolders] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadType] = useState('blood')
  const [hue, setHue] = useState(0)
  const [sat, setSat] = useState(100)
  const [bri, setBri] = useState(100)
  const [showColorPanel, setShowColorPanel] = useState(false)
  const [openFolder, setOpenFolder] = useState(null)
  const fileRef = useRef()
  const folderFileRef = useRef()
  let activeFolderId = useRef(null)

  const folderFilter = `hue-rotate(${hue}deg) saturate(${sat}%) brightness(${bri}%)`

  useEffect(() => {
    try { setDataItems(JSON.parse(localStorage.getItem('pj_lab_data') || '[]')) } catch {}
    try { setFolders(JSON.parse(localStorage.getItem('pj_lab_folders') || '[]')) } catch {}
  }, [])

  const saveData = (d) => { setDataItems(d); localStorage.setItem('pj_lab_data', JSON.stringify(d)) }
  const saveFolders = (f) => { setFolders(f); localStorage.setItem('pj_lab_folders', JSON.stringify(f)) }
  const handleUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const id = `data_${Date.now()}`
    saveData([...dataItems, { id, name: file.name.replace(/\.[^.]+$/, ''), type: uploadType,
      uploadedAt: new Date().toLocaleDateString(), folderId: null }])
    fileRef.current.value = ''
  }
  const handleFolderUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const id = `data_${Date.now()}`
    saveData([...dataItems, { id, name: file.name.replace(/\.[^.]+$/, ''), type: uploadType,
      uploadedAt: new Date().toLocaleDateString(), folderId: activeFolderId.current }])
    folderFileRef.current.value = ''
  }
  const handleUploadIntoFolder = (folderId) => {
    activeFolderId.current = folderId
    folderFileRef.current.click()
  }
  const handleRemoveItem = (id) => saveData(dataItems.filter(d => d.id !== id))
  const handleCreateFolder = (name, color) => saveFolders([...folders,
    { id: `folder_${Date.now()}`, name, color, createdAt: new Date().toLocaleDateString() }])
  const handleRemoveFolder = (id) => saveFolders(folders.filter(f => f.id !== id))
  const handleAnalyze = (item) => router.push(`/research?data=${item.id}`)
  const looseItems = dataItems.filter(d => !d.folderId)

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', marginTop: 8, position: 'relative', height: 250, overflow: 'hidden' }}>
        <img src="/hero-banner4.png" alt="Peptide Journal" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <AnalyticalChain height="100%" />
        </div>
      </div>
      <TopBar view="grid" setView={() => {}} onUpload={null} searchQuery="" setSearchQuery={() => {}} />
      <input ref={folderFileRef} type="file" style={{ display: 'none' }} onChange={handleFolderUpload} />

      <div style={{ padding: '40px 48px 60px' }}>
        {/* Folder color panel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, position: 'relative' }}>
          <button onClick={() => setShowColorPanel(p => !p)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: showColorPanel ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
            transition: 'color 0.2s' }}>
            <VscSettings size={18} />
          </button>
          {showColorPanel && (
            <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50,
              background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '14px 16px', width: 220,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Hue', value: hue, set: setHue, min: 0, max: 360, unit: '°' },
                { label: 'Saturation', value: sat, set: setSat, min: 0, max: 300, unit: '%' },
                { label: 'Brightness', value: bri, set: setBri, min: 0, max: 200, unit: '%' },
              ].map(({ label, value, set, min, max, unit }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{value}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} value={value}
                    onChange={e => set(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#29a2ff', cursor: 'pointer' }} />
                </div>
              ))}
              <button onClick={() => { setHue(0); setSat(100); setBri(100) }} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4, padding: '3px 0', color: 'rgba(255,255,255,0.4)',
                fontSize: 9, cursor: 'pointer' }}>Reset</button>
            </div>
          )}
        </div>

        <div style={{ background: theme.shelfBg, border: `1px solid ${theme.shelfBorder}`,
          borderRadius: '6px 6px 0 0', padding: '28px 32px 0', minHeight: 240,
          display: 'flex', alignItems: 'flex-end', gap: 16,
          position: 'relative', boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40,
            background: 'linear-gradient(to bottom,rgba(255,255,255,0.03),transparent)',
            borderRadius: '6px 6px 0 0', pointerEvents: 'none' }} />

          {/* Folders and data cards — left side */}
          {folders.map(folder => (
            <FolderCard key={folder.id} folder={folder}
              items={dataItems.filter(d => d.folderId === folder.id)}
              onRemove={handleRemoveFolder}
              onUpload={handleUploadIntoFolder}
              onOpen={setOpenFolder}
              folderFilter={folderFilter} />
          ))}
          {looseItems.map(item => (
            <DataCard key={item.id} item={item} onRemove={handleRemoveItem} onAnalyze={handleAnalyze} />
          ))}
          {looseItems.length === 0 && folders.length === 0 && (
            <div style={{ height: 40 }} />
          )}

          {/* Right side: New folder — pinned bottom-right */}
          <div style={{ position: 'absolute', bottom: 5, right: 32, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <GhostFolder onCreate={handleCreateFolder} folderFilter={folderFilter} />
          </div>
        </div>
        <ShelfPlank theme={theme} />
      </div>
    </div>
  )
}





