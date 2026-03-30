/* ════════════════════════════════════════════════════════════════
   RadialCommandMenu.tsx — CortixHealth Radial Navigation Controller
   Apple-quality glassmorphic design with CortixHealth pipeline context
   Circle 1: center hub (360, 1 section)
   Circle 2: inner ring (360, 8 pie sections, 10px gaps)
   Circle 3: outer partial ring (180, 3 large sections, 10px gaps)
   ════════════════════════════════════════════════════════════════ */
import React, { useState, useCallback, useMemo } from 'react';

// ── Types ────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  subs: string[];
}

interface RadialCommandMenuProps {
  sections?: Section[];
  onSelect?: (selection: { section: string; sub: string; path: string }) => void;
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}

// ── CortixHealth Pipeline Sections ───────────────────────────
const DEFAULT_SECTIONS: Section[] = [
  { id: 'diagnostics', label: 'Diagnostics', subs: ['Lab Panel', 'Imaging', 'Screening'] },
  { id: 'vitals',      label: 'Vitals',      subs: ['Heart Rate', 'Blood Pressure', 'SpO2'] },
  { id: 'records',     label: 'Records',     subs: ['Patient File', 'History', 'Notes'] },
  { id: 'agents',      label: 'Agents',      subs: ['CortixEngine', 'Validator', 'Router'] },
  { id: 'tools',       label: 'Tools',       subs: ['Calculator', 'Converter', 'Templates'] },
  { id: 'settings',    label: 'Settings',    subs: ['Preferences', 'Profiles', 'Permissions'] },
  { id: 'navigate',    label: 'Navigate',    subs: ['Patient Flow', 'Pipeline View', 'Canvas Map'] },
  { id: 'comms',       label: 'Comms',       subs: ['Messages', 'Alerts', 'Reports'] },
];

// ── Icons (24x24 viewBox) — healthcare/pipeline themed ───────
const IC: Record<string, React.ReactNode> = {
  diagnostics: (
    <g>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" opacity=".3"/>
      <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
    </g>
  ),
  vitals: (
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
  ),
  records: (
    <g>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
      <path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h5v2H8z" opacity=".5"/>
    </g>
  ),
  agents: (
    <g>
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 2a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2z"/>
      <rect x="9" y="13" width="6" height="7" rx="1"/>
      <path d="M7 15h2v3H7zm8 0h2v3h-2z" opacity=".5"/>
    </g>
  ),
  tools: (
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
  ),
  settings: (
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  ),
  navigate: (
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  ),
  comms: (
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
  ),
  back: (
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  ),
};

