/**
 * CanvasNodeTall — configurable merger node
 *
 * Horizontal layout. Multi-input left, single-output right.
 * User can click +/- to add/remove input ports (2-7).
 * Height scales with port count.
 */

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';
import type { CanvasConnectionPort } from '../../../../canvas.types';

const MIN_PORTS = 2;
const MAX_PORTS = 7;
const PORT_HEIGHT = 36;
const BASE_HEIGHT = 56;

const CanvasNodeTall: React.FC = () => {
  const {
    id, label, data, icon, executionStatus, executionRunning,
    isSelected, action,
  } = useCanvasNode();
  const [expanded, setExpanded] = useState(false);

  const colors = resolveNodeColors(data);
  const Icon = IC[icon];
  const inputCount = data.inputPorts?.length ?? 2;
  const nodeHeight = Math.max(BASE_HEIGHT, inputCount * PORT_HEIGHT + 20);

  const updatePortCount = useCallback((delta: number) => {
    const newCount = Math.min(MAX_PORTS, Math.max(MIN_PORTS, inputCount + delta));
    if (newCount === inputCount) return;
    const newPorts: CanvasConnectionPort[] = [];
    for (let i = 0; i < newCount; i++) {
      newPorts.push({ id: `merge-in-${i}`, label: `Input ${i + 1}`, dataType: 'any' });
    }
    window.dispatchEvent(new CustomEvent('canvas:update-node-ports', {
      detail: { nodeId: id, inputPorts: newPorts },
    }));
  }, [id, inputCount]);

  const nodeClasses = clsx(
    'canvas-node',
    'canvas-node-tall',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  return (
    <div style={{ position: 'relative', width: 140 }}>
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '140px',
          height: `${nodeHeight}px`,
          borderRadius: '9px',
          background: 'rgba(32,32,40,0.95)',
          border: '3px solid #5a5a5a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {Icon && <Icon size={20} color={colors.accent} strokeWidth={SW} />}

        <div style={{
          color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontWeight: 300,
          textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          {label}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px',
        }}>
          <button
            onClick={e => { e.stopPropagation(); updatePortCount(-1); }}
            style={{
              width: '18px', height: '18px', borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: inputCount <= MIN_PORTS ? 'transparent' : 'rgba(255,255,255,0.05)',
              color: inputCount <= MIN_PORTS ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
              cursor: inputCount <= MIN_PORTS ? 'default' : 'pointer',
              fontSize: '11px', fontFamily: 'inherit', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: 0,
            }}
          >−</button>
          <span style={{
            color: colors.accent, fontSize: '10px', fontWeight: 400, minWidth: '8px', textAlign: 'center',
          }}>{inputCount}</span>
          <button
            onClick={e => { e.stopPropagation(); updatePortCount(1); }}
            style={{
              width: '18px', height: '18px', borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: inputCount >= MAX_PORTS ? 'transparent' : 'rgba(255,255,255,0.05)',
              color: inputCount >= MAX_PORTS ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
              cursor: inputCount >= MAX_PORTS ? 'default' : 'pointer',
              fontSize: '11px', fontFamily: 'inherit', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: 0,
            }}
          >+</button>
        </div>

        {executionStatus !== 'idle' && (
          <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
            <CanvasNodeStatusIcons />
          </div>
        )}
      </div>

      {expanded && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10, marginTop: '6px',
          width: '180px', background: 'rgba(28,28,36,0.95)',
          border: `1px solid ${colors.border}`, borderRadius: '8px',
          padding: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', fontWeight: 300 }}>
            {data.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasNodeTall;
