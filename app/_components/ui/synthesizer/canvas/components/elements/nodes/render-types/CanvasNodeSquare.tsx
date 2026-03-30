/**
 * CanvasNodeSquare — square utility node (120x120)
 *
 * Icon centered, label below (9px), border-radius: 10px.
 * Used for compact utility blocks.
 * Rod+button on right edge when action=true.
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';


const CanvasNodeSquare: React.FC = () => {
  const {
    id, label, data, icon, executionStatus, executionRunning,
    isSelected, action,
  } = useCanvasNode();
  const [expanded, setExpanded] = useState(false);

  const colors = resolveNodeColors(data);
  const Icon = IC[icon];

  const nodeClasses = clsx(
    'canvas-node',
    'canvas-node-square',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  return (
    <div style={{ position: 'relative', width: 120 }}>
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '9px',
          background: '#222120',
          border: '3px solid #5a5a5a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {/* Icon */}
        {Icon && <Icon size={42} color={colors.accent} strokeWidth={SW} />}

        {/* Label */}
        <div
          style={{
            color: '#fff',
            fontSize: '9px',
            fontWeight: 300,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'visible',
          }}
        >
          {label}
        </div>

        {/* Status dot */}
        {executionStatus !== 'idle' && (
          <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
            <CanvasNodeStatusIcons />
          </div>
        )}

      </div>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '6px',
            width: '180px',
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
        </div>
      )}
    </div>
  );
};

export default CanvasNodeSquare;
