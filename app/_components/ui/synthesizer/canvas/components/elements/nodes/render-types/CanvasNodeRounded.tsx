/**
 * CanvasNodeRounded — rounded trigger node (260x120)
 *
 * border-radius: 46px 10px 10px 46px (left-rounded, right-square)
 * Trigger input style — icon circle left, label + subtitle right.
 * No truncation. Rod+button when action=true.
 */

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useReactFlow } from '@xyflow/react';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';


const CanvasNodeRounded: React.FC = () => {
  const {
    id, label, data, icon, executionStatus, executionRunning,
    isSelected, subtitle, action,
  } = useCanvasNode();
  const { setNodes } = useReactFlow();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(data.userInput || '');

  const saveInput = useCallback(() => {
    setEditing(false);
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, userInput: inputVal } } : n
    ));
  }, [id, inputVal, setNodes]);

  const colors = resolveNodeColors(data);
  const Icon = IC[icon];

  const nodeClasses = clsx(
    'canvas-node',
    'canvas-node-rounded',
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
          borderRadius: '46px 9px 9px 46px',
          background: '#222120',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 20px 0 12px',
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

        {/* Status icons */}
        <div style={{ flexShrink: 0 }}>
          <CanvasNodeStatusIcons />
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
            width: '240px',
            background: '#222120',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 16px #222120',
          }}
        >
          <div style={{ color: '#5A5754', fontSize: '9px', fontWeight: 300, marginBottom: '6px' }}>
            {data.description}
          </div>

          {/* Editable trigger config */}
          {editing ? (
            <textarea
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
              onBlur={saveInput}
              onKeyDown={e => { if (e.key === 'Escape') setEditing(false); }}
              className="nodrag nowheel"
              style={{
                width: '100%',
                minHeight: '50px',
                background: 'rgba(0,0,0,0.25)',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 300,
                padding: '6px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="Add trigger configuration..."
            />
          ) : (
            <div
              onClick={e => { e.stopPropagation(); setEditing(true); }}
              className="nodrag"
              style={{
                padding: '6px',
                borderRadius: '6px',
                cursor: 'text',
                border: `1px dashed ${colors.border}`,
                minHeight: '28px',
                fontSize: '10px',
                fontWeight: 300,
                color: data.userInput ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
              }}
            >
              {data.userInput || 'Click to add trigger configuration...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasNodeRounded;
