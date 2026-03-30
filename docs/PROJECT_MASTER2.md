# Peptide Journal — Master Project Document
**Last Updated:** March 17, 2026
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
| Python scoring API | Port 8000 (local + CT200) | Metabolic Engine scoring |

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
| State | Zustand (installed via `@xyflow/react` dep — no separate install needed) |
| Storage (planned) | IndexedDB via `idb` |
| Scoring API | Python FastAPI on port 8000 (`Python_meto_engine/`) |
| LLM (first) | OpenRouter API → Claude |
| LLM (future) | Proxmox local models via LiteLLM |
| Vector DB (future) | Pinecone / Qdrant / Supabase pgvector |
| PDF rendering | pdfjs-dist, react-pdf, react-pageflip |
| UI primitives | Radix UI, shadcn/ui |
| Icons | Lucide React, React Icons |
| Theme system | CSS vars (`gruvbox-dark-theme.css`) + `data-theme` on `<body>` |
| Future runtime | Electron (local memory, MCP tools, local models) |

---

## 4. Repository & File Structure

```
/
├── app/
│   ├── (pages)/
│   │   ├── (website)/page.jsx           # Dashboard — hero banner + AnalyticalChain overlay + publications grid
│   │   ├── bookshelf/page.jsx           # Bookshelf — publications + user docs + AnalyticalChain overlay
│   │   ├── lab/page.jsx                 # Health Data Vault — folders, uploads + AnalyticalChain overlay
│   │   ├── protocols/page.jsx           # Protocol sidebar + CardSwap viewer
│   │   ├── research/page.jsx            # Canvas — React Flow analytical engine (6 node types)
│   │   ├── about/page.jsx               # About page
│   │   ├── Meto_Engine/
│   │   │   ├── page.jsx                 # LIVE — split-screen intake + 7-node ReactFlow pipeline
│   │   │   ├── layout.jsx               # Standalone layout — no shared wrappers
│   │   │   ├── index.tsx                # DEAD — not used by App Router (can delete)
│   │   │   ├── engine_config.json       # Front-end copy of engine config
│   │   │   └── components/
│   │   │       ├── MetaNodes.jsx        # All 7 canvas node types (Gruvbox themed)
│   │   │       ├── ProfileSection.tsx
│   │   │       ├── VitalsSection.tsx
│   │   │       ├── LifestyleSection.tsx
│   │   │       ├── SymptomsSection.tsx  # Full 25 symptoms across 5 triads
│   │   │       ├── LabsSection.tsx
│   │   │       └── NotesSection.tsx
│   │   └── layout.jsx                   # Shared layout — fonts, providers, theme init script
│   ├── login/
│   │   ├── layout.tsx                   # Standalone — no TopBar, no banner
│   │   └── page.tsx                     # Login — MagicRings + Supabase auth
│   ├── auth/callback/route.ts           # OAuth callback handler
│   ├── api/
│   │   ├── issues/route.js
│   │   ├── issues/[id]/
│   │   ├── files/[...path]/
│   │   └── upload/route.js
│   ├── _components/ui/
│   │   ├── MagicRings.jsx
│   │   ├── dashboard/
│   │   │   ├── top-bar.jsx              # TopBar — "Plan My Cycle Now" → /Meto_Engine
│   │   │   ├── AnalyticalChain.jsx      # Banner canvas — shows live Meto nodes from store
│   │   │   ├── chat-input.jsx
│   │   │   ├── Dock.jsx / Dock.css      # Framer Motion dock (CSS var themed)
│   │   │   ├── PlanningButton.jsx
│   │   │   └── ...
│   │   ├── protocols/
│   │   │   ├── CardSwap.jsx / CardSwap.css
│   │   │   └── AnimatedList.jsx / AnimatedList.css
│   │   └── lab/
│   ├── _lib/
│   │   ├── utils.js
│   │   └── store/
│   │       └── metoStore.js             # Zustand store — global assessment results (persisted)
│   ├── _providers/
│   │   ├── shelf-theme-context.jsx      # 7-theme system — sets data-theme on body
│   │   ├── theme-provider.jsx
│   │   └── nprogress-provider.jsx
│   ├── _styles/
│   │   ├── globals.css                  # Tailwind base + body uses --canvas-bg
│   │   └── gruvbox-dark-theme.css       # All CSS vars — defaults + Gruvbox overrides
│   └── _backups/pre-gruvbox/            # Pre-Gruvbox file backups
├── utils/supabase/
│   ├── client.ts
│   └── server.ts
├── middleware.ts                        # Route guard — unauthenticated → /login
├── Python_meto_engine/
│   ├── main.py                          # FastAPI — POST /score, GET /health, CORS enabled
│   ├── scoring.py                       # Pure scoring logic (lab + non-lab modes)
│   ├── engine_config.json               # 5 triads, ranges, weights, risk bands
│   ├── requirements.txt                 # fastapi, uvicorn, pydantic, python-multipart
│   └── .venv/                           # Python virtual environment
├── public/
│   ├── templates/                       # ReactFlow JSON templates
│   ├── issues/                          # 14 UUID-named issue folders
│   ├── canvas_logo.png
│   └── hero-banner4.png                 # ACTIVE — 4800x400, full-width, unoptimized
├── data/issues.json
├── docs/
│   ├── PROJECT_MASTER.md                # THIS FILE
│   ├── README_Meto_Engine.md            # Meto Engine developer reference
│   ├── THEME_SYSTEM.md                  # Theme switching reference + bug fixes
│   └── HANDOFF_*.md
└── .env.local                           # Never committed to git
```

