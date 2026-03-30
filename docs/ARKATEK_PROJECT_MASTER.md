# ArkatekBuilder — Project Master Document
**Last Updated:** March 30, 2026  
**Status:** Active Development  
**Repository:** https://github.com/KodeRacer5/ArkatekBuilder  
**Local Path:** `C:\Developer_main\Projects\ArkatekBuilder`  
**Dev Server:** `localhost:3002`  
**Stack:** Next.js 14 · React · TypeScript/JSX · Tailwind · React Flow · Framer Motion

---

## 1. What ArkatekBuilder Is

ArkatekBuilder is the **Financial Power Pack** of the CortixEngine platform family.

It is **not** a financial report generator. It is **not** a score. It is not a ChatGPT wrapper.

It produces a **Living Financial Position** — a continuously optimizing, AI-driven financial intelligence system that:

1. Connects to every financial data source a business uses
2. Queries government databases for grants, credits, and rebates automatically
3. Maps everything across six APEX verticals in real time
4. Surfaces opportunities ranked by dollar impact
5. Updates continuously as new data flows in
6. Never goes stale — it's alive

### Product Hierarchy

| Layer | Name |
|---|---|
| Division | CortixEngine Financial |
| Product | ArkatekBuilder |
| Tagline | Adaptive Financial Intelligence System |
| Assessment Framework | APEX — Adaptive Position & Exposure Analysis |
| Verticals | Debt · Retirement · Expense · Asset · Money · Security |

---

## 2. Strategic Architecture

### The CortixEngine Stack

```
CortixEngine (model-agnostic AI delivery layer)
    └── Financial Power Pack: ArkatekBuilder
            └── APEX Framework (6 verticals)
                    └── Living Financial Position (output)
```

**Key differentiator:** CortixEngine does NOT use ChatGPT as a lookup tool.  
It owns proprietary vector databases, curated and validated, running 24/7.  
Generic models read 1,000 pages to answer one question. CortixEngine reads 3% — because the data is pre-structured before the model sees it.

### The Living Financial Position Concept

Not a one-time assessment. A living system:

```
CONNECT → QUERY → MAP → RANK → UPDATE → ADVISE
   |          |       |       |        |         |
All 20    Gov DBs  6 APEX  Dollar  Real-time  Advisor
sources   auto    verticals impact  updates   approves
```

### Market Validation (sourced)

| Stat | Source |
|---|---|
| $129B AI wealth management market by 2034 | InsightAce Analytic |
| $1.2T AI value add in finance by 2030 | McKinsey |
| 100K advisor shortage coming | McKinsey Feb 2025 |
| $3T corporate productivity from agentic AI | KPMG 2025 |
| 25–35% advisory cost reduction | KPMG |
| 40–50% prospecting time reduction | KPMG |
| 3.5× ROI per $1 invested in agentic AI | KPMG |
| 58% of financial institutions attribute revenue growth to AI | McKinsey |


---

## 3. Integration Infrastructure

### Private Data Sources (10)

| Integration | Domain | APEX Verticals | Auth |
|---|---|---|---|
| QuickBooks | quickbooks.intuit.com | All | OAuth |
| Plaid | plaid.com | Debt · Money | API Key |
| Gusto | gusto.com | Retirement · Security | API Key |
| Stripe | stripe.com | Money | API Key |
| Ramp | ramp.com | Expense | API Key |
| Salesforce | salesforce.com | Money · Asset | OAuth |
| ADP | adp.com | Retirement · Security | API Key |
| Xero | xero.com | Debt · Expense · Money | OAuth |
| NetSuite | netsuite.com | All | API Key |
| HubSpot | hubspot.com | Money · Asset | OAuth |

### Government Databases (10)

