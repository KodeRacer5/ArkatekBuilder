import React, { useState, useEffect, useMemo } from 'react';
import { NodeResizer, type NodeProps } from '@xyflow/react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DREAMSVertical {
  id: string;
  label: string;
  keywords: string;
  color1: string;
  color2: string;
  qualified?: boolean;
}

export interface DREAMSSelectorNodeData {
  orientation?: 'left' | 'right'; // which side has the hub
  qualifiedMap?: Partial<Record<string, boolean>>;
  onSelect?: (vertical: DREAMSVertical) => void;
  centerLabel?: string;
  centerSub?: string;
  label?: string; // ReactFlow node label (unused visually)
}

// ── Vertical definitions ───────────────────────────────────────────────────────

const VERTICALS: DREAMSVertical[] = [
  { id: 'debt',       label: 'Debt Management',      keywords: 'RESTRUCTURE · FUNDING · SBA',   color1: '#fb6b56', color2: '#b82010' },
  { id: 'retirement', label: 'Retirement & Planning', keywords: '401K · IRA · KEY-PERSON',       color1: '#e080b0', color2: '#904070' },
  { id: 'expense',    label: 'Expense Management',    keywords: 'ENERGY · HEALTHCARE · PAYROLL', color1: '#fcd050', color2: '#b88000' },
  { id: 'asset',      label: 'Asset Management',      keywords: 'PROTECT · OPTIMIZE · GROW',     color1: '#60d080', color2: '#208840' },
  { id: 'money',      label: 'Money Management',      keywords: 'CASH FLOW · R&D · CREDITS',     color1: '#50b8b0', color2: '#106890' },
  { id: 'security',   label: 'Security & Succession', keywords: 'CYBER · COMPLIANCE · RISK',     color1: '#c8d850', color2: '#789000' },
];

// ── Arc angles — 6 items evenly distributed ───────────────────────────────────
const ARC_ANGLES_DEG = [-40, -24, -8, 8, 24, 40];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

// ── Proportional geometry ratios (derived from working 780×700 layout) ────────
// These ratios are locked — never change them. They define the visual language.
const RATIOS = {
  // Hub position — right side (left orientation) or left side (right orientation)
  hubXRight: 0.801, // HX=625 / 780
  hubXLeft:  0.199, // HX=155 / 780
  hubY:      0.500, // HY=350 / 700

  hubR:       0.207, // 145/700 — hub radius as fraction of height
  innerRing:  0.247, // 173/700 — inner dashed ring
  outerRing:  0.443, // 310/700 — outer subtle ring

  arcDist:    0.474, // 370/780 — hub-center to pill-center, fraction of width
  nodeR:      0.228, // 178/780 — hub-center to connector dot, fraction of width

  pillW:      0.308, // 240/780 — pill width fraction of total width
  pillH:      0.091, // 64/700  — pill height fraction of total height
  pillR:      0.046, // 32/700  — pill corner radius fraction of height
};

// ── Default node dimensions ───────────────────────────────────────────────────
export const DREAMS_NODE_DEFAULTS = {
  sm: { width: 520,  height: 460 },
  lg: { width: 820,  height: 700 },
};

// ── Factory — create a ReactFlow node object ──────────────────────────────────
export function createDREAMSNode(
  id: string,
  orientation: 'left' | 'right',
  size: 'sm' | 'lg',
  position: { x: number; y: number },
  extra?: Partial<DREAMSSelectorNodeData>,
) {
  const dims = DREAMS_NODE_DEFAULTS[size];
  return {
    id,
    type: 'dreamsSelector',
    position,
    width:  dims.width,
    height: dims.height,
    data: { orientation, ...extra } satisfies DREAMSSelectorNodeData,
  };
}

