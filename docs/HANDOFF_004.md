# Peptide Journal — Handoff Document #004
**Date:** March 14, 2026
**Session Focus:** Auth Infrastructure + Login Page + Project Architecture
**GitHub:** https://github.com/KodeRacer5/Peptide_Journal.git
**Dev:** http://localhost:3000
**CT200 Production:** http://[CT200-IP]:3030
**Deploy:** `ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"`
**Master Doc:** `docs/PROJECT_MASTER.md`

---

## SESSION WORK COMPLETED

### Auth Infrastructure (DONE)
- `utils/supabase/client.ts` — browser Supabase client (`createBrowserClient`)
- `utils/supabase/server.ts` — server Supabase client (`createServerClient` with cookies)
- `middleware.ts` — route guard at project root, redirects unauthenticated users to `/login`
- `app/auth/callback/route.ts` — OAuth code exchange handler

### Login Page (DONE)
- `app/login/layout.tsx` — standalone layout, no TopBar, no banner
- `app/login/page.tsx` — full login page, Supabase auth wired
- `app/_components/ui/MagicRings.jsx` — WebGL Three.js rings component installed
- Email/password sign in working
- Google OAuth working
- Toggle: Sign In / Get Started (new users)
- Version tag: "v0.1 — Research Preview"

### Supabase Project (DONE)
- Project: KodeRacer5 org, Free tier
- URL: `https://broibjghfccxsjcrcviy.supabase.co`
- Auth providers: Email + Google OAuth enabled
- Google OAuth: Client ID + Secret configured in both Google Cloud Console and Supabase
- Redirect URLs: `http://localhost:3000/auth/callback` added

### Environment (DONE)
- `.env.local` at project root with correct legacy anon key (`eyJ...` JWT format)
- Key name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not the `sb_publishable_` format)

### Packages Installed (DONE)
```
@supabase/supabase-js
@supabase/ssr
three
```

### Master Document (DONE)
- `docs/PROJECT_MASTER.md` created — 568 lines, full source of truth
- Covers: infrastructure, tech stack, file structure, all pages, auth, data layer,
  canvas architecture, intake wizard design, locked decisions, build sequence,
  deployment, environment variables, do-not list, mobile roadmap

---

## KNOWN ISSUES

### MagicRings Not Rendering on Login Page
- The glass card renders correctly but the WebGL background is not visible
- Cause: Three.js SSR conflict with Next.js — `dynamic()` import with `ssr: false` is
  in place but may need additional guard
- Fix needed: Wrap MagicRings mount in `useEffect` client-only check or verify
  Three.js canvas is appending to DOM correctly
- Priority: High — this is the first visual impression

### Root Route 404
- `GET / 404` — the dashboard lives at `/(website)` route group
- Middleware redirects unauthenticated users to `/login` correctly
- After login, redirect goes to `/` which 404s
- Fix: Change `router.push('/')` in login page to `router.push('/(website)')` or
  add a redirect at the root route
- Priority: High — must fix before testing full auth flow

---

## NEXT SESSION — PRIORITY ORDER

### 1. Fix Login Page Issues
- MagicRings WebGL background not rendering
- Post-login redirect to correct dashboard route
- Test full flow: land on site → redirect to login → sign in → dashboard

### 2. CT200 Environment Setup
- SSH into CT200
- Create `/opt/Peptide_Journal/.env.local` with Supabase keys
- Add CT200 redirect URL to Supabase: `http://[CT200-IP]:3030/auth/callback`
- Deploy and verify on production

### 3. Lab Page — Open Folder Panel
- `onOpen(folder)` handler is wired but panel UI doesn't exist
- Slide-up panel showing folder contents
- Each file: icon + name + date + "Analyze" button
- "Upload to folder" button at top of panel

### 4. Data Layer Setup
- Install `idb` package: `npm install idb`
- Install `zustand`: `npm install zustand`
- Create `lib/store/labSlice.ts`
- Create `lib/store/canvasSlice.ts`
- Create `lib/db/indexeddb.ts` — pj_lab_data + pj_results stores

### 5. Canvas ↔ Lab Handoff
- DataCard "Analyze in Canvas" → `dispatchEvent('pj:load-data', { dataId })`
- Canvas reads from IndexedDB by dataId on load
- Canvas "Save Analysis" → writes to `pj_results`
- Lab results shelf appears automatically

---

## FILE REFERENCE

### New Files This Session
| File | Purpose |
|---|---|
| `utils/supabase/client.ts` | Browser Supabase client |
| `utils/supabase/server.ts` | Server Supabase client |
| `middleware.ts` | Route guard |
| `app/auth/callback/route.ts` | OAuth callback |
| `app/login/layout.tsx` | Standalone login layout |
| `app/login/page.tsx` | Login page |
| `app/_components/ui/MagicRings.jsx` | WebGL rings component |
| `docs/PROJECT_MASTER.md` | Master project document |
| `docs/HANDOFF_004.md` | This file |

### Key Existing Files
| File | Purpose |
|---|---|
| `app/(pages)/lab/page.jsx` | Health Data Vault |
| `app/(pages)/bookshelf/page.jsx` | Bookshelf + PDF viewer |
| `app/(pages)/research/page.jsx` | Canvas — React Flow |
| `app/(pages)/(website)/page.jsx` | Dashboard |
| `app/_components/ui/dashboard/top-bar.jsx` | Global nav |
| `public/templates/` | 4 protocol JSON templates |
| `.env.local` | Supabase keys (not in git) |

---

## ARCHITECTURE DECISIONS MADE THIS SESSION

### TypeScript Going Forward
All new files use `.ts` / `.tsx`. Existing `.jsx` files stay as-is.
Reason: Electron conversion will require typed IPC, local store, MCP integration.

### Mobile Framework
React Native (Expo) — Phase 6, after Electron.
Shares: TypeScript interfaces, Zustand stores, Supabase client, LLM calls.
Mobile-specific: React Navigation, AsyncStorage, no WebGL (Lottie instead of MagicRings).

### Platform Roadmap
```
Web (Next.js) → Electron → Mobile (React Native)
```

### Supabase Key Format
Use legacy `eyJ...` JWT anon key, NOT the new `sb_publishable_...` format.
The `@supabase/ssr` package does not support the new format yet.

---

## LOCKED DECISIONS (carried forward)
- TopBar always `#0d1117`
- Banner above TopBar, per-page, never in layout
- `framer-motion` not `motion/react`
- No emojis of any kind in work product
- Canvas: users never touch nodes — premade, silent execution
- IndexedDB for structured data, not localStorage
- New files: `.ts`/`.tsx` — existing files stay `.jsx`

---

## NEXT SESSION PROMPT

```
Continue Peptide Journal development.
Read: docs/HANDOFF_004.md
Read: docs/PROJECT_MASTER.md

Priority 1: Fix login page — MagicRings WebGL background not rendering,
post-login redirect going to 404. Fix both then test full auth flow.

Priority 2: Set up CT200 production environment (.env.local on server,
add production redirect URL to Supabase, deploy and verify).

Priority 3: Lab page open folder panel — slide-up panel with file list,
Analyze button per file, Upload button at top.

Priority 4: Install idb + zustand, create data layer
(lib/store/, lib/db/indexeddb.ts).

GitHub: https://github.com/KodeRacer5/Peptide_Journal.git
Dev: http://localhost:3000
Deploy: ssh ct200 "cd /opt/Peptide_Journal && git pull origin main && npm install && npm run build && pm2 restart peptide-journal"
```
