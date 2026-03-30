/**
 * Canvas Constants — style tokens, icon map, color scheme
 * Source: CortixEngineSynthesizer.tsx lines 101-255 + n8n _variables.scss
 *
 * Centralizes all visual constants. n8n uses CSS custom properties;
 * we merge that approach with CortixEngine's inline style objects.
 */

import React from 'react';
import type { NodeCategory, ClinicalNodeData } from './canvas.types';

/* ═══════════════════════════════════════════════════
   ICON MAP — unified icon registry (256 icons: Lucide + WireIcons)
   All existing IC keys preserved for backward compatibility.
   See src/components/icons/ for full icon system.
   ═══════════════════════════════════════════════════ */
export { IC } from '../../../components/icons';

/* ═══════════════════════════════════════════════════
   GLOBAL STROKE WIDTH — wire-thin aesthetic
   n8n uses strokeWidth ~1.5-2; CortixEngine uses 1 (per HANDOFF)
   ═══════════════════════════════════════════════════ */
export const SW = 1;

/* ═══════════════════════════════════════════════════
   CATEGORY COLOR SCHEME
   n8n uses CSS variables; we use typed objects for inline styles.
   Dark theme adapted for clinical aesthetic.
   ═══════════════════════════════════════════════════ */
export const CATEGORY_COLORS: Record<NodeCategory, { border: string; accent: string; bg: string }> = {
  data:       { border: 'rgba(195,175,155,0.2)', accent: '#c3af9b', bg: 'rgba(195,175,155,0.06)' },
  extension:  { border: 'rgba(130,160,180,0.2)', accent: '#82a0b4', bg: 'rgba(130,160,180,0.06)' },
  validation: { border: 'rgba(180,160,200,0.2)', accent: '#b4a0c8', bg: 'rgba(180,160,200,0.06)' },
  output:     { border: 'rgba(140,180,140,0.2)', accent: '#8cb48c', bg: 'rgba(140,180,140,0.06)' },
  unknown:    { border: 'rgba(200,170,130,0.25)', accent: '#c8aa82', bg: 'rgba(200,170,130,0.08)' },
  custom:     { border: 'rgba(160,160,180,0.2)', accent: '#a0a0b4', bg: 'rgba(160,160,180,0.06)' },
};

// Shorthand alias (matches original code's `C` variable name)
export const C = CATEGORY_COLORS;

/* ═══════════════════════════════════════════════════
   HANDLE STYLES — HTML prototype alignment
   Left (input) = rect, Right (output) = circle+rod+[+]
   ═══════════════════════════════════════════════════ */

/** Input handle: solid rect (10x25, borderRadius 3px) */
export const INPUT_HANDLE_STYLE: React.CSSProperties = {
  width: '10px',
  height: '25px',
  borderRadius: '3px',
  background: '#5a5a5a',
  border: 'none',
};
export const IH = INPUT_HANDLE_STYLE;

/** Output handle: styled as [+] button (24x24, the actual ReactFlow Handle) */
export const OUTPUT_HANDLE_STYLE: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  border: '3px solid #5a5a5a',
  background: 'rgba(32,32,40,0.95)',
};
export const OH = OUTPUT_HANDLE_STYLE;

/** Diamond handle: kept for Engine sub-ports only */
export const DIAMOND_HANDLE_STYLE: React.CSSProperties = {
  width: '10px',
  height: '10px',
  borderRadius: '2px',
  transform: 'rotate(45deg)',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(30,30,38,0.9)',
};
export const DH = DIAMOND_HANDLE_STYLE;

/* ═══════════════════════════════════════════════════
   STATUS COLORS (n8n pattern)
   Maps execution status to visual indicator colors
   ═══════════════════════════════════════════════════ */
export const STATUS_COLORS: Record<string, string> = {
  idle: 'transparent',
  running: '#eab308',    // amber — var(--color--warning)
  complete: '#22c55e',   // green — var(--color--success)
  error: '#ef4444',      // red   — var(--color--danger)
  waiting: '#f59e0b',    // orange
};

/* ═══════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES (n8n design token pattern)
   Applied to :root in canvas-animations.css
   ═══════════════════════════════════════════════════ */
export const CSS_VARS = {
  // Node dimensions
  '--canvas-node--width': '170px',
  '--canvas-node--height': '56px',
  '--canvas-node--circle-size': '64px',
  '--canvas-node--border-width': '1px',
  '--canvas-node--border-radius': '10px',

  // Colors
  '--color--success': '#22c55e',
  '--color--danger': '#ef4444',
  '--color--warning': '#eab308',
  '--color--primary': '#C2B9A7',
  '--color--background': '#1A1918',
  '--color--background-dark': '#1A1918',
  '--color--foreground': '#C8C5BC',
  '--color--foreground-dim': '#5A5754',

  // Spacing (n8n scale)
  '--spacing--xs': '8px',
  '--spacing--sm': '12px',
  '--spacing--md': '16px',

  // Typography
  '--font-size--2xs': '8px',
  '--font-size--xs': '10px',
  '--font-size--sm': '11px',
  '--font-size--md': '12px',

  // Canvas
  '--canvas-grid-gap': '20',
  '--canvas-grid-dot-size': '1.5',
  '--canvas-grid-dot-color': '#3D3B38',
} as const;

/* ═══════════════════════════════════════════════════
   NODE DIMENSIONS (for smart-edge routing)
   Critical: must match or exceed actual render size
   ═══════════════════════════════════════════════════ */
