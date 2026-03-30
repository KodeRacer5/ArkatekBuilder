# ArkatekBuilder — Issues, Problems & Fix Handoff
**Date:** March 30, 2026  
**Status:** Active Development — Handoff Document  
**Purpose:** Complete record of every known issue, broken path, wrong behavior, and what needs to be fixed next session  
**Repository:** https://github.com/KodeRacer5/ArkatekBuilder  
**Dev Server:** `localhost:3002` (Next.js, already running — do NOT restart)

---

## QUICK REFERENCE — Dev Environment

```
Project Root:   C:\Developer_main\Projects\ArkatekBuilder
Dev Server:     localhost:3002  (port confirmed, process already running)
Git Branch:     main
Last Commit:    c6dc857 — "docs: project master doc + APEX canvas page"
Node Modules:   Present, excluded from git
```

---

## PRIORITY 1 — CRITICAL (Blocking)

### Issue 1.1 — APEX Canvas: Nodes Rendering Off-Screen
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx`  
**Route:** `localhost:3002/APEX`  
**Symptom:** Canvas renders, background grid visible, but nodes appear as tiny yellow bars in top-right corner — all nodes are off-screen  
**Root Cause:** `fitView` fires before ReactFlow has measured node dimensions. `defaultViewport` coordinates do not match the actual node positions.

**Current broken code (APEXCanvas return):**
```jsx
defaultViewport={{ x: 120, y: 60, zoom: 0.85 }}
onInit={(instance) => {
  setTimeout(() => instance.fitView({ padding: 0.18 }), 150)
}}
```

**Fix needed:**
```jsx
// Option A — reliable: remove defaultViewport, use onInit fitView only
onInit={(instance) => setTimeout(() => instance.fitView({ padding: 0.2, duration: 400 }), 200)}

// Option B — explicit: set viewport to where nodes actually are
// INIT_NODES span x:40-1090, y:60-720
// At zoom 0.7, start viewport at x:-20, y:-20
defaultViewport={{ x: 80, y: 40, zoom: 0.65 }}
```

**Exact location in file:** Line ~418-450 (APEXCanvas function, return block)

---

### Issue 1.2 — APEXHubNode: Not Matching Design Vision
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx`  
**Symptom:** Center node is a simple flat card with vertical pills. Should be the full APEX Chat Node — a windowed interface with the chat UI, vertical tabs, and input area.  
**Design reference:** See `app/_components/ui/New folder/dreams-chat-node.html` for the full design  
**What it needs to become:** A proper React Flow node that embeds the chat interface (scrollable message list, data gap pills, chip prompts, input bar)

**Current:** 220px wide flat card  
**Target:** ~600px × ~700px windowed node matching the HTML prototype design

---


### Issue 1.3 — VerticalNode: Wrong Visual Style
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx`  
**Symptom:** Vertical score nodes (Debt, Retirement, etc.) render as flat rectangular cards with a progress bar.  
**Design reference:** Reference image shows them as **MagicRings — radial Three.js ring components** with colorful concentric arcs  
**Component that should be used:** `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\MagicRings.jsx`

**What needs to happen:**
1. Create a new `MagicRingsNode` React Flow node type
2. Embed `MagicRings` (the Three.js shader component) inside a ReactFlow node wrapper
3. Pass APEX vertical colors to the ring shader uniforms
4. Replace current `VerticalNode` with `MagicRingsNode` in `NODE_TYPES`

**MagicRings props needed:**
```jsx
<MagicRings
  color={verticalColor}      // e.g. [0.98, 0.29, 0.20] for Debt red
  colorTwo={verticalColorTwo}
  ringCount={6}
  baseRadius={0.08}
  // etc — read MagicRings.jsx for full prop list