| Integration | Domain | APEX Verticals | Auth |
|---|---|---|---|
| IRS e-Services | irs.gov | Money · Security | EIN |
| SBA Lender Match | sba.gov | Debt | EIN |
| Grants.gov | grants.gov | Money · Debt | EIN |
| SBIR / STTR | sbir.gov | Money | EIN |
| DSIRE Energy | dsireusa.org | Expense | API Key |
| SAM.gov | sam.gov | Security · Money | EIN |
| SEC / EDGAR | sec.gov | Security · Asset | EIN |
| DOL / ERISA | dol.gov | Retirement · Security | EIN |
| State Incentives DB | dsireusa.org | Expense · Money | API Key |
| US Treasury / FinCEN | treasury.gov | Security | EIN |

### What Each Government Integration Delivers

- **IRS** — R&D credit eligibility, SETC qualification, FICA reduction flags, retroactive credit identification
- **SBA** — 7(a), 504, microloan pre-qualification in real time
- **Grants.gov** — Active federal grant programs matched by NAICS code and state
- **SBIR** — Phase I and Phase II R&D funding eligibility
- **DSIRE** — Utility rebates, deregulation savings, energy efficiency programs by state
- **SAM.gov** — Government contract eligibility, set-aside qualifications, entity registration
- **EDGAR** — Entity verification, ownership structure, compliance filings
- **DOL/ERISA** — 401k fee benchmarking, FICA audit flags, wage classification
- **State Incentives** — Workforce training grants, hiring credits, economic development programs
- **Treasury** — BOI reporting status, BSA compliance, sanctions screening

---

## 4. APEX Verticals

| Vertical | Color | Focus |
|---|---|---|
| Debt | `#fb4934` Red | Restructuring · SBA Match · Credit Lines |
| Retirement | `#d3869b` Pink | 401k · GOALL · IUL Comparison |
| Expense | `#fabd2f` Yellow | Energy · Healthcare · Payroll |
| Asset | `#8ec07c` Green | Protection · Optimization · Growth |
| Money | `#83a598` Teal | R&D Credits · SETC · FICA |
| Security | `#b8bb26` Lime | Cyber · Compliance · Risk |

---

## 5. UI Architecture

### Design System

- **Theme:** Gruvbox Dark (full token system)
- **Primary font:** Syne 800 (display/headings)
- **Body font:** DM Sans 300–600
- **Mono font:** DM Mono 400–500
- **Colors:** All defined in `app/_styles/gruvbox-dark-theme.css`
- **Icons:** No emoji. No brain, dollar, or heart icons.

### Gruvbox Core Tokens

```css
--gb-bg:        #282828   /* base background */
--gb-bg-soft:   #32302f   /* panel background */
--gb-bg-1:      #3c3836   /* elevated surface */
--gb-fg:        #ebdbb2   /* primary text */
--gb-fg-mid:    #a89984   /* secondary text */
--gb-yellow:    #d79921   /* primary accent */
--gb-yellow-hi: #fabd2f   /* bright yellow */
--gb-teal:      #458588   /* government/info */
--gb-green:     #b8bb26   /* success/connected */
--gb-red:       #fb4934   /* debt/urgent */
```


---

## 6. What We Built — Component Inventory

### 6.1 HTML Prototype (Design Reference)
**Location:** `app/_components/ui/New folder/dreams-chat-node.html`  
**Purpose:** Full fidelity design prototype — used to lock all visual decisions before TSX conversion.  
**Status:** Design locked. Not deployed. Replaced by the Next.js page.

**What it contains:**
- Arc navigation dock bar with Framer Motion-style dock magnification (vanilla JS)
- Left sidebar: ArkatekBuilder logo, vertical channel list, Active Connections panel
- Center: APEX chat interface with empty state, message list, data gap pills, chip prompts
- Right panel: Vertical scoring ring cards (0–4 scale, tap to advance)
- Integration hub: Full-width panel, 20 integrations, real favicons from Google favicon CDN
- About page: Inlined as `renderAboutPage()` function
- Integrations hub: `renderIntegrationsHub()` with 5-column grid
- Connection modal: Fixed center overlay with backdrop
- Government database integrations: IRS, SBA, Grants.gov, SBIR, DSIRE, SAM, EDGAR, DOL, State Inc, Treasury

