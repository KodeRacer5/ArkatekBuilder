# CLAUDE_CONTINUE.md — Peptide Journal

---

## PROJECT PATH
**Windows:** `C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master`
**Proxmox CT200:** `/opt/Peptide_Journal`

## PROJECT NAME
Peptide Journal — Longevity Medicine & Protocols (Digital flipbook journal for clinicians)

---

## INFRASTRUCTURE

### Two Environments — CRITICAL
| Environment | Purpose | URL | Start Command |
|---|---|---|---|
| Windows Dev | Local development | `http://localhost:3000` | `npm run dev` in project root |
| Proxmox CT200 | Production server | `http://[CT200-IP]:3030` | `pm2` managed, see deploy below |

### GitHub
- **Repo:** https://github.com/KodeRacer5/Peptide_Journal.git
- **Branch:** `main`

### Windows Push Command
```powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master"; git add -A; git commit -m "MESSAGE"; git push origin main
```

### CT200 Deploy Command (ALWAYS use SSH wrapper from PowerShell)
```powershell
ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```

### CT200 Specs
- Proxmox LXC 200, Ubuntu 22.04, 4 cores, 32GB RAM
- Node 20.20.1 via NVM
- Port: **3030** (not 3000)
- DO NOT run Linux commands directly in PowerShell — always wrap with `ssh ct200 "..."`

### VS Code Open Command (Windows)
```powershell
Start-Process "code" -ArgumentList "FILEPATH"
```

---

## PROJECT STATUS
**Phase:** Active Development — UI & Feature Build

### Completed
- Next.js 14 app with App Router, TypeScript, Tailwind, DM Sans/Playfair Display fonts
- PDF upload → WebP page rendering pipeline
- Flipbook viewer (react-pageflip / StPageFlip) using WebP images
- Dashboard with hero banner, TopBar dual-dock, issue list/grid views
- Bookshelf page with card flip (front/back faces, rotateY on hover)
- Protocols page (66 protocols, 14 sections, sidebar + CardSwap)
- Research page (React Flow canvas)
- `_lib/issues.js` shared data layer
- Dark theme fixed (`:root` CSS vars set to dark values)
- TopBar: dual dock, Sign In text link, LogIn icon, glass pill chat input

### In Progress / Broken — START HERE
- **Bookshelf** — card flip renders but grid layout needs verification; `paddingBottom` trick replaced with explicit `height: 320` — needs testing on Windows at `localhost:3000/bookshelf`
- **Grid view on dashboard** — flip cards added to `grid-view.jsx`, needs testing
- **Flipbook 3D effects** — shadows, page corners, hard covers, spine binding, paper texture added but not verified live
- **CT200 build** — was failing with "no production build" error; fix is `npm run build` before `pm2 restart`

---

## PRIORITIES

1. **RESTORE & VERIFY BOOKSHELF** — Card flip grid must work at `localhost:3000/bookshelf`. The `height: 320` fix was just applied to both `bookshelf/page.jsx` and `grid-view.jsx`. If still broken, check browser console — likely `transformStyle: preserve-3d` not propagating or a CSS conflict.

2. **VERIFY FLIPBOOK 3D EFFECTS** — Navigate to an issue. Confirm: page corner fold on hover, realistic shadow during flip, 900ms curl, hard cover on first/last pages, spine binding gradient on each page.

3. **DEPLOY TO CT200** — Once Windows is verified, push to GitHub and run full production build on CT200.

4. **PROGRAM THE CANVAS** — Research page (`/research`) uses React Flow. Wire "Analyze Protocol" button on protocols page → loads pre-wired canvas blueprint per protocol → user uploads lab panel → simulation result. Canvas templates needed for: bpc157, tb500, semax, ghk_cu.

5. **CONTINUE UPDATING PROTOCOLS** — Add search/filter input to protocols sidebar (66 protocols, client-side). Consider more protocol sections or metadata updates.

---

## KEY FILES

