# Peptide Journal — Handoff Document #006
**Date:** March 15, 2026
**Session Focus:** Banner height fix, Planning Pill, Demo Think Tanks, Engine Embedding
**GitHub:** https://github.com/KodeRacer5/Peptide_Journal.git
**Dev:** http://localhost:3000
**CT200 Production:** http://[CT200-IP]:3030
**Deploy:** `ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"`
**Master Doc:** `docs/PROJECT_MASTER.md`

---

## SESSION WORK COMPLETED

### Planning Pill — Replaced Dock with Glass Pill (DONE)
- Removed `MIDDLE_DOCK_ITEMS` array and Dock-based planning pill
- `baseItemSize=600` was breaking TopBar layout (column overflow)
- Replaced with inline `<PlanningPill />` component in `top-bar.jsx`
- Uses `useState` hover for glass effect, no framer-motion dependency
- Text: **"Plan your cycle now"** with Atom icon left
- Height: 42px (matches dock buttons), borderRadius: 21 (full pill)
- Hover: border brightens, bg deepens, text/icon opacity lifts
- Links to `/planning` (route not yet built)
- `MIDDLE_DOCK_ITEMS` const and its import removed

### Banner Height — Target 250px (PENDING — DO THIS FIRST)
Current state: `hero-banner4.svg` in `/public` is too large to read (>1MB).
Both pages use `hero-banner4.png` (not .svg) — the PNG is what renders.

**Task:** Regenerate `hero-banner4.png` at exactly 250px height:
```powershell
# Option A — Inkscape (preferred, preserves SVG quality)
inkscape "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\public\hero-banner4.svg" --export-type=png --export-filename="C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\public\hero-banner4.png" --export-height=250

# Option B — ImageMagick
magick "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\public\hero-banner4.svg" -resize x250 "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\public\hero-banner4.png"
```

**After PNG is regenerated — update BOTH banner containers to explicit 250px height:**

### Landing Page (`app/(pages)/(website)/page.jsx`) — Banner fix
Find the Image block (~line 60) and replace:
```jsx
// OLD
<Image
  src="/hero-banner4.png"
  alt="Peptide Journal — Longevity Medicine & Protocols"
  width={4800}
  height={400}
  style={{ width: '100%', height: 'auto', display: 'block' }}
  priority
  unoptimized
/>

// NEW
<Image
  src="/hero-banner4.png"
  alt="Peptide Journal — Longevity Medicine & Protocols"
  width={4800}
  height={250}
  style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
  priority
  unoptimized
/>
```

### Bookshelf Page (`app/(pages)/bookshelf/page.jsx`) — Banner fix
Find the banner img block (~line 183) and replace:
```jsx
// OLD
<img src="/hero-banner4.png" alt="Peptide Journal" style={{ width: '100%', height: 'auto', display: 'block' }} />

// NEW
<img src="/hero-banner4.png" alt="Peptide Journal" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
```

Both banner overlay divs (AnalyticalChain) are already `position: absolute, inset: 0` — no changes needed there.

---


## DEMO — THINK TANKS + ENGINE EMBEDDING (20-MINUTE PRIORITY)

### Think Tank Pages Required
Build 3 demo think tank pages that live inside the Research section.
These are **static demo pages** — no data layer needed, just visual content.

#### Route structure:
```
app/(pages)/research/
  page.jsx                ← existing (canvas/nodes view)
  think-tanks/
    page.jsx              ← Think Tank index (list of 3)
    cortix-engine/page.jsx
    russian-university/page.jsx
    longevity-institute/page.jsx
```

#### Each think tank page layout:
```
[TopBar]
[Banner — same hero-banner4.png at 250px]
[Think Tank header — name, affiliation badge, description]
[Research grid — 3-4 "publication" cards with placeholder data]
[Peptide protocol table — static demo data]
```

#### Demo data for each:

**1. CortixEngine Think Tank**
- Name: CortixEngine Longevity Research Division
- Badge: Private Research Consortium
- Focus: Bioactive peptide stack optimization, AI-assisted protocol design
- Publications: "GLP-1 Receptor Agonist Synergies", "BPC-157 Tissue Repair Cascade", "IGF-1/GH Stack Periodization"

