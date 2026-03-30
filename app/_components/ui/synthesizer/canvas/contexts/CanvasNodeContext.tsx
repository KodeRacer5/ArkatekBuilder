/**
 * CanvasNodeContext — per-node state injection
 * Source: n8n CanvasNode.vue provide(CanvasNodeKey, ...)
 *
 * Each CanvasNode component provides this context to its
 * renderer, toolbar, handles, and status icons.
 */

import { createContext, useContext } from 'react';
import type { CanvasNodeContextData } from '../canvas.types';

const CanvasNodeContext = createContext<CanvasNodeContextData | null>(null);

/**
 * Hook to consume per-node state.
 * Must be used within a CanvasNodeContext.Provider (inside CanvasNode).
 */
export function useCanvasNodeContext(): CanvasNodeContextData {
  const ctx = useContext(CanvasNodeContext);
  if (!ctx) {
    throw new Error('useCanvasNodeContext must be used within CanvasNodeContext.Provider');
  }
  return ctx;
}

export default CanvasNodeContext;
