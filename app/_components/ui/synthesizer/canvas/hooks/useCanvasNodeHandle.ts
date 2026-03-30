/**
 * useCanvasNodeHandle — per-handle state consumer hook
 * Source: n8n composables/useCanvasNodeHandle.ts (38 lines)
 *
 * Provides handle-level data to handle render type components
 * (CanvasHandleMainInput, CanvasHandleMainOutput, etc.)
 */

import { createContext, useContext } from 'react';
import type { CanvasNodeHandleContextData, CanvasConnectionMode, PortDataType } from '../canvas.types';

/**
 * Handle-level context — provided by CanvasHandleRenderer
 * for each individual handle on a node.
 */
export const CanvasNodeHandleContext = createContext<CanvasNodeHandleContextData | null>(null);

export function useCanvasNodeHandle() {
  const handle = useContext(CanvasNodeHandleContext);

  // Provide defaults when context is not available (shouldn't happen in production)
  const label = handle?.label ?? '';
  const isConnected = handle?.isConnected ?? false;
  const isConnecting = handle?.isConnecting ?? false;
  const isReadOnly = handle?.isReadOnly ?? false;
  const isRequired = handle?.isRequired ?? false;
  const maxConnections = handle?.maxConnections;
  const dataType = handle?.dataType ?? ('any' as PortDataType);
  const mode = handle?.mode ?? ('inputs' as CanvasConnectionMode);
  const index = handle?.index ?? 0;

  return {
    label,
    isConnected,
    isConnecting,
    isReadOnly,
    isRequired,
    maxConnections,
    dataType,
    mode,
    index,
  };
}
