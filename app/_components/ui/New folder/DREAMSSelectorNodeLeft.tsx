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

export interface DREAMSSelectorLeftData {
  qualifiedMap?: Partial<Record<string, boolean>>;
  onSelect?: (vertical: DREAMSVertical) => void;
  centerLabel?: string;
  centerSub?: string;
  label?: string;
}

// ── Orientation locked: hub RIGHT, pills extend LEFT ─────────────────────────
const ORIENTATION = 'left' as const;

// ── Vertical definitions ──────────────────────────────────────────────────────

const VERTICALS: DREAMSVertical[] = [
  { id: 'debt',       label: 'Debt Management',      keywords: 'RESTRUCTURE · FUNDING · SBA',   color1: '#fb6b56', color2: '#b82010' },
  { id: 'retirement', label: 'Retirement & Planning', keywords: '401K · IRA · KEY-PERSON',       color1: '#e080b0', color2: '#904070' },
  { id: 'expense',    label: 'Expense Management',    keywords: 'ENERGY · HEALTHCARE · PAYROLL', color1: '#fcd050', color2: '#b88000' },
  { id: 'asset',      label: 'Asset Management',      keywords: 'PROTECT · OPTIMIZE · GROW',     color1: '#60d080', color2: '#208840' },
  { id: 'money',      label: 'Money Management',      keywords: 'CASH FLOW · R&D · CREDITS',     color1: '#50b8b0', color2: '#106890' },
  { id: 'security',   label: 'Security & Succession', keywords: 'CYBER · COMPLIANCE · RISK',     color1: '#c8d850', color2: '#789000' },
];

const ARC_ANGLES_DEG = [-40, -24, -8, 8, 24, 40];
function toRad(deg: number) { return (deg * Math.PI) / 180; }

// ── Proportional ratios — locked to visual language ───────────────────────────
const R = {
  hubX:      0.801, // hub center X — right side
  hubY:      0.500,
  hubR:      0.207,
  innerRing: 0.247,
  outerRing: 0.443,
  arcDist:   0.474,
  nodeR:     0.228,
  pillW:     0.308,
  pillH:     0.091,
  pillRad:   0.046,
};

// ── Default dimensions ────────────────────────────────────────────────────────
export const DEFAULT_WIDTH  = 820;
export const DEFAULT_HEIGHT = 700;

// ── Geometry ──────────────────────────────────────────────────────────────────

interface PillGeo { nx: number; ny: number; pcx: number; pcy: number; px: number; py: number; }

function computeGeo(w: number, h: number) {
  const HX = w * R.hubX;
  const HY = h * R.hubY;
  const HR = h * R.hubR;
  const innerR = h * R.innerRing;
  const outerR = h * R.outerRing;
  const arcDist = w * R.arcDist;
  const nodeR   = w * R.nodeR;
  const PW = w * R.pillW;
  const PH = h * R.pillH;
  const PR = h * R.pillRad;

  // Pills extend LEFT → sign = -1
  const pills: PillGeo[] = ARC_ANGLES_DEG.map((deg) => {
    const rad = toRad(deg);
    const nx  = HX - nodeR   * Math.cos(rad);
    const ny  = HY + nodeR   * Math.sin(rad);
    const pcx = HX - arcDist * Math.cos(rad);
    const pcy = HY + arcDist * Math.sin(rad);
    return { nx, ny, pcx, pcy, px: pcx - PW / 2, py: pcy - PH / 2 };
  });

  // Connector exits RIGHT edge of pill (facing hub)
  const connX = (g: PillGeo) => g.pcx + PW / 2;

  return { HX, HY, HR, innerR, outerR, PW, PH, PR, pills, connX };
}

