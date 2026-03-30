/**
 * SeeAllHideAll — template-standard global toggle buttons
 * Matches the HTML prototype's ext-toggle-btn pattern.
 */

import React from 'react';

interface SeeAllHideAllProps {
  onSeeAll: () => void;
  onHideAll: () => void;
}

const btnStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 300,
  padding: '5px 14px',
  borderRadius: '6px',
  background: '#2A2928',
  border: '1px solid #3A3836',
  color: '#8A8680',
  cursor: 'pointer',
  letterSpacing: '0.04em',
  fontFamily: 'inherit',
  transition: 'background 0.15s, color 0.15s',
};

const SeeAllHideAll: React.FC<SeeAllHideAllProps> = ({ onSeeAll, onHideAll }) => (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
    <button
      onClick={onSeeAll}
      style={btnStyle}
      onMouseEnter={e => { e.currentTarget.style.background = '#3A3836'; e.currentTarget.style.color = '#C8C5BC'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#2A2928'; e.currentTarget.style.color = '#8A8680'; }}
    >
      See All
    </button>
    <button
      onClick={onHideAll}
      style={btnStyle}
      onMouseEnter={e => { e.currentTarget.style.background = '#3A3836'; e.currentTarget.style.color = '#C8C5BC'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#2A2928'; e.currentTarget.style.color = '#8A8680'; }}
    >
      Hide All
    </button>
  </div>
);

export default SeeAllHideAll;
