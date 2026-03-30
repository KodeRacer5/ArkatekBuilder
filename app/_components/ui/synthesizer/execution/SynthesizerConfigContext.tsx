/**
 * SynthesizerConfigContext — bridges Settings UI → AgentService
 *
 * Provides API key, model, and auto-save state to the entire synthesizer tree.
 * The provider in index.tsx syncs these values to AgentService via useEffect,
 * so changes in TabSettings immediately affect pipeline execution.
 *
 * Persists API key and model to localStorage for cross-session retention.
 */

import React, { createContext, useContext } from 'react';

export interface SynthesizerConfig {
  apiKey: string;
  model: string;
  autoSave: boolean;
  platform: 'radix' | 'cortixhealth' | null;
}

export interface SynthesizerConfigContextValue extends SynthesizerConfig {
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setAutoSave: (enabled: boolean) => void;
}

const SynthesizerConfigContext = createContext<SynthesizerConfigContextValue>({
  apiKey: '',
  model: 'anthropic/claude-sonnet-4-20250514',
  autoSave: true,
  platform: 'cortixhealth',
  setApiKey: () => {},
  setModel: () => {},
  setAutoSave: () => {},
});

export function useSynthesizerConfig(): SynthesizerConfigContextValue {
  return useContext(SynthesizerConfigContext);
}

export default SynthesizerConfigContext;
