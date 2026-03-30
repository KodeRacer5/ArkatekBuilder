/**
 * CollapsibleSection — template-standard dropdown section
 *
 * Matches the HTML prototype's ext-collapsible pattern:
 * - Chevron (rotates on open) + UPPERCASE header + badge pill
 * - Consistent 14px/300 weight across all tabs
 * - Bottom border separator on header
 */

import React from 'react';

interface CollapsibleSectionProps {
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  badge,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Section header — matches template .canvas-section-header .ext-section-toggle */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 0',
          borderBottom: '1px solid #2A2928',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Chevron — rotates 90° when open */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            color: isOpen ? '#C8C5BC' : '#5A5754',
            transition: 'transform 0.2s, color 0.2s',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>

        {/* Title — uppercase, 14px, weight 300, letter-spacing 0.08em */}
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 300,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isOpen ? '#F5F4F0' : '#8A8680',
            margin: 0,
            transition: 'color 0.2s',
          }}
        >
          {title}
        </h3>

        {/* Badge — hidden for clean UI */}
      </div>

      {/* Body — only shown when open */}
      {isOpen && (
        <div style={{ paddingTop: '16px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
