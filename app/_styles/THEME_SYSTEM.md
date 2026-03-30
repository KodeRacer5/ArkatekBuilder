# Peptide Journal — Theme System Reference

## How It Works

Theme switching is controlled by `data-theme` attribute on `<body>`.  
Set by `shelf-theme-context.jsx` when user clicks a theme dot on bookshelf.

```
User clicks dot → setTheme(idx) → document.body.setAttribute('data-theme', key) → CSS vars activate
```

---

## File Map

| File | Role |
|---|---|
| `app/_styles/gruvbox-dark-theme.css` | All CSS vars — defaults in `:root`, overrides in `[data-theme="gruvbox"]` |
| `app/_styles/globals.css` | Imports gruvbox-dark-theme.css (must be first line) |
| `app/_providers/shelf-theme-context.jsx` | Theme state, localStorage persistence, body attribute |
| `app/(pages)/layout.jsx` | Inline script sets `data-theme` before first paint (prevents flash) |

---

## CSS Var Reference

### Switchable vars (change per theme)

| Var | Default | Gruvbox |
|---|---|---|
| `--canvas-bg` | `#0c0e14` | `#282828` |
| `--node-bg` | `#1a1d24` | `#32302f` |
| `--node-border` | `rgba(255,255,255,0.12)` | `#3c3836` |
| `--topbar-bg` | `#0d1117` | `#32302f` |
| `--widget-bg` | `rgba(30,35,45,0.72)` | `rgba(80,73,69,0.72)` |
| `--dock-bg` | `rgba(30,35,45,0.72)` | `rgba(80,73,69,0.72)` |

### Always-available Gruvbox palette vars

```
--gb-bg         #282828    canvas/page bg
--gb-bg-soft    #32302f    panels, topbar
--gb-bg-1       #3c3836    raised surfaces
--gb-bg-2       #504945    inputs
--gb-bg-3       #665c54    hover
--gb-fg-1       #ebdbb2    primary text
--gb-fg-4       #a89984    dim text
--gb-yellow-bright  #fabd2f
--gb-red-bright     #fb4934
--gb-green-bright   #b8bb26
--gb-blue-bright    #83a598
```

---

## Common Bug: Nodes/canvas stuck on wrong color

**Symptom:** Nodes stay brown on navy theme, or stay dark on Gruvbox.

**Cause:** Component uses `var(--gb-node-bg)` or hardcoded hex instead of `var(--node-bg)`.

**Fix:**
```powershell
# Replace in MetaNodes.jsx
(Get-Content "app\(pages)\Meto_Engine\components\MetaNodes.jsx" -Raw) -replace "'#1a1d24'", "'var(--node-bg, #1a1d24)'" | Set-Content "app\(pages)\Meto_Engine\components\MetaNodes.jsx"

# Replace canvas bg in all pages
Get-ChildItem app -Recurse -Include "*.jsx" | Where {$_.FullName -notmatch "node_modules|\.next|\[id\]"} | ForEach-Object {
  (Get-Content $_.FullName -Raw) -replace "var\(--gb-canvas\)", "var(--canvas-bg, #0c0e14)" | Set-Content $_.FullName
}
```

---

## Common Bug: Theme flash on page load

**Symptom:** Wrong theme briefly visible before correct theme loads.

**Cause:** React hydrates before `shelf-theme-context` reads localStorage.

**Fix:** Inline script in `layout.jsx` runs before first paint:
```jsx
<script dangerouslySetInnerHTML={{ __html: `
  try {
    var idx = localStorage.getItem('pj_shelf_theme');
    var keys = ['navy','walnut','oak','ebony','steel','slate','gruvbox'];
    document.body.setAttribute('data-theme', idx !== null ? (keys[parseInt(idx)] || 'navy') : 'navy');
  } catch(e) {}
`}} />
```

---

## Common Bug: TopBar stays wrong color

**Symptom:** TopBar doesn't change when theme switches.

**Cause:** Hardcoded background instead of CSS var.

**Fix — top-bar.jsx line ~45:**
```js
// Wrong
background: '#0d1117'
background: 'var(--gb-bg-soft)'

// Correct
background: 'var(--topbar-bg, #0d1117)'
```

---

## Adding a New Theme

1. Add entry to `SHELF_THEMES` array in `shelf-theme-context.jsx`
2. Add `data-theme="yourkey"` block to `gruvbox-dark-theme.css`  
3. Add key to the `keys` array in `layout.jsx` inline script

---

## Theme Keys (index order matters)

```
0 = navy
1 = walnut
2 = oak
3 = ebony
4 = steel
5 = slate
6 = gruvbox
```

Index order in `layout.jsx` script must match `SHELF_THEMES` array order exactly.
