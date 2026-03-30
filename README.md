# Peptide Journal
### Longevity Medicine & Protocols

A self-hosted digital publication platform for the Peptide Journal — a scientific flipbook viewer and issue library built on Next.js.

## Stack
- Next.js 14, React 18, Tailwind CSS
- react-pdf + react-pageflip (PDF flipbook engine)
- react-zoom-pan-pinch (zoom/pan)
- Radix UI, framer-motion, lucide-react

## Features
- PDF upload → auto cover thumbnail extraction
- Issue bookcase with list + grid views
- Full flipbook viewer (flip, zoom, pan, fullscreen, keyboard nav)
- Issue metadata editing (title, volume, date, tags)
- Share via link, social media
- Self-hosted, no external dependencies at runtime

## Roadmap
- [ ] CortixEngine science workflow sidebar
- [ ] Per-issue annotation layer
- [ ] Protocol database integration
- [ ] Reader analytics

## Dev
```bash
npm install
npm run dev
```

## Structure
```
public/issues/[id]/   ← PDF files + cover thumbnails
data/issues.json      ← Issue metadata store
app/(pages)/          ← Dashboard + viewer routes
app/api/              ← Upload, list, delete API routes
```
