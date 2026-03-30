'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, BookOpen, Plus } from 'lucide-react'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import dynamic from 'next/dynamic'
const AnalyticalChain = dynamic(() => import('@/app/_components/ui/dashboard/AnalyticalChain'), { ssr: false })
import { useShelfTheme } from '@/app/_providers/shelf-theme-context'

function ShelfPlank({ theme }) {
  return (
    <div style={{ position: 'relative', height: 28, marginTop: 4 }}>
      <div style={{ height: 10, background: theme.shelfTop, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }} />
      <div style={{ height: 18, background: theme.shelfFace, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }} />
    </div>
  )
}

function BookCover({ issue, index, onRemove, isUserDoc }) {
  const router = useRouter()
  const [hov, setHov] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const title = issue.title || 'Untitled'
  const isLocked = issue.status !== 'published' && !isUserDoc
  const h = [188, 200, 176, 194, 184, 198, 174, 192][index % 8]
  const w = 118

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}
      onMouseEnter={() => { setHov(true); setFlipped(true) }}
      onMouseLeave={() => { setHov(false); setFlipped(false) }}>
      {isUserDoc && hov && (
        <button onClick={() => onRemove(issue.id)} style={{
          position: 'absolute', top: -8, right: -6, zIndex: 30, width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(180,40,40,0.9)', border: '1px solid rgba(255,255,255,0.3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><X size={9} color="#fff" /></button>
      )}
      <div style={{ perspective: 900, width: w, height: h, transform: hov ? 'translateY(-14px)' : 'translateY(0)', transition: 'transform 0.25s ease' }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          cursor: isLocked && !isUserDoc ? 'default' : 'pointer',
        }} onClick={() => !isLocked && router.push(`/issue/${issue.id}`)}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: '2px 4px 4px 2px', overflow: 'hidden', background: isUserDoc ? '#0f1f3a' : '#0d1b2a',
            boxShadow: '3px 6px 16px rgba(0,0,0,0.55)' }}>
            {issue.coverPath
              ? <img src={issue.coverPath} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
              : <div style={{ width: '100%', height: '100%', background: isUserDoc ? 'linear-gradient(160deg,#0f2040,#1a3060)' : 'linear-gradient(160deg,#0d1b2a,#1a2744)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10, gap: 8 }}>
                  <BookOpen size={22} color="rgba(255,255,255,0.25)" />
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4 }}>{title}</span>
                </div>
            }
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 10, background: 'linear-gradient(to right,rgba(0,0,0,0.5),transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, background: 'linear-gradient(to bottom,rgba(255,255,255,0.07),transparent)', pointerEvents: 'none' }} />
            {isUserDoc && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(30,80,180,0.88)', fontSize: 7, fontWeight: 700, color: '#fff', textAlign: 'center', padding: '3px 0', letterSpacing: '0.1em' }}>MY DOC</div>}
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)', borderRadius: '4px 2px 2px 4px', overflow: 'hidden',
            background: 'linear-gradient(160deg,#111d30,#1a2a4a)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', padding: 14, gap: 8, justifyContent: 'space-between' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{isUserDoc ? 'My Document' : 'Peptide Journal'}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.45, flex: 1 }}>{title}</div>
            {issue.totalPages > 0 && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{issue.totalPages} pages</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLocked && !isUserDoc ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)',
              borderRadius: 6, padding: '6px 0', fontSize: 9, fontWeight: 700,
              color: isLocked && !isUserDoc ? 'rgba(255,255,255,0.3)' : '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isLocked && !isUserDoc ? 'Preview Only' : 'Open'}
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: w,
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {title}
      </div>
    </div>
  )
}

