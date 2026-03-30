import React, { useState, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DREAMSVertical {
  id: string;
  letter: string;
  label: string;
  keywords: string;
  color1: string;
  color2: string;
  qualified?: boolean;
}

interface DREAMSSelectorRightProps {
  onSelect?: (vertical: DREAMSVertical) => void;
  qualifiedMap?: Partial<Record<string, boolean>>;
  centerLabel?: string;
  centerSub?: string;
}

// ── Vertical definitions ───────────────────────────────────────────────────────

const VERTICALS: DREAMSVertical[] = [
  { id: 'debt',       letter: 'D', label: 'Debt Management',       keywords: 'RESTRUCTURE · FUNDING · SBA',       color1: '#fb6b56', color2: '#b82010' },
  { id: 'retirement', letter: 'R', label: 'Retirement & Planning',  keywords: '401K · IRA · KEY-PERSON',           color1: '#e080b0', color2: '#904070' },
  { id: 'expense',    letter: 'E', label: 'Expense Management',     keywords: 'ENERGY · HEALTHCARE · PAYROLL',     color1: '#fcd050', color2: '#b88000' },
  { id: 'asset',      letter: 'A', label: 'Asset Management',       keywords: 'PROTECT · OPTIMIZE · GROW',         color1: '#60d080', color2: '#208840' },
  { id: 'money',      letter: 'M', label: 'Money Management',       keywords: 'CASH FLOW · R&D · CREDITS',         color1: '#50b8b0', color2: '#106890' },
  { id: 'security',   letter: 'S', label: 'Security & Succession',  keywords: 'CYBER · COMPLIANCE · RISK',         color1: '#c8d850', color2: '#789000' },
];

// ── Geometry — hub LEFT (HX=155), pills extend RIGHT ──────────────────────────

const HX = 155;
const HY = 350;
const ARC_DIST = 370;
const NODE_R = 178;
const ARC_ANGLES = [-40, -24, -8, 8, 24, 40];
const PW = 240;
const PH = 64;
const PR = 32;

function toRad(deg: number) { return (deg * Math.PI) / 180; }

interface PillGeometry {
  nx: number; ny: number;
  pcx: number; pcy: number;
  px: number; py: number;
}

const PILLS: PillGeometry[] = ARC_ANGLES.map((angle) => {
  const rad = toRad(angle);
  // Hub on LEFT — pills extend RIGHT → use + cos
  const nx  = HX + NODE_R  * Math.cos(rad);
  const ny  = HY + NODE_R  * Math.sin(rad);
  const pcx = HX + ARC_DIST * Math.cos(rad);
  const pcy = HY + ARC_DIST * Math.sin(rad);
  return { nx, ny, pcx, pcy, px: pcx - PW / 2, py: pcy - PH / 2 };
});

// ── CSS animations ────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes dsr-hex-in {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes dsr-ring-in {
    from { opacity: 0; transform: scale(0.75) rotate(-20deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes dsr-pill-in {
    from { opacity: 0; transform: translateX(60px) scaleX(0.7); }
    to   { opacity: 1; transform: translateX(0) scaleX(1); }
  }
  @keyframes dsr-line-in {
    from { opacity: 0; stroke-dashoffset: 80; }
    to   { opacity: 0.85; stroke-dashoffset: 0; }
  }
  .dsr-hub  { transform-origin: ${HX}px ${HY}px; animation: dsr-hex-in  0.65s cubic-bezier(0.34,1.56,0.64,1) 0.10s both; }
  .dsr-ring { transform-origin: ${HX}px ${HY}px; animation: dsr-ring-in 0.80s cubic-bezier(0.34,1.20,0.64,1) 0.05s both; }
  ${ARC_ANGLES.map((_, i) => `
    .dsr-pill-${i} { animation: dsr-pill-in 0.55s cubic-bezier(0.34,1.4,0.64,1) ${0.20 + i * 0.07}s both; }
    .dsr-line-${i} { animation: dsr-line-in 0.40s ease-out ${0.25 + i * 0.07}s both; stroke-dasharray: 5 6; }
  `).join('')}
`;

// ── Component ─────────────────────────────────────────────────────────────────

const DREAMSSelectorRight: React.FC<DREAMSSelectorRightProps> = ({
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
          {VERTICALS.map((v, i) => (
            <linearGradient key={v.id} id={`dsr-g${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={v.color1} />
              <stop offset="100%" stopColor={v.color2} />
            </linearGradient>
          ))}
          <radialGradient id="dsr-hub" cx="60%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e1e30" />
            <stop offset="100%" stopColor="#050510" />
          </radialGradient>
          <filter id="dsr-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="18" floodColor="#000" floodOpacity="0.7" />
          </filter>
          <filter id="dsr-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
          </filter>
          {VERTICALS.map((v, i) => (
            <filter key={`dsr-gf${i}`} id={`dsr-glow${i}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={v.color1} floodOpacity="0.65" />
            </filter>
          ))}
        </defs>

        {/* ═══ OUTER RING ═══ */}
        <circle
          className={mounted ? 'dsr-ring' : ''}
          cx={HX} cy={HY} r={310}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="3 10"
          style={{ opacity: mounted ? undefined : 0 }}
        />

        {/* ═══ INNER RING ═══ */}
        <circle
          className={mounted ? 'dsr-ring' : ''}
          cx={HX} cy={HY} r={173}
          fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="8"
          strokeDasharray="4 8"
          style={{ opacity: mounted ? undefined : 0 }}
        />

        {/* ═══ HUB ═══ */}
        <g className={mounted ? 'dsr-hub' : ''} style={{ opacity: mounted ? undefined : 0 }}>
          <circle cx={HX} cy={HY} r={145}
            fill="url(#dsr-hub)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
            filter="url(#dsr-shadow)"
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

        {/* ═══ PILLS — extend RIGHT from hub ═══ */}
        {VERTICALS.map((v, i) => {
          const g = PILLS[i];
          const isHovered = hovered === i;
          const isQualified = qualifiedMap[v.id] ?? false;
          const hasMap = Object.keys(qualifiedMap).length > 0;
          const pillFilter = isHovered ? `url(#dsr-glow${i})` : 'url(#dsr-soft)';
          const opacity = isQualified || !hasMap ? 1 : 0.35;

          return (
            <g key={v.id}>
              {/* Connector — exits LEFT edge of pill toward hub */}
              <line
                className={mounted ? `dsr-line-${i}` : ''}
                x1={g.nx} y1={g.ny}
                x2={g.px} y2={g.pcy}
                stroke={v.color1}
                strokeWidth={isHovered ? 2.2 : 1.8}
                strokeLinecap="round"
                opacity={mounted ? undefined : 0}
                style={{ transition: 'stroke-width 0.2s' }}
              />

              {/* Connector dot on hub ring */}
              <circle cx={g.nx} cy={g.ny} r={6} fill={v.color1} opacity={0.9} />
              <circle cx={g.nx} cy={g.ny} r={3} fill="white" opacity={0.6} />

              {/* Pill */}
              <g
                className={mounted ? `dsr-pill-${i}` : ''}
                filter={pillFilter}
                style={{
                  opacity: mounted ? opacity : 0,
                  cursor: isQualified || !hasMap ? 'pointer' : 'default',
                  transition: 'opacity 0.3s ease, filter 0.22s ease',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (isQualified || !hasMap) {
                    onSelect?.({ ...v, qualified: isQualified });
                  }
                }}
              >
                <rect x={g.px} y={g.py} width={PW} height={PH} rx={PR} ry={PR}
                  fill={`url(#dsr-g${i})`} />
                <rect x={g.px + PR} y={g.py + 1} width={PW - PR * 2} height={2}
                  fill="rgba(255,255,255,0.22)" rx={1} />
                <text x={g.pcx} y={g.pcy - 8}
                  textAnchor="middle" fill="white"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 16, fontWeight: 900, letterSpacing: '0.03em' }}>
                  {v.label}
                </text>
                <text x={g.pcx} y={g.pcy + 14}
                  textAnchor="middle" fill="rgba(255,255,255,0.68)"
                  style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 10, letterSpacing: '0.07em' }}>
                  {v.keywords}
                </text>
                {isQualified && (
                  <circle cx={g.px + 20} cy={g.pcy} r={5} fill="white" opacity={0.9} />
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DREAMSSelectorRight;