// ── Animations (injected once) ────────────────────────────────────────────────
const ANIM_ID = 'dsnl-keyframes';
const ANIMATIONS = `
  @keyframes dsnl-hub-in  { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes dsnl-ring-in { from{opacity:0;transform:scale(0.6) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes dsnl-pill-in { from{opacity:0;transform:translateX(-40px) scaleX(0.7)} to{opacity:1;transform:translateX(0) scaleX(1)} }
  @keyframes dsnl-line-in { from{opacity:0;stroke-dashoffset:60} to{opacity:0.85;stroke-dashoffset:0} }
`;
function ensureAnims() {
  if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
    const s = document.createElement('style');
    s.id = ANIM_ID;
    s.textContent = ANIMATIONS;
    document.head.appendChild(s);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const DREAMSSelectorNodeLeft: React.FC<NodeProps & { data: DREAMSSelectorLeftData }> = ({
  data,
  width  = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}) => {
  const {
    qualifiedMap = {},
    onSelect,
    centerLabel = 'DREAMS',
    centerSub   = 'SCORE',
  } = data;

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => { ensureAnims(); const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const geo = useMemo(() => computeGeo(width, height), [width, height]);
  const { HX, HY, HR, innerR, outerR, PW, PH, PR, pills, connX } = geo;

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
  const uid = useMemo(() => `dsnl-${Math.random().toString(36).slice(2, 7)}`, []);

  return (
    <div className="nopan nodrag" style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent' }}>
      <NodeResizer
        minWidth={260} minHeight={220} maxWidth={1400} maxHeight={1200}
        lineStyle={{ borderColor: 'rgba(255,255,255,0.15)' }}
        handleStyle={{ background: 'rgba(255,255,255,0.25)', borderColor: 'transparent', width: 8, height: 8 }}
      />
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {VERTICALS.map((v, i) => (
            <linearGradient key={v.id} id={`${uid}-g${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={v.color1} /><stop offset="100%" stopColor={v.color2} />
            </linearGradient>
          ))}
          <radialGradient id={`${uid}-hub`} cx="60%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e1e30" /><stop offset="100%" stopColor="#050510" />
          </radialGradient>
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={HR * 0.05} stdDeviation={HR * 0.12} floodColor="#000" floodOpacity="0.7" />
          </filter>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy={HR * 0.04} stdDeviation={HR * 0.07} floodColor="#000" floodOpacity="0.5" />
          </filter>
          {VERTICALS.map((v, i) => (
            <filter key={i} id={`${uid}-glow${i}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation={HR * 0.1} floodColor={v.color1} floodOpacity="0.65" />
            </filter>
          ))}
        </defs>

        {/* Outer ring */}
        <circle cx={HX} cy={HY} r={outerR} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={Math.max(0.5, HR * 0.008)} strokeDasharray="3 10"
          style={{ transformOrigin: `${HX}px ${HY}px`, animation: mounted ? 'dsnl-ring-in 0.8s cubic-bezier(0.34,1.2,0.64,1) 0.05s both' : 'none', opacity: mounted ? undefined : 0 }} />

        {/* Inner ring */}
        <circle cx={HX} cy={HY} r={innerR} fill="none"
          stroke="rgba(255,255,255,0.38)" strokeWidth={Math.max(2, HR * 0.055)} strokeDasharray="4 8"
          style={{ transformOrigin: `${HX}px ${HY}px`, animation: mounted ? 'dsnl-ring-in 0.8s cubic-bezier(0.34,1.2,0.64,1) 0.05s both' : 'none', opacity: mounted ? undefined : 0 }} />

        {/* Hub */}
        <g style={{ transformOrigin: `${HX}px ${HY}px`, animation: mounted ? 'dsnl-hub-in 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' : 'none', opacity: mounted ? undefined : 0 }}>
          <circle cx={HX} cy={HY} r={HR} fill={`url(#${uid}-hub)`} stroke="rgba(255,255,255,0.12)" strokeWidth={Math.max(1, HR * 0.014)} filter={`url(#${uid}-shadow)`} />
          <circle cx={HX} cy={HY} r={HR * 0.92} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={Math.max(0.5, HR * 0.007)} />
          <text x={HX} y={HY - HR * 0.23} textAnchor="middle" fill="rgba(255,255,255,0.38)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubSub, fontWeight: 700, letterSpacing: '0.22em' }}>BUSINESS</text>
          <text x={HX} y={HY + HR * 0.02} textAnchor="middle" fill="white"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubMain, fontWeight: 900, letterSpacing: '0.08em' }}>{centerLabel}</text>
          <text x={HX} y={HY + HR * 0.22} textAnchor="middle" fill="rgba(255,255,255,0.85)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.hubScore, fontWeight: 700, letterSpacing: '0.14em' }}>{centerSub}</text>
          {VERTICALS.map((v, i) => (
            <circle key={v.id} cx={HX - HR * 0.5 + i * HR * 0.2} cy={HY + HR * 0.52}
              r={fs.dotR} fill={v.color1} opacity={qualifiedMap[v.id] ? 1 : 0.3} />
          ))}
        </g>

        {/* Pills */}
        {VERTICALS.map((v, i) => {
          const g = pills[i];
          const isH = hovered === i;
          const isQ = qualifiedMap[v.id] ?? false;
          const opaque = isQ || !hasMap;
          return (
            <g key={v.id}>
              <line x1={g.nx} y1={g.ny} x2={connX(g)} y2={g.pcy}
                stroke={v.color1} strokeWidth={Math.max(1, isH ? HR * 0.015 : HR * 0.012)}
                strokeLinecap="round" strokeDasharray="5 6"
                style={{ animation: mounted ? `dsnl-line-in 0.4s ease-out ${0.25 + i * 0.07}s both` : 'none', opacity: mounted ? undefined : 0, transition: 'stroke-width 0.2s' }} />
              <circle cx={g.nx} cy={g.ny} r={fs.dotR * 1.5} fill={v.color1} opacity={0.9} />
              <circle cx={g.nx} cy={g.ny} r={fs.dotR * 0.75} fill="white" opacity={0.6} />
              <g filter={isH ? `url(#${uid}-glow${i})` : `url(#${uid}-soft)`}
                style={{ opacity: mounted ? (opaque ? 1 : 0.32) : 0, cursor: opaque ? 'pointer' : 'default',
                  animation: mounted ? `dsnl-pill-in 0.55s cubic-bezier(0.34,1.4,0.64,1) ${0.20 + i * 0.07}s both` : 'none',
                  transition: 'opacity 0.3s ease, filter 0.22s ease', transformOrigin: `${g.pcx}px ${g.pcy}px` }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                onClick={() => opaque && onSelect?.({ ...v, qualified: isQ })}>
                <rect x={g.px} y={g.py} width={PW} height={PH} rx={PR} ry={PR} fill={`url(#${uid}-g${i})`} />
                <rect x={g.px + PR} y={g.py + PH * 0.04} width={PW - PR * 2} height={Math.max(1, PH * 0.04)} fill="rgba(255,255,255,0.22)" rx={1} />
                <text x={g.pcx} y={g.pcy - PH * 0.1} textAnchor="middle" dominantBaseline="middle" fill="white"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.pillMain, fontWeight: 900, letterSpacing: '0.03em' }}>{v.label}</text>
                <text x={g.pcx} y={g.pcy + PH * 0.25} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.68)"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: fs.pillSub, letterSpacing: '0.07em' }}>{v.keywords}</text>
                {isQ && <circle cx={g.px + PR * 0.6} cy={g.pcy} r={fs.dotR} fill="white" opacity={0.9} />}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DREAMSSelectorNodeLeft;

export const DREAMS_LEFT_NODE_TYPES = { dreamsSelectorLeft: DREAMSSelectorNodeLeft };
