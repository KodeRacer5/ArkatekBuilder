/**
 * CanvasHandleRenderer — handle composition wrapper (HTML prototype alignment)
 *
 * Input handles: solid rect (10x25px) — the ReactFlow Handle IS the rect.
 *   ReactFlow's default left:0 + translate(-50%,-50%) centers it on the border.
 *
 * Output handles: single flex container holding circle + rod + [+] button.
 *   The [+] button IS the ReactFlow Handle, forced to position:static via CSS
 *   !important (in canvas-animations.css) so it flows as a flex sibling.
 *   This guarantees zero gap between rod and button regardless of ReactFlow CSS.
 */

import React, { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, Plug } from 'lucide-react';
import { CanvasNodeHandleContext } from '../../../hooks/useCanvasNodeHandle';
import { createCanvasConnectionHandleString } from '../../../canvas.utils';
import { IH, OH, SW } from '../../../canvas.constants';
import type { CanvasConnectionPort, CanvasNodeHandleContextData, PortDataType } from '../../../canvas.types';
import { CanvasConnectionMode } from '../../../canvas.types';

/** Clinical data types whose output handles show a Plug icon instead of Plus */
const CLINICAL_DATA_TYPES: PortDataType[] = ['labs', 'medications', 'symptoms', 'history', 'imaging'];

interface CanvasHandleRendererProps {
  port: CanvasConnectionPort;
  index: number;
  mode: CanvasConnectionMode;
  position: Position;
  totalPorts: number;
  isConnecting?: boolean;
  connectionsCount?: number;
}

const CanvasHandleRenderer: React.FC<CanvasHandleRendererProps> = ({
  port,
  index,
  mode,
  position,
  totalPorts,
  isConnecting = false,
  connectionsCount = 0,
}) => {
  // ── Build handle ID for ReactFlow ──
  const handleId = useMemo(() =>
    createCanvasConnectionHandleString({
      mode,
      dataType: port.dataType,
      index,
      id: port.id,
    }),
    [mode, port.dataType, index, port.id],
  );

  // ── Calculate vertical offset for multiple handles ──
  const topPercent = useMemo(() => {
    if (totalPorts <= 1) return '50%';
    const spacing = 100 / (totalPorts + 1);
    return `${spacing * (index + 1)}%`;
  }, [totalPorts, index]);

  // ── Build handle context value ──
  const handleContextValue = useMemo<CanvasNodeHandleContextData>(() => ({
    label: port.label,
    mode,
    dataType: port.dataType,
    index,
    isRequired: port.required ?? false,
    isConnected: connectionsCount > 0,
    isConnecting,
    isReadOnly: false,
    maxConnections: port.maxConnections,
  }), [port, mode, index, connectionsCount, isConnecting]);

  const handleType = mode === CanvasConnectionMode.Input ? 'target' : 'source';
  const isInput = mode === CanvasConnectionMode.Input;

  if (isInput) {
    // ── INPUT HANDLE: solid rect at left edge ──
    // ReactFlow's .react-flow__handle-left: left:0; transform:translate(-50%,-50%)
    // With 10px width → center at x=0 (border outer edge), extends -5 to +5.
    // This perfectly straddles the 3px node border. No override needed.
    return (
      <CanvasNodeHandleContext.Provider value={handleContextValue}>
        <Handle
          type={handleType}
          position={position}
          id={handleId}
          className="canvas-handle"
          style={{
            ...IH,
            top: topPercent,
            background: connectionsCount > 0 ? '#8a8a8a' : '#5a5a5a',
          }}
        />
      </CanvasNodeHandleContext.Provider>
    );
  }

  // ── OUTPUT HANDLE: circle + rod + [+] button in ONE flex container ──
  // The Handle has class "canvas-handle-output" which forces position:static
  // via CSS !important, making it a natural flex sibling of the circle and rod.
  // Container positioned so circle center sits at the node's right border.
  //
  // Layout:  [circle 25px][rod 15px][button 24px] = 64px total
  // Circle center at 12.5px from container left edge.
  // left:100% puts container left at node right edge.
  // marginLeft:-12px shifts left so circle center ≈ node right edge.
  return (
    <CanvasNodeHandleContext.Provider value={handleContextValue}>
      <div
        style={{
          position: 'absolute',
          top: topPercent,
          left: '100%',
          marginLeft: '-12px',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            background: connectionsCount > 0 ? '#8a8a8a' : '#5a5a5a',
            border: '2px solid #1a1a22',
            flexShrink: 0,
          }}
        />
        {/* Rod */}
        <div
          style={{
            width: '15px',
            height: '2px',
            background: '#5a5a5a',
            flexShrink: 0,
          }}
        />
        {/* [+] button IS the ReactFlow Handle.
            CSS class "canvas-handle-output" forces position:static !important,
            so it flows naturally in this flex row — zero gap guaranteed. */}
        <Handle
          type={handleType}
          position={position}
          id={handleId}
          className="canvas-handle-output nodrag"
          style={{
            ...OH,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {CLINICAL_DATA_TYPES.includes(port.dataType)
            ? <Plug size={12} color="rgba(255,255,255,0.15)" strokeWidth={SW} style={{ pointerEvents: 'none' }} />
            : <Plus size={12} color="rgba(255,255,255,0.15)" strokeWidth={SW} style={{ pointerEvents: 'none' }} />
          }
        </Handle>
      </div>
    </CanvasNodeHandleContext.Provider>
  );
};

export default CanvasHandleRenderer;
