# Peptide Journal — Master Project Document
**Last Updated:** March 14, 2026
**Status:** Active Development
**Version:** 0.1 — Research Preview

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Infrastructure & Deployment](#2-infrastructure--deployment)
3. [Tech Stack](#3-tech-stack)
4. [Repository & File Structure](#4-repository--file-structure)
5. [Pages & Features](#5-pages--features)
6. [Architecture — Analytical Engine](#6-architecture--analytical-engine)
7. [Data Layer](#7-data-layer)
8. [Auth — Supabase](#8-auth--supabase)
9. [Intake Wizard](#9-intake-wizard)
10. [Canvas — Silent Execution Engine](#10-canvas--silent-execution-engine)
11. [Locked Decisions](#11-locked-decisions)
12. [Build Sequence](#12-build-sequence)
13. [Deployment](#13-deployment)
14. [Environment Variables](#14-environment-variables)
15. [Do Not](#15-do-not)

---

## 1. Project Overview

Peptide Journal is a personal peptide intelligence platform. It combines a scientific publication library, an AI-powered cycle planning engine, a health data vault, and a protocol builder into a single application.

**Core value proposition:** Nobody knows how to build a peptide cycle. This platform takes user inputs (goals, body data, health markers, experience level) and generates a complete, personalized, research-backed cycle plan — grounded in Peptide Journal's own scientific publications.

**Target users:** Biohackers, performance athletes, longevity practitioners, functional medicine doctors.

**Two input paths:**
- Conversational wizard (MagicRings orb interface, 9-screen flow)
- Direct upload (labs/bloodwork → immediate analysis)

**Platform target:** Web (Next.js) now → Electron desktop app later. Same codebase, different runtime.

---

## 2. Infrastructure & Deployment

| Environment | Location | Purpose |
|---|---|---|
| Development | Windows local machine | Build and test |
| Production | Proxmox CT200, port 3030 | Live server |
| Process manager | PM2 on CT200 | Keep app running |
| Git remote | GitHub — KodeRacer5/Peptide_Journal | Source of truth |

**Deploy command:**
```bash
ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```

**SSH Linux commands from Windows PowerShell must be wrapped:**
```powershell
ssh ct200 "linux command here"
```
Never run Linux commands directly in PowerShell.

**Open VS Code from PowerShell:**
```powershell
Start-Process "code" -ArgumentList "FILEPATH"
```

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion (`framer-motion`, NOT `motion/react`) |
| Canvas/Flow | React Flow (`@xyflow/react`) |
| 3D/WebGL | Three.js (MagicRings component) |
| Auth | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| State (planned) | Zustand + persist middleware |
| Storage (planned) | IndexedDB via `idb` |
| LLM (first) | OpenRouter API → Claude |
| LLM (future) | Proxmox local models via LiteLLM |
| Vector DB (future) | Pinecone / Qdrant / Supabase pgvector |
| PDF rendering | pdfjs-dist, react-pdf, react-pageflip |
| UI primitives | Radix UI, shadcn/ui |
| Icons | Lucide React, React Icons |
| Future runtime | Electron (local memory, MCP tools, local models) |


---

## 4. Repository & File Structure

```
/
├── app/
│   ├── (pages)/                         # Main app pages (route group)
│   │   ├── (website)/page.jsx           # Dashboard — hero banner + AnalyticalChain overlay + publications grid
│   │   ├── bookshelf/page.jsx           # Bookshelf — publications + user docs + AnalyticalChain overlay
│   │   ├── lab/page.jsx                 # Health Data Vault — folders, uploads + AnalyticalChain overlay
│   │   ├── protocols/page.jsx           # Protocol sidebar + CardSwap viewer
│   │   ├── research/page.jsx            # Canvas — React Flow analytical engine (6 node types)
│   │   ├── about/page.jsx               # About page
│   │   └── layout.jsx                   # Shared layout — TopBar, banners, Audiowide font (--font-tech)
│   ├── login/
│   │   ├── layout.tsx                   # Standalone — no TopBar, no banner
│   │   └── page.tsx                     # Login — MagicRings + Supabase auth
│   ├── auth/
│   │   └── callback/route.ts            # OAuth callback handler
│   ├── api/
│   │   ├── issues/route.js              # Issue/publication API
│   │   ├── issues/[id]/                 # Individual issue route
│   │   ├── files/[...path]/             # File serving route
│   │   └── upload/route.js             # File upload API
│   ├── _components/ui/
│   │   ├── MagicRings.jsx               # WebGL animated rings (Three.js shader)
│   │   ├── coming-soon.jsx              # Coming soon placeholder
│   │   ├── logo.jsx                     # Logo component
│   │   ├── message.jsx                  # Message component
│   │   ├── share.jsx / share-expanded.jsx
│   │   ├── alert.jsx / alert-dialog.jsx / badge.jsx / button.jsx
│   │   ├── dialog.jsx / dropdown-menu.jsx / popover.jsx / separator.jsx
│   │   ├── sonner.jsx / toast.jsx / toaster.jsx / use-toast.js
│   │   ├── toggle.jsx / toggle-group.jsx / tooltip.jsx
│   │   ├── dashboard/
│   │   │   ├── top-bar.jsx              # TopBar — three-dock glass HUD layout, standalone glass planning pill
│   │   │   ├── PlanningButton.jsx       # Planning button component (docs/ has copy)
│   │   │   ├── AnalyticalChain.jsx      # React Flow overlay on banner images (home/bookshelf/lab)
│   │   │   ├── chat-input.jsx           # Chat input component
│   │   │   ├── Dock.jsx                 # Framer Motion magnification dock
│   │   │   ├── Dock.css                 # Dock styles (clean — planning overrides removed)
│   │   │   ├── edit-modal.jsx
│   │   │   ├── grid-view.jsx
│   │   │   ├── issue-row.jsx
│   │   │   ├── navbar.tsx               # Navbar
│   │   │   ├── preview-panel.jsx
│   │   │   └── upload-modal.jsx
│   │   ├── lab/                         # Folder system, data cards
│   │   ├── protocols/                   # CardSwap, custom scroll list (NO AnimatedList)
│   │   └── flipbook-viewer/             # PDF flipbook viewer
│   ├── _hooks/
│   │   ├── use-debounce.js
│   │   ├── use-ref-size.js
│   │   └── use-screensize.js
│   ├── _lib/
│   │   ├── issues.js
│   │   └── utils.js
│   ├── _providers/
│   │   ├── shelf-theme-context.jsx      # 6-theme system
│   │   ├── theme-provider.jsx           # Dark/light mode
│   │   └── nprogress-provider.jsx
│   └── _styles/globals.css
├── utils/
│   └── supabase/
│       ├── client.ts                    # Browser Supabase client
│       └── server.ts                    # Server Supabase client
├── middleware.ts                        # Route guard — unauthenticated → /login
├── public/
│   ├── templates/
│   │   ├── cortix_biohacker_chain.json  # Banner canvas template (13 nodes)
│   │   ├── demo_muscle_gain.json        # Research canvas (27 nodes, 33 connections, 6 node types)
│   │   ├── protocol_bpc157.json
│   │   ├── protocol_tb500.json
│   │   ├── protocol_semax.json
│   │   ├── protocol_ghkcu.json
│   │   ├── aai_ml.json
│   │   ├── action_architecture.json
│   │   ├── architecture.json
│   │   ├── llmapp.json
│   │   └── llm_app_notes.md / README.md
│   ├── icons/                           # Folder PNG icons (premium, clay, color, gradient × 3 view angles)
│   ├── issues/                          # 14 UUID-named issue folders with cover.webp + pages/
│   ├── canvas_logo.png                  # Transparent logo — canvas top-left, height: 70px
│   ├── hero-banner.png                  # Unused legacy banner
│   ├── hero-banner2.png                 # Unused legacy banner
│   ├── hero-banner3.png                 # Unused legacy banner
│   └── hero-banner4.png                 # ACTIVE — 4800x400 @2x retina, full-width, unoptimized
├── data/issues.json                     # Publication metadata
├── scripts/render-pages.mjs
├── docs/
│   ├── PROJECT_MASTER.md                # THIS FILE — single source of truth
│   ├── HANDOFF_003.md / HANDOFF_004.md / HANDOFF_005.md / HANDOFF_006.md
│   ├── CLAUDE_CONTINUE-1.md / CLAUDE_CONTINUE2.md
│   └── PlanningButton_COMPONENT.jsx     # Archived component reference
├── HANDOFF_003.md                       # Root-level copy (legacy)
├── components.json                      # shadcn/ui config
├── jsconfig.json / tsconfig.json
├── middleware.ts
├── next.config.mjs
├── next-env.d.ts
├── postcss.config.js
├── tailwind.config.js
├── package.json
└── .env.local                           # Never committed to git
```


---

## 5. Pages & Features

### Dashboard — `/(website)`
- Hero banner: `hero-banner4.png` — full-width, 4800x400, unoptimized
- AnalyticalChain React Flow overlay on banner (loads `cortix_biohacker_chain.json`)
- Publications grid
- Navigation to all sections

### Bookshelf — `/bookshelf`
- Hero banner: `hero-banner4.png` + AnalyticalChain overlay
- Shelf sections: Peptide Journal Publications, My Documents
- PDF flipbook viewer — magazine-style reading
- Planned: 8 category shelves

### Lab — `/lab` — Health Data Vault
- Hero banner: `hero-banner4.png` + AnalyticalChain overlay
- Folder system with `folder-dynamic-premium.png` icons
- Ghost folder (+ button) → naming state → creates folder
- Three-action icons on folder click: delete (red), upload (blue), open (green)
- Open folder panel → slide-up showing contents (NOT STARTED)
- Results shelf — appears when `pj_lab_results` has entries (NOT STARTED)

### Protocols — `/protocols`
- Sidebar: categorized peptide list — section headers as non-clickable dividers
- Custom scroll list (AnimatedList REMOVED from this page)
- CardSwap right panel: cycles Overview / Stack Notes / Administration / Dosing
- Layout is LOCKED — do not change

### Research/Canvas — `/research`
- React Flow canvas — analytical engine, 6 registered node types:
  - `pill` — compact single row: icon + name + sub
  - `engine` — large prominent: icon + name + tech + description
  - `database` — rounded rectangle: icon + name + tech
  - `router` — diamond (rotated 45deg), 4 handles (LRTB)
  - `output` — compact with icon box: icon + name + sub
  - `arch` — full detail: icon + name + sub + tech + description + 3-dot menu
- Active template: `demo_muscle_gain.json` — 27 nodes, 33 connections
- Edge colors: data=#f97316, analysis=#ec4899, optimize=#a855f7, safety=#ef4444, protocol=#22d3ee
- Animated dashed edges with drop-shadow glow
- Canvas logo: `canvas_logo.png` top-left, height: 70px
- Node icons: SHORT TEXT LABELS only (Rx, Cx, SM, G, P, W, L, H, Px, Ix, Ev, Fs, T, D, R, S) — NO emoji
- `.react-flow__node { background: transparent !important }` — override required

**Known open issues (fix next session):**
1. White block behind nodes — CSS override may need to move to globals.css
2. ArchNode emoji fallback `'\u{2699}'` at ~line 170 → change to `'N'`
3. All nodes should be same WIDTH (200-240px) — shape/glow/content vary, not size

### Login — `/login`
- Standalone (no TopBar, no banner)
- MagicRings full-bleed WebGL background
- Supabase email/password + Google OAuth
- Toggle: Sign In / Get Started

---

## 6. Architecture — Analytical Engine

The analytical engine runs silently. Users never see nodes or pipelines. They see inputs and outputs only.

### User Flow
```
Login → Intake Wizard (9 screens) OR Direct Upload
  → UserIntakeProfile created
  → Canvas executes silently
  → PJ articles injected as context + user health data injected
  → LLM generates cycle plan
  → Protocol Reveal output
  → Dashboard active cycle tracker
```

### Backend Architecture
```
User → LLM Web UI (Next.js)
  → API Gateway → LLM Inference API (OpenAI/Claude/local)
               → Vector DB (Pinecone/Qdrant/Supabase)
                 → Document Storage (S3/GCS)
                 → Embedding Queue Worker (Celery/BullMQ)
               → Analytics Service
               → Logging Service
  → LLM Provider (OpenAI/Gemini/Claude)
```

### LLM Strategy
- Phase 1 (now): OpenRouter → Claude
- Phase 2: Multiple models simultaneously via OpenRouter
- Phase 3: Proxmox local models via LiteLLM (Agents 13-20)
- Electron: Routes to local Proxmox stack by default

### Cycle Plan Output Schema
```typescript
interface CyclePlan {
  id: string; userId: string; createdAt: Date
  profile: UserIntakeProfile
  compounds: CompoundPlan[]
  schedule: WeeklySchedule
  cycleStructure: CycleStructure
  vialMath: VialCalculation[]
  estimatedCost: number
  citations: ArticleCitation[]
  reassessAt: Date
}
```

---

## 7. Data Layer

### Storage Strategy
- Browser (now): IndexedDB via `idb` library
- Electron (later): electron-store / SQLite dual-backend
- Remote (later): Supabase tables with Zustand sync action

### IndexedDB Stores
| Store | Contents |
|---|---|
| `pj_lab_data` | Uploaded files + metadata |
| `pj_protocols` | User-saved protocol graphs |
| `pj_results` | Saved analyses + cycle plans |
| `pj_active_cycle` | Current active cycle for dashboard |

### Zustand Slices (planned)
| Slice | Contents |
|---|---|
| `labSlice` | Folders, data cards, upload state |
| `canvasSlice` | Nodes, edges, activeDataId, activeProtocolId |
| `resultsSlice` | Result cards for results shelf |
| `cycleSlice` | Active cycle, daily log, progress |

### Cross-Component Communication Pattern (CustomEvents)
```
'pj:load-data'          Lab DataCard → Canvas
'pj:analysis-complete'  Canvas → Lab results shelf
'pj:load-protocol'      Bookshelf → Canvas
'pj:cycle-saved'        Canvas → Dashboard active cycle
```


---

## 8. Auth — Supabase

**Project URL:** `https://broibjghfccxsjcrcviy.supabase.co`

| File | Purpose |
|---|---|
| `utils/supabase/client.ts` | Browser client |
| `utils/supabase/server.ts` | Server client with cookies |
| `middleware.ts` | Route guard — no session → /login |
| `app/auth/callback/route.ts` | OAuth code exchange |

Auth end-to-end verified working on localhost. Google OAuth configured.

---

## 9. Intake Wizard

**Route:** `/wizard` (not yet built)
**Concept:** MagicRings orb as interviewer. One question per screen.

### 9-Screen Flow
| Screen | Question | Input Type |
|---|---|---|
| 1 | "What brings you here?" | 6 goal cards |
| 2 | Goal depth | Cards or body silhouette |
| 3 | Condition detail | Timeline scrubber + severity dial |
| 4 | Body data | Weight wheel + age wheel + sex cards |
| 5 | Experience level | 3 cards |
| 6 | Route preference | SubQ / Oral / Either |
| 7 | Timeline & constraints | Multi-select toggles |
| 8 | Lab data upload | Upload or skip |
| 9 | Analysis loading | Canvas visible briefly |

### Orb Color States
| Goal | color | colorTwo |
|---|---|---|
| Default | `#fc42ff` | `#42fcff` |
| Injury | `#ff4242` | `#ff9f42` |
| Cognitive | `#42fcff` | `#4287ff` |
| Build/Perform | `#fcff42` | `#42ff8c` |
| Loading | `#ffffff` | `#fc42ff` |

---

## 10. Canvas — Silent Execution Engine

Users never build nodes. Canvas is invisible infrastructure.

### Protocol Templates — `public/templates/`
- `protocol_bpc157.json`, `protocol_tb500.json`, `protocol_semax.json`, `protocol_ghkcu.json`
- `demo_muscle_gain.json` — active research page demo (27 nodes, 33 connections)
- `cortix_biohacker_chain.json` — banner overlay (13 nodes)

### Hidden Node Types
| Node | Purpose |
|---|---|
| ArticleContextNode | PJ article content → LLM context |
| UserDataNode | Lab upload content |
| AnalysisNode | LLM call — generates cycle plan |
| SummaryNode | Formats output |
| OutputNode | Fires `pj:analysis-complete` event |

### Node Execution State Machine
```
idle → running → complete
              └→ error
```

---

## 11. Locked Decisions

| Decision | Value |
|---|---|
| TopBar background | Always `#0d1117` |
| Banner placement | Above TopBar, per-page, NOT in layout or TopBar |
| Active banner file | `hero-banner4.png` — 4800x400, full-width, `unoptimized` |
| Canvas logo | `canvas_logo.png`, top-left Panel, height: 70px |
| Folder icon (created) | `folder-dynamic-premium.png` |
| Folder icon (ghost/+) | `folder-front-premium.png` |
| React Bits Folder | REMOVED — PNG icons only |
| Animation library | `framer-motion` — NOT `motion/react` |
| New file extension | `.ts` / `.tsx` |
| Existing files | Stay as `.jsx` — no forced migration |
| Supabase | Auth only for now |
| Canvas user interaction | NONE — fully premade, silent execution |
| Storage (browser) | IndexedDB — NOT localStorage for structured data |
| Planning pill | Standalone glass div in TopBar — NOT a Dock component |
| Planning pill font | Audiowide via `--font-tech` CSS variable |
| Dock wrappers | 310px fixed-width, absolute-positioned Dock inside |
| Node icons | Short text labels only (Rx, Cx, SM, etc.) — NO emoji of any kind |
| React Flow node bg | `.react-flow__node { background: transparent !important }` |
| Node width | All node types: 200-240px wide. Shape/glow/content vary, NOT size |
| Supabase key format | Legacy `eyJ...` JWT format — NOT `sb_publishable_` |

### Protocols Page Layout — LOCKED
- Sidebar: section headers (non-clickable dividers), plain scroll list, selected state highlight
- No AnimatedList component on protocols page — custom scroll list
- CardSwap on right panel
- This layout must not change

---

## 12. Build Sequence

### Completed
- [x] Dashboard page
- [x] Bookshelf + PDF flipbook viewer
- [x] Lab page — folders, upload, ghost folder, three-action icons
- [x] Protocols page — sidebar (LOCKED layout) + CardSwap
- [x] Research/Canvas — React Flow, 6 node types, demo_muscle_gain.json template
- [x] TopBar — three-dock glass HUD, standalone glass planning pill, Audiowide font
- [x] AnalyticalChain overlay — interactive React Flow banner on home/bookshelf/lab
- [x] Banner system (hero-banner4.png, full-width, per-page)
- [x] 6-theme system
- [x] Supabase auth — client, server, middleware, callback, Google OAuth
- [x] MagicRings component
- [x] Login page — working end-to-end

### Next Session — Phase 1 Completion (Priority Order)
- [ ] Fix research canvas rendering issues (white block, ArchNode emoji, node widths)
- [ ] Visual polish — vibrant wire glow, pulsing workflow animation, CortixEngine prominence
- [ ] Commit + push + deploy to CT200
- [ ] Lab: open folder panel (slide-up, file list, Analyze button per file)
- [ ] Lab: results shelf (appears when pj_lab_results has entries)
- [ ] Install idb + zustand: `npm install idb zustand`
- [ ] `lib/db/indexeddb.ts` — stores: pj_lab_data, pj_results
- [ ] `lib/store/labSlice.ts`, `lib/store/canvasSlice.ts`
- [ ] CT200 production URL → add to Supabase redirect URLs

### Phase 2 — Canvas Integration
- [ ] DataCard "Analyze in Canvas" → CustomEvent → canvas loads data
- [ ] Canvas "Save Analysis" → writes to pj_results
- [ ] Lab results shelf wired to pj_results
- [ ] Protocol execution skeleton

### Phase 3 — LLM Integration
- [ ] OpenRouter API client
- [ ] Article tagging + context injection
- [ ] Cycle plan generator

### Phase 4 — Intake Wizard
- [ ] `/wizard` route + standalone layout
- [ ] 9-screen flow with MagicRings orb
- [ ] UserIntakeProfile builder → engine → protocol reveal

### Phase 5 — Electron Conversion
- [ ] Electron shell, electron-store/SQLite, IPC bridge, MCP tools

### Phase 6 — Mobile (React Native/Expo)
- Shared: TypeScript interfaces, Zustand stores, Supabase client
- Mobile-specific: Navigation, AsyncStorage, native components, push notifications

---

## 13. Deployment

### Windows → Proxmox Workflow
```
1. Build and test on Windows (localhost:3000)
2. git add . && git commit -m "description"
3. git push origin main
4. ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
5. Verify at http://[CT200-IP]:3030
```

### PM2 Commands
```bash
ssh ct200 "pm2 status"
ssh ct200 "pm2 logs peptide-journal"
ssh ct200 "pm2 restart peptide-journal"
```

---

## 14. Environment Variables

`.env.local` — never committed to git.

```
NEXT_PUBLIC_SUPABASE_URL=https://broibjghfccxsjcrcviy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key — legacy eyJ... format]
```

Future:
```
OPENROUTER_API_KEY=[from openrouter.ai]
NEXT_PUBLIC_APP_URL=http://[CT200-IP]:3030
```

---

## 15. Do Not

- Do not add banner to `TopBar` or `layout.jsx`
- Do not use `motion/react` — use `framer-motion`
- Do not run Linux commands directly in PowerShell — wrap with `ssh ct200 "..."`
- Do not change TopBar background from `#0d1117`
- Do not let users interact with canvas nodes
- Do not use localStorage for structured data — use IndexedDB
- Do not use brain emojis, dollar sign icons, heart icons, or ANY emojis anywhere
- Do not run `npm audit fix --force`
- Do not commit `.env.local`
- Do not use `sb_publishable_` Supabase key format — use legacy `eyJ...` JWT
- Do not put emoji in node icons — text labels only
- Do not change Protocols page layout — it is LOCKED

---

*This document is the single source of truth for the Peptide Journal project. Update at the end of every session.*
