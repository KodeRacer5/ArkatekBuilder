/**
 * CanvasEngineSubPort — single sub-port column for CortixEngine nodes
 *
 * Renders: diamond (16x16, rotated 45deg) → stem (2px x 31px) →
 *          label (10px) → attach box (loaded) or [+] button (empty)
 *
 * Per v2 spec + HTML prototype:
 * - Data slot is ALWAYS null — only shows [+] button
 * - No truncation on any label text
 * - Diamond/stem/button infrastructure is always #5a5a5a
 * - Only the loaded attach box border gets accent coloring
 * - Extension/Tool diamonds are visual-only (not ReactFlow Handle components)
 * - Data diamond (⑤) is a real ReactFlow Handle target for incoming patient data wires
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, Zap } from 'lucide-react';
import { IC, SW } from '../../../../../canvas.constants';
import type { EngineSubPort } from '../../../../../canvas.types';

interface CanvasEngineSubPortProps {
  slot: 'ext' | 'tool' | 'data';
  subPort: EngineSubPort | null;
  accentColor: string;
  /** When provided, the diamond becomes a real ReactFlow Handle target */
  handleId?: string;
  onClickEmpty?: (slot: 'ext' | 'tool' | 'data') => void;
  onClickLoaded?: (slot: 'ext' | 'tool' | 'data') => void;
}

const SLOT_LABELS: Record<string, string> = {
  ext: 'Extension',
  tool: 'Tool',
  data: 'Data',
};

const CanvasEngineSubPortComponent: React.FC<CanvasEngineSubPortProps> = ({
  slot,
  subPort,
  accentColor,
  handleId,
  onClickEmpty,
  onClickLoaded,
}) => {
  const slotLabel = SLOT_LABELS[slot];
  const isLoaded = subPort !== null;
  const Icon = isLoaded ? IC[subPort!.icon] : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '60px',
      }}
    >
      {/* Diamond — always solid #5a5a5a.
          When handleId is provided (Data slot), this is a real ReactFlow Handle target
          so wires from Acquire/data nodes can connect here. */}
      {handleId ? (
        <Handle
          type="target"
          position={Position.Top}
          id={handleId}
          className="canvas-handle-data-diamond"
          style={{
            width: '16px',
            height: '16px',
            transform: 'rotate(45deg)',
            marginTop: '-8px',
            background: '#5a5a5a',
            cursor: 'crosshair',
            zIndex: 2,
            borderRadius: 0,
            border: 'none',
          }}
        />
      ) : (
        <div
          style={{
            width: '16px',
            height: '16px',
            transform: 'rotate(45deg)',
            marginTop: '-8px',
            background: '#5a5a5a',
            cursor: 'crosshair',
            zIndex: 2,
          }}
        />
      )}

      {/* Stem — always #5a5a5a */}
      <div
        style={{
          width: '2px',
          height: '31px',
          background: '#5a5a5a',
          marginTop: '-2px',
        }}
      />

      {/* Label */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.25)',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          marginTop: '4px',
        }}
      >
        {slotLabel}
      </div>

      {/* Attach box (loaded) or [+] button (empty) */}
      {isLoaded ? (
        <div
          onClick={(e) => { e.stopPropagation(); onClickLoaded?.(slot); }}
          style={{
            width: '32px',
            height: '32px',
            border: `2px solid ${subPort!.color}`,
            borderRadius: '6px',
            background: 'rgba(32,32,40,0.95)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '4px',
            cursor: 'pointer',
          }}
        >
          {/* Top notch — always #5a5a5a */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '5px',
              background: '#5a5a5a',
              borderRadius: '2px',
            }}
          />
          {/* Icon */}
          {Icon && <Icon size={16} color={subPort!.color} strokeWidth={SW} />}
          {/* Sub-label */}
          <div
            style={{
              position: 'absolute',
              bottom: '-14px',
              fontSize: '7px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {subPort!.label}
          </div>
        </div>
      ) : (
        <div
          className="nodrag"
          onClick={(e) => { e.stopPropagation(); onClickEmpty?.(slot); }}
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #5a5a5a',
            borderRadius: '6px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          {slot === 'data'
            ? <Zap size={12} color="rgba(255,255,255,0.2)" strokeWidth={SW} />
            : <Plus size={12} color="rgba(255,255,255,0.2)" strokeWidth={SW} />
          }
        </div>
      )}
    </div>
  );
};

export default CanvasEngineSubPortComponent;