/>
```

---

## PRIORITY 2 — Navigation & Routing (Broken)

### Issue 2.1 — TopBar Left Dock: Missing Active State
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `TopBar` function  
**Symptom:** Left dock items (Journal, Bookshelf, Protocols, Research, About) have no active/highlighted state showing which page the user is on.  
**Expected:** The APEX/home item should be highlighted when on the APEX page  
**Fix:** Add an `activePage` prop to TopBar and pass `'apex'` when on APEX page. Apply active styling to the matching dock item.

---

### Issue 2.2 — Right Dock: Integrations and New Session Not Wired
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `TopBar` rightItems  
**Symptom:** "New" and "Integrations" buttons have empty `onClick: ()=>{}` — they do nothing  
**What each should do:**
- **New** → Clear canvas / reset APEX session state
- **Integrations** → Open integrations panel (either a drawer or navigate to integrations view)
- **Schedule** → Open scheduling modal (planned)
- **Export** → Generate APEX report (planned)
- **Chat** → `window.location.href = '/Message_Board'` ✓ (already wired)

---

### Issue 2.3 — APEX Center Pill: Vertical Click Does Nothing Visible
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `TopBar` center pill  
**Symptom:** Clicking D/R/E/A/M/S vertical buttons in center pill calls `onVertical(v.id)` which sets `activeVertical` state, but the canvas node update effect isn't reliable  
**Root cause:** The `useEffect` in `APEXCanvas` that watches `activeVertical` runs correctly, but because the nodes are off-screen (Issue 1.1), the score bar change isn't visible  
**Fix:** Resolve Issue 1.1 first, then this will work. Also add visual feedback in the center pill — the active vertical button should glow in its color.

---


## PRIORITY 3 — Visual / Design Issues

### Issue 3.1 — BottomStrip: Not Matching Reference Design
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `BottomStrip` function  
**Symptom:** Bottom strip shows 6 plain vertical tiles. Reference image shows actual node thumbnail previews (miniaturized versions of the full nodes — MagicRings wheel thumbnails, chat node thumbnail, options wheel thumbnails)  
**Fix needed:** Replace simple D/R/E/A/M/S tiles with actual canvas node thumbnails. Use React Flow's `useNodes()` hook to get node positions and render miniature previews.

---

### Issue 3.2 — OutputNode: Too Dim, Not Visible
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `OutputNode` component  
**Symptom:** Output nodes (Living Financial Position, Grant Match Results, Tax Credit Finder, APEX Report) have very low contrast — hard to see on dark background  
**Fix:** Increase border opacity and glow. Change `border: 1px solid ${color}35` → `border: 1.5px solid ${color}66`. Add `boxShadow: 0 0 16px ${color}33`

---

### Issue 3.3 — Edge Colors Too Dark
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `mkEdge` function  
**Symptom:** Edges between nodes are barely visible — `stroke: ${c}66` is too transparent  
**Fix:** Change edge stroke opacity to `99` or `aa`:
```js
style:{stroke:`${c}99`, strokeWidth:2}
```
Also set `animated: true` for the integration → APEX hub edges to show data flow

---

### Issue 3.4 — Canvas Background: Grid Lines Too Faint
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `APEXCanvas` return div  
**Symptom:** CSS grid background lines are barely visible  
**Current:** `rgba(69,133,136,0.07)` — too low opacity  
**Fix:** Increase to `rgba(69,133,136,0.12)` for better visibility against `#1d2021` background

---

