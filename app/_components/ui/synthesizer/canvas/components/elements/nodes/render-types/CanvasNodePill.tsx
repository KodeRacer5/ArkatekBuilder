/**
 * CanvasNodePill — rounded pill node (clinician review / filter gates)
 *
 * 299x120px, border-radius: 46px, icon circle left → label + subtitle (colored)
 * + subtitle2 (8px dimgray). No truncation on any text.
 * Rod+button on right edge when action=true.
 */

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useReactFlow } from '@xyflow/react';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';


const CanvasNodePill: React.FC = () => {
  const {
    id, label, data, icon, executionStatus, executionRunning,
    isSelected, subtitle, subtitle2, action,
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
    'canvas-node-pill',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  return (
    <div style={{ position: 'relative', width: 299 }}>
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '299px',
          height: '120px',
          borderRadius: '46px',
          background: 'rgba(42,42,46,0.95)',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 24px 0 20px',
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

        {/* Label + subtitles */}
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
                fontSize: '10px',
                fontWeight: 300,
                marginTop: '3px',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {subtitle}
            </div>
          )}
          {subtitle2 && (
            <div
              style={{
                color: 'dimgray',
                fontSize: '8px',
                fontWeight: 300,
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {subtitle2}
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
            width: '280px',
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

          {/* Editable approval notes */}
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
              placeholder="Add approval notes or criteria..."
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
              {data.userInput || 'Click to add approval notes or criteria...'}
            </div>
          )}

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

export default CanvasNodePill;
