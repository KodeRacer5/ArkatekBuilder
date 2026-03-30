/**
 * CanvasNode — entry point for all canvas nodes
 * Source: n8n CanvasNode.vue (461 lines)
 *
 * This is the ONLY component registered in ReactFlow's nodeTypes.
 * It provides CanvasNodeContext, renders handles via CanvasHandleRenderer,
 * shows toolbar on selection, and delegates visual rendering to CanvasNodeRenderer.
 *
 * n8n pattern: CanvasNode provides → CanvasNodeRenderer switches → CanvasNodeDefault renders
 */

import React, { useMemo, useCallback, useState } from 'react';
import type { NodeProps, Node } from '@xyflow/react';
import { Position } from '@xyflow/react';
import CanvasNodeContext from '../../../contexts/CanvasNodeContext';
import CanvasNodeRenderer from './CanvasNodeRenderer';
import CanvasNodeToolbar from './CanvasNodeToolbar';
import CanvasHandleRenderer from '../handles/CanvasHandleRenderer';
import type { ClinicalNodeData, CanvasNodeContextData, CanvasConnectionPort } from '../../../canvas.types';
import { CanvasConnectionMode } from '../../../canvas.types';

type ClinicalNode = Node<ClinicalNodeData>;

const CanvasNode: React.FC<NodeProps<ClinicalNode>> = (props) => {
  const { id, data, selected } = props;
  const nodeData = data as ClinicalNodeData;
  const [isHovered, setIsHovered] = useState(false);

  // ── Build context value (n8n: provide(CanvasNodeKey)) ──
  const contextValue = useMemo<CanvasNodeContextData>(() => ({
    id,
    data: nodeData,
    label: nodeData.label,
    selected: selected ?? false,
    readOnly: false,
  }), [id, nodeData, selected]);

  // ── Map input ports to handle render data ──
  const inputHandles = useMemo(() => {
    return (nodeData.inputPorts || []).map((port: CanvasConnectionPort, index: number) => ({
      port,
      index,
      mode: CanvasConnectionMode.Input as const,
      position: Position.Left as const,
    }));
  }, [nodeData.inputPorts]);

  // ── Map output ports to handle render data ──
  const outputHandles = useMemo(() => {
    return (nodeData.outputPorts || []).map((port: CanvasConnectionPort, index: number) => ({
      port,
      index,
      mode: CanvasConnectionMode.Output as const,
      position: Position.Right as const,
    }));
  }, [nodeData.outputPorts]);

  // ── Toolbar callbacks (bubble up via custom events or store) ──
  const handleRun = useCallback(() => {
    window.dispatchEvent(new CustomEvent('canvas:run-node', { detail: { nodeId: id } }));
  }, [id]);

  const handleDelete = useCallback(() => {
    window.dispatchEvent(new CustomEvent('canvas:delete-node', { detail: { nodeId: id } }));
  }, [id]);

  const handleToggle = useCallback(() => {
    window.dispatchEvent(new CustomEvent('canvas:toggle-node', { detail: { nodeId: id } }));
  }, [id]);

  return (
    <CanvasNodeContext.Provider value={contextValue}>
      <div
        className="canvas-node-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative' }}
      >
        {/* ── Input handles (left side) ── */}
        {inputHandles.map(({ port, index, mode, position }) => (
          <CanvasHandleRenderer
            key={`input-${port.id}`}
            port={port}
            index={index}
            mode={mode}
            position={position}
            totalPorts={inputHandles.length}
          />
        ))}

        {/* ── Toolbar (shown on selection — n8n pattern) ── */}
        {selected && (
          <CanvasNodeToolbar
            onRun={handleRun}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        {/* ── Node renderer (dispatches to correct render type) ── */}
        <CanvasNodeRenderer />

        {/* ── Output handles (right side) ── */}
        {outputHandles.map(({ port, index, mode, position }) => (
          <CanvasHandleRenderer
            key={`output-${port.id}`}
            port={port}
            index={index}
            mode={mode}
            position={position}
            totalPorts={outputHandles.length}
          />
        ))}
      </div>
    </CanvasNodeContext.Provider>
  );
};

export default CanvasNode;
