/**
 * CanvasNodeDualOut — dual output node (260x120)
 *
 * Wider Default body. 2 output handles at 33%/67% (auto by handle renderer).
 * Used for If/Else, Router nodes.
 * No truncation. Rod+button when action=true.
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';
import CanvasNodeClinicalBadge from './parts/CanvasNodeClinicalBadge';


const CanvasNodeDualOut: React.FC = () => {
  const {
    id, label, data, category, icon, executionStatus, executionRunning,
    hasUserInput, isSelected, subtitle, action,
  } = useCanvasNode();
  const [expanded, setExpanded] = useState(false);

  const colors = resolveNodeColors(data);
  const Icon = IC[icon];

  const nodeClasses = clsx(
    'canvas-node',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  return (
    <div style={{ position: 'relative', width: 260 }}>
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '260px',
          height: '120px',
          borderRadius: '9px',
          background: '#222120',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 18px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon size={48} color={colors.accent} strokeWidth={SW} />}
        </div>

        {/* Label + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {label}
          </div>
          {subtitle && (
            <div
              style={{
                color: colors.accent,
                fontSize: '9px',
                fontWeight: 300,
                marginTop: '3px',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Status + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <CanvasNodeClinicalBadge />
          <CanvasNodeStatusIcons />
        </div>

        {/* Output labels (True/False indicators) */}
        <div
          style={{
            position: 'absolute',
            right: '-6px',
            top: '33%',
            transform: 'translateY(-50%)',
            fontSize: '7px',
            fontWeight: 300,
            color: '#5A5754',
          }}
        >
        </div>
        <div
          style={{
            position: 'absolute',
            right: '-6px',
            top: '67%',
            transform: 'translateY(-50%)',
            fontSize: '7px',
            fontWeight: 300,
            color: '#5A5754',
          }}
        >
        </div>

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
            width: '260px',
            background: '#222120',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '10px',
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

export default CanvasNodeDualOut;
