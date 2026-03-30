'use client'
import { X, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '../button'
import Image from 'next/image'
import Share from '../share'

export default function PreviewPanel({ issue, onClose }) {
  if (!issue) return null

  const viewerUrl = `/issue/${issue.id}`

  return (
    <div className="panel-slide-in w-[420px] shrink-0 border-l border-border bg-card flex flex-col h-full">
      {/* Cover */}
      <div className="relative flex-1 bg-muted flex items-center justify-center overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
          <X className="size-4" />
        </button>
        {issue.coverPath ? (
          <Image src={issue.coverPath} alt={issue.title} fill className="object-contain p-4" />
        ) : (
          <div className="text-muted-foreground text-sm">No preview available</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-border">
        <p className="font-display font-semibold text-base leading-tight">{issue.title}</p>
        {issue.volume && <p className="text-xs text-primary mt-0.5">{issue.volume}</p>}
        {issue.subtitle && <p className="text-xs text-muted-foreground mt-1">{issue.subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <Button asChild className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
          <a href={viewerUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="size-3.5" />
            Open in tab
          </a>
        </Button>
        <Share shareUrl={typeof window !== 'undefined' ? window.location.origin + viewerUrl : viewerUrl} asChild>
          <Button variant="secondary" className="flex-1 gap-2 text-sm">
            <Share2 className="size-3.5" />
            Share
          </Button>
        </Share>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}





