/**
 * TabSettings — synthesizer settings panel
 * Interactive: Canvas Background preset selector, Theme display
 */

import React, { useState } from 'react';
import CollapsibleSection from './CollapsibleSection';
import { useCanvasTheme, CANVAS_BG_PRESETS } from '../canvas/contexts/CanvasThemeContext';
import { useTheme } from '../../../components/ThemeContext';

/** Static setting row */
const SettingRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 16px', borderBottom: '1px solid #2A2928',
  }}>
    <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>{label}</div>
    <span style={{
      fontSize: '12px', fontWeight: 300, color: '#8A8680',
      padding: '3px 10px', borderRadius: '4px', background: '#2A2928', border: '1px solid #2A2928',
    }}>{value}</span>
  </div>
);

/** Canvas background preset selector */
const CanvasBgSelector: React.FC = () => {
  const { presetId, setPreset, getCanvasBg } = useCanvasTheme();
  const { theme } = useTheme();

  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid #2A2928' }}>
      <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', marginBottom: '10px' }}>
        Canvas Background
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CANVAS_BG_PRESETS.map(p => {
          const isActive = p.id === presetId;
          const previewColor = getCanvasBg(theme);
          return (
            <div
              key={p.id}
              onClick={() => setPreset(p.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                cursor: 'pointer', padding: '6px', borderRadius: '6px',
                border: isActive ? '1px solid #4bab13' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(75,171,19,0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: '36px', height: '24px', borderRadius: '4px',
                background: theme === 'dark' ? p.dark : p.light,
                border: '1px solid rgba(255,255,255,0.1)',
              }} />
              <span style={{
                fontSize: '9px', fontWeight: 300, whiteSpace: 'nowrap',
                color: isActive ? '#4bab13' : 'rgba(255,255,255,0.4)',
              }}>{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TabSettings: React.FC = () => {
  const [generalOpen, setGeneralOpen] = useState(true);
  const [dataOpen, setDataOpen] = useState(true);
  const [apiOpen, setApiOpen] = useState(true);
  const { theme } = useTheme();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      <CollapsibleSection title="General" badge="application preferences"
        isOpen={generalOpen} onToggle={() => setGeneralOpen(!generalOpen)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <SettingRow label="Theme" value={theme === 'dark' ? 'Dark' : 'Light'} />
          <CanvasBgSelector />
          <SettingRow label="Canvas Scale" value="0.75x" />
          <SettingRow label="Animation" value="On" />
          <SettingRow label="Grid Snap" value="Off" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Data & Export" badge="output preferences"
        isOpen={dataOpen} onToggle={() => setDataOpen(!dataOpen)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <SettingRow label="Default Export Format" value="PDF" />
          <SettingRow label="EHR Integration" value="Disabled" />
          <SettingRow label="Data Retention" value="90 days" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="API & Connections" badge="external services"
        isOpen={apiOpen} onToggle={() => setApiOpen(!apiOpen)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <SettingRow label="API Key" value="Not configured" />
          <SettingRow label="PubMed Access" value="Connected" />
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default TabSettings;