### Issue 3.5 — IntegrationNode: GOV badge not showing for government nodes
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\APEX\page.jsx` — `IntegrationNode`  
**Symptom:** `{gov && <div ...>GOV DB</div>}` — this works but the `gov` prop isn't showing visually distinct styling  
**Fix:** Add a top-left badge to government nodes with teal color treatment to differentiate from private integrations

---

## PRIORITY 4 — Architecture / State (Planned)

### Issue 4.1 — No Persistent State for APEX Scores
**Current:** VSCORES stored in local `useState` inside `APEXCanvas` — resets on page refresh  
**Needed:** Connect to `app/_lib/store/dreamsStore.js` (existing Zustand store) or create `app/_lib/store/useAPEXStore.ts`  
**Path:** `C:\Developer_main\Projects\ArkatekBuilder\app\_lib\store\dreamsStore.js`

---

### Issue 4.2 — No Integration Connection Persistence  
**Current:** Clicking the + button and connecting an integration has no effect beyond visual — no state stored  
**Needed:** Integration connected state stored in Zustand, persisted to localStorage  
**Where to build:** New `useIntegrationsStore.ts` or add to `dreamsStore.js`

---

### Issue 4.3 — APEX Chat Node Not Built Yet
**This is the main center node — the most important component.**  
**Design reference:** `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\New folder\dreams-chat-node.html`  
**What it needs:**
- React Flow custom node wrapper (handles drag, resize, connect)
- Left sidebar: vertical channel list (Position, APEX, Debt, Retirement, Expense, Asset, Money, Security)
- Center: Chat message list + empty state + prompt chips
- Right panel: Scoring ring card for active vertical
- Bottom: Input bar with chip buttons
- Top: Mini arc nav (General/Position, APEX, verticals)

**Planned file:** `app/_components/ui/dashboard/APEXChatNode.jsx`

---

### Issue 4.4 — No API Connection for APEX Analysis
**Current:** Chat input has no backend — messages go nowhere  
**Needed:** API route at `app/api/apex/route.js` that:
1. Takes user message + connected integrations + active vertical as context
2. Calls OpenRouter with CortixEngine Financial system prompt
3. Streams response back to chat node
**OpenRouter key:** Should come from node data prop `apiKey` (pattern from existing synthesizer)

---


---

## PRIORITY 5 — Existing Pages with Known Issues

### Issue 5.1 — DREAMScore Page: Naming Not Updated
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\DREAMScore\page.jsx`  
**Route:** `localhost:3002/DREAMScore`  
**Symptom:** Page still says "DREAM Score Engine" — should be updated to "APEX Financial Engine"  
**Also:** The center planning pill in the TopBar at `top-bar.jsx` links to `/DREAMScore` — should link to `/APEX`

**File to update:** `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\dashboard\top-bar.jsx`  
**Line ~116:** `onClick={() => window.location.href = '/DREAMScore'}`  
**Change to:** `onClick={() => window.location.href = '/APEX'}`  
**Also change label:** `"DREAM Score Engine"` → `"APEX Financial Engine"`

---

### Issue 5.2 — HTML Prototype: Broken Local File
**Files:**  
- `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\New folder\dreams-chat-node.html`  
- `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\New folder\arkatek-about.html`  

**Symptom:** When opened as local HTML files, multiple things break:
- `location.reload()` in `sw()` restore path kills all state
- `_centerTemplate` is empty because `DOMContentLoaded` fires after template capture  
- The connection modal `position:absolute` bleeds over center content  
- Dock magnification uses vanilla JS that doesn't fire correctly  
- About page iframe approach blocked by same-origin policy  

**These are DESIGN REFERENCE FILES only — do not fix, do not deploy.**  
All functionality should be built in the Next.js project instead.

---

