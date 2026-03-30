/**
 * Canvas Utilities — pure functions for canvas operations
 * Source: n8n canvas.utils.ts + CortixEngine-specific utilities
 *
 * All functions are framework-agnostic (no React/Vue dependencies).
 */

import {
  type CanvasConnectionPort,
  type BoundingBox,
  type PortDataType,
  CanvasConnectionMode,
} from './canvas.types';

/* ═══════════════════════════════════════════════════
   HANDLE ID ENCODING (from n8n)
   Encodes port identity into a single handle string for ReactFlow
   ═══════════════════════════════════════════════════ */

const HANDLE_SEPARATOR = '|';

/**
 * Creates a handle ID string from port properties.
 * Format: "mode|dataType|index|id"
 */
export function createCanvasConnectionHandleString({
  mode,
  dataType,
  index,
  id,
}: {
  mode: CanvasConnectionMode;
  dataType: PortDataType;
  index: number;
  id: string;
}): string {
  return [mode, dataType, index, id].join(HANDLE_SEPARATOR);
}

/**
 * Parses a handle ID string back into port properties.
 */
export function parseCanvasConnectionHandleString(handle: string): {
  mode: CanvasConnectionMode;
  dataType: PortDataType;
  index: number;
  id: string;
} | null {
  const parts = handle.split(HANDLE_SEPARATOR);
  if (parts.length < 4) return null;
  return {
    mode: parts[0] as CanvasConnectionMode,
    dataType: parts[1] as PortDataType,
    index: parseInt(parts[2], 10),
    id: parts[3],
  };
}

/**
 * Creates a unique connection ID from source and target handles.
 */
export function createCanvasConnectionId(
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
): string {
  return `${source}${HANDLE_SEPARATOR}${sourceHandle}${HANDLE_SEPARATOR}${target}${HANDLE_SEPARATOR}${targetHandle}`;
}

/* ═══════════════════════════════════════════════════
   GEOMETRY UTILITIES (from n8n)
   ═══════════════════════════════════════════════════ */

/**
 * Checks if two bounding boxes overlap.
 */
export function checkOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/* ═══════════════════════════════════════════════════
   CONNECTION VALIDATION (CortixEngine-specific)
   ═══════════════════════════════════════════════════ */

/**
 * Checks if two port data types are compatible for connection.
 * 'any' type connects to everything.
 */
export function arePortsCompatible(source: PortDataType, target: PortDataType): boolean {
  if (source === 'any' || target === 'any') return true;
  if (source === 'analysis') return true; // analysis connects to any target
  return source === target;
}

/* ═══════════════════════════════════════════════════
   NODE ID GENERATION
   ═══════════════════════════════════════════════════ */

let _nodeIdCounter = 0;

/**
 * Generates a unique node ID.
 */
export function generateNodeId(): string {
  return `n_${++_nodeIdCounter}`;
}

/**
 * Resets the node ID counter (useful for tests).
 */
export function resetNodeIdCounter(): void {
  _nodeIdCounter = 0;
}

/* ═══════════════════════════════════════════════════
   TOPOLOGICAL SORT (CortixEngine pipeline execution)
   Extracts execution order from the node graph.
   ═══════════════════════════════════════════════════ */

/**
 * Returns node IDs in topological order for pipeline execution.
 * Uses Kahn's algorithm (BFS-based).
 */
export function topologicalSort(
  nodeIds: string[],
  edges: Array<{ source: string; target: string }>,
): string[] {
  const inDeg = new Map<string, number>(nodeIds.map(id => [id, 0]));
  const adj = new Map<string, string[]>(nodeIds.map(id => [id, []]));

  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target);
    inDeg.set(edge.target, (inDeg.get(edge.target) || 0) + 1);
  }

  const queue: string[] = [];
  inDeg.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const neighbor of adj.get(id) || []) {
      const newDeg = (inDeg.get(neighbor) || 1) - 1;
      inDeg.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  return order;
}

/* ═══════════════════════════════════════════════════
   KEYBOARD SHORTCUT HELPERS
   ═══════════════════════════════════════════════════ */

/**
 * Checks if a keyboard event should be ignored (e.g., when typing in an input).
 * Adapted from n8n's shouldIgnoreCanvasShortcut.
 */
