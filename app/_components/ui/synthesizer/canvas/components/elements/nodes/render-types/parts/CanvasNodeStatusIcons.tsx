/**
 * CanvasNodeStatusIcons — execution status indicators
 * Source: n8n CanvasNodeStatusIcons.vue (204 lines)
 *
 * Shows visual indicators for node execution state:
 * - idle: nothing shown
 * - running: amber spinner
 * - complete: green check
 * - error: red X
 *
 * n8n priority chain: pinned → disabled → errors → success → warning
 * CortixEngine simplified: idle → running → complete → error
 */

import React from 'react';
import { CircleCheck, CircleX, AlertTriangle } from 'lucide-react';
import { SW, STATUS_COLORS } from '../../../../../canvas.constants';
import { useCanvasNode } from '../../../../../hooks/useCanvasNode';

const CanvasNodeStatusIcons: React.FC = () => {
  const { executionStatus, executionRunning } = useCanvasNode();

  // Idle — no indicator
  if (executionStatus === 'idle' && !executionRunning) return null;

  // Running — neon border animation handles the visual (no spinning icon)
  // The conic-gradient border rotation in canvas-animations.css is the primary indicator
  if (executionRunning || executionStatus === 'running') {
    return null;
  }

  // Complete — green check
  if (executionStatus === 'complete') {
    return (
      <div className="flex items-center">
        <CircleCheck size={14} color={STATUS_COLORS.complete} strokeWidth={SW} />
      </div>
    );
  }

  // Error — red X
  if (executionStatus === 'error') {
    return (
      <div className="flex items-center">
        <CircleX size={14} color={STATUS_COLORS.error} strokeWidth={SW} />
      </div>
    );
  }

  // Waiting — orange triangle
  if (executionStatus === 'waiting') {
    return (
      <div className="flex items-center">
        <AlertTriangle size={14} color={STATUS_COLORS.waiting} strokeWidth={SW} />
      </div>
    );
  }

  return null;
};

export default CanvasNodeStatusIcons;
