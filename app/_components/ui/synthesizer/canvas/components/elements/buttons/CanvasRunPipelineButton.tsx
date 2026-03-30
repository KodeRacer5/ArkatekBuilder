/**
 * CanvasRunPipelineButton — execute pipeline button
 * Source: n8n CanvasRunWorkflowButton.vue
 *
 * Floating button to execute the entire pipeline.
 * Shows running state with spinner animation.
 */

import React from 'react';
import { Play, Loader2 } from 'lucide-react';
import { SW } from '../../../canvas.constants';

interface CanvasRunPipelineButtonProps {
  isExecuting?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const CanvasRunPipelineButton: React.FC<CanvasRunPipelineButtonProps> = ({
  isExecuting = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isExecuting}
      title={isExecuting ? 'Pipeline running...' : 'Execute pipeline'}
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1px solid #3A3836',
        background: isExecuting
          ? 'rgba(234,179,8,0.1)'
          : 'rgba(195,175,155,0.08)',
        cursor: disabled || isExecuting ? 'not-allowed' : 'pointer',
        color: isExecuting ? '#eab308' : '#C2B9A7',
        fontSize: '11px',
        fontWeight: 300,
        fontFamily: 'inherit',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        zIndex: 5,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {isExecuting ? (
        <Loader2 size={14} strokeWidth={SW} className="animate-spin" />
      ) : (
        <Play size={14} strokeWidth={SW} />
      )}
      {isExecuting ? 'Running...' : 'Execute'}
    </button>
  );
};

export default CanvasRunPipelineButton;
