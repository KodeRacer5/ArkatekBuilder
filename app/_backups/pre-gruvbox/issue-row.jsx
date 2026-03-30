'use client'
import { Pencil, Link, Trash2, ExternalLink, Share2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/app/_lib/utils'

export default function IssueRow({ issue, onPreview, onEdit, onDelete, onCopyLink, isSelected }) {
  const coverSrc = issue.coverPath || null
  const viewerUrl = `/issue/${issue.id}`

  return (
    <div
      onClick={() => onPreview(issue)}
      className={cn(
        'flex items-center gap-4 px-4 py-3 border rounded-lg mx-4 my-1.5 cursor-pointer transition-all',
        isSelected
          ? 'bg-secondary border-primary'
          : 'bg-card border-primary/60 hover:border-primary hover:bg-secondary/30'
      )}
    >
      {/* Portrait thumbnail */}
      <div className="w-16 shrink-0 rounded overflow-hidden bg-muted" style={{ aspectRatio: '3/4' }}>
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={issue.title || 'Issue'}
            width={128}
            height={170}
            className="object-cover w-full h-full"
            quality={90}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground uppercase tracking-wider">PDF</div>
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{issue.title || 'Untitled'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {issue.volume && <span className="text-primary mr-2">{issue.volume}</span>}
          {issue.issueDate && new Date(issue.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Status */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        <span className={cn('w-1.5 h-1.5 rounded-full',
          issue.status === 'published' ? 'bg-green-500' :
          issue.status === 'processing' ? 'bg-yellow-500 animate-pulse' : 'bg-muted-foreground'
        )} />
        <span className="text-xs text-muted-foreground capitalize">{issue.status}</span>
      </div>

      {/* File size */}
      <span className="hidden lg:block text-xs text-muted-foreground shrink-0">{issue.fileSize}</span>

      {/* Actions — always inline, expanded when selected */}
      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
        {isSelected && (
          <>
            <a
              href={viewerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Open in tab
            </a>
            <button
              onClick={() => onCopyLink(issue)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              <Share2 className="size-3.5" />
              Share
            </button>
            <div className="w-px h-4 bg-border mx-1" />
          </>
        )}
        <button onClick={() => onEdit(issue)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Edit">
          <Pencil className="size-3.5" />
        </button>
        <button onClick={() => onCopyLink(issue)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Copy link">
          <Link className="size-3.5" />
        </button>
        <button onClick={() => onDelete(issue)} className="p-1.5 rounded hover:bg-secondary text-red-400 hover:text-red-500 transition-colors" title="Delete">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}