export function shouldIgnoreCanvasShortcut(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement;
  if (!target) return false;

  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return true;
  if (target.isContentEditable) return true;
  if (target.closest('.nodrag')) return true;

  return false;
}

/* ═══════════════════════════════════════════════════
   PATIENT CONTEXT BUILDER
   Builds a context string from patient data for agent calls
   ═══════════════════════════════════════════════════ */

import type { PatientRecord, ClinicalNodeData } from './canvas.types';
import { NODE_DIMENSIONS } from './canvas.constants';
import type { Node, Edge } from '@xyflow/react';

/* ═══════════════════════════════════════════════════
   PIPELINE INSTANTIATION
   Converts a pipeline definition into positioned nodes + edges
   ═══════════════════════════════════════════════════ */

/**
 * Assigns each node a column (layer) via BFS from sources (nodes with no incoming edges).
 * Returns a Map<nodeIndex, column>.
 */
function assignLayers(
  count: number,
  topoEdges: Array<{ from: number; to: number }>,
): Map<number, number> {
  const incomingMap = new Map<number, number[]>();
  const outgoingMap = new Map<number, number[]>();
  for (let i = 0; i < count; i++) {
    incomingMap.set(i, []);
    outgoingMap.set(i, []);
  }
  for (const e of topoEdges) {
    incomingMap.get(e.to)!.push(e.from);
    outgoingMap.get(e.from)!.push(e.to);
  }

  const layers = new Map<number, number>();
  // Sources: nodes with no incoming edges
  const queue: number[] = [];
  for (let i = 0; i < count; i++) {
    if (incomingMap.get(i)!.length === 0) {
      layers.set(i, 0);
      queue.push(i);
    }
  }

  while (queue.length > 0) {
    const idx = queue.shift()!;
    const col = layers.get(idx)!;
    for (const target of outgoingMap.get(idx)!) {
      const existing = layers.get(target);
      const newCol = col + 1;
      if (existing === undefined || newCol > existing) {
        layers.set(target, newCol);
      }
      // Only enqueue once all predecessors have been visited
      const allPredVisited = incomingMap.get(target)!.every(p => layers.has(p));
      if (allPredVisited && !queue.includes(target)) {
        queue.push(target);
      }
    }
  }

  // Fallback: any unassigned node goes to column = its index
  for (let i = 0; i < count; i++) {
    if (!layers.has(i)) layers.set(i, i);
  }

  return layers;
}

