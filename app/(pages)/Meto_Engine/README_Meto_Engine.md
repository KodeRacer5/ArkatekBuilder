Meto Engine – Developer Notes
1. Root layout
Repo root (Windows and Proxmox):

text
react-pdf-flipbook-viewer-master/
└─ react-pdf-flipbook-viewer-master/
   ├─ app/
   │  ├─ _components/
   │  ├─ _hooks/
   │  ├─ _lib/
   │  ├─ _providers/
   │  ├─ _styles/
   │  └─ (pages)/
   │     └─ Meto_Engine/
   │        ├─ index.tsx              # Meto Engine UI + call to Python /score
   │        ├─ engine_config.json     # Front-end copy of engine config (optional)
   │        ├─ page.jsx               # ReactFlow canvas (visual meta canvas)
   │        └─ components/
   │           ├─ ProfileSection.tsx
   │           ├─ VitalsSection.tsx
   │           ├─ LifestyleSection.tsx
   │           ├─ SymptomsSection.tsx
   │           ├─ LabsSection.tsx
   │           └─ NotesSection.tsx
   │
   ├─ Python_meto_engine/
   │  ├─ main.py                      # FastAPI app exposing POST /score
   │  ├─ scoring.py                   # Pure scoring logic (triads, vitals, labs)
   │  ├─ engine_config.json           # Canonical engine config used by scorer
   │  └─ requirements.txt             # fastapi, uvicorn, pydantic
   │
   ├─ .next/
   ├─ node_modules/
   ├─ package.json
   ├─ package-lock.json
   ├─ next.config.mjs
   ├─ tsconfig.json
   └─ other app files...
Key idea: React/Next handles UI, Python_meto_engine is the scoring API.

2. Meto_Engine front‑end
2.1 Entry page
app/(pages)/Meto_Engine/index.tsx

Collects user input in sections:

ProfileSection → subject (age, sex, height_cm, weight_kg, waist_cm, hip_cm).

VitalsSection → biometrics (BP, resting HR, SpO2, urine_ph).

LifestyleSection → lifestyle (smoking_status, diagnoses, exercise).

SymptomsSection → symptom_responses (Likert 0–4, mapped by item_id).

LabsSection → labs (fasting_glucose_mg_dl, hba1c_pct, etc., optional).

NotesSection → user_notes (title, free‑text, tags; plain black‑and‑white).

On submit, builds an assessment payload:

ts
const payload = {
  version: "1.0.0",
  assessment_id: crypto.randomUUID(),
  subject,
  biometrics,
  lifestyle,
  labs,
  symptom_responses: symptomResponses,
  user_notes
};
Sends it to the Python API:

ts
const res = await fetch("http://localhost:8000/score", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    engine_config: { engine_version: "1.0.0" }, // or omit to use server default
    assessment: payload
  })
});
Displays the JSON result in a <pre> for now; can later be turned into cards/charts.

2.2 Canvas (visual meta)
app/(pages)/Meto_Engine/page.jsx

ReactFlow canvas showing:

Triads (Energy, Resiliency, Endurance, Detox, Potency).

Input nodes (Subject, Vitals, Lifestyle, Symptoms, Labs).

Score/Flag/Engine nodes.

Purpose: visual designer for how triads and inputs connect.
Future work: export its config to engine_config.json to drive the Python engine.

3. Python_meto_engine (scoring API)
3.1 Files
Python_meto_engine/engine_config.json

JSON spec describing:

Triads and their symptom_items, vitals_fields, lab_fields.

Weights for lab vs non‑lab modes.

Risk bands (low / moderate / high).

Ranges for vitals and labs (optimal_low, optimal_high, direction).

The attached engine_config.json includes all five triads and matching symptom IDs.

Python_meto_engine/scoring.py

Pure logic, no web framework:

Derives BMI and waist_to_height_ratio from subject.

Normalizes symptom scores to 0–100 per triad.

Computes penalties for vitals and labs vs the ranges in engine_config.json.

Combines into composite triad scores (different weights lab vs non‑lab).

Assigns risk levels based on risk_bands.

Returns:

json
{
  "engine_version": "1.0.0",
  "assessment_id": "...",
  "mode": "lab|non_lab",
  "triads": [
    {
      "id": "energy",
      "label": "Energy",
      "scores": {
        "symptom_score": 0–100,
        "vitals_score": 0–100 or null,
        "lab_score": 0–100 or null,
        "composite_score": 0–100,
        "risk_level": "low|moderate|high"
      },
      "flags": []
    }
  ],
  "overall": {
    "overall_risk_index": 0–100,
    "mode": "lab|non_lab",
    "global_flags": []
  }
}
Python_meto_engine/main.py

FastAPI wrapper exposing POST /score:

Reads default engine_config.json from the same folder.

Accepts JSON with:

engine_config (optional; if omitted, uses default).

assessment (payload described above).

Calls score_assessment(engine_config, assessment) from scoring.py.

Returns the triads and overall score JSON.

Python_meto_engine/requirements.txt

Minimal dependencies:

text
fastapi
uvicorn
pydantic
4. Running locally (Windows dev box)
4.1 Python engine
powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\Python_meto_engine"

# Create and activate venv (once)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install deps
pip install -r .\requirements.txt

# Run the engine
uvicorn main:app --reload --host 0.0.0.0 --port 8000
You should see “Application startup complete” in the console.

4.2 Next/React app
In another terminal:

powershell
cd "C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master"
npm install         # first time only
npm run dev         # or: next dev
Then open the Meto_Engine page in the browser (e.g., /Meto_Engine), enter sample data, and click “Calculate Score” to hit /score and see JSON results.

5. Deploying / running in Proxmox LXC
Assuming this repo is already cloned in the LXC container:

Python engine (inside LXC)

bash
cd react-pdf-flipbook-viewer-master/react-pdf-flipbook-viewer-master/Python_meto_engine
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
Next app (inside LXC, separate shell)

bash
cd react-pdf-flipbook-viewer-master/react-pdf-flipbook-viewer-master
npm install
npm run dev   # or build + start, depending on how you deploy
Networking

Inside the container, React calls http://localhost:8000/score.

From outside the container, expose ports via Proxmox/LXC config (not covered here) if needed.

6. Next steps for future agents
Hook the ReactFlow canvas (page.jsx) to export its node/edge config into a JSON that matches engine_config.json.

Add trigger/floor rules to the engine (e.g., known_diabetes forces Energy ≥ high).

Build a user‑friendly result view (cards per triad + overall risk dial) instead of raw JSON.

Optionally, insert n8n between the front end and Python to handle storage, notifications, and multi‑step workflows.

This document should give any new agent enough context to understand where the Meto Engine lives, how it’s wired, and how to run or extend it on both Windows and Proxmox.