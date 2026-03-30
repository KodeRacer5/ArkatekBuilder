/**
 * usePatientContext — patient data management hook
 * Source: CortixEngineSynthesizer.tsx patient state
 *
 * Manages patient record state with localStorage persistence.
 */

import { useState, useCallback, useEffect } from 'react';
import type { PatientRecord } from '../canvas/canvas.types';

const EMPTY_PATIENT: PatientRecord = {
  id: '',
  name: '',
  dob: '',
  mrn: '',
  labs: '',
  medications: '',
  symptoms: '',
  history: '',
  imaging: '',
  notes: '',
};

const STORAGE_KEY = 'cortix-patient-context';

export function usePatientContext(patientId?: string) {
  const [patient, setPatientState] = useState<PatientRecord>(() => {
    if (patientId) {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${patientId}`);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* fall through */ }
      }
    }
    return { ...EMPTY_PATIENT };
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persist on change
  useEffect(() => {
    if (patient.id || patient.name) {
      const key = patient.id ? `${STORAGE_KEY}-${patient.id}` : STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(patient));
    }
  }, [patient]);

  const setPatient = useCallback((update: PatientRecord) => {
    setPatientState(update);
  }, []);

  const updateField = useCallback((key: keyof PatientRecord, value: string) => {
    setPatientState(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearPatient = useCallback(() => {
    setPatientState({ ...EMPTY_PATIENT });
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    patient,
    setPatient,
    updateField,
    clearPatient,
    isOpen,
    setIsOpen,
    toggleOpen,
  };
}
