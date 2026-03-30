# Meto Engine — Developer Notes
**Last Updated:** March 17, 2026

---

## 1. Root Layout

```
react-pdf-flipbook-viewer-master/
└─ react-pdf-flipbook-viewer-master/
   ├─ app/
   │  ├─ _components/ui/dashboard/
   │  │  ├─ AnalyticalChain.jsx     # Banner canvas — shows live Meto nodes from global store
   │  │  ├─ top-bar.jsx             # TopBar — "Plan My Cycle Now" pill routes to /Meto_Engine
   │  │  ├─ chat-input.jsx
   │  │  ├─ Dock.jsx / Dock.css
   │  ├─ _lib/store/
   │  │  └─ metoStore.js            # Zustand store — persists assessment results globally
   │  ├─ _styles/
   │  │  ├─ globals.css
   │  │  └─ gruvbox-dark-theme.css  # All CSS vars + Gruvbox theme overrides
   │  └─ (pages)/
   │     └─ Meto_Engine/
   │        ├─ page.jsx             # LIVE — split-screen intake + 7-node ReactFlow pipeline
   │        ├─ layout.jsx           # Standalone layout — no shared wrappers
   │        ├─ index.tsx            # DEAD — not used by Next.js App Router (can delete)
   │        ├─ engine_config.json   # Front-end copy of engine config
   │        └─ components/
   │           ├─ MetaNodes.jsx     # All 7 node types (Gruvbox themed, CSS vars)
   │           ├─ ProfileSection.tsx
   │           ├─ VitalsSection.tsx
   │           ├─ LifestyleSection.tsx
   │           ├─ SymptomsSection.tsx  # Full 25 symptoms across 5 triads
   │           ├─ LabsSection.tsx
   │           └─ NotesSection.tsx
   │
   ├─ Python_meto_engine/
   │  ├─ main.py                    # FastAPI — POST /score, GET /health, CORS enabled
   │  ├─ scoring.py                 # Pure scoring logic (lab + non-lab modes)
   │  ├─ engine_config.json         # Canonical config — 5 triads, ranges, weights
   │  └─ requirements.txt           # fastapi, uvicorn, pydantic, python-multipart
   │
   └─ docs/
      ├─ README_Meto_Engine.md      # This file
      ├─ THEME_SYSTEM.md            # Theme switching reference + bug fixes
      └─ PROJECT_MASTER.md          # Full project source of truth
```

**Key idea:** `page.jsx` owns the full intake + canvas. `index.tsx` is dead. Python handles scoring via API.

---

## 2. How It Works

### User flow
1. User clicks **Plan My Cycle Now** in TopBar → navigates to `/Meto_Engine`
2. Left panel: fill Subject, Vitals, Lifestyle, Symptoms, Labs
3. Right panel: ReactFlow canvas builds live as user fills sections (partial scoring at 3+ sections)
4. Click **Run Assessment** → full scoring → results write to Zustand store
5. Results persist globally → `AnalyticalChain` banner canvas shows live Meto nodes on every page
6. Click any triad node in banner → popover with score breakdown + "Open Full Canvas" link

### Scoring modes
| Mode | Condition | Weights |
|---|---|---|
| `lab` | Any lab value present | 0.4 symptoms / 0.2 vitals / 0.4 labs |
| `non_lab` | No labs | 0.6 symptoms / 0.4 vitals |

### Post-processing floors
- `known_diabetes` → Energy risk ≥ high
- `known_hypertension` OR SBP ≥ 140 OR DBP ≥ 90 → Endurance risk ≥ high
- `chest_tightness` symptom ≥ 3 → Endurance risk ≥ high + `urgent_followup_possible_cardio` flag
- ALT > 50 OR AST > 44 → Detox risk ≥ high

---

## 3. Canvas Node Pipeline

| Node | Color | Role |
|---|---|---|
| `MetaConfigNode` | Purple `#7E57C2` | Defines sections, triads, thresholds |
| `MetaInputNode` | Blue `#42A5F5` | One per data section, lights up when filled |
| `MetaEngineNode` | White | Scoring core, shows lab vs non-lab mode |
| `MetaFlagNode` | Amber `#FFB74D` | Floor triggers + urgent flags |
| `MetaScoreNode` | Teal `#26A69A` | Per-triad score + SX/VT/LB sub-scores |
| `MetaResultNode` | Purple `#AB47BC` | Aggregates all triads + ORI + global flags |
| `MetaStorageNode` | Green `#66BB6A` | IndexedDB persistence |

---

## 4. Running Locally

### Python engine
```powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\Python_meto_engine"
.\.venv\Scripts\Activate.ps1
pip install -r .\requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Next.js app
```powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master"
npm run dev
```

Open `/Meto_Engine` → fill form → Run Assessment → check banner canvas updates.

---

## 5. Deploying to Proxmox CT200

```powershell
# Push from Windows
git add .
git commit -m "description"
git push origin main

# Pull + rebuild on CT200
ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"

# Python engine on CT200 (separate shell)
ssh ct200 "cd /opt/Peptide_Journal/Python_meto_engine && source .venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"
```

**Note:** `.env.local` is never committed. Must be created manually on CT200.

---

## 6. Known Issues / Watch Points

- `index.tsx` is unreachable — Next.js App Router uses `page.jsx` only. Can delete.
- Python engine must be running on port 8000 for lab-mode scoring via API. JS engine runs in-app without it.
- `engine_config.json` in `Meto_Engine/` must match `Python_meto_engine/engine_config.json`.
- CT200 URL must be added to Supabase redirect URLs for Google OAuth to work on production.

---

## 7. Next Steps

- [ ] Wire `index.tsx` submit logic into `page.jsx` (POST to Python on Run Assessment)
- [ ] Results display — cards per triad + overall risk dial instead of raw canvas only
- [ ] IndexedDB write on `MetaStorageNode` activation
- [ ] CT200 production URL → add to Supabase redirect URLs
- [ ] n8n between front end and Python for storage + notifications
