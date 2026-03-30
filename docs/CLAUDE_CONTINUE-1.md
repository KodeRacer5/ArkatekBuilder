# CLAUDE_CONTINUE.md — Peptide Journal

## PROJECT PATH
`C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master`

## PROJECT NAME
Peptide Journal — Longevity Medicine & Protocols

## STARTUP FILES TO READ
1. `CLAUDE_CONTINUE.md` (this file)
2. `data/issues.json`
3. `app/(pages)/(website)/page.jsx`
4. `app/api/upload/route.js`
5. `app/_components/ui/flipbook-viewer/flipbook/pdf-page.jsx`
6. `app/_components/ui/flipbook-viewer/flipbook/flipbook-loader.jsx`

---

## WHAT THIS PROJECT IS

Peptide Journal is a clinical publication platform and Trojan Horse delivery system for CortixEngine AI analysis.

### The Surface Layer (what it looks like)
A professional peer-reviewed digital journal — *Peptide Journal: Longevity Medicine & Protocols* — published every 20 days and distributed via shareable links to 100,000+ clinicians via iMessage, WhatsApp, and email. Free to readers. Advertiser-subsidized.

### The Easter Egg (what it actually is)
Each article is a pre-wired CortixEngine canvas blueprint. After reading, clinicians can activate the Science Engine and run the protocol from the article directly against their own patient data or lab panels — without ever leaving the publication. No blank canvas. No onboarding. The article IS the onboarding.

### The Business Model
- **Free to clinicians** — zero friction, maximum distribution
- **Advertisers pay** — pharma, compounding pharmacies, supplement brands
- **Pharma premium tier** — pay a percentage of clinician prescription value per year (top prescribers write $400K-$500K/year). Each simulation run is a measurable conversion event: article read → protocol simulated → prescription written
- **Data layer** — anonymized simulation runs licensed to pharma as clinical intent data
- **Distribution** — 100K clinician mailing list, published every 20 days, shared via iMessage/WhatsApp/email as rich link cards showing magazine cover

### Why It Works
Clinicians won't learn new AI tools. But they read journals. By the time they finish the article they already understand the protocol — which is also the node graph. One click activates it. One upload (lab panel or patient chart) runs it. The AI is invisible until they find it themselves.

---

## INFRASTRUCTURE

| Component | Detail |
|---|---|
| Dev/Staging | CT200 — `192.168.68.200:3000` |
| Container | Proxmox LXC 200, Ubuntu 22.04, 4 cores, 16GB RAM |
| Node | 20.20.1 via NVM |
| Chrome | `/usr/bin/google-chrome-stable` |
| GitHub | https://github.com/KodeRacer5/Peptide_Journal.git |
| Production | Oracle Cloud Ubuntu VM (future) |
| Process | `npm run dev` — PM2 not yet configured |

**Deploy workflow:** Windows (VS Code + Desktop Commander) → git push → CT200 git pull

---

## PROJECT STATUS

**Current Phase: 1 — Core Upload Pipeline (IN PROGRESS)**

### Completed
- [x] Next.js 14 app scaffolded from react-pdf-flipbook-viewer base
- [x] Brand tokens — dark navy bg, gold primary, Playfair Display + DM Sans
- [x] Hero banner (2400x366px) `public/hero-banner2.png` wired as full-width header
- [x] Dashboard page — list/grid view, search, upload modal
- [x] `data/issues.json` flat file store
- [x] `GET /api/issues`, `POST /api/upload`, `PUT /api/issues/[id]`, `DELETE /api/issues/[id]`
- [x] Issue viewer route `/issue/[id]` — FlipbookViewer with back button
- [x] IssueRow, GridView, PreviewPanel, EditModal, UploadModal components
- [x] Upload modal bug fixed — `fd.append('file', file)` not 'pdf'
- [x] `uuid` package installed on CT200
- [x] viewRange increased to [0,12] — pre-renders first 12 pages
- [x] Flipbook renders — confirmed working with test PDF
- [x] **Architecture decision locked** — pre-render all PDF pages to WebP on server at upload time (same approach as Heyzine)
- [x] `app/api/upload/route.js` rewritten — pdfjs-dist + canvas + sharp pipeline
- [x] `pdf-page.jsx` rewritten — loads `<img>` WebP instead of react-pdf `<Page>`
- [x] `canvas` npm package install triggered on CT200