---

## 5. Pages & Features

### Dashboard — `/(website)`
- Hero banner: `hero-banner4.png` — full-width, 4800x400, unoptimized
- `AnalyticalChain` overlay — live Meto pipeline nodes from global store
- Publications grid + list view
- TopBar with "Plan My Cycle Now" → `/Meto_Engine`

### Bookshelf — `/bookshelf`
- 3D book flip cards, 6 shelf themes (+ Gruvbox)
- User document upload (PDF)
- Theme switcher dots

### Lab — `/lab`
- Folder system with PNG icons
- File upload, ghost folder (+)
- Three-action icons per file

### Protocols — `/protocols`
- Sidebar: section headers + scroll list (LOCKED layout)
- CardSwap viewer — 66 protocols across 8 categories
- No AnimatedList component

### Research — `/research`
- React Flow canvas — 6 node types, demo template
- Think Tank mode
- Protocol templates loadable via `?protocol=` param

### Meto Engine — `/Meto_Engine`
- Split screen: intake form (left) + ReactFlow pipeline (right)
- 7 canvas node types: Config → Input × 5 → Engine → Flags → Score × 5 → Result → Storage
- In-app JS scoring engine (lab + non-lab modes)
- Writes results to Zustand store → banner canvas updates on all pages
- Python FastAPI on port 8000 for server-side scoring (optional)

---

## 6. Architecture — Analytical Engine

The banner canvas (`AnalyticalChain.jsx`) reads from `metoStore` (Zustand, persisted).
When store has results → shows live Meto triad nodes. Empty → shows demo cortix chain.
Click triad node → popover with score + "Open Full Canvas" → `/Meto_Engine`.

---

## 7. Data Layer

| Store | Contents | Persistence |
|---|---|---|
| `metoStore` (Zustand) | Last assessment results + form | localStorage (`pj_meto_store`) |
| `pj_lab_data` | Lab data items | localStorage |
| `pj_lab_folders` | Folder structure | localStorage |
| `pj_user_docs` | User uploaded PDFs | localStorage |
| `pj_shelf_theme` | Active theme index | localStorage |
| `pj_chain_viewport` | Banner canvas viewport | localStorage |

---

## 8. Auth — Supabase

| File | Role |
|---|---|
| `utils/supabase/client.ts` | Browser client |
| `utils/supabase/server.ts` | Server client with cookies |
| `middleware.ts` | Route guard — no session → /login |
| `app/auth/callback/route.ts` | OAuth code exchange |

Auth end-to-end verified working on localhost. Google OAuth configured.
CT200 production URL must be added to Supabase redirect URLs.

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

---

## 10. Canvas — Silent Execution Engine

Users never build nodes. Canvas is invisible infrastructure.

### Protocol Templates — `public/templates/`
- `protocol_bpc157.json`, `protocol_tb500.json`, `protocol_semax.json`, `protocol_ghkcu.json`
- `demo_muscle_gain.json` — active research page demo (27 nodes, 33 connections)
- `cortix_biohacker_chain.json` — banner overlay (13 nodes)

### Meto Engine Node Types
| Node | Purpose |
|---|---|
| MetaConfigNode | Assessment config — sections, triads, thresholds |
| MetaInputNode | User data sections (5 inputs) |
| MetaEngineNode | Scoring core — lab vs non-lab mode |
| MetaFlagNode | Floor triggers + urgent flags |
| MetaScoreNode | Per-triad composite score + sub-scores |
| MetaResultNode | Aggregated result payload + ORI |
| MetaStorageNode | IndexedDB persistence |

---

