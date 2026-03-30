/**
 * CanvasNodeCircle — circular processor node
 * CortixEngine-specific (n8n doesn't have circle nodes)
 *
 * Used for: Research, Analysis, Pharmacology, Validation, Output
 * These are pure processors — no user input, click to expand results.
 *
 * Follows n8n patterns: clsx for class computation, status animations.
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, C, STATUS_COLORS } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';

const CanvasNodeCircle: React.FC = () => {
  const {
    id, label, data, category, icon, executionStatus, executionRunning, isSelected,
  } = useCanvasNode();
  const [expanded, setExpanded] = useState(false);

  const colors = C[category];
  const Icon = IC[icon];

  // ── n8n class computation pattern ──
  const nodeClasses = clsx(
    'canvas-node',
    'canvas-node-circle',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  return (
    <div style={{ position: 'relative', width: 64 }}>
      {/* ── Circle icon — 64px ── */}
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#222120',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {Icon && <Icon size={26} color={colors.accent} strokeWidth={SW} />}

        {/* Status dot (top-right corner) */}
        {executionStatus !== 'idle' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: STATUS_COLORS[executionStatus],
              border: '1.5px solid rgba(20,20,28,1)',
              boxShadow: executionRunning ? '0 0 5px rgba(34, 197, 94, 0.6)' : 'none',
            }}
          />
        )}
      </div>

      {/* ── Label (below circle, absolute so it doesn't affect handle centering) ── */}
      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '5px', textAlign: 'center', maxWidth: '110px', whiteSpace: 'nowrap' }}>
        <div style={{ color: '#fff', fontSize: '10px', fontWeight: 300, lineHeight: 1.2 }}>
          {label}
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 24px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: '200px',
            background: '#222120',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 16px #222120',
          }}
        >
          <div style={{ color: '#5A5754', fontSize: '9px', fontWeight: 300 }}>
            {data.description}
          </div>
          {data.result && (
            <div
              style={{
                marginTop: '6px',
                padding: '6px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 300,
                color: '#8A8680',
                maxHeight: '60px',
                overflow: 'hidden',
              }}
            >
              {typeof data.result === 'string' ? data.result.slice(0, 140) : 'Results available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasNodeCircle;