### IN PROGRESS
- [ ] Confirm `canvas` installed successfully on CT200
- [ ] Wire `pagesPath` prop through flipbook-loader.jsx → pdf-page.jsx

### Pending
- [ ] Test full upload → WebP pages generated → instant flipbook render
- [ ] `.env.local` — CHROME_PATH, BASE_URL, NODE_ENV
- [ ] PM2 persistent process on CT200
- [ ] Open Graph meta tags per issue (rich iMessage/WhatsApp link previews)
- [ ] Bookshelf view (`/bookshelf`) — visual magazine rack
- [ ] Public shareable flipbook links (no login required)
- [ ] CortixEngine canvas activation from bookshelf
- [ ] `canvasTemplate` field wired in upload UI
- [ ] Auth (admin/reader) — deferred

---

## PRIORITIES

1. **Confirm `canvas` installed** — `npm list canvas` on CT200
2. **Wire pagesPath through flipbook-loader** — MemoizedPdfPage needs pagesPath prop
3. **Test upload** — upload real Peptide Science Journal PDF, confirm WebP pages generated in `/public/issues/[id]/pages/`
4. **Test flipbook** — confirm instant page rendering, zero client-side delay
5. **OG meta tags** — per-issue so share links show magazine cover in iMessage/WhatsApp
6. **PM2** — `pm2 start npm --name "peptide-journal" -- run dev && pm2 save && pm2 startup`

---

## ARCHITECTURE DECISIONS LOCKED

| Topic | Decision | Rationale |
|---|---|---|
| Page rendering | Pre-render all pages to WebP at upload time | Eliminates 10s+ client-side PDF.js render delay |
| Page format | WebP quality 90, scale 2.0 | Sharp clinical text, small file size for mobile distribution |
| Per-page size | ~200-400KB | 24-page issue ~8-10MB total — fast on mobile LTE |
| Page storage | `/public/issues/[id]/pages/1.webp, 2.webp...` | Static files, served instantly |
| Cover thumbnail | Page 1.webp copied as cover.webp | Automatic, no separate render step |
| Render stack | pdfjs-dist + canvas npm + sharp | pdfjs renders to canvas, sharp converts to WebP |
| Storage | Flat file `data/issues.json` + filesystem | No DB needed yet |
| Auth | Deferred | Upload button always visible for now |
| Distribution | Public shareable links, no login | iMessage tap → instant flipbook |
| Canvas template | JSON field in issues.json | Each article maps to pre-wired CortixEngine node graph |
| Puppeteer | Not needed for thumbnails | pdfjs-dist handles server-side render directly |

---

## ISSUE OBJECT SHAPE (CURRENT)
```json
{
  "id": "uuid-v4",
  "title": "Cellular Resets",
  "subtitle": "From Cells to Systems",
  "volume": "Vol. 1",
  "issueDate": "2026-03-12",
  "tags": ["BPC-157", "longevity"],
  "status": "published",
  "pdfPath": "/issues/[id]/document.pdf",
  "coverPath": "/issues/[id]/cover.webp",
  "pagesPath": "/issues/[id]/pages",
  "totalPages": 24,
  "fileSize": "4.2 MB",
  "createdAt": "ISO string",
  "canvasTemplate": null
}
```

---

## INTERFACE HIERARCHY LOCKED

```
iMessage/WhatsApp share link
        ↓
/issue/[id]  ← full screen flipbook, lands here directly
        ↓
"View All Issues" button  ← takes them to bookshelf
        ↓
/bookshelf  ← magazine rack, all covers
        ↓
/  ← admin dashboard (upload, edit, delete)
```

---

## THREE INTERFACE LAYERS

**Interface 1 — Admin Dashboard** (`/`)
Upload, manage, publish. You only. Upload button always visible for now, hidden later via auth.

**Interface 2 — Bookshelf** (`/bookshelf`)
Visual magazine rack. All issues as covers. Premium scientific feel. From here, CortixEngine activates.

**Interface 3 — Flipbook Viewer** (`/issue/[id]`)
Full screen. Article takes over. Minimal chrome. Subtle "Analyze Protocol" button appears after page 3.
This is the primary share link target — clinician lands here directly from iMessage.

---

## THE CORTIXENGINE EASTER EGG

