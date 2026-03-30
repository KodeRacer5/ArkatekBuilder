/**
 * SynthesizerCanvas — top-level orchestrator
 * Source: n8n WorkflowCanvas.vue
 *
 * Composes Canvas + manages nodes/edges state + handles drag-and-drop
 * from the sidebar palette. This is the component that the Synthesizer
 * page renders.
 *
 * State management:
 * - nodes/edges stored in React state (future: Zustand store)
 * - Listens for custom events from CanvasNode/CanvasEdge
 *   (canvas:delete-node, canvas:delete-edge, canvas:delete-selected, canvas:run-node)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import Canvas from './Canvas';
import CanvasRunPipelineButton from './elements/buttons/CanvasRunPipelineButton';
import type { ClinicalNodeData, CanvasConnectionData } from '../canvas.types';
import { generateNodeId } from '../canvas.utils';
import { CanvasNodeRenderType } from '../canvas.types';

interface SynthesizerCanvasProps {
  initialNodes?: Node<ClinicalNodeData>[];
  initialEdges?: Edge<CanvasConnectionData>[];
  isExecuting?: boolean;
  onRunPipeline?: () => void;
  onRunNode?: (nodeId: string) => void;
  onNodesUpdate?: (nodes: Node<ClinicalNodeData>[]) => void;
  onEdgesUpdate?: (edges: Edge<CanvasConnectionData>[]) => void;
}

const SynthesizerCanvasInner: React.FC<SynthesizerCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  isExecuting = false,
  onRunPipeline,
  onRunNode,
  onNodesUpdate,
  onEdgesUpdate,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // ── Sync state upward ──
  useEffect(() => { onNodesUpdate?.(nodes); }, [nodes, onNodesUpdate]);
  useEffect(() => { onEdgesUpdate?.(edges); }, [edges, onEdgesUpdate]);

  // ── Connect handler ──
  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({
      ...connection,
      type: 'clinicalEdge',
      markerEnd: 'url(#canvas-arrowhead)',
    }, eds));
  }, [setEdges]);

  // ── Reconnect handler (drag edge endpoint to a new handle) ──
  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges(eds => {
      // Remove the old edge, then add the new connection
      const filtered = eds.filter(e => e.id !== oldEdge.id);
      return addEdge({
        ...newConnection,
        type: 'clinicalEdge',
        markerEnd: 'url(#canvas-arrowhead)',
      }, filtered);
    });
  }, [setEdges]);

  // ── Drop handler (from palette drag & drop) ──
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/cortix-node');
    if (!raw) return;

    try {
      const nodeData: ClinicalNodeData = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<ClinicalNodeData> = {
        id: generateNodeId(),
        type: 'clinicalNode',
        position,
        data: nodeData,
      };

      setNodes(nds => [...nds, newNode]);
    } catch {
      // Invalid drop data — ignore
    }
  }, [screenToFlowPosition, setNodes]);

  // ── Listen for custom events from child components ──
  useEffect(() => {
    const handleDeleteNode = (e: Event) => {
      const nodeId = (e as CustomEvent).detail?.nodeId;
      if (nodeId) {
        setNodes(nds => nds.filter(n => n.id !== nodeId));
        setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      }
    };

    const handleDeleteEdge = (e: Event) => {
      const edgeId = (e as CustomEvent).detail?.edgeId;
      if (edgeId) {
        setEdges(eds => eds.filter(e => e.id !== edgeId));
      }
    };

    const handleDeleteSelected = () => {
      setNodes(nds => {
        const selectedIds = nds.filter(n => n.selected).map(n => n.id);
        setEdges(eds => eds.filter(e =>
          !selectedIds.includes(e.source) && !selectedIds.includes(e.target) && !e.selected
        ));
        return nds.filter(n => !n.selected);
      });
    };

    const handleRunNode = (e: Event) => {
      const nodeId = (e as CustomEvent).detail?.nodeId;
      if (nodeId) onRunNode?.(nodeId);
    };

    window.addEventListener('canvas:delete-node', handleDeleteNode);
    window.addEventListener('canvas:delete-edge', handleDeleteEdge);
    window.addEventListener('canvas:delete-selected', handleDeleteSelected);
    window.addEventListener('canvas:run-node', handleRunNode);

    return () => {
      window.removeEventListener('canvas:delete-node', handleDeleteNode);
      window.removeEventListener('canvas:delete-edge', handleDeleteEdge);
      window.removeEventListener('canvas:delete-selected', handleDeleteSelected);
      window.removeEventListener('canvas:run-node', handleRunNode);
    };
  }, [setNodes, setEdges, onRunNode]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <Canvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onDrop={onDrop}
        isExecuting={isExecuting}
      >
        <CanvasRunPipelineButton
          isExecuting={isExecuting}
          onClick={onRunPipeline}
          disabled={nodes.length === 0}
        />
      </Canvas>
    </div>
  );
};

/**
 * SynthesizerCanvas — wrapped in ReactFlowProvider
 * ReactFlow requires a provider ancestor for useReactFlow() hooks.
 */
const SynthesizerCanvas: React.FC<SynthesizerCanvasProps> = (props) => (
  <ReactFlowProvider>
    <SynthesizerCanvasInner {...props} />
  </ReactFlowProvider>
);

export default SynthesizerCanvas;
