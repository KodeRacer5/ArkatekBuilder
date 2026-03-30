/**
 * useZoomAdjustedValues — zoom-compensated sizes
 * Source: n8n composables/useZoomAdjustedValues.ts
 *
 * n8n uses --canvas-zoom-compensation-factor CSS variable to keep
 * UI elements (handles, labels, toolbars) visually consistent
 * regardless of canvas zoom level.
 */

import { useMemo } from 'react';
import { useViewport } from '@xyflow/react';

/**
 * Returns a compensation factor that can be used to keep
 * UI elements at a consistent visual size regardless of zoom.
 *
 * At zoom 1.0 → factor 1.0
 * At zoom 0.5 → factor 2.0 (elements rendered 2x to appear same size)
 * At zoom 2.0 → factor 0.5
 *
 * Clamped between 0.5 and 2.0 to prevent extreme scaling.
 */
export function useZoomAdjustedValues() {
  const viewport = useViewport();
  const zoom = viewport.zoom;

  const compensationFactor = useMemo(() => {
    const raw = 1 / zoom;
    return Math.min(Math.max(raw, 0.5), 2.0);
  }, [zoom]);

  return {
    zoom,
    compensationFactor,
  };
}