export const NODE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  rect: { width: 170, height: 56 },
  default: { width: 170, height: 56 },
  circle: { width: 64, height: 64 },
  stickyNote: { width: 200, height: 120 },
  pill: { width: 299, height: 120 },
  square: { width: 120, height: 120 },
  rounded: { width: 260, height: 120 },
  smRounded: { width: 140, height: 120 },
  tall: { width: 140, height: 120 },
  splitter: { width: 140, height: 120 },
  engine: { width: 260, height: 290 },
  dualOut: { width: 260, height: 120 },
};

/* ═══════════════════════════════════════════════════
   PER-NODE ACCENT COLORS (~30 clinical node accents)
   Used by palette entries via accentColor override
   ═══════════════════════════════════════════════════ */
export const NODE_ACCENT_COLORS: Record<string, string> = {
  // ACQUIRE
  lab: '#6bc1ff', meds: '#5ba0d0', symptoms: '#d070b0',
  history: '#c3af9b', imaging: '#a0afc3', vitals: '#4cd964',
  // ORGANIZE
  filter: '#8b7bec', split: '#d070b0', combine: '#e0a040', merge: '#40b0c0',
  // APPRAISE
  diffdiag: '#e06060', interaction: '#e8b84d', mechanism: '#b070d0',
  contraind: '#cc4444', crossref: '#60a0e0', causal: '#c3af9b',
  // APPLY
  hypothesis: '#b070d0', doseresp: '#e0a040', efficacy: '#50b060',
  riskben: '#e06060', safety: '#cc4444', evidence: '#60a0e0',
  // ASSESS
  summary: '#60a0e0', treatment: '#50b060', report: '#c3af9b',
  export: '#40b0c0', audit: '#8b7bec',
};

/* ═══════════════════════════════════════════════════
   CORTIXHEALTH ACCENT COLORS (wellness vertical)
   ═══════════════════════════════════════════════════ */
export const HEALTH_ACCENT_COLORS: Record<string, string> = {
  // INPUT (data nodes — neutral light tones)
  goals: '#96d4ff', supplements: '#a8dcff', dietary: '#b8e0ff',
  activity: '#88ccff', conditions: '#9ad0f8', allergies: '#a0d8ff',
  // BIOMETRICS — data nodes neutral, engines by function
  bracelet: '#8ed8c4', wearableImport: '#9adcc8', manualVitals: '#a6e0d0',
  hrv: '#ff9494',           // heart/cardio — warm red
  sleepStages: '#a78bfa',   // sleep — purple
  readiness: '#4ade80',     // readiness — green
  strain: '#f97316',        // strain/intensity — orange
  // ORGANIZE (utility nodes — soft lavender)
  filter: '#b0a5e8', split: '#baaeed', combine: '#c4b8f0', merge: '#a8a0e4',
  // OUTPUT (result nodes — soft greens)
  wellnessSummary: '#8ec89a', progress: '#98cca4', shopping: '#a2d0ae',
  schedule: '#88c494', exportplan: '#92c8a0',
  // KNOWLEDGE — data nodes neutral blue, engines by function
  compoundDb: '#92bbe0', interactionGraph: '#9cc0e4', pathwayMap: '#a6c6e8',
  evidenceBase: '#8cb6dc', formulationDb: '#96bce2',
  // NUTRITION engines — each distinct by function
  mealplan: '#4ade80',      // meal planning — fresh green
  stackbuilder: '#f59e0b',  // stacking/building — amber
  nutrientgap: '#38bdf8',   // analysis/search — sky blue
  hydration: '#22d3ee',     // water — cyan
  macros: '#e879f9',        // calculation — pink/magenta
  // REMEDIES engines — each distinct by function
  herbal: '#22c55e',        // plants — green
  homeopathic: '#c084fc',   // alternative — purple
  immune: '#f87171',        // immune/defense — red
  mineral: '#60a5fa',       // minerals — blue
  detox: '#2dd4bf',         // cleansing — teal
  essentialoil: '#fbbf24',  // essential oils — golden
  interactionCheck: '#fb923c', // warning/safety — orange
  pregnancyGuide: '#f9a8d4',   // nurturing — pink
  // HEALTH PLAN engines — each distinct by function
  exercise: '#34d399',      // movement — emerald
  recovery: '#a78bfa',      // rest/recovery — violet
  sleep: '#818cf8',         // sleep — indigo
  stress: '#fbbf24',        // calm/wind — warm yellow
  dosageTracker: '#fb923c', // monitoring — orange
  // SHOP engines — each distinct by function
  productCatalog: '#e8cc82', verifiedFormulation: '#4ade80',
  orderBuilder: '#38bdf8', priceCompare: '#f59e0b', qualityCert: '#22c55e',
};

/* ═══════════════════════════════════════════════════
   resolveNodeColors — accent-first color resolution
   Returns { accent, border, bg } from accentColor override
   or falls back to CATEGORY_COLORS[category]
   ═══════════════════════════════════════════════════ */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export function resolveNodeColors(data: Pick<ClinicalNodeData, 'accentColor' | 'category'>): {
  accent: string; border: string; bg: string;
} {
  if (data.accentColor) {
    const rgb = hexToRgb(data.accentColor);
    return {
      accent: data.accentColor,
      border: `rgba(${rgb},0.2)`,
      bg: `rgba(${rgb},0.06)`,
    };
  }
  return CATEGORY_COLORS[data.category] ?? CATEGORY_COLORS.unknown;
}

/* ═══════════════════════════════════════════════════
   EDGE DEFAULTS
   ═══════════════════════════════════════════════════ */
export const EDGE_STYLE = {
  stroke: 'rgba(195,175,155,0.5)',
  strokeWidth: 2,
} as const;

export const EDGE_MARKER = {
  color: 'rgba(195,175,155,0.3)',
  width: 8,
  height: 8,
} as const;