export function instantiatePipeline(
  pipelineNodes: Array<ClinicalNodeData & { renderType?: string }>,
  topology?: Array<{ from: number; to: number }>,
): { nodes: Node[], edges: Edge[] } {
  const GAP_X = 80;
  const GAP_Y = 40;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (topology && topology.length > 0) {
    // ── DAG layout ──
    const layers = assignLayers(pipelineNodes.length, topology);

    // Group nodes by column
    const columns = new Map<number, number[]>();
    for (let i = 0; i < pipelineNodes.length; i++) {
      const col = layers.get(i)!;
      if (!columns.has(col)) columns.set(col, []);
      columns.get(col)!.push(i);
    }

    // Calculate x offset for each column
    const sortedCols = [...columns.keys()].sort((a, b) => a - b);
    const colX = new Map<number, number>();
    let xOffset = 100;
    for (const col of sortedCols) {
      // Use the widest node in this column for spacing
      const indices = columns.get(col)!;
      let maxWidth = 0;
      for (const idx of indices) {
        const rt = pipelineNodes[idx].renderType || pipelineNodes[idx].render.type || 'default';
        const d = NODE_DIMENSIONS[rt] ?? NODE_DIMENSIONS.rect;
        maxWidth = Math.max(maxWidth, d.width);
      }
      colX.set(col, xOffset);
      xOffset += maxWidth + GAP_X;
    }

    // Position nodes: center each column's nodes vertically
    for (const col of sortedCols) {
      const indices = columns.get(col)!;
      // Calculate total height of this column
      let totalHeight = 0;
      const heights: number[] = [];
      for (const idx of indices) {
        const rt = pipelineNodes[idx].renderType || pipelineNodes[idx].render.type || 'default';
        const d = NODE_DIMENSIONS[rt] ?? NODE_DIMENSIONS.rect;
        heights.push(d.height);
        totalHeight += d.height;
      }
      totalHeight += (indices.length - 1) * GAP_Y;

      // Start y so the column is centered around y=200
      let y = 200 - totalHeight / 2;
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        const pNode = pipelineNodes[idx];
        const rt = pNode.renderType || pNode.render.type || 'default';
        const dims = NODE_DIMENSIONS[rt] ?? NODE_DIMENSIONS.rect;
        const nodeId = generateNodeId();

        nodes[idx] = {
          id: nodeId,
          type: 'clinicalNode',
          position: { x: colX.get(col)!, y },
          data: pNode,
          width: dims.width,
          height: dims.height,
        };
        y += dims.height + GAP_Y;
      }
    }

    // Create edges from topology
    for (const { from, to } of topology) {
      const srcNode = nodes[from];
      const tgtNode = nodes[to];
      if (!srcNode || !tgtNode) continue;
      const srcData = srcNode.data as ClinicalNodeData;
      const tgtData = tgtNode.data as ClinicalNodeData;
      if (srcData.outputPorts.length > 0 && tgtData.inputPorts.length > 0) {
        edges.push({
          id: `e_${srcNode.id}_${tgtNode.id}`,
          source: srcNode.id,
          sourceHandle: createCanvasConnectionHandleString({
            mode: CanvasConnectionMode.Output,
            dataType: srcData.outputPorts[0].dataType,
            index: 0,
            id: srcData.outputPorts[0].id,
          }),
          target: tgtNode.id,
          targetHandle: createCanvasConnectionHandleString({
            mode: CanvasConnectionMode.Input,
            dataType: tgtData.inputPorts[0].dataType,
            index: 0,
            id: tgtData.inputPorts[0].id,
          }),
          type: 'clinicalEdge',
        });
      }
    }
  } else {
    // ── Linear layout (backward compatible) ──
    let xOffset = 100;

    pipelineNodes.forEach((pNode, idx) => {
      const renderType = pNode.renderType || pNode.render.type || 'default';
      const dims = NODE_DIMENSIONS[renderType] ?? NODE_DIMENSIONS.rect;
      const nodeId = generateNodeId();

      nodes.push({
        id: nodeId,
        type: 'clinicalNode',
        position: { x: xOffset, y: 200 },
        data: pNode,
        width: dims.width,
        height: dims.height,
      });
      xOffset += dims.width + GAP_X;

      // Connect to previous node
      if (idx > 0) {
        const prevNode = nodes[idx - 1];
        const prevData = prevNode.data as ClinicalNodeData;
        const currData = pNode;
        if (prevData.outputPorts.length > 0 && currData.inputPorts.length > 0) {
          edges.push({
            id: `e_${prevNode.id}_${nodeId}`,
            source: prevNode.id,
            sourceHandle: createCanvasConnectionHandleString({
              mode: CanvasConnectionMode.Output,
              dataType: prevData.outputPorts[0].dataType,
              index: 0,
              id: prevData.outputPorts[0].id,
            }),
            target: nodeId,
            targetHandle: createCanvasConnectionHandleString({
              mode: CanvasConnectionMode.Input,
              dataType: currData.inputPorts[0].dataType,
              index: 0,
              id: currData.inputPorts[0].id,
            }),
            type: 'clinicalEdge',
          });
        }
      }
    });
  }

  return { nodes, edges };
}

export function buildPatientContextString(patient: PatientRecord): string {
  const parts: string[] = [];
  if (patient.name) parts.push(`Name: ${patient.name}`);
  if (patient.mrn) parts.push(`MRN: ${patient.mrn}`);
  if (patient.dob) parts.push(`DOB: ${patient.dob}`);
  if (patient.labs) parts.push(`Labs:\n${patient.labs}`);
  if (patient.medications) parts.push(`Medications:\n${patient.medications}`);
  if (patient.symptoms) parts.push(`Symptoms:\n${patient.symptoms}`);
  if (patient.history) parts.push(`History:\n${patient.history}`);
  if (patient.imaging) parts.push(`Imaging:\n${patient.imaging}`);
  if (patient.notes) parts.push(`Notes:\n${patient.notes}`);
  return parts.join('\n\n');
}