| File | Purpose | Status |
|---|---|---|
| `app/(pages)/(website)/page.jsx` | Dashboard — default view is `grid` | OK |
| `app/(pages)/bookshelf/page.jsx` | Bookshelf — SSRP-style card flip grid | NEEDS VERIFY |
| `app/(pages)/issue/[id]/page.jsx` | Flipbook viewer page | Fixed (duplicate import removed) |
| `app/(pages)/protocols/page.jsx` | Protocols — 66 protocols, 14 sections | OK |
| `app/(pages)/research/page.jsx` | React Flow canvas | Stub — needs wiring |
| `app/(pages)/about/page.jsx` | ComingSoon placeholder | Empty |
| `app/_components/ui/dashboard/top-bar.jsx` | TopBar dual dock | OK |
| `app/_components/ui/dashboard/chat-input.jsx` | Glass pill chat input | OK |
| `app/_components/ui/dashboard/grid-view.jsx` | Grid view with card flip | NEEDS VERIFY |
| `app/_components/ui/dashboard/issue-row.jsx` | List view row | OK |
| `app/_components/ui/flipbook-viewer/flipbook/flipbook-loader.jsx` | HTMLFlipBook 3D config | NEEDS VERIFY |
| `app/_components/ui/flipbook-viewer/flipbook/pdf-page.jsx` | WebP page — texture, spine | NEEDS VERIFY |
| `app/_components/ui/flipbook-viewer/toolbar/slider-nav/hover-item.jsx` | Fixed — WebP thumbnails (no react-pdf) | Fixed |
| `app/_components/ui/protocols/CardSwap.jsx` | React Bits CardSwap (gsap) | OK |
| `app/_lib/issues.js` | Shared data layer | OK |
| `app/_styles/globals.css` | Dark theme in :root | Fixed |
| `data/issues.json` | Issues data store | OK |

---

## BUSINESS MODEL (LOCKED)
- **Surface:** Peer-reviewed digital journal, published every 20 days, distributed via shareable links to 100K+ clinicians. Free to readers. Advertiser-subsidized.
- **Easter egg:** Each article is a pre-wired CortixEngine canvas blueprint → clinician reads → clicks "Analyze Protocol" → pre-wired canvas loads → uploads lab panel → simulation result.

## INTERFACE HIERARCHY (LOCKED)
```
iMessage share link → /issue/[id] (flipbook)
  → "View All Issues" → /bookshelf
  → / (admin dashboard)
```

---

## PROTOCOLS PAGE — LOCKED LAYOUT
- Left sidebar (width: 240) — collapsible sections, plain scroll list
- Selected state: white text + fontWeight 600 ONLY — no background, no border, no pill
- Right panel: protocol name/category + CardSwap
- All fonts: DM Sans explicitly — NO Playfair Display, NO italic on this page
- NO AnimatedList component — custom scroll list only
- CardSwap props: `width=420 height=280 cardDistance=50 verticalDistance=60 delay=4000 pauseOnHover easing="elastic"`

---

## TOPBAR LAYOUT (LOCKED)
```
[glass toggle + chat] [NAV_ITEMS Dock] [RIGHT_DOCK_ITEMS Dock] [New Publication] [LogIn icon + Sign In text]
```
- DO NOT put buttons inside the glass dock pill
- DO NOT remove onUpload / New Publication button — needed for admin upload
- Use `framer-motion` NOT `motion/react`

---

## FLIPBOOK VIEWER — CURRENT CONFIG
```jsx
// flipbook-loader.jsx
drawShadow={true}
maxShadowOpacity={0.65}
flippingTime={900}
showCover={true}
showPageCorners={true}
// Wrapper: filter: drop-shadow(0 24px 48px rgba(0,0,0,0.8))
// First/last pages: data-density="hard"
// pdf-page.jsx: paper texture SVG noise overlay + spine binding gradient
```

---

## DECISIONS MADE
- Dark-only app — `:root` CSS vars set to dark, no `.dark` class toggle needed
- WebP images for flipbook (NOT react-pdf)
- Grid view is default on dashboard
- Bookshelf card flip uses explicit `height: 320` (NOT paddingBottom percentage)
- CT200 runs production build — NOT dev mode
- Glass UI: `rgba(30,35,45,0.72)` backdrop-blur-24px

## PENDING DECISIONS
- `/signin` page — auth not built (admin vs reader roles)
- Open Graph meta tags per issue (critical for iMessage/WhatsApp rich previews)
- Canvas template data structure for CortixEngine integration
- About page content

---

## DO NOT
- DO NOT use `motion/react` — use `framer-motion`
- DO NOT use italic or Playfair Display on protocols page
- DO NOT use pill/box/background on selected sidebar items
- DO NOT use emojis in UI
- DO NOT forget port is 3030 on CT200
- DO NOT run Linux commands directly in PowerShell — wrap with `ssh ct200 "..."`
- DO NOT export non-HTTP functions from route.js — use `_lib/` instead
- DO NOT remove New Publication button

---

## QUICK START FOR NEXT AGENT
1. Read this file fully before touching any code
2. Start Windows dev server: `npm run dev` in project root
3. Test `localhost:3000` — dashboard grid with flip cards
4. Test `localhost:3000/bookshelf` — card flip grid
5. Test `localhost:3000/issue/[id]` — flipbook 3D effects
6. Fix anything broken, then push + deploy to CT200:
```powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master"; git add -A; git commit -m "Fix and verify all features"; git push origin main
```
```powershell
ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```
7. Next feature: wire "Analyze Protocol" → Research canvas

---
*Generated: March 13, 2026*