**Naming locked in prototype:**
- `general` → renamed to `Position`
- `Analysis` → renamed to `APEX`
- `DREAMS Intelligence` → `APEX Intelligence`
- `Run full DREAMS assessment` → `Build Living Financial Position`
- `Identify missing data fields` → `Find Optimization Opportunities`
- `Estimate savings potential` → `Estimate Annual Savings Impact`

---

### 6.2 About Page (Standalone)
**Location:** `app/_components/ui/New folder/arkatek-about.html`  
**Also at:** `/mnt/user-data/outputs/arkatek-about.html`

**Content sections:**
1. Hero — "The Financial Position That Never Goes Stale" + animated stat counters
2. The Problem — Old way vs ArkatekBuilder side-by-side
3. Living Financial Position — 6-step visual (Connect → Query → Map → Rank → Update → Advise)
4. Integration Showcase — All 20 logos with real favicons
5. KPMG Quote Block
6. Market Opportunity — 6 stat cards with sourced data
7. Advisor Impact — split layout, 5 metrics
8. Tech Differentiators — Proprietary databases vs ChatGPT wrappers
9. CTA — "This isn't financial software. It's a financial operating system."

---

### 6.3 APEX Canvas Page (Active)
**Location:** `app/(pages)/APEX/page.jsx`  
**Route:** `localhost:3002/APEX`  
**Status:** Active, rendering, nodes visible

**Architecture:**
```
APEXPage (ReactFlowProvider wrapper)
  └── APEXPageInner
        ├── TopBar (site nav + APEX vertical switcher center pill)
        ├── APEXCanvas (React Flow canvas, below TopBar at top:74px)
        │     ├── IntegrationNode (×8) — private + gov, favicon logos
        │     ├── APEXHubNode (×1) — center APEX Intelligence hub
        │     ├── VerticalNode (×6) — Debt/Retirement/Expense/Asset/Money/Security
        │     └── OutputNode (×4) — Living Position/Grants/Tax Credits/APEX Report
        └── BottomStrip — 6 vertical thumbnail cards
```

**TopBar layout:**
- Left dock: Journal · Bookshelf · Protocols · Research · About (site nav, Framer Motion magnification)
- Center pill: "APEX Financial Engine" + D·R·E·A·M·S vertical switcher buttons
- Right dock: New · Integrations · Schedule · Export · Chat (→ /Message_Board)

**Background:** CSS grid lines `rgba(69,133,136,0.07)` at 60px spacing on `#1d2021`  
**ReactFlow config:** `defaultViewport {x:120, y:60, zoom:0.85}` + `onInit fitView` after 150ms

---

### 6.4 DREAMScore Page (Existing)
**Location:** `app/(pages)/DREAMScore/page.jsx`  
**Route:** `localhost:3002/DREAMScore`  
**Status:** Existing canvas page with node palette system

**What it has:**
- React Flow canvas with rect/circle node types
- PALETTE system: INTAKE / ANALYSIS / SCORING / OUTPUT categories
- Node types: Business Profile, Financial Data, Benefits Data, Debt Analyzer, Retirement Optimizer, etc.
- Scoring simulation via `simulateNode()`

---

### 6.5 Existing Components Used

| Component | Path | Used By |
|---|---|---|
| `Dock.jsx` | `app/_components/ui/dashboard/Dock.jsx` | TopBar (Framer Motion spring magnification) |
| `Dock.css` | `app/_components/ui/dashboard/Dock.css` | Dock styling, gruvbox CSS variables |
| `top-bar.jsx` | `app/_components/ui/dashboard/top-bar.jsx` | Reference for site nav pattern |
| `MagicRings.jsx` | `app/_components/ui/MagicRings.jsx` | Three.js radial scoring wheel (planned) |
| `gruvbox-dark-theme.css` | `app/_styles/gruvbox-dark-theme.css` | Full CSS variable token system |
| `synthesizer/` | `app/_components/ui/synthesizer/` | Full React Flow canvas engine (existing) |


---

## 7. File Structure

