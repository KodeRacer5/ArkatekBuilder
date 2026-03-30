/**
 * CanvasTabBar — horizontal tab strip above the canvas area
 *
 * Tab layout: Canvas | separator | Preloaded Modules | Extension Packs | Custom Modules | Skills | Web | System | Settings
 * Canvas tab returns to canvas (activeTab = null); clicking active tab toggles back to canvas.
 */

import React from 'react';
import { Workflow } from 'lucide-react';

interface TabDef {
  id: string;
  label: string;
  accent: string;
}

const RADIX_TABS: TabDef[] = [
  { id: 'notes', label: 'Notes', accent: '#FFEA6B' },
  { id: 'preloaded', label: 'Preloaded Modules', accent: '#C2B9A7' },
  { id: 'extensions', label: 'Extension Packs', accent: '#82a0b4' },
  { id: 'custom', label: 'Custom Modules', accent: '#8cb48c' },
  { id: 'skills', label: 'Skills', accent: '#b48cb4' },
  { id: 'web', label: 'Web', accent: '#8cb4b4' },
  { id: 'system', label: 'System', accent: '#b4a08c' },
  { id: 'settings', label: 'Settings', accent: '#8c8c8c' },
];

const HEALTH_TABS: TabDef[] = [
  { id: 'notes', label: 'Notes', accent: '#FFEA6B' },
  { id: 'preloaded', label: 'Wellness Modules', accent: '#6b8fb5' },
  { id: 'extensions', label: 'Extension Packs', accent: '#82a0b4' },
  { id: 'custom', label: 'Custom Modules', accent: '#8cb48c' },
  { id: 'skills', label: 'Skills', accent: '#b48cb4' },
  { id: 'web', label: 'Web', accent: '#8cb4b4' },
  { id: 'system', label: 'System', accent: '#b4a08c' },
  { id: 'settings', label: 'Settings', accent: '#8c8c8c' },
];

interface CanvasTabBarProps {
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
  platform?: 'radix' | 'cortixhealth' | null;
}

const CanvasTabBar: React.FC<CanvasTabBarProps> = ({ activeTab, onTabChange, platform = 'cortixhealth' }) => {
  const TABS = platform === 'cortixhealth' ? HEALTH_TABS : RADIX_TABS;
  const isCanvasActive = activeTab === null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #222120 0%, #1E1D1B 100%)',
        borderBottom: '1px solid #2A2928',
        padding: '0 8px',
        height: '36px',
        flexShrink: 0,
        gap: '0px',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {/* Canvas tab — always present */}
      <button
        onClick={() => onTabChange(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 14px',
          borderRadius: '6px 6px 0 0',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 300,
          fontFamily: 'inherit',
          transition: 'all 0.15s',
          background: isCanvasActive ? '#2A2928' : 'transparent',
          color: isCanvasActive ? '#4bab13' : '#C8C5BC',
          borderBottom: isCanvasActive ? '1px solid #2A2928' : '1px solid transparent',
        }}
      >
        <Workflow size={12} strokeWidth={1} />
        Canvas
      </button>

      {/* Separator */}
      <div
        style={{
          width: '1px',
          height: '14px',
          background: '#2A2928',
          margin: '0 4px',
          flexShrink: 0,
        }}
      />

      {/* Content tabs */}
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(isActive ? null : tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 14px',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 300,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              background: isActive ? '#2A2928' : 'transparent',
              color: isActive ? '#4bab13' : '#C8C5BC',
              borderBottom: isActive ? '1px solid #2A2928' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CanvasTabBar;