// ── CSS animation injection (once per document) ───────────────────────────────
const ANIM_ID = 'dsn-keyframes';
const ANIMATIONS = `
  @keyframes dsn-hub-in  { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes dsn-ring-in { from{opacity:0;transform:scale(0.6) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes dsn-pill-l  { from{opacity:0;transform:translateX(-40px) scaleX(0.7)} to{opacity:1;transform:translateX(0) scaleX(1)} }
  @keyframes dsn-pill-r  { from{opacity:0;transform:translateX(40px)  scaleX(0.7)} to{opacity:1;transform:translateX(0) scaleX(1)} }
  @keyframes dsn-line-in { from{opacity:0;stroke-dashoffset:60} to{opacity:0.85;stroke-dashoffset:0} }
`;

function ensureAnimations() {
  if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
    const s = document.createElement('style');
    s.id = ANIM_ID;
    s.textContent = ANIMATIONS;
    document.head.appendChild(s);
  }
}

// ── Geometry computation ──────────────────────────────────────────────────────

interface PillGeo {
  nx: number; ny: number;   // connector dot on hub ring
  pcx: number; pcy: number; // pill center
  px: number; py: number;   // pill rect top-left
}

function computeGeo(width: number, height: number, orientation: 'left' | 'right') {
  const hubXRatio = orientation === 'left' ? RATIOS.hubXRight : RATIOS.hubXLeft;
  const HX = width  * hubXRatio;
  const HY = height * RATIOS.hubY;
  const HR = height * RATIOS.hubR;
  const innerR = height * RATIOS.innerRing;
  const outerR = height * RATIOS.outerRing;
  const arcDist = width  * RATIOS.arcDist;
  const nodeR   = width  * RATIOS.nodeR;
  const PW = width  * RATIOS.pillW;
  const PH = height * RATIOS.pillH;
  const PR = height * RATIOS.pillR;

  // Direction sign: left-orientation → pills extend LEFT (−cos), right → RIGHT (+cos)
  const sign = orientation === 'left' ? -1 : 1;

  const pills: PillGeo[] = ARC_ANGLES_DEG.map((deg) => {
    const rad = toRad(deg);
    const nx  = HX + sign * nodeR  * Math.cos(rad);
    const ny  = HY +       nodeR  * Math.sin(rad);
    const pcx = HX + sign * arcDist * Math.cos(rad);
    const pcy = HY +       arcDist * Math.sin(rad);
    return { nx, ny, pcx, pcy, px: pcx - PW / 2, py: pcy - PH / 2 };
  });

  // Connector line endpoint: pill edge facing the hub
  // left-orientation: right edge of pill = pcx + PW/2
  // right-orientation: left edge of pill = pcx - PW/2 = px
  const pillConnectorX = (g: PillGeo) =>
    orientation === 'left' ? g.pcx + PW / 2 : g.px;

  return { HX, HY, HR, innerR, outerR, PW, PH, PR, pills, pillConnectorX };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DREAMSSelectorNodeProps extends NodeProps {
  width?: number;
  height?: number;
  data: DREAMSSelectorNodeData;
}

const DREAMSSelectorNode: React.FC<DREAMSSelectorNodeProps> = ({
  data,
  width  = DREAMS_NODE_DEFAULTS.lg.width,
  height = DREAMS_NODE_DEFAULTS.lg.height,
}) => {
  const {
    orientation  = 'left',
    qualifiedMap = {},
    onSelect,
    centerLabel  = 'DREAMS',
    centerSub    = 'SCORE',
  } = data;

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    ensureAnimations();
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Recompute all geometry when dimensions change
  const geo = useMemo(
    () => computeGeo(width, height, orientation),
    [width, height, orientation],
  );

  const { HX, HY, HR, innerR, outerR, PW, PH, PR, pills, pillConnectorX } = geo;

  // Proportional font sizes
  const unit = Math.min(width, height);
  const fs = {
    hubSub:   Math.max(7,  unit * 0.016),
    hubMain:  Math.max(12, unit * 0.040),
    hubScore: Math.max(10, unit * 0.025),
    pillMain: Math.max(9,  unit * 0.022),
    pillSub:  Math.max(7,  unit * 0.013),
    dotR:     Math.max(3,  unit * 0.008),
  };

  const hasMap = Object.keys(qualifiedMap).length > 0;
  const pillAnim = orientation === 'left' ? 'dsn-pill-l' : 'dsn-pill-r';

  // Unique ID prefix so multiple instances don't clash on gradients/filters
  const uid = useMemo(() => `dsn-${Math.random().toString(36).slice(2, 7)}`, []);

  return (
    <div
      className="nopan nodrag"
      style={{
        width:    '100%',
        height:   '100%',
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* ReactFlow resize handles */}
      <NodeResizer
        minWidth={260}
        minHeight={220}
        maxWidth={1400}
        maxHeight={1200}
        lineStyle={{ borderColor: 'rgba(255,255,255,0.15)' }}
        handleStyle={{ background: 'rgba(255,255,255,0.25)', borderColor: 'transparent', width: 8, height: 8 }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Per-vertical pill gradients */}
          {VERTICALS.map((v, i) => (
            <linearGradient key={v.id} id={`${uid}-g${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={v.color1} />
              <stop offset="100%" stopColor={v.color2} />
            </linearGradient>
          ))}

          {/* Hub gradient */}
          <radialGradient id={`${uid}-hub`}
            cx={orientation === 'left' ? '60%' : '40%'} cy="35%" r="65%">
            <stop offset="0%"   stopColor="#1e1e30" />
            <stop offset="100%" stopColor="#050510" />
          </radialGradient>

          {/* Filters */}
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={HR * 0.05} stdDeviation={HR * 0.12}
              floodColor="#000" floodOpacity="0.7" />
          </filter>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy={HR * 0.04} stdDeviation={HR * 0.07}
              floodColor="#000" floodOpacity="0.5" />
          </filter>

          {/* Per-vertical glow filters */}
          {VERTICALS.map((v, i) => (
            <filter key={i} id={`${uid}-glow${i}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation={HR * 0.1}
                floodColor={v.color1} floodOpacity="0.65" />
            </filter>
          ))}
        </defs>

        {/* ── OUTER RING ── */}
        <circle
          cx={HX} cy={HY} r={outerR}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={Math.max(0.5, HR * 0.008)}
          strokeDasharray="3 10"
          style={{
            transformOrigin: `${HX}px ${HY}px`,
            animation: mounted ? `dsn-ring-in 0.8s cubic-bezier(0.34,1.2,0.64,1) 0.05s both` : 'none',
            opacity: mounted ? undefined : 0,
          }}
        />

        {/* ── INNER RING ── */}
        <circle
          cx={HX} cy={HY} r={innerR}
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth={Math.max(2, HR * 0.055)}
          strokeDasharray="4 8"
          style={{
            transformOrigin: `${HX}px ${HY}px`,
            animation: mounted ? `dsn-ring-in 0.8s cubic-bezier(0.34,1.2,0.64,1) 0.05s both` : 'none',
            opacity: mounted ? undefined : 0,
          }}
        />

        {/* ── HUB ── */}
        <g style={{
          transformOrigin: `${HX}px ${HY}px`,
          animation: mounted ? `dsn-hub-in 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.1s both` : 'none',
          opacity: mounted ? undefined : 0,
        }}>
          {/* Hub body */}
          <circle cx={HX} cy={HY} r={HR}
            fill={`url(#${uid}-hub)`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={Math.max(1, HR * 0.014)}
            filter={`url(#${uid}-shadow)`}
          />
          {/* Inner edge */}
          <circle cx={HX} cy={HY} r={HR * 0.92}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={Math.max(0.5, HR * 0.007)}
          />

          {/* Hub text */}
          <text x={HX} y={HY - HR * 0.23}
            textAnchor="middle" fill="rgba(255,255,255,0.38)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubSub, fontWeight: 700, letterSpacing: '0.22em' }}>
            BUSINESS
          </text>
          <text x={HX} y={HY + HR * 0.02}
            textAnchor="middle" fill="white"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubMain, fontWeight: 900, letterSpacing: '0.08em' }}>
            {centerLabel}
          </text>
          <text x={HX} y={HY + HR * 0.22}
            textAnchor="middle" fill="rgba(255,255,255,0.85)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubScore, fontWeight: 700, letterSpacing: '0.14em' }}>
            {centerSub}
          </text>

          {/* Color indicator dots */}
          {VERTICALS.map((v, i) => (
            <circle key={v.id}
              cx={HX - HR * 0.5 + i * HR * 0.2}
              cy={HY + HR * 0.52}
              r={fs.dotR}
              fill={v.color1}
              opacity={qualifiedMap[v.id] ? 1 : 0.3}
            />
          ))}
        </g>

        {/* ── PILLS ── */}
        {VERTICALS.map((v, i) => {
          const g      = pills[i];
          const isH    = hovered === i;
          const isQ    = qualifiedMap[v.id] ?? false;
          const opaque = isQ || !hasMap;
          const delay  = `${0.20 + i * 0.07}s`;
          const lineDelay = `${0.25 + i * 0.07}s`;

          return (
            <g key={v.id}>
              {/* Connector line */}
              <line
                x1={g.nx} y1={g.ny}
                x2={pillConnectorX(g)} y2={g.pcy}
                stroke={v.color1}
                strokeWidth={Math.max(1, isH ? HR * 0.015 : HR * 0.012)}
                strokeLinecap="round"
                strokeDasharray="5 6"
                style={{
                  animation: mounted
                    ? `dsn-line-in 0.4s ease-out ${lineDelay} both`
                    : 'none',
                  opacity: mounted ? undefined : 0,
                  transition: 'stroke-width 0.2s',
                }}
              />

              {/* Connector dot */}
              <circle cx={g.nx} cy={g.ny}
                r={fs.dotR * 1.5} fill={v.color1} opacity={0.9} />
              <circle cx={g.nx} cy={g.ny}
                r={fs.dotR * 0.75} fill="white" opacity={0.6} />

              {/* Pill group */}
              <g
                filter={isH ? `url(#${uid}-glow${i})` : `url(#${uid}-soft)`}
                style={{
                  opacity: mounted ? (opaque ? 1 : 0.32) : 0,
                  cursor: opaque ? 'pointer' : 'default',
                  animation: mounted
                    ? `${pillAnim} 0.55s cubic-bezier(0.34,1.4,0.64,1) ${delay} both`
                    : 'none',
                  transition: 'opacity 0.3s ease, filter 0.22s ease',
                  transformOrigin: `${g.pcx}px ${g.pcy}px`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => opaque && onSelect?.({ ...v, qualified: isQ })}
              >
                {/* Pill body */}
                <rect x={g.px} y={g.py} width={PW} height={PH} rx={PR} ry={PR}
                  fill={`url(#${uid}-g${i})`} />

                {/* Specular highlight */}
                <rect
                  x={g.px + PR} y={g.py + PH * 0.04}
                  width={PW - PR * 2} height={Math.max(1, PH * 0.04)}
                  fill="rgba(255,255,255,0.22)" rx={1}
                />

                {/* Label */}
                <text
                  x={g.pcx} y={g.pcy - PH * 0.1}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white"
                  style={{
                    fontFamily: "'DM Sans',system-ui,sans-serif",
                    fontSize: fs.pillMain,
                    fontWeight: 900,
                    letterSpacing: '0.03em',
                  }}
                >
                  {v.label}
                </text>

                {/* Keywords sublabel */}
                <text
                  x={g.pcx} y={g.pcy + PH * 0.25}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.68)"
                  style={{
                    fontFamily: "'DM Sans',system-ui,sans-serif",
                    fontSize: fs.pillSub,
                    letterSpacing: '0.07em',
                  }}
                >
                  {v.keywords}
                </text>

                {/* Qualified indicator */}
                {isQ && (
                  <circle
                    cx={orientation === 'left' ? g.px + PR * 0.6 : g.px + PW - PR * 0.6}
                    cy={g.pcy}
                    r={fs.dotR}
                    fill="white" opacity={0.9}
                  />
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DREAMSSelectorNode;

// ── ReactFlow registration helper ─────────────────────────────────────────────
export const DREAMS_NODE_TYPES = {
  dreamsSelector: DREAMSSelectorNode,
};
