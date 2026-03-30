/**
 * CanvasThemeContext — user-selectable canvas background preset
 * Stored in localStorage, consumed by DashboardCanvas / FlowMapHero / Synthesizer
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface CanvasBgPreset {
  id: string;
  label: string;
  dark: string;   // bg hex for dark app theme
  light: string;  // bg hex for light app theme
}

export const CANVAS_BG_PRESETS: CanvasBgPreset[] = [
  { id: 'warm',    label: 'Warm Charcoal',  dark: '#2A2826', light: '#35332F' },
  { id: 'blue',    label: 'Deep Blue',      dark: '#1a1a22', light: '#2A2A34' },
  { id: 'dark',    label: 'Midnight',       dark: '#141413', light: '#2A2826' },
  { id: 'neutral', label: 'Neutral Gray',   dark: '#242424', light: '#333333' },
  { id: 'slate',   label: 'Warm Slate',     dark: '#1E1D1B', light: '#302E2B' },
];

const STORAGE_KEY = 'cortixhealth-canvas-bg';
const DEFAULT_PRESET = 'warm';

interface CanvasThemeContextType {
  presetId: string;
  preset: CanvasBgPreset;
  setPreset: (id: string) => void;
  getCanvasBg: (appTheme: 'dark' | 'light') => string;
}

const CanvasThemeContext = createContext<CanvasThemeContextType | null>(null);

export const CanvasThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presetId, setPresetId] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_PRESET; }
    catch { return DEFAULT_PRESET; }
  });

  const preset = CANVAS_BG_PRESETS.find(p => p.id === presetId) || CANVAS_BG_PRESETS[0];

  const setPreset = useCallback((id: string) => {
    setPresetId(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  }, []);

  const getCanvasBg = useCallback((appTheme: 'dark' | 'light') => {
    return appTheme === 'dark' ? preset.dark : preset.light;
  }, [preset]);

  return (
    <CanvasThemeContext.Provider value={{ presetId, preset, setPreset, getCanvasBg }}>
      {children}
    </CanvasThemeContext.Provider>
  );
};

export const useCanvasTheme = (): CanvasThemeContextType => {
  const ctx = useContext(CanvasThemeContext);
  if (!ctx) throw new Error('useCanvasTheme must be inside CanvasThemeProvider');
  return ctx;
};