**2. Russian University (placeholder)**
- Name: Institute for Bioregulatory Peptide Research
- Badge: Academic Partner — Eastern European Network
- Focus: Khavinson peptide bioregulators, pineal peptides, longevity biomarkers
- Publications: "Epithalamin Circadian Reset Protocol", "Thymalin Immune Restoration", "Vilon Peptide Bioregulation"

**3. Longevity Institute**
- Name: Applied Longevity Sciences Institute
- Badge: Clinical Research Partner
- Focus: Senolytic protocols, mTOR modulation, NAD+ pathway interventions
- Publications: "Rapamycin Pulse Dosing", "Dasatinib + Quercetin Senolytic Cycles", "NMN vs NR Comparative Trial"

---

### Embedding the CortixEngine
The demo should show an embedded AI engine panel on the Research page.
This is a **visual demo placeholder** — a chat-style interface panel that looks live.

#### Implementation:
Add an `EnginePanel` component at `app/_components/ui/dashboard/EnginePanel.jsx`:
- Dark glass panel, right-side slide-in or bottom drawer
- Header: "CortixEngine — Protocol Assistant" with Atom icon
- Shows 2-3 pre-seeded demo messages (user → assistant Q&A about peptides)
- Input bar at bottom (non-functional for demo, just styled)
- Trigger: floating button bottom-right of Research page ("Ask CortixEngine")

**Demo conversation to display:**
```
User: What's the optimal BPC-157 dosing for gut repair?
Engine: Standard protocol: 250–500mcg subcutaneous, AM fasted. Stack with TB-500 at 2mg 2x/week for systemic synergy. Cycle 8 weeks on, 4 weeks off.

User: Any contraindications with GLP-1 agonists?
Engine: No known direct antagonism. Monitor appetite suppression — GLP-1 may blunt hunger signals that serve as repair feedback markers. Recommend splitting AM/PM dosing when stacking.
```

---

## CURRENT FILE STATE (post this session)

| File | Status |
|---|---|
| `app/_components/ui/dashboard/top-bar.jsx` | PlanningPill component, useState import added, MIDDLE_DOCK removed |
| `app/(pages)/(website)/page.jsx` | Banner height PENDING (change height to 250px) |
| `app/(pages)/bookshelf/page.jsx` | Banner height PENDING (change height to 250px) |
| `public/hero-banner4.png` | PENDING re-export at 250px from SVG |
| `app/(pages)/research/think-tanks/` | NOT YET BUILT |
| `app/_components/ui/dashboard/EnginePanel.jsx` | NOT YET BUILT |

---

## KNOWN ISSUES / CARRIED FORWARD

- `/planning` route does not exist — PlanningPill links there, will 404 until built
- `PlanningButton.jsx` at `app/_components/ui/dashboard/PlanningButton.jsx` is orphaned — safe to delete
- Post-login redirect goes to `/bookshelf` — should eventually go to `/` dashboard
- CT200 `.env.local` Supabase keys still need to be set for production auth
- Supabase redirect URL `http://[CT200-IP]:3030/auth/callback` not yet added to allowed list

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
- Banner height: 250px, `objectFit: cover`

---

## NEXT SESSION PROMPT

```
Continue Peptide Journal development.
Read: docs/HANDOFF_006.md
Read: docs/PROJECT_MASTER.md

Current state: TopBar Planning Pill live ("Plan your cycle now"), banner height fix pending.

Priority 1: Regenerate hero-banner4.png at 250px height (Inkscape or ImageMagick command in HANDOFF_006.md).
Priority 2: Update banner height in (website)/page.jsx and bookshelf/page.jsx to 250px.
Priority 3: Build 3 think tank demo pages under app/(pages)/research/think-tanks/.
Priority 4: Build EnginePanel.jsx (CortixEngine demo chat UI), wire into Research page.
Priority 5: Commit all, deploy to CT200.

GitHub: https://github.com/KodeRacer5/Peptide_Journal.git
Dev: http://localhost:3000
Deploy: ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```
