/**
 * PatientWorkspace — right panel patient data entry
 * Source: CortixEngineSynthesizer.tsx PatientWorkspace (lines 611-669)
 *
 * Form for entering patient context data that gets injected
 * into every agent call during pipeline execution.
 */

import React from 'react';
import {
  User, ScanLine, Heart, FlaskConical, Pill, Activity,
  FileText, Eye, MessageSquare, Stethoscope,
} from 'lucide-react';
import { SW } from '../canvas/canvas.constants';
import type { PatientRecord } from '../canvas/canvas.types';

interface PatientWorkspaceProps {
  patient: PatientRecord;
  setPatient: (p: PatientRecord) => void;
}

const FIELDS: {
  key: keyof PatientRecord;
  label: string;
  icon: React.FC<any>;
  rows: number;
}[] = [
  { key: 'name', label: 'Patient Name', icon: User, rows: 1 },
  { key: 'mrn', label: 'MRN', icon: ScanLine, rows: 1 },
  { key: 'dob', label: 'Date of Birth', icon: Heart, rows: 1 },
  { key: 'labs', label: 'Lab Results', icon: FlaskConical, rows: 3 },
  { key: 'medications', label: 'Medications', icon: Pill, rows: 3 },
  { key: 'symptoms', label: 'Symptoms', icon: Activity, rows: 3 },
  { key: 'history', label: 'Medical History', icon: FileText, rows: 3 },
  { key: 'imaging', label: 'Imaging', icon: Eye, rows: 2 },
  { key: 'notes', label: 'Clinical Notes', icon: MessageSquare, rows: 3 },
];

const PatientWorkspace: React.FC<PatientWorkspaceProps> = ({ patient, setPatient }) => {
  return (
    <div
      style={{
        width: '280px',
        height: '100%',
        background: 'rgba(22,22,28,0.98)',
        borderLeft: '1px solid #2A2928',
        overflowY: 'auto',
        padding: '12px',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Stethoscope size={14} color="#8cb48c" strokeWidth={SW} />
        <span
          style={{
            color: '#C8C5BC',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.1em',
          }}
        >
          PATIENT WORKSPACE
        </span>
      </div>

      {/* Fields */}
      {FIELDS.map(f => {
        const FIcon = f.icon;
        return (
          <div key={f.key} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <FIcon size={11} color="#5A5754" strokeWidth={SW} />
              <span
                style={{
                  color: '#5A5754',
                  fontSize: '8px',
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                }}
              >
                {f.label.toUpperCase()}
              </span>
            </div>
            {f.rows === 1 ? (
              <input
                value={patient[f.key]}
                onChange={e => setPatient({ ...patient, [f.key]: e.target.value })}
                className="nodrag"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid #2A2928',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 300,
                  padding: '5px 7px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            ) : (
              <textarea
                value={patient[f.key]}
                onChange={e => setPatient({ ...patient, [f.key]: e.target.value })}
                rows={f.rows}
                className="nodrag nowheel"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid #2A2928',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 300,
                  padding: '5px 7px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          padding: '8px 0',
          borderTop: '1px solid #2A2928',
          marginTop: '8px',
        }}
      >
        <div
          style={{
            color: '#3A3836',
            fontSize: '8px',
            fontWeight: 300,
            textAlign: 'center',
          }}
        >
          Patient context is injected into every agent call during pipeline execution.
        </div>
      </div>
    </div>
  );
};

export default PatientWorkspace;
