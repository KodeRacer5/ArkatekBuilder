'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import TopBar from '@/app/_components/ui/dashboard/top-bar'
import dynamic from 'next/dynamic'
const AnalyticalChain = dynamic(() => import('@/app/_components/ui/dashboard/AnalyticalChain'), { ssr: false })
import IssueRow from '@/app/_components/ui/dashboard/issue-row'
import GridView from '@/app/_components/ui/dashboard/grid-view'
import UploadModal from '@/app/_components/ui/dashboard/upload-modal'
import EditModal from '@/app/_components/ui/dashboard/edit-modal'
import { useShelfTheme } from '@/app/_providers/shelf-theme-context'

export default function DashboardPage() {
  const { theme } = useShelfTheme()
  const [issues, setIssues] = useState([])
  const [view, setView] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [editIssue, setEditIssue] = useState(null)

  const fetchIssues = useCallback(async () => {
    const res = await fetch('/api/issues')
    setIssues(await res.json())
  }, [])

  useEffect(() => { fetchIssues() }, [fetchIssues])

  const filtered = issues.filter(i =>
    i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.volume?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )


  const handleDelete = async (issue) => {
    if (!confirm(`Delete "${issue.title}"?`)) return
    await fetch(`/api/issues/${issue.id}`, { method: 'DELETE' })
    setIssues(p => p.filter(i => i.id !== issue.id))
    if (selectedIssue?.id === issue.id) setSelectedIssue(null)
  }

  const handleCopyLink = (issue) => {
    navigator.clipboard.writeText(window.location.origin + '/issue/' + issue.id)
  }

  const handleSaveEdit = (updated) => {
    setIssues(p => p.map(i => i.id === updated.id ? updated : i))
    if (selectedIssue?.id === updated.id) setSelectedIssue(updated)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg, transition: 'background 0.3s ease' }}>

      {/* Hero Banner with Analytical Chain Canvas */}
      <div style={{ width: '100%', marginTop: 8, position: 'relative' }}>
        <Image
          src="/hero-banner4.png"
          alt="Peptide Journal — Longevity Medicine & Protocols"
          width={4800}
          height={250}
          style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
          priority
          unoptimized
        />
        {/* Nodes overlay on banner */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            <AnalyticalChain height="100%" />
          </div>
        </div>
      </div>


      {/* Controls */}
      <TopBar
        view={view}
        setView={setView}
        onUpload={() => setShowUpload(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">
                {issues.length === 0 ? 'No publications yet. Upload your first issue.' : 'No results found.'}
              </p>
            </div>
          ) : view === 'list' ? (
            filtered.map(issue => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isSelected={selectedIssue?.id === issue.id}
                onPreview={setSelectedIssue}
                onEdit={setEditIssue}
                onDelete={handleDelete}
                onCopyLink={handleCopyLink}
              />
            ))
          ) : (
            <GridView issues={filtered} onPreview={setSelectedIssue} selectedId={selectedIssue?.id} />
          )}
        </div>

      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={issue => setIssues(p => [issue, ...p])} />}
      {editIssue && <EditModal issue={editIssue} onClose={() => setEditIssue(null)} onSave={handleSaveEdit} />}
    </div>
  )
}


