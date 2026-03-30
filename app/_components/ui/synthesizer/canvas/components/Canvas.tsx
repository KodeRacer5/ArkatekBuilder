/**
 * Canvas — main ReactFlow wrapper
 * Source: n8n Canvas.vue (964 lines)
 *
 * This is the core ReactFlow configuration component.
 * It registers nodeTypes, edgeTypes, and connectionLineComponent,
 * provides CanvasContext, and handles:
 * - onConnect (new edges)
 * - onDrop (palette drag & drop)
 * - onDragOver (drag hover acceptance)
 * - Keyboard shortcuts (Delete, Backspace)
 * - Viewport state tracking
 *
 * n8n pattern: Canvas.vue wraps VueFlow and provides CanvasKey;
 * here we wrap ReactFlow and provide CanvasContext.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  useViewport,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type Node,
  type Edge,
  type Viewport,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../canvas-animations.css';

import CanvasContext from '../contexts/CanvasContext';
import CanvasNode from './elements/nodes/CanvasNode';
import CanvasEdge from './elements/edges/CanvasEdge';
import CanvasConnectionLine from './elements/edges/CanvasConnectionLine';
import CanvasControlButtons from './elements/buttons/CanvasControlButtons';
import CanvasArrowHeadMarker from './elements/edges/CanvasArrowHeadMarker';
import type { CanvasContextData, ClinicalNodeData, CanvasConnectionData } from '../canvas.types';
import { shouldIgnoreCanvasShortcut } from '../canvas.utils';
import { useCanvasTheme } from '../contexts/CanvasThemeContext';
import { useTheme } from '../../../../components/ThemeContext';

/* ── Node and edge type registrations (must be stable refs) ── */
const nodeTypes: NodeTypes = {
  clinicalNode: CanvasNode as any,
};

const edgeTypes: EdgeTypes = {
  clinicalEdge: CanvasEdge as any,
};

/* ── Props ── */
interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onReconnect?: (oldEdge: Edge, newConnection: Connection) => void;
  onDrop?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
  isExecuting?: boolean;
  onAddStickyNote?: () => void;
  children?: React.ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  onDrop,
  onDragOver,
  onNodeClick,
  onPaneClick,
  isExecuting = false,
  onAddStickyNote,
  children,
}) => {
  const [isPaneMoving, setIsPaneMoving] = useState(false);
  const { theme } = useTheme();
  const { getCanvasBg } = useCanvasTheme();
  const canvasBg = getCanvasBg(theme);
  const dotColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)';

  // ── Build canvas context (n8n: provide(CanvasKey)) ──
  const contextValue = useMemo<CanvasContextData>(() => ({
    initialized: true,
    isExecuting,
    connectingHandle: undefined,
    viewport: { x: 0, y: 0, zoom: 1 },
    isPaneMoving,
  }), [isExecuting, isPaneMoving]);

  // ── Keyboard shortcuts ──
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (shouldIgnoreCanvasShortcut(event.nativeEvent)) return;

    if (event.key === 'Delete' || event.key === 'Backspace') {
      window.dispatchEvent(new CustomEvent('canvas:delete-selected'));
    }
  }, []);

  // ── Drag & Drop acceptance ──
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOver?.(event);
  }, [onDragOver]);

  return (
    <CanvasContext.Provider value={contextValue}>
      <div
        style={{ width: '100%', height: '100%', position: 'relative' }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* SVG marker definitions */}
        <CanvasArrowHeadMarker id="canvas-arrowhead" />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          edgesReconnectable
          onDrop={onDrop}
          onDragOver={handleDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onMoveStart={() => setIsPaneMoving(true)}
          onMoveEnd={() => setIsPaneMoving(false)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={CanvasConnectionLine}
          defaultEdgeOptions={{
            type: 'clinicalEdge',
            markerEnd: 'url(#canvas-arrowhead)',
            animated: false,
          }}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode={null}
          proOptions={{ hideAttribution: true }}
          style={{ background: canvasBg }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color={dotColor}
          />
        </ReactFlow>

        {/* Canvas control buttons */}
        <CanvasControlButtons onAddStickyNote={onAddStickyNote} />

        {/* Additional children (run button, etc.) */}
        {children}
      </div>
    </CanvasContext.Provider>
  );
};

export default Canvas;