```
ArkatekBuilder/
├── app/
│   ├── (pages)/
│   │   ├── APEX/
│   │   │   └── page.jsx              ← APEX canvas home page (active)
│   │   ├── DREAMScore/
│   │   │   └── page.jsx              ← Existing DREAMS canvas (reference)
│   │   ├── Message_Board/
│   │   │   └── page.jsx              ← Full message board UI (1606 lines, working)
│   │   ├── about/
│   │   ├── bookshelf/
│   │   ├── protocols/
│   │   ├── research/
│   │   └── layout.jsx
│   ├── _components/
│   │   └── ui/
│   │       ├── dashboard/
│   │       │   ├── Dock.jsx          ← Framer Motion spring dock (magnification)
│   │       │   ├── Dock.css          ← Dock gruvbox styles
│   │       │   └── top-bar.jsx       ← Site nav bar reference
│   │       ├── MagicRings.jsx        ← Three.js radial ring component (planned use)
│   │       ├── synthesizer/          ← Full canvas engine (existing)
│   │       └── New folder/
│   │           ├── dreams-chat-node.html   ← HTML prototype (design reference)
│   │           └── arkatek-about.html      ← About page standalone
│   ├── _lib/
│   │   └── store/
│   │       └── dreamsStore.js        ← VSCORES state management
│   └── _styles/
│       ├── globals.css
│       └── gruvbox-dark-theme.css    ← Full gruvbox token system
├── docs/
│   ├── ARKATEK_PROJECT_MASTER.md     ← This document
│   ├── HANDOFF_003.md
│   ├── HANDOFF_004.md
│   ├── HANDOFF_005.md
│   └── HANDOFF_006.md
├── public/
│   └── icons/
│       └── CortixHealth_icon.svg
├── .gitignore                        ← node_modules, .next, nul excluded
├── package.json                      ← arkatek-builder
└── tailwind.config.js
```

---

## 8. Git Status

**Repository:** https://github.com/KodeRacer5/ArkatekBuilder  
**Branch:** main  
**Commit:** `72a0c06` — "Initial commit — ArkatekBuilder DREAMS node + APEX integration stack"  
**Files committed:** 558  
**Status:** Clean — `nothing to commit, working tree clean`

**How the initial commit was fixed:**
- Problem 1: `nul` file (Windows NUL device artifact) — added to `.gitignore`
- Problem 2: `node_modules` not ignored — created `.gitignore` before `git add`
- Problem 3: LF/CRLF warnings — harmless on Windows, not errors
- Result: Clean push to origin/main

---

## 9. Canvas Architecture Vision

### The Home Page Concept

The ArkatekBuilder home page IS the React Flow canvas — full screen, edge to edge. The canvas is the operating system. Nodes float on it. The user interacts with the financial intelligence system directly through nodes.

**Reference:** The existing DREAM Score Engine page at `/DREAMScore` demonstrates this exact pattern — three-dock top bar, full-screen canvas, node thumbnails at bottom.

### Target Layout (from reference image)

```
┌─────────────────────────────────────────────────────────┐
│  [Left Dock]    [APEX Financial Engine pill]  [Right Dock]│  ← TopBar 74px
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ●━━━━━━━━●━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━●           │
│ [MagicRing]   [APEX Chat Node — center]   [Options Ring]│
│  node         full chat interface          node         │
│                                                         │
│  CSS grid background (#1d2021 + teal lines 60px)       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│    [D] [R] [E] [A] [M] [S]   ← Bottom strip (thumbnails)│
└─────────────────────────────────────────────────────────┘
```

### Planned Node Types

| Node | Description | Status |
|---|---|---|
| `IntegrationNode` | Integration source with favicon + status | Built |
| `VerticalNode` | APEX vertical score card with progress bar | Built |
| `APEXHubNode` | Center intelligence hub (placeholder) | Built |
| `OutputNode` | Output report card | Built |
| `APEXChatNode` | Full chat interface embedded in canvas | Planned |
| `MagicRingsNode` | Three.js radial score wheel (left) | Planned |
| `OptionsRingNode` | Three.js radial options wheel (right) | Planned |

### The Bottom Thumbnail Strip