## 11. Locked Decisions

| Decision | Value |
|---|---|
| TopBar background | Always `var(--topbar-bg, #0d1117)` |
| Banner placement | Above TopBar, per-page, NOT in layout or TopBar |
| Active banner file | `hero-banner4.png` — 4800x400, full-width, `unoptimized` |
| Canvas logo | `canvas_logo.png`, top-left Panel, height: 70px |
| Folder icon (created) | `folder-dynamic-premium.png` |
| Folder icon (ghost/+) | `folder-front-premium.png` |
| Animation library | `framer-motion` — NOT `motion/react` |
| New file extension | `.ts` / `.tsx` |
| Existing files | Stay as `.jsx` — no forced migration |
| Supabase | Auth only for now |
| Canvas user interaction | NONE on research canvas — fully premade, silent execution |
| Storage (browser) | IndexedDB — NOT localStorage for structured data |
| Planning pill | Routes to `/Meto_Engine` |
| Planning pill font | Audiowide via `--font-tech` CSS variable |
| Dock wrappers | 310px fixed-width, absolute-positioned Dock inside |
| Node icons | Short text labels only (Rx, Cx, SM, etc.) — NO emoji |
| React Flow node bg | `.react-flow__node { background: transparent !important }` |
| Node width | All node types: 200-260px. Shape/glow/content vary, NOT size |
| Supabase key format | Legacy `eyJ...` JWT format — NOT `sb_publishable_` |
| Theme system | CSS vars in `gruvbox-dark-theme.css`, switched via `data-theme` on `<body>` |
| Theme default | Navy (index 0) — Gruvbox available as last option |
| Canvas bg var | `--canvas-bg` — `#0c0e14` default, `#282828` Gruvbox |
| Node bg var | `--node-bg` — `#1a1d24` default, `#32302f` Gruvbox |
| Theme reference doc | `docs/THEME_SYSTEM.md` |

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
- [x] Protocols page — sidebar (LOCKED layout) + CardSwap (66 protocols, 8 categories)
- [x] Research/Canvas — React Flow, 6 node types, demo_muscle_gain.json template
- [x] TopBar — three-dock glass HUD, standalone glass planning pill, Audiowide font
- [x] AnalyticalChain — upgraded to show live Meto nodes from global store
- [x] Banner system (hero-banner4.png, full-width, per-page)
- [x] 7-theme system (Navy, Walnut, Oak, Ebony, Steel, Slate, Gruvbox)
- [x] Supabase auth — client, server, middleware, callback, Google OAuth
- [x] MagicRings component
- [x] Login page — working end-to-end
- [x] Meto Engine page — split-screen intake + 7-node ReactFlow pipeline
- [x] Python scoring API — FastAPI, engine_config.json, CORS, /health endpoint
- [x] Zustand global store (metoStore) — persists assessment results
- [x] Gruvbox theme system — full CSS var system, switchable, zero flash on load
- [x] THEME_SYSTEM.md — complete theme reference doc

### Next Session — Priority Order
- [ ] Wire `index.tsx` POST logic into `page.jsx` (call Python /score on Run Assessment)
- [ ] Results display — triad cards + overall risk dial
- [ ] Lab: open folder panel (slide-up, file list, Analyze button per file)
- [ ] Lab: results shelf (appears when pj_lab_results has entries)
- [ ] Install idb: `npm install idb`
- [ ] `lib/db/indexeddb.ts` — stores: pj_lab_data, pj_results
- [ ] CT200 production URL → add to Supabase redirect URLs
- [ ] Python engine → run as PM2 process on CT200

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

### Python Engine on CT200
```bash
ssh ct200 "cd /opt/Peptide_Journal/Python_meto_engine && source .venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"
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
- Do not change TopBar background from `var(--topbar-bg, #0d1117)`
- Do not let users interact with research canvas nodes
- Do not use localStorage for structured data — use IndexedDB
- Do not use brain emojis, dollar sign icons, heart icons, or ANY emojis anywhere
- Do not run `npm audit fix --force`
- Do not commit `.env.local`
- Do not use `sb_publishable_` Supabase key format — use legacy `eyJ...` JWT
- Do not put emoji in node icons — text labels only
- Do not change Protocols page layout — it is LOCKED
- Do not hardcode `#0c0e14`, `#0d1117`, `#1c1f26` — use CSS vars (`--canvas-bg`, `--topbar-bg`, `--node-bg`)
- Do not create duplicate `[data-theme]` blocks in `gruvbox-dark-theme.css`

---

*This document is the single source of truth for the Peptide Journal project. Update at the end of every session.*