// ── Dot Patterns ─────────────────────────────────────────────
const DOTS = [
  [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
  [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
  [[0, 0, 1], [0, 1, 0], [1, 0, 0]],
];

// ── Geometry ─────────────────────────────────────────────────
const D2R = Math.PI / 180;

function p2c(cx: number, cy: number, r: number, deg: number) {
  const a = (deg - 90) * D2R;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, ri: number, ro: number, sa: number, ea: number) {
  const a = p2c(cx, cy, ro, ea), b = p2c(cx, cy, ro, sa);
  const c = p2c(cx, cy, ri, sa), d = p2c(cx, cy, ri, ea);
  const l = ea - sa > 180 ? '1' : '0';
  return `M${a.x} ${a.y}A${ro} ${ro} 0 ${l} 0 ${b.x} ${b.y}L${c.x} ${c.y}A${ri} ${ri} 0 ${l} 1 ${d.x} ${d.y}Z`;
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════
const RadialCommandMenu: React.FC<RadialCommandMenuProps> = ({
  sections = DEFAULT_SECTIONS,
  onSelect,
  size = 680,
  centerLabel = 'CortixHealth',
  centerSub = 'Pipeline Control',
}) => {
  const CX = size / 2;
  const CY = size / 2;
  const GAP = 20;

  // Circle 1: Center hub
  const c1R = 80;

  // Circle 2: Inner ring, 8 slices
  const c2i = c1R + GAP;
  const c2o = 220;

  // Circle 3: Outer partial ring, 180deg, 3 sections
  const c3i = c2o + GAP;
  const c3o = c3i + 92;

  const N = 8;
  const SLICE = 360 / N;
  const midR2 = (c2i + c2o) / 2;
  const gapDeg2 = ( 2/ midR2) * (180 / Math.PI);

  // Circle 3 geometry
  const C3_TOTAL = 190;
  const C3_N = 3;
  const midR3 = (c3i + c3o) / 2;
  const gapDeg3 = ( 7/ midR3) * (180 / Math.PI);
  const c3Slice = (C3_TOTAL - (C3_N - 1) * gapDeg3) / C3_N;

  // Default to Navigate (index 6)
  const [active, setActive] = useState<number | null>(6);
  const [hI, setHI] = useState<string | null>(null);
  const [hO, setHO] = useState<number | null>(null);

  const handleI = useCallback((i: number) => {
    setActive((prev) => (prev === i ? null : i));
    setHO(null);
  }, []);

  const handleO = useCallback(
    (label: string) => {
      if (active === null) return;
      const sec = sections[active];
      onSelect?.({ section: sec.id, sub: label, path: `${sec.label} > ${label}` });
    },
    [active, sections, onSelect]
  );

  const handleBack = useCallback(() => {
    setActive(null);
    setHO(null);
  }, []);

  const subs = active !== null ? sections[active].subs : [];
  const showC3 = active !== null;

  const fid = useMemo(() => `rcm-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <div style={{ position: 'fixed', top: 280, right: 190, width: size, height: size, overflow: 'visible', zIndex: 999 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          overflow: 'visible',
          
        }}
      >
        <defs>
          {/* Center hub — frosted glass */}
          <radialGradient id={`${fid}-hub`} cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgba(62,62,72,0.97)" />
            <stop offset="55%" stopColor="rgba(34,34,40,0.98)" />
            <stop offset="100%" stopColor="rgba(16,16,20,0.99)" />
          </radialGradient>

          {/* Slice gradients */}
          <linearGradient id={`${fid}-sDk`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(26,26,32,0.96)" />
            <stop offset="100%" stopColor="rgba(16,16,20,0.96)" />
          </linearGradient>
          <linearGradient id={`${fid}-sMd`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(42,42,50,0.93)" />
            <stop offset="100%" stopColor="rgba(30,30,36,0.93)" />
          </linearGradient>

          {/* Gold active — warm amber */}
          <linearGradient id={`${fid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(218,182,60,0.96)" />
            <stop offset="50%" stopColor="rgba(198,162,42,0.94)" />
            <stop offset="100%" stopColor="rgba(172,142,32,0.92)" />
          </linearGradient>

          {/* Hover lift */}
          <linearGradient id={`${fid}-hov`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(58,58,68,0.95)" />
            <stop offset="100%" stopColor="rgba(44,44,52,0.95)" />
          </linearGradient>

          {/* Outer ring gradients */}
          <linearGradient id={`${fid}-oDk`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(28,28,34,0.94)" />
            <stop offset="100%" stopColor="rgba(18,18,22,0.94)" />
          </linearGradient>
          <linearGradient id={`${fid}-oMd`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(44,44,52,0.91)" />
            <stop offset="100%" stopColor="rgba(32,32,38,0.91)" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`${fid}-glow`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="0.85 0 0 0 0.08  0 0.72 0 0 0.04  0 0 0.18 0 0  0 0 0 0.35 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══ CIRCLE 3 — OUTER PARTIAL RING ═══ */}
        {showC3 &&
          subs.slice(0, 3).map((label, i) => {
            const C3_START = 180 - 1 * (c3Slice + gapDeg3) - c3Slice / 2 - 3.5 * (c3Slice + gapDeg3);
            const sa = C3_START + i * (c3Slice + gapDeg3);
            const ea = sa + c3Slice;
            const isH = hO === i;
            const mid = (sa + ea) / 2;
            const labP = p2c(CX, CY, (c3i + c3o) * 0.54, mid);
            const dotP = p2c(CX, CY, (c3i + c3o) * 0.40, mid);
            const pat = DOTS[i % DOTS.length];

            return (
              <g
                key={`c3-${i}`}
                onMouseEnter={() => setHO(i)}
                onMouseLeave={() => setHO(null)}
                onClick={() => handleO(label)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={arcPath(CX, CY, c3i, c3o, sa, ea)}
                  fill={isH ? `url(#${fid}-gold)` : i % 2 ? `url(#${fid}-oDk)` : `url(#${fid}-oMd)`}
                  stroke="rgba(140,140,160,0.10)"
                  strokeWidth="0.7"
                  filter={isH ? `url(#${fid}-glow)` : undefined}
                  style={{ transition: 'fill 0.22s ease, filter 0.22s ease' }}
                />
                <text
                  x={labP.x}
                  y={labP.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isH ? 'rgba(20,20,24,0.95)' : 'rgba(215,215,228,0.85)'}
                  fontSize="14"
                  fontWeight="500"
                  letterSpacing=".05em"
                  style={{ pointerEvents: 'none', transition: 'fill 0.22s ease' }}
                >
                  {label}
                </text>
                <g transform={`translate(${dotP.x},${dotP.y})`} style={{ pointerEvents: 'none' }}>
                  {pat.map((row, ri) =>
                    row.map((f, ci) => (
                      <circle
                        key={`${ri}${ci}`}
                        cx={(ci - (row.length - 1) / 2) * 4.5}
                        cy={(ri - (pat.length - 1) / 2) * 4.5}
                        r="1.6"
                        fill={
                          f
                            ? isH ? 'rgba(20,20,24,0.4)' : 'rgba(195,195,215,0.45)'
                            : 'rgba(195,195,215,0.06)'
                        }
                        style={{ transition: 'fill 0.22s ease' }}
                      />
                    ))
                  )}
                </g>
              </g>
            );
          })}

        {/* ═══ CIRCLE 2 — INNER RING (360, 8 slices) ═══ */}
        {sections.map((sec, i) => {
          const rawSa = i * SLICE;
          const sa = rawSa + gapDeg2 / 2;
          const ea = rawSa + SLICE - gapDeg2 / 2;
          const isA = active === i;
          const isH = hI === sec.id && !isA;

          let fill = i % 2 ? `url(#${fid}-sDk)` : `url(#${fid}-sMd)`;
          if (isA) fill = `url(#${fid}-gold)`;
          else if (isH) fill = `url(#${fid}-hov)`;

          const mid = (sa + ea) / 2;
          const iconP = p2c(CX, CY, (c2i + c2o) * 0.42, mid);
          const labP = p2c(CX, CY, (c2i + c2o) * 0.78, mid);

          return (
            <g
              key={sec.id}
              onMouseEnter={() => setHI(sec.id)}
              onMouseLeave={() => setHI(null)}
              onClick={() => handleI(i)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={arcPath(CX, CY, c2i, c2o, sa, ea)}
                fill={fill}
                stroke="rgba(140,140,160,0.10)"
                strokeWidth="0.7"
                filter={isA ? `url(#${fid}-glow)` : undefined}
                style={{ transition: 'fill 0.22s ease, filter 0.22s ease' }}
              />
              {/* Icon */}
              <svg
                x={iconP.x - 15}
                y={iconP.y - 15}
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill={isA ? 'rgba(20,20,24,0.95)' : 'rgba(210,210,225,0.8)'}
                style={{ pointerEvents: 'none', transition: 'fill 0.22s ease' } as any}
              >
                {IC[sec.id] || IC.settings}
              </svg>
              {/* Label */}
              <text
                x={labP.x}
                y={labP.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isA ? 'rgba(20,20,24,0.95)' : 'rgba(210,210,225,0.8)'}
                fontSize="14"
                fontWeight="500"
                letterSpacing=".05em"
                style={{ pointerEvents: 'none', transition: 'fill 0.22s ease' }}
              >
                {sec.label}
              </text>
            </g>
          );
        })}

        {/* ═══ Ambient depth rings ═══ */}
        {[c2i, c2o, c3i, c3o].map((r, i) => (
          <circle
            key={`ring-${i}`}
            cx={CX} cy={CY} r={r}
            fill="none"
            stroke={`rgba(140,140,160,${i < 2 ? 0.05 : 0.03})`}
            strokeWidth="0.5"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {/* ═══ CIRCLE 1 — CENTER HUB ═══ */}
        {/* Soft outer glow */}
        <circle
          cx={CX} cy={CY} r={c1R + 4}
          fill="none"
          stroke="rgba(175,168,148,0.05)"
          strokeWidth="8"
          style={{ pointerEvents: 'none' }}
        />
        {/* Hub body */}
        <circle
          cx={CX} cy={CY} r={c1R}
          fill={`url(#${fid}-hub)`}
          stroke="rgba(110,110,130,0.14)"
          strokeWidth="1.2"
        />
        {/* Glass edge highlight */}
        <circle
          cx={CX} cy={CY} r={c1R - 2}
          fill="none"
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="0.8"
          style={{ pointerEvents: 'none' }}
        />

        {active !== null ? (
          <g onClick={handleBack} style={{ cursor: 'pointer' }}>
            <circle cx={CX} cy={CY} r={c1R} fill="transparent" />
            {/* Back arrow */}
            <svg
              x={CX - 9}
              y={CY - 22}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="rgba(205,205,218,0.75)"
              style={{ pointerEvents: 'none' } as any}
            >
              {IC.back}
            </svg>
            <text
              x={CX}
              y={CY + 4}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(222,222,235,0.93)"
              fontSize="15"
              fontWeight="600"
              letterSpacing=".03em"
            >
              {sections[active].label}
            </text>
            <text
              x={CX}
              y={CY + 18}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(145,145,162,0.45)"
              fontSize="8"
              fontWeight="500"
              letterSpacing=".14em"
            >
              TAP TO GO BACK
            </text>
          </g>
        ) : (
          <g>
            <text
              x={CX}
              y={CY - 5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(228,228,240,0.93)"
              fontSize="16"
              fontWeight="600"
              letterSpacing=".03em"
            >
              {centerLabel}
            </text>
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(145,145,162,0.45)"
              fontSize="11"
              fontWeight="400"
              letterSpacing=".08em"
            >
              {centerSub}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default RadialCommandMenu;