Mirrors the reference image exactly — each open node window has a thumbnail card at the bottom of the canvas. Clicking a thumbnail focuses/expands that node.

---

## 10. Navigation Design

### Naming Decisions (Final)

| Before | After | Reason |
|---|---|---|
| General | Position | Maps directly to "Living Financial Position" |
| Analysis | APEX | Branded framework name |
| DREAMS Intelligence | APEX Intelligence | Old name retired |
| DREAM Score | APEX Score | Rebranded |

### Nav Bar Rules

- Left dock: Site navigation (Journal, Bookshelf, Protocols, Research, About)
- Center: Product-specific — APEX vertical switcher (D·R·E·A·M·S)
- Right dock: Actions (New, Integrations, Schedule, Export, Chat)
- No "Configure" in primary nav — belongs in settings
- No "New" as a primary action — redundant with clicking a vertical

### Strict Design Rules

- **Never use:** brain icons, dollar sign icons, heart icons, or any emoji in UI
- **Always use:** Syne 800 for ArkatekBuilder wordmark
- **"Arkatek"** in `#ebdbb2` cream, **"Builder"** in `#fabd2f` yellow
- **"CortixEngine"** — one word, capital C, capital E
- Gruvbox theme everywhere — no blue-dark overrides

---

## 11. Key Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| HTML prototype vs TSX | Move to TSX | HTML was accumulating structural debt |
| State management | React useState/useReducer | No Redux needed yet |
| Canvas library | React Flow (@xyflow/react) | Already in project, production-grade |
| Dock magnification | Framer Motion (Dock.jsx) | Already built, works natively |
| Node thumbnails | Bottom strip component | Matches reference design |
| About page | Standalone HTML + inlined in node | Dual-use: sharelink + embedded |
| Integration layout | 4-column grid → full hub panel | Investor readability |
| Government DBs | 10 real endpoints | Differentiator vs competitors |
| Canvas background | CSS grid lines (teal, 60px) | Matches design language |

---

## 12. Pending Work

### Immediate
- [ ] Fix canvas node visibility / fitView on page load
- [ ] Build `APEXChatNode` — full chat interface embedded as React Flow node
- [ ] Build `MagicRingsNode` — Three.js radial scoring wheel as canvas node
- [ ] Connect bottom thumbnail strip to actual node instances
- [ ] Wire "Build Living Financial Position" prompt to APEX analysis

### Near Term
- [ ] Integration connection modal — paste EIN/API key → animate connection state
- [ ] APEX vertical scoring — connect real logic from `dreamsStore.js`
- [ ] About page as a route `/about` with full content
- [ ] Export/Report generation from APEX scores
- [ ] Deploy production build to Proxmox CT200 (port 3030)

### Architecture
- [ ] `APEXChatNode.tsx` — proper TypeScript component
- [ ] `useAPEXStore.ts` — Zustand store for VSCORES, connections, messages
- [ ] API route for APEX analysis (OpenRouter integration)
- [ ] Integration connection persistence (currently simulated)

---

## 13. Session Notes — March 30, 2026

**What we accomplished this session:**
1. Built full HTML prototype (dreams-chat-node.html) with all design decisions locked
2. Designed complete integration stack — 10 private + 10 government sources
3. Researched and sourced all market statistics (KPMG, McKinsey, InsightAce)
4. Built standalone About page (arkatek-about.html) — investor-grade
5. Initialized GitHub repository (KodeRacer5/ArkatekBuilder) — 558 files pushed
6. Built APEX canvas page (app/(pages)/APEX/page.jsx) — React Flow working
7. Wired site TopBar to APEX page — navigation connected
8. Fixed all git issues (nul file, node_modules, CRLF warnings)
9. Locked all naming: Position, APEX, Living Financial Position, CortixEngine Financial
10. Documented canvas architecture vision and node layout plan

**Current state:**
- `/APEX` route: Canvas renders, nodes visible, fitView working
- TopBar: Left dock → site pages, Center → vertical switcher, Right dock → actions
- Background: CSS grid lines matching reference design
- Nodes: Integration favicons, vertical score cards, APEX hub, output nodes, edges

