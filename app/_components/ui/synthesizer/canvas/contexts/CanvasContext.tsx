/**
 * CanvasContext — canvas-level state injection
 * Source: n8n Canvas.vue provide(CanvasKey, ...)
 *
 * Replaces Vue's provide/inject with React Context.
 * Provides canvas-wide state to all descendant components.
 */

import { createContext, useContext } from 'react';
import type { CanvasContextData } from '../canvas.types';

const CanvasContext = createContext<CanvasContextData | null>(null);

/**
 * Hook to consume canvas-level state.
 * Must be used within a CanvasContext.Provider.
 */
export function useCanvasContext(): CanvasContextData {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error('useCanvasContext must be used within CanvasContext.Provider');
  }
  return ctx;
}

export default CanvasContext;
