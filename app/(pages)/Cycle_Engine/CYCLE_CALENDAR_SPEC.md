# Dosing Calendar & Cycle Tracker — Project Spec
**Status:** Planning
**Route:** `/cycle`
**Depends on:** Meto_Engine assessment output, protocols data

---

## Overview

A cycle management system that converts Meto_Engine assessment results + protocol data into a structured dosing schedule. Users track injections, adjust doses, and view compound analytics in a textbook-style dashboard.

---

## Inputs

| Source | Data | Used For |
|---|---|---|
| `metoStore` (Zustand) | Assessment results, triad scores, risk levels | Auto-suggest compounds + starting doses |
| `protocols/page.jsx` | 66 protocols — dose, frequency, route, stack notes | Populate compound defaults |
| User input | Cycle name, start date, duration, custom doses | Build schedule |
| Per-injection | Actual dose taken, time, notes | Tracking |

---

## Outputs

| Output | Destination | Format |
|---|---|---|
| Active cycle config | `pj_active_cycle` (IndexedDB) | JSON |
| Injection log | `pj_injection_log` (IndexedDB) | JSON array |
| Supabase sync (future) | `cycles` + `injections` tables | Row per record |
| Mobile app sync (future) | Supabase realtime | Push on change |

---

## Data Model

### Cycle
```json
{
  "id": "cycle_uuid",
  "name": "Spring Healing Stack",
  "start_date": "2026-03-17",
  "end_date": "2026-06-09",
  "duration_weeks": 12,
  "status": "active | completed | draft",
  "source_assessment_id": "mc_1234567890",
  "compounds": [CompoundConfig],
  "created_at": "ISO8601"
}
```

### CompoundConfig
```json
{
  "id": "compound_uuid",
  "name": "BPC-157",
  "category": "Signaling Peptides",
  "dose_amount": 250,
  "dose_unit": "mcg",
  "frequency": "daily | EOD | 2x_week | weekly | post_workout",
  "times_per_day": 1,
  "time_of_day": ["morning", "evening", "post_workout"],
  "route": "SubQ | IM | intranasal | oral",
  "dose_multiplier": 1.0,
  "notes": "Near injury site",
  "protocol_ref": "bpc157"
}
```

### InjectionLog entry
```json
{
  "id": "log_uuid",
  "cycle_id": "cycle_uuid",
  "compound_id": "compound_uuid",
  "scheduled_date": "2026-03-17",
  "scheduled_dose": 250,
  "actual_dose": 250,
  "taken": true,
  "time_taken": "07:45",
  "skipped": false,
  "skip_reason": "",
  "notes": "Slight redness at site",
  "created_at": "ISO8601"
}
```

---

## Pages & Components

```
app/(pages)/cycle/
├── page.jsx                  # Cycle dashboard — compound cards + calendar
├── layout.jsx                # Standalone layout
└── components/
    ├── CompoundCard.jsx      # Textbook-style card per compound
    ├── DoseGraph.jsx         # Pharmacokinetic curve (recharts)
    ├── CalendarGrid.jsx      # Week/month injection schedule grid
    ├── DoseAdjuster.jsx      # Global % multiplier + per-compound override
    ├── InjectionCell.jsx     # Single calendar cell — mark taken, add note
    ├── CycleBuilder.jsx      # Wizard to create new cycle from assessment
    └── AdherenceBar.jsx      # % taken, missed, upcoming
```

---

## CompoundCard Layout (textbook style)

```
┌─────────────────────────────────────────────────────┐
│  BPC-157                          Signaling Peptide  │
│  ─────────────────────────────────────────────────  │
│  MECHANISM                                           │
│  Body Protection Compound. Promotes tissue repair    │
│  via NO pathways and angiogenesis...                 │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  DOSING PROTOCOL                            │    │
│  │  250 mcg · SubQ · Daily · Morning           │    │
│  │  Weeks 1–12                                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  [Dose curve graph — 12 week timeline]               │
│                                                      │
│  STACK NOTES                                         │
│  Synergistic with TB-500. Avoid concurrent NSAIDs.   │
│                                                      │
│  Adherence: ████████░░  80%   Next: Tomorrow 7am    │
└─────────────────────────────────────────────────────┘
```

---

## Calendar Grid Layout

```
Week 1 of 12 — March 17–23, 2026

         MON   TUE   WED   THU   FRI   SAT   SUN
BPC-157  [✓]   [✓]   [✓]   [ ]   [✓]   [✓]   [✓]
TB-500   [✓]   [ ]   [ ]   [✓]   [ ]   [ ]   [ ]
Semax    [✓]   [✓]   [✓]   [✓]   [✓]   [ ]   [ ]

[✓] = taken  [ ] = scheduled  [!] = missed  [–] = not scheduled
```

---

## Dose Adjuster

- **Global multiplier:** slider 50% → 200% — scales all compound doses proportionally
- **Per-compound override:** individual +/- field, absolute value
- **Preview mode:** shows new doses before applying
- **Audit log:** records every dose change with timestamp

---

## Key Functions

| Function | Input | Output |
|---|---|---|
| `generateSchedule(cycle)` | CycleConfig | InjectionLog[] (all future entries) |
| `markTaken(logId, actual)` | Log ID + actual dose | Updated log entry |
| `adjustDoses(multiplier)` | Float 0.5–2.0 | Updated CompoundConfig[] |
| `getAdherence(cycleId)` | Cycle ID | `{ taken, missed, scheduled, pct }` |
| `exportCycle(cycleId)` | Cycle ID | JSON download |
| `syncToSupabase(cycleId)` | Cycle ID | Upsert to `cycles` + `injections` tables |

---

## Mobile Sync Strategy

All data stored in IndexedDB now using same schema as Supabase tables.
When mobile app is built:
- Supabase `cycles` table = 1:1 with `Cycle` model
- Supabase `injections` table = 1:1 with `InjectionLog`
- Realtime subscription → push reminders to phone
- Zero schema refactor required

---

## Next Steps (Build Order)

1. `lib/db/cycleDB.ts` — IndexedDB schema for cycles + injections
2. `CycleBuilder.jsx` — wizard: pick compounds → set doses → generate schedule
3. `CalendarGrid.jsx` — weekly view with injection cells
4. `CompoundCard.jsx` — textbook-style card with dose graph
5. `DoseAdjuster.jsx` — global multiplier + per-compound override
6. `/cycle/page.jsx` — assemble all components
7. Supabase tables — `cycles`, `injections`, `compound_configs`
8. Mobile sync — realtime Supabase + push notifications

---

## Do Not

- Do not use localStorage for cycle data — IndexedDB only
- Do not hardcode compound data — pull from protocols dataset
- Do not build mobile app yet — design schema mobile-ready now
- No emoji in node icons or compound labels
