# Peptide Journal — Handoff Document #005
**Date:** March 14, 2026
**Session Focus:** TopBar UI — Glass HUD Planning Pill + Build Fixes
**GitHub:** https://github.com/KodeRacer5/Peptide_Journal.git
**Dev:** http://localhost:3000
**CT200 Production:** http://[CT200-IP]:3030
**Deploy:** `ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"`
**Master Doc:** `docs/PROJECT_MASTER.md`

---

## SESSION WORK COMPLETED

### Build Fixes (DONE)
- `app/api/upload/route.js` — fixed `ERR_DLOPEN_FAILED` on `canvas.node`
  - Moved `sharp`, `canvas`, `pdfjs-dist` to lazy dynamic `import()` inside async function
  - Added `export const dynamic = 'force-dynamic'` at top of file
  - Build now passes cleanly (12 static pages)
- `next.config.mjs` — fixed `serverComponentsExternalPackages` key
  - Moved under `experimental` block (correct for Next.js 14)
  - Added webpack externals for `canvas` and `sharp` on server
- CT200 deployed and verified — PM2 online PID 46639

### Login Page Fixes (DONE — committed 6784255)
- MagicRings SSR fixed — dynamic import with `ssr: false` + mounted guard
- Post-login redirect fixed — now goes to `/bookshelf`
- Research page wrapped in Suspense

### TopBar — Three-Dock Glass HUD Layout (DONE)
Current layout: Left dock | Planning HUD pill | Right dock

**Left dock (NAV_ITEMS):** Journal `/`, Bookshelf `/bookshelf`, Protocols `/protocols`, Research `/research`, About `/about`

**Middle dock (MIDDLE_DOCK_ITEMS):** Single Atom icon → `/planning` (route not yet built)
- `baseItemSize={600}` — oversized pill acting as wide glass HUD screen
- `magnification={600}` + `distance={0}` — hover shrink disabled, stays locked at full size

**Right dock (RIGHT_DOCK_ITEMS):** Protocols `/protocols`, Lab `/lab`, Molecular `/research`, Longevity `/`, My Lab `/lab`

- TopBar outer gap: `gap: 4`
- All dock containers: `flexShrink: 0` except planning pill which is `flexShrink: 1`

### ChatInput Height Fix (DONE)
- `chat-input.jsx` — locked to `height: 42` matching dock button height
- Padding changed from `7px 10px 7px 12px` to `0 10px 0 12px`

### Research Page Padding (DONE)
- Added `paddingTop: 32` to canvas wrapper div to prevent TopBar overlap at zoom

### TopBar Icon Changes (DONE)
- Right dock item 2: was `Dna` → now `FlaskConical` linking to `/lab`
- Right dock last item: label changed from "Lab Data" → "My Lab"

### Standalone Component Artifacts (SAVED)
- `docs/PlanningButton_COMPONENT.jsx` — standalone PlanningButton (narrow version)
- `docs/TopBar_STANDALONE.jsx` — fully self-contained TopBar (no internal deps)

---

## CURRENT FILE STATE

| File | Key Values |
|---|---|
| `app/_components/ui/dashboard/top-bar.jsx` | 3 docks, gap:4, planning baseItemSize=600 |
| `app/_components/ui/dashboard/chat-input.jsx` | height:42 locked |
| `app/_components/ui/dashboard/PlanningButton.jsx` | exists but NOT used in TopBar currently |
| `app/(pages)/research/page.jsx` | paddingTop:32 on canvas wrapper |
| `app/api/upload/route.js` | lazy imports, force-dynamic |
| `next.config.mjs` | experimental.serverComponentsExternalPackages, webpack externals |

---

## KNOWN ISSUES / NOT YET RESOLVED

### Planning HUD Pill — Concept Undecided
- Current state: wide glass pill with single Atom icon, `baseItemSize=600`
- Hover shrink is disabled (magnification=distance=600/0)
- `/planning` route does not exist yet
- Decision pending: keep as HUD screen entry point OR simplify to "Plan Cycle" label button
- When intake wizard (Phase 4) is built, this becomes the entry point

### PlanningButton.jsx — Orphaned
- `app/_components/ui/dashboard/PlanningButton.jsx` exists but is NOT imported anywhere
- Was built as a popup nav alternative, then replaced by the Dock approach
- Keep for reference or delete — not wired up

### Post-login Redirect
- Currently goes to `/bookshelf` — should eventually go to dashboard `/`
- Root route `/(website)` may need a redirect at `/`

---

## NEXT SESSION — PRIORITY ORDER

### 1. Commit + Push Current State
```powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master"
git add .
git commit -m "feat: TopBar HUD pill, chat-input height fix, research padding"
git push origin main
```
Then deploy to CT200.

### 2. Decide Planning Pill Fate
- Option A: Label it "Plan Cycle", link to `/wizard` when built
- Option B: Keep as HUD screen, build popup content when intake wizard exists
- Recommendation: Option A now, upgrade later

### 3. Lab Page — Open Folder Panel
- `onOpen(folder)` handler wired but panel UI missing
- Slide-up panel: file list, Analyze button per file, Upload button at top

### 4. Data Layer
- `npm install idb zustand`
- `lib/db/indexeddb.ts` — stores: `pj_lab_data`, `pj_results`
- `lib/store/labSlice.ts`, `lib/store/canvasSlice.ts`

### 5. CT200 Production URL
- Add `http://[CT200-IP]:3030/auth/callback` to Supabase redirect URLs
- Set `.env.local` on CT200 with Supabase keys

---

## LOCKED DECISIONS (carried forward)
- TopBar always `#0d1117`
- Banner above TopBar, per-page, never in layout
- `framer-motion` not `motion/react`
- No emojis of any kind
- Canvas: users never touch nodes
- IndexedDB for structured data, not localStorage
- New files: `.ts`/`.tsx` — existing files stay `.jsx`
- Supabase key: use legacy `eyJ...` JWT format, not `sb_publishable_`

---

## NEXT SESSION PROMPT

```
Continue Peptide Journal development.
Read: docs/HANDOFF_005.md
Read: docs/PROJECT_MASTER.md

Current state: Build passes, CT200 live, TopBar has three-dock glass HUD layout.

Priority 1: Commit and push any uncommitted changes, deploy to CT200.

Priority 2: Decide on Planning pill — recommend labeling "Plan Cycle" linking to /wizard.

Priority 3: Lab page open folder panel — slide-up with file list and Analyze button.

Priority 4: Install idb + zustand, build data layer (lib/store/, lib/db/indexeddb.ts).

GitHub: https://github.com/KodeRacer5/Peptide_Journal.git
Dev: http://localhost:3000
Deploy: ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```
