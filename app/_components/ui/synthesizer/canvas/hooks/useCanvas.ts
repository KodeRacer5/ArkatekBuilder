/**
 * useCanvas — canvas-level state consumer hook
 * Source: n8n composables/useCanvas.ts (7 lines)
 *
 * n8n: injectStrict(CanvasKey)
 * React: useContext(CanvasContext)
 */

import { useCanvasContext } from '../contexts/CanvasContext';

export function useCanvas() {
  return useCanvasContext();
}