function ShelfSection({ label, books, startIndex, onRemove, userDocIds, onUpload, showUpload, uploading, theme, wrap }) {
  const BOOKS_PER_ROW = 10
  const rows = wrap
    ? Array.from({ length: Math.max(1, Math.ceil(books.length / BOOKS_PER_ROW)) }, (_, i) => books.slice(i * BOOKS_PER_ROW, (i + 1) * BOOKS_PER_ROW))
    : [books]
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.labelColor }}>{label}</span>
        {showUpload && (
          <button onClick={onUpload} disabled={uploading} style={{
            display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 10px',
            cursor: 'pointer', color: theme.mutedColor, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          }}><Plus size={11} /> {uploading ? 'Adding...' : 'Add Document'}</button>
        )}
      </div>
      {rows.map((rowBooks, ri) => (
        <div key={ri}>
          <div style={{ background: theme.shelfBg, border: `1px solid ${theme.shelfBorder}`,
            borderRadius: '6px 6px 0 0', padding: '28px 32px 0', minHeight: 240,
            display: 'flex', alignItems: 'flex-end', position: 'relative',
            boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40,
              background: 'linear-gradient(to bottom,rgba(255,255,255,0.03),transparent)',
              borderRadius: '6px 6px 0 0', pointerEvents: 'none' }} />
            {rowBooks.length === 0
              ? <div style={{ color: theme.mutedColor, fontSize: 12, paddingBottom: 40, paddingLeft: 4 }}>Empty shelf</div>
              : <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, width: '100%' }}>
                  {rowBooks.map((book, i) => (
                    <BookCover key={book.id} issue={book} index={startIndex + ri * BOOKS_PER_ROW + i}
                      onRemove={onRemove} isUserDoc={userDocIds.has(book.id)} />
                  ))}
                </div>
            }
          </div>
          <ShelfPlank theme={theme} />
        </div>
      ))}
    </div>
  )
}

export default function BookshelfPage() {
  const { theme, themeIdx, setTheme, themes } = useShelfTheme()
  const [issues, setIssues] = useState([])
  const [userDocs, setUserDocs] = useState([])
  const [userDocIds, setUserDocIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const fetchIssues = useCallback(async () => {
    const res = await fetch('/api/issues')
    setIssues(await res.json())
  }, [])

  useEffect(() => { fetchIssues() }, [fetchIssues])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pj_user_docs') || '[]')
      setUserDocs(saved)
      setUserDocIds(new Set(saved.map(d => d.id)))
    } catch {}
  }, [])

  const saveUserDocs = (docs) => {
    setUserDocs(docs); setUserDocIds(new Set(docs.map(d => d.id)))
    localStorage.setItem('pj_user_docs', JSON.stringify(docs))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name.replace(/\.[^.]+$/, ''))
      formData.append('tags', 'user-upload')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const newIssue = await res.json()
        // Save to user docs list so it shows on shelf 2
        const id = newIssue.id
        const newDoc = { id, title: newIssue.title, status: 'user', coverPath: newIssue.coverPath, totalPages: newIssue.totalPages, isUserDoc: true }
        saveUserDocs([...userDocs, newDoc])
        // Refresh shelf 1 issues from server
        fetchIssues()
      }
    } catch (err) { console.error('Upload failed:', err) }
    setUploading(false)
    fileRef.current.value = ''
  }

  const filteredIssues = issues.filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()))
  const filteredUserDocs = userDocs.filter(d => !search || d.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.3s ease' }}>
      <div style={{ width: '100%', marginTop: 8, position: 'relative', height: 250, overflow: 'hidden' }}>
        <img src="/hero-banner4.png" alt="Peptide Journal" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <AnalyticalChain height="100%" />
        </div>
      </div>
      <TopBar view="grid" setView={() => {}} onUpload={null} searchQuery="" setSearchQuery={() => {}} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 48px', borderBottom: `1px solid ${theme.headerBorder}`, background: theme.headerBg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.searchBg,
          border: `1px solid ${theme.searchBorder}`, borderRadius: 16, padding: '5px 12px', width: 220 }}>
          <Search size={12} color={theme.mutedColor} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search publications..."
            style={{ background: 'none', border: 'none', outline: 'none', color: theme.textColor, fontSize: 12, width: '100%', fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.mutedColor, marginRight: 4 }}>Theme</span>
          {themes.map((t, i) => (
            <button key={t.key} onClick={() => setTheme(i)} title={t.label} style={{
              width: 18, height: 18, borderRadius: '50%', background: t.dot, padding: 0, cursor: 'pointer',
              border: themeIdx === i ? '2px solid rgba(255,255,255,0.85)' : '2px solid rgba(255,255,255,0.12)',
              transition: 'border 0.15s',
            }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '40px 48px 60px' }}>
        <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
        <ShelfSection label="Peptide Journal Publications" books={filteredIssues} startIndex={0}
          onRemove={() => {}} userDocIds={new Set()} showUpload={true}
          onUpload={() => fileRef.current.click()} uploading={uploading} theme={theme} wrap={true} />
        <ShelfSection label="My Documents" books={filteredUserDocs} startIndex={filteredIssues.length}
          onRemove={(id) => saveUserDocs(userDocs.filter(d => d.id !== id))} userDocIds={userDocIds}
          showUpload={true} onUpload={() => fileRef.current.click()} uploading={uploading} theme={theme} wrap={false} />
      </div>
    </div>
  )
}





