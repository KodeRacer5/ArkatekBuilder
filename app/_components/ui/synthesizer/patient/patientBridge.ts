/**
 * patientBridge — maps workspace Patient to synthesizer PatientRecord
 *
 * The workspace Patient has rich structured data (notes[], files[], conversations[]).
 * The Synthesizer's PatientRecord is a flat record with text fields.
 * This adapter bridges between the two without coupling either side.
 */

import type { PatientRecord } from '../canvas/canvas.types';

/** Workspace Patient shape (matches CortixPatientWorkspace.tsx Patient interface) */
export interface WorkspacePatient {
  id: string;
  name: string;
  patientId: string;
  dob: string;
  age: number;
  chiefComplaint: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  instructions: string;
  notes: Array<{ id: string; content: string; section: string }>;
  files?: Array<{ name: string; category: string }>;
}

/**
 * Convert a workspace Patient into a synthesizer PatientRecord.
 * When fileContents is provided, lab and imaging files populate
 * the previously-empty labs/imaging fields.
 */
export function workspacePatientToRecord(
  patient: WorkspacePatient,
  fileContents?: Record<string, string>,
): PatientRecord {
  const notesParts: string[] = [];

  if (patient.allergies) notesParts.push(`Allergies: ${patient.allergies}`);
  if (patient.instructions) notesParts.push(`Instructions: ${patient.instructions}`);
  if (patient.notes?.length) {
    notesParts.push(
      patient.notes.map(n => `[${n.section}] ${n.content}`).join('\n'),
    );
  }

  // Populate labs and imaging from uploaded file contents
  let labsContent = '';
  let imagingContent = '';

  if (fileContents && patient.files) {
    const labFiles = patient.files.filter(f => f.category === 'Lab Results');
    labsContent = labFiles
      .map(f => fileContents[f.name])
      .filter(Boolean)
      .join('\n---\n');

    const imagingFiles = patient.files.filter(f => f.category === 'Imaging');
    imagingContent = imagingFiles
      .map(f => fileContents[f.name])
      .filter(Boolean)
      .join('\n---\n');
  }

  return {
    id: patient.id,
    name: patient.name,
    dob: patient.dob,
    mrn: patient.patientId,
    symptoms: patient.chiefComplaint || '',
    medications: patient.medications || '',
    history: patient.medicalHistory || '',
    labs: labsContent,
    imaging: imagingContent,
    notes: notesParts.join('\n\n'),
  };
}
