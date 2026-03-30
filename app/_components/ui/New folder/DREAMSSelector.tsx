import React, { useState, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DREAMSVertical {
  id: string;
  letter: string;
  label: string;
  sublabel: string;
  keywords: string;
  color1: string;
  color2: string;
  glowColor: string;
  qualified?: boolean;
}

interface DREAMSSelectorProps {
  /** Called when agent clicks a vertical pill */
  onSelect?: (vertical: DREAMSVertical) => void;
  /** Map of vertical IDs → qualified state (from scoring engine) */
  qualifiedMap?: Partial<Record<string, boolean>>;
  /** Center hub label override */
  centerLabel?: string;
  centerSub?: string;
}

// ── Vertical definitions ───────────────────────────────────────────────────────

const VERTICALS: DREAMSVertical[] = [
  {
    id: 'debt',
    letter: 'D',
    label: 'Debt Management',
    sublabel: 'Restructure · Funding · SBA',
    keywords: 'RESTRUCTURE · FUNDING · SBA',
    color1: '#fb6b56',
    color2: '#b82010',
    glowColor: '#fb6b5688',
  },
  {
    id: 'retirement',
    letter: 'R',
    label: 'Retirement & Planning',
    sublabel: '401K · IRA · Key-Person',
    keywords: '401K · IRA · KEY-PERSON',
    color1: '#e080b0',
    color2: '#904070',
    glowColor: '#e080b088',
  },
  {
    id: 'expense',
    letter: 'E',
    label: 'Expense Management',
    sublabel: 'Energy · Healthcare · Payroll',
    keywords: 'ENERGY · HEALTHCARE · PAYROLL',
    color1: '#fcd050',
    color2: '#b88000',
    glowColor: '#fcd05088',
  },
  {
    id: 'asset',
    letter: 'A',
    label: 'Asset Management',
    sublabel: 'Protect · Optimize · Grow',
    keywords: 'PROTECT · OPTIMIZE · GROW',
    color1: '#60d080',
    color2: '#208840',
    glowColor: '#60d08088',
  },
  {
    id: 'money',
    letter: 'M',
    label: 'Money Management',
    sublabel: 'Cash Flow · R&D · Credits',
    keywords: 'CASH FLOW · R&D · CREDITS',
    color1: '#50b8b0',
    color2: '#106890',
    glowColor: '#50b8b088',
  },
  {
    id: 'security',
    letter: 'S',
    label: 'Security & Succession',
    sublabel: 'Cyber · Compliance · Risk',
    keywords: 'CYBER · COMPLIANCE · RISK',
    color1: '#c8d850',
    color2: '#789000',
    glowColor: '#c8d85088',
  },
];

// ── Geometry ──────────────────────────────────────────────────────────────────
// Hub center: HX=625, HY=350
// Arc angles (degrees from left horizontal): -40, -24, -8, 8, 24, 40
// arcDist=370 (hub center → pill center)
// nodeR=178 (hub center → connector dot on ring)
// PW=240, PH=64, R=32 (pill dimensions + corner radius)

const HX = 625;
const HY = 350;
const ARC_DIST = 370;
const NODE_R = 178;
const ARC_ANGLES = [-40, -24, -8, 8, 24, 40];
const PW = 240;
const PH = 64;
const PR = 32; // pill corner radius

function toRad(deg: number) { return (deg * Math.PI) / 180; }

interface PillGeometry {
  nx: number;   // connector dot x
  ny: number;   // connector dot y
  pcx: number;  // pill center x
  pcy: number;  // pill center y
  px: number;   // pill rect origin x
  py: number;   // pill rect origin y
}

const PILLS: PillGeometry[] = ARC_ANGLES.map((angle) => {
  const rad = toRad(angle);
  const nx = HX - NODE_R * Math.cos(rad);
  const ny = HY + NODE_R * Math.sin(rad);
  const pcx = HX - ARC_DIST * Math.cos(rad);
  const pcy = HY + ARC_DIST * Math.sin(rad);
  return { nx, ny, pcx, pcy, px: pcx - PW / 2, py: pcy - PH / 2 };
});

// ── CSS animations (injected once) ───────────────────────────────────────────

const STYLES = `
  @keyframes ds-hex-in {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ds-ring-in {
    from { opacity: 0; transform: scale(0.75) rotate(-20deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes ds-pill-in {
    from { opacity: 0; transform: translateX(-60px) scaleX(0.7); }
    to   { opacity: 1; transform: translateX(0) scaleX(1); }
  }
  @keyframes ds-line-in {
    from { opacity: 0; stroke-dashoffset: 80; }
    to   { opacity: 0.85; stroke-dashoffset: 0; }
  }
  .ds-hub  { transform-origin: ${HX}px ${HY}px; animation: ds-hex-in  0.65s cubic-bezier(0.34,1.56,0.64,1) 0.10s both; }
  .ds-ring { transform-origin: ${HX}px ${HY}px; animation: ds-ring-in 0.80s cubic-bezier(0.34,1.20,0.64,1) 0.05s both; }
  ${ARC_ANGLES.map((_, i) => `
    .ds-pill-${i} { animation: ds-pill-in 0.55s cubic-bezier(0.34,1.4,0.64,1) ${0.20 + i * 0.07}s both; }
    .ds-line-${i} { animation: ds-line-in 0.40s ease-out ${0.25 + i * 0.07}s both; stroke-dasharray: 5 6; }
  `).join('')}
`;

// ── Component ─────────────────────────────────────────────────────────────────

const DREAMSSelector: React.FC<DREAMSSelectorProps> = ({
  onSelect,
  qualifiedMap = {},
  centerLabel = 'DREAMS',
  centerSub = 'SCORE',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 780 }}>
      <style>{STYLES}</style>

      <svg
        viewBox="0 0 780 700"
        width="100%"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          {/* Pill gradients */}
          {VERTICALS.map((v, i) => (
            <linearGradient key={v.id} id={`ds-g${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={v.color1} />
              <stop offset="100%" stopColor={v.color2} />
            </linearGradient>
          ))}

          {/* Hub gradient */}
          <radialGradient id="ds-hub" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e1e30" />
            <stop offset="100%" stopColor="#050510" />
          </radialGradient>

          {/* Filters */}
          <filter id="ds-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="18" floodColor="#000" floodOpacity="0.7" />
          </filter>
          <filter id="ds-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
          </filter>

          {/* Per-vertical glow filters */}
          {VERTICALS.map((v, i) => (
            <filter key={`gf-${i}`} id={`ds-glow${i}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={v.color1} floodOpacity="0.65" />
            </filter>
          ))}
        </defs>

        {/* ═══ OUTER RING ═══ */}
        <circle
          className={mounted ? 'ds-ring' : ''}
          cx={HX} cy={HY} r={310}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="3 10"
          style={{ opacity: mounted ? undefined : 0 }}
        />

        {/* ═══ INNER DASHED RING ═══ */}
        <circle
          className={mounted ? 'ds-ring' : ''}
          cx={HX} cy={HY} r={173}
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="8"
          strokeDasharray="4 8"
          style={{ opacity: mounted ? undefined : 0 }}
        />

        {/* ═══ HUB ═══ */}
        <g className={mounted ? 'ds-hub' : ''} style={{ opacity: mounted ? undefined : 0 }}>
          <circle cx={HX} cy={HY} r={145}
            fill="url(#ds-hub)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
            filter="url(#ds-shadow)"
          />
          <circle cx={HX} cy={HY} r={133}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
          <text x={HX} y={HY - 34} textAnchor="middle" fill="rgba(255,255,255,0.38)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.24em' }}>
            BUSINESS
          </text>
          <text x={HX} y={HY + 2} textAnchor="middle" fill="white"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 30, fontWeight: 900, letterSpacing: '0.08em' }}>
            {centerLabel}
          </text>
          <text x={HX} y={HY + 28} textAnchor="middle" fill="rgba(255,255,255,0.85)"
            style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: '0.14em' }}>
            {centerSub}
          </text>
          {/* Color indicator dots */}
          {VERTICALS.map((v, i) => (
            <circle key={v.id}
              cx={HX - 38 + i * 15}
              cy={HY + 54}
              r={5}
              fill={v.color1}
              opacity={qualifiedMap[v.id] ? 1 : 0.3}
            />
          ))}
        </g>

        {/* ═══ PILLS ═══ */}
        {VERTICALS.map((v, i) => {
          const g = PILLS[i];
          const isHovered = hovered === i;
          const isQualified = qualifiedMap[v.id] ?? false;
          const pillFilter = isHovered ? `url(#ds-glow${i})` : 'url(#ds-soft)';
          const opacity = isQualified || Object.keys(qualifiedMap).length === 0 ? 1 : 0.35;

          return (
            <g key={v.id}>
              {/* Connector line — exits right edge of pill toward hub */}
              <line
                className={mounted ? `ds-line-${i}` : ''}
                x1={g.nx} y1={g.ny}
                x2={g.pcx + PW / 2} y2={g.pcy}
                stroke={v.color1}
                strokeWidth={isHovered ? 2.2 : 1.8}
                strokeLinecap="round"
                opacity={mounted ? undefined : 0}
                style={{ transition: 'stroke-width 0.2s' }}
              />

              {/* Connector dot */}
              <circle cx={g.nx} cy={g.ny} r={6} fill={v.color1} opacity={0.9} />
              <circle cx={g.nx} cy={g.ny} r={3} fill="white" opacity={0.6} />

              {/* Pill group */}
              <g
                className={mounted ? `ds-pill-${i}` : ''}
                filter={pillFilter}
                style={{
                  opacity: mounted ? opacity : 0,
                  cursor: isQualified || Object.keys(qualifiedMap).length === 0 ? 'pointer' : 'default',
                  transition: 'opacity 0.3s ease, filter 0.22s ease',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (isQualified || Object.keys(qualifiedMap).length === 0) {
                    onSelect?.({ ...v, qualified: isQualified });
                  }
                }}
              >
                {/* Pill body */}
                <rect
                  x={g.px} y={g.py}
                  width={PW} height={PH}
                  rx={PR} ry={PR}
                  fill={`url(#ds-g${i})`}
                />
                {/* Specular highlight */}
                <rect
                  x={g.px + PR} y={g.py + 1}
                  width={PW - PR * 2} height={2}
                  fill="rgba(255,255,255,0.22)"
                  rx={1}
                />

                {/* Label */}
                <text
                  x={g.pcx} y={g.pcy - 8}
                  textAnchor="middle"
                  fill="white"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 16, fontWeight: 900, letterSpacing: '0.03em' }}
                >
                  {v.label}
                </text>

                {/* Sublabel */}
                <text
                  x={g.pcx} y={g.pcy + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.68)"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 10, letterSpacing: '0.07em' }}
                >
                  {v.keywords}
                </text>

                {/* Qualified indicator dot */}
                {isQualified && (
                  <circle cx={g.px + PW - 20} cy={g.pcy} r={5} fill="white" opacity={0.9} />
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DREAMSSelector;
