/**
 * SynthesizerToolbar — top bar
 * Source: CortixEngineSynthesizer.tsx Toolbar + n8n-style polish
 *
 * Contains: title, patient workspace toggle, save, clear, execute buttons.
 * Below: investigation target chips (draggable).
 */

import React from 'react';

interface SynthesizerToolbarProps {
  onExecute: () => void;
  onClear: () => void;
  onSave: () => void;
  executing: boolean;
  onTogglePatient: () => void;
  patientOpen: boolean;
  hidePatientToggle?: boolean;
  title?: string;
  platform?: 'radix' | 'cortixhealth' | null;
}

const SynthesizerToolbar: React.FC<SynthesizerToolbarProps> = ({
  onExecute,
  onClear,
  onSave,
  executing,
  onTogglePatient,
  patientOpen,
  hidePatientToggle,
  title,
  platform,
}) => {
  const isHealth = platform === 'cortixhealth';
  const workspaceLabel = isHealth ? 'Health Workspace' : 'Patient Workspace';
  return (
    <div style={{ background: 'linear-gradient(180deg, #1A1918 0%, #222120 100%)', borderBottom: '1px solid #2A2928' }}>
      {/* Main toolbar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}>
        <div style={{ flex: 1 }}>
          {title ? (
            <h1 style={{ color: '#fff', fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', margin: 0 }}>
              {title}
            </h1>
          ) : (
            <>
              <h1 style={{ color: '#fff', fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', margin: 0 }}>
                {isHealth ? 'My Health Plan' : 'Mapper'}
              </h1>
              <p style={{ color: '#5A5754', fontSize: '9px', fontWeight: 300, letterSpacing: '0.12em', margin: '2px 0 0 0' }}>
                CortixEngine
              </p>
            </>
          )}
        </div>

        {/* Patient workspace toggle */}
        {!hidePatientToggle && (
          <button
            onClick={onTogglePatient}
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              border: `1px solid ${patientOpen ? '#3A3836' : '#3A3836'}`,
              background: patientOpen ? '#2A2928' : 'transparent',
              color: patientOpen ? '#C8C5BC' : '#8A8680',
              fontSize: '9px',
              fontWeight: 300,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {workspaceLabel}
          </button>
        )}

        {/* Save button */}
        <button
          onClick={onSave}
          style={{
            padding: '5px 12px',
            borderRadius: '5px',
            border: '1px solid #3A3836',
            background: 'transparent',
            color: '#8A8680',
            fontSize: '9px',
            fontWeight: 300,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Save
        </button>

        {/* Clear button */}
        <button
          onClick={onClear}
          style={{
            padding: '5px 12px',
            borderRadius: '5px',
            border: '1px solid #3A3836',
            background: 'transparent',
            color: '#8A8680',
            fontSize: '9px',
            fontWeight: 300,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Clear
        </button>

        {/* Execute button */}
        <button
          onClick={onExecute}
          disabled={executing}
          style={{
            padding: '5px 16px',
            borderRadius: '5px',
            border: `1px solid ${executing ? '#2A2928' : '#3A3836'}`,
            background: executing ? 'rgba(195,175,155,0.04)' : 'rgba(195,175,155,0.08)',
            color: executing ? '#3A3836' : '#C2B9A7',
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '0.08em',
            cursor: executing ? 'default' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {executing ? 'EXECUTING...' : 'EXECUTE'}
        </button>
      </div>

    </div>
  );
};

export default SynthesizerToolbar;