Each PDF article IS the onboarding for the CortixEngine canvas. The node graph is the visual representation of the protocol described in the article. Clinician reads → understands protocol → clicks "Analyze Protocol" → pre-wired canvas loads → uploads lab panel → sees simulation result. No blank canvas. No learning curve.

**Pharma value proposition:** Simulate drug against real patient chart without administering it. Post-simulation prescribe likelihood is extremely high. Measurable funnel: article read → simulation run → prescription written. Pharma pays per clinician prescription quota value ($400-500K/year for top prescribers).

---

## COMPONENT CHAIN FOR FLIPBOOK

```
/issue/[id]/page.jsx
  → flipbook-viewer.jsx
    → flipbook.jsx
      → flipbook-loader.jsx  ← needs pagesPath prop added + passed to MemoizedPdfPage
        → pdf-page.jsx       ← rewritten: loads <img src={pagesPath/page.webp}> 
```

---

## KEY FILES

| File | Purpose | Status |
|---|---|---|
| `app/(pages)/(website)/page.jsx` | Admin dashboard | Done |
| `app/(pages)/issue/[id]/page.jsx` | Flipbook viewer route | Done — verify pagesPath passed to FlipbookViewer |
| `app/api/upload/route.js` | PDF upload + WebP page generation | Rewritten — needs canvas install confirmed |
| `app/api/issues/route.js` | GET all issues | Done |
| `app/api/issues/[id]/route.js` | PUT/DELETE single issue | Done |
| `app/_components/ui/flipbook-viewer/flipbook/pdf-page.jsx` | Page renderer | Rewritten — img tags, needs pagesPath prop |
| `app/_components/ui/flipbook-viewer/flipbook/flipbook-loader.jsx` | Page loader | Needs pagesPath wired through |
| `app/_components/ui/flipbook-viewer/flipbook/flipbook.jsx` | Flipbook container | viewRange [0,12] — done |
| `data/issues.json` | Flat file data store | Done |
| `public/hero-banner2.png` | 2400x366 masthead | Done |
| `app/_styles/globals.css` | Brand tokens | Done |

---

## INSTALLED PACKAGES ON CT200

```
pdfjs-dist: ^4.6.82
puppeteer:  ^22.0.0  (keep for future use)
sharp:      ^0.32.6
uuid:       installed
canvas:     installing / confirm with npm list canvas
```

---

## DO NOT

- Do NOT render PDF pages client-side — pre-render to WebP at upload time
- Do NOT use JPEG — WebP quality 90 for clinical text sharpness
- Do NOT use PNG — too large for internet distribution (3-4MB per page)
- Do NOT use bundled Puppeteer Chromium for thumbnails — pdfjs handles it
- Do NOT run Puppeteer without `--no-sandbox` if ever used — CT200 is unprivileged LXC
- Do NOT use swap on CT200 — pure RAM
- Do NOT bake buttons or nav into hero banner image — overlay in code
- Do NOT use emojis anywhere in the UI
- Do NOT open VS Code with `code FILEPATH` — use `Start-Process "code" -ArgumentList "FILEPATH"`
- Do NOT expose GitHub PAT — rotate at github.com/settings/tokens

---

## QUICK START

1. Read this file in full
2. On CT200: `npm list canvas` — confirm installed
3. Read `flipbook-loader.jsx` — add pagesPath prop, pass to MemoizedPdfPage
4. Read `app/(pages)/issue/[id]/page.jsx` — confirm pagesPath from issue object passed into FlipbookViewer
5. Upload a real Peptide Science Journal PDF via the dashboard
6. Confirm WebP files appear: `ls /opt/Peptide_Journal/public/issues/[id]/pages/`
7. Hit `/issue/[id]` — confirm instant page rendering with no delay

**Confirm you have read all startup files and are ready to continue Phase 1.**

---

## NEXT SESSION PROMPT

```
Read CLAUDE_CONTINUE.md at:
C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\CLAUDE_CONTINUE.md

Project: Peptide Journal — Longevity Medicine & Protocols
Phase 1 — Upload pipeline nearly complete.

Priority 1: Confirm canvas npm installed on CT200 (npm list canvas), then wire 
pagesPath prop through flipbook-loader.jsx to pdf-page.jsx

Priority 2: Test full upload → WebP generation → instant flipbook render end-to-end

Priority 3: OG meta tags per issue for iMessage/WhatsApp rich link previews

Confirm you have read the file and are ready.
```