### Issue 5.3 — TopBar CSS: `top-bar.jsx` Gruvbox Theme Not Applied  
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\_components\ui\dashboard\top-bar.jsx`  
**Symptom:** TopBar background uses `var(--topbar-bg, #0d1117)` — dark blue/black, not gruvbox  
**Fix:** When `data-theme="gruvbox"` is active, `--topbar-bg` should resolve to `var(--gb-bg-soft)` = `#32302f`  
**Where defined:** `C:\Developer_main\Projects\ArkatekBuilder\app\_styles\gruvbox-dark-theme.css`  
Add: `--topbar-bg: var(--gb-bg-soft);` to the `[data-theme="gruvbox"]` block

---

### Issue 5.4 — Layout File: Theme Not Set to Gruvbox by Default
**File:** `C:\Developer_main\Projects\ArkatekBuilder\app\(pages)\layout.jsx`  
**Symptom:** `THEME_INIT_SCRIPT` reads from `localStorage('pj_shelf_theme')` — defaults to `'navy'` if not set  
**Fix for APEX:** The APEX page should force `document.body.setAttribute('data-theme', 'gruvbox')` on mount  
**Add to `APEXPageInner` useEffect:**
```js
useEffect(() => {
  document.body.setAttribute('data-theme', 'gruvbox')
  return () => document.body.removeAttribute('data-theme')
}, [])
```

---

## COMPLETE FILE PATH REFERENCE

```
ACTIVE FILES (need attention):
├── app/(pages)/APEX/page.jsx                          ← MAIN CANVAS PAGE (issues 1.1–3.5)
├── app/(pages)/DREAMScore/page.jsx                   ← Naming outdated (issue 5.1)
├── app/_components/ui/dashboard/top-bar.jsx          ← Links to wrong page (issue 5.1)
├── app/_components/ui/dashboard/Dock.jsx             ← Working correctly ✓
├── app/_components/ui/dashboard/Dock.css             ← Working correctly ✓
├── app/_components/ui/MagicRings.jsx                 ← Needs to become canvas node (issue 1.3)
├── app/_styles/gruvbox-dark-theme.css                ← Missing topbar-bg var (issue 5.3)
├── app/(pages)/layout.jsx                            ← Theme not forced to gruvbox (issue 5.4)
└── app/_lib/store/dreamsStore.js                     ← Not connected to APEX yet (issue 4.1)

DESIGN REFERENCE ONLY (do not modify):
├── app/_components/ui/New folder/dreams-chat-node.html   ← HTML prototype
└── app/_components/ui/New folder/arkatek-about.html      ← About page standalone

TO BE CREATED:
├── app/_components/ui/dashboard/APEXChatNode.jsx         ← Main chat node (issue 4.3)
├── app/_components/ui/dashboard/MagicRingsNode.jsx       ← Radial ring node (issue 1.3)
├── app/_lib/store/useAPEXStore.ts                        ← APEX state store (issue 4.1)
└── app/api/apex/route.js                                 ← API for APEX analysis (issue 4.4)

DOCS:
├── docs/ARKATEK_PROJECT_MASTER.md   ← Full project documentation
└── docs/HANDOFF_ISSUES.md           ← This file
```

---

## FIX ORDER FOR NEXT SESSION

Work in this exact order to avoid blocking issues:

```
1. Fix Issue 5.4 — Force gruvbox theme on APEX page mount
   → useEffect in APEXPageInner setting data-theme="gruvbox"

2. Fix Issue 1.1 — Nodes off screen
   → Remove defaultViewport, fix onInit fitView with duration:400

3. Fix Issue 3.4 — Grid lines too faint
   → rgba(69,133,136,0.12) instead of 0.07

4. Fix Issue 3.3 — Edges too dark
   → stroke opacity 99, strokeWidth 2, animated on integration edges

5. Fix Issue 3.2 — Output nodes too dim
   → border and boxShadow intensity increase

6. Fix Issue 5.1 — Update top-bar.jsx link /DREAMScore → /APEX
   → Also update label text to "APEX Financial Engine"

7. Fix Issue 2.2 — Wire right dock New and Integrations buttons
   → New clears canvas state, Integrations opens drawer

8. Build APEXChatNode (Issue 4.3)
   → This is the most important remaining build task
   → Full chat interface as a React Flow node
   → Reference: dreams-chat-node.html for design

9. Build MagicRingsNode (Issue 1.3)  
   → Wrap MagicRings.jsx as React Flow node
   → Replace VerticalNode with MagicRingsNode

10. Connect dreamsStore (Issue 4.1)
    → Wire VSCORES from store instead of local state
```

---

## KNOWN WORKING CORRECTLY ✓

- Dev server running on port 3002
- React Flow canvas renders and is interactive
- Background CSS grid renders
- Dock.jsx magnification works (Framer Motion)
- Left dock site navigation links are correct
- Integration node favicons load from Google favicon CDN
- Edge connections render between nodes
- Bottom strip renders 6 vertical tiles
- Git: clean, pushed to GitHub, both commits on main
- gruvbox-dark-theme.css token system complete
- MagicRings.jsx Three.js shader component exists and works (on other pages)

---

*Generated: March 30, 2026 — ArkatekBuilder session handoff*
