# Peptide Journal — Handoff Document #003
**Date:** March 14, 2026  
**Priority:** Canvas Integration & User Data Interaction  
**GitHub:** https://github.com/KodeRacer5/Peptide_Journal.git  
**Dev:** http://localhost:3000  
**CT200 Production:** http://[CT200-IP]:3030  
**Deploy:** `ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"`

---

## SESSION WORK COMPLETED (This Session)

### Lab Page — Health Data Vault (DONE)
- Folder system with `folder-dynamic-premium.png` for created folders
- `folder-front-premium.png` for the + (new folder) ghost icon
- Ghost folder: click → naming state (folder open animation) → Enter creates → click outside cancels
- Three-action icons on folder click: red X (delete), blue upload arrow (upload into folder), green open (view contents)
- `folderFileRef` for folder-specific uploads with `folderId` assignment
- `VscSettings` gear icon replaces "Folder Color" text button
- CSS filter sliders: Hue / Saturation / Brightness for folder color adjustment
- All folders pinned bottom-right: Upload folder removed, only + folder remains

### TopBar (DONE)
- Single-bar layout restored — no duplicate banners
- `VscSettings` imported from `react-icons/vsc` (installed this session)
- Banner handled per-page, NOT in TopBar

### Banner Layout (DONE)
- Dashboard: uses `hero-banner2.png` with padding/rounded/shadow — was already working
- Bookshelf + Lab: now use same structure (`px-8 pt-6 pb-4`, `max-w-5xl mx-auto`, rounded-2xl) with `hero-banner.png`
- Banner sits ABOVE TopBar on every page
- TopBar is `sticky top-0 z-10` — stays below banner on scroll

### Bookshelf Page
- Two shelves: Peptide Journal Publications + My Documents
- Category shelves (Growth Hormone, Tissue Repair, etc.) — PLANNED, not built yet

---

## THE BIG QUESTION — Canvas Integration

**Current state of `/research` (canvas):**
- React Flow canvas for protocol visualization
- URL params: `?protocol=bpc157`, `?data=ID`, `?result=ID`
- 4 protocol templates: BPC-157, TB-500, Semax, GHK-Cu

**What needs to be figured out:**

### How users interact with the canvas and get information back

The core flow should be:

```
User uploads health data (Lab page)
        ↓
Assigns to folder OR leaves loose
        ↓
Clicks "Analyze in Canvas" on a data card
        ↓
Canvas loads with that data pre-loaded
        ↓
User builds/views protocol node graph
        ↓
Canvas generates analysis/results
        ↓
Results saved back to Lab page (Results shelf)
        ↓
User can open report from Results shelf
```

### Key integration points to build:

1. **Data → Canvas handoff**
   - `DataCard` "Analyze in Canvas" → `/research?data=ID`
   - Canvas reads `pj_lab_data` from localStorage by ID
   - Loads data into a node on the canvas automatically

2. **Protocol + Data overlay**
   - User can load a protocol template AND a data file simultaneously
   - Canvas shows protocol nodes + patient data nodes side by side
   - Connections drawn between protocol steps and data points

3. **Canvas → Results handoff**
   - "Save Analysis" button on canvas
   - Saves `{id, name, protocol, dataId, nodes, edges, runAt}` to `pj_lab_results`
   - Lab page Results shelf auto-appears when `pj_lab_results` has entries

4. **Folder → Canvas**
   - Open folder icon on FolderCard → shows folder contents panel
   - Panel has "Analyze All" button → sends all folder files to canvas

5. **Bookshelf → Canvas**
   - Protocol books on bookshelf → click → loads that protocol on canvas
   - Research shelf category → "Open Protocol Canvas" per category

### Architecture decision needed:

**Option A — localStorage only (current approach)**
- All data stays in browser
- Fast, no backend needed
- Not persistent across devices
- Good for demo/MVP

**Option B — Supabase backend**
- Data uploaded to storage bucket
- Results saved to database
- User accounts → personal data persists
- Required for real clinical use

**Option C — Hybrid**
- Files stay local for now
- Results/protocols saved to Supabase
- Auth added later

---

## PENDING / IN PROGRESS

### Lab Page — Open Folder Panel (NOT STARTED)
- `onOpen(folder)` handler is wired but `openFolder` state is set with no UI
- Need: slide-up panel or modal showing folder contents as a list
- Each file in panel: icon + name + date + "Analyze" button
- "Upload to folder" button at top of panel

### Bookshelf Category Shelves (NOT STARTED)
Confirmed categories:
1. Peptide Journal Publications (existing)
2. Growth Hormone & Metabolics
3. Tissue Repair & Recovery
4. Cognitive & Neuroprotection
5. Mitochondrial & Longevity
6. Immune Modulation
7. Clinical Protocols
8. My Documents (existing)

Each shelf = full-width horizontal `ShelfSection`. Books draggable between shelves. `categoryId` stored per book in localStorage.

### My Protocols Shelf on Bookshelf (NOT STARTED)
- Save Protocol button on Research/canvas page
- Saves React Flow state to `pj_protocols`
- Protocol cards render as books on Shelf 2 of bookshelf

---

## KEY FILES

| File | Purpose |
|---|---|
| `app/(pages)/lab/page.jsx` | Health Data Vault — folders, data cards, upload |
| `app/(pages)/bookshelf/page.jsx` | Bookshelf — publications + user docs |
| `app/(pages)/research/page.jsx` | Canvas — React Flow protocol builder |
| `app/(pages)/(website)/page.jsx` | Dashboard — hero banner, publications grid |
| `app/_components/ui/dashboard/top-bar.jsx` | Global nav bar |
| `app/_providers/shelf-theme-context.jsx` | 6-theme system |
| `public/icons/` | All folder PNG icons |
| `public/hero-banner.png` | Banner for bookshelf/lab |
| `public/hero-banner2.png` | Banner for dashboard (padded/rounded) |

---

## LOCKED DECISIONS

- TopBar always `#0d1117`, never changes with theme
- Banner above TopBar, per-page, not in layout or TopBar component
- Dashboard uses `hero-banner2.png` (padded, rounded, shadowed)
- Other pages use `hero-banner.png` (same structure, different file)
- Folder icons: created = `folder-dynamic-premium.png`, ghost = `folder-front-premium.png`
- React Bits Folder component removed — PNG icons only
- `framer-motion` not `motion/react`
- CT200 port 3030, SSH wrap for Linux commands

## DO NOT

- Do not add banner to TopBar component
- Do not add banner to layout.jsx
- Do not use `motion/react` — use `framer-motion`
- Do not run Linux commands directly in PowerShell — wrap with `ssh ct200 "..."`
- Do not change TopBar background from `#0d1117`
- Do not put duplicate banners anywhere

---

## NEXT SESSION PROMPT

```
Continue Peptide Journal development.
Read: C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\HANDOFF_003.md

Priority 1: Build the open folder panel on the Lab page — slide-up panel showing folder contents when user clicks the green open icon on a folder. Each file shows icon + name + date + Analyze button.

Priority 2: Wire the canvas integration — DataCard "Analyze in Canvas" loads data into React Flow canvas via localStorage. Canvas "Save Analysis" writes results back to pj_lab_results.

Priority 3: Add category shelves to the bookshelf page — 8 full-width horizontal shelves with drag-to-organize between shelves.

GitHub: https://github.com/KodeRacer5/Peptide_Journal.git
Dev: http://localhost:3000
Deploy: ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```
