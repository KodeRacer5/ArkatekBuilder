import FlipbookViewer from '@/app/_components/ui/flipbook-viewer/flipbook-viewer'
import { getIssues } from '@/app/_lib/issues'
import { notFound } from 'next/navigation'

export default function IssuePage({ params }) {
  const issues = getIssues()
  const issue = issues.find(i => i.id === params.id)
  if (!issue) notFound()

  return (
    <FlipbookViewer
      pdfUrl={issue.pdfPath}
      pagesPath={issue.pagesPath}
      totalPages={issue.totalPages}
      shareUrl={`/issue/${issue.id}`}
      title={issue.title}
      volume={issue.volume}
    />
  )
}
