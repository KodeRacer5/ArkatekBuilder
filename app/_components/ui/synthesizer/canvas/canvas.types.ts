/**
 * Canvas Type System — adapted from n8n canvas.types.ts
 * Source: n8n/features/workflows/canvas/canvas.types.ts
 *
 * Translated from Vue (Ref, ComputedRef) to plain TypeScript for React.
 * Extended with CortixEngine clinical fields.
 */

import type { Node, Edge, Position, OnConnectStartParams, Viewport } from '@xyflow/react';

/* ═══════════════════════════════════════════════════
   ENUMS & CONSTANTS
   ═══════════════════════════════════════════════════ */

/** Node category for clinical domain coloring */
export type NodeCategory = 'data' | 'extension' | 'validation' | 'output' | 'unknown' | 'custom';

/** Node visual shape */
export type NodeShape = 'circle' | 'rect';

/** Execution status per node */
export type ExecutionStatus = 'idle' | 'running' | 'complete' | 'error' | 'waiting';

/** Port data types for connection validation */
export type PortDataType = 'labs' | 'medications' | 'symptoms' | 'history' | 'imaging' | 'analysis' | 'any';

/** Connection direction */
export const enum CanvasConnectionMode {
  Input = 'inputs',
  Output = 'outputs',
}

/** Render type for node component dispatch (n8n: CanvasNodeRenderType) */
export const enum CanvasNodeRenderType {
  Default = 'default',         // Rect card — data inputs, investigation targets, custom
  Circle = 'circle',           // Circle processor — research, analysis, pharmacology, etc.
  StickyNote = 'stickyNote',   // Editable canvas note
  AddNodes = 'addNodes',       // "Add node" placeholder
  Pill = 'pill',               // Rounded pill — clinician review / filter gates
  Square = 'square',           // Square utility — compact icon block
  Rounded = 'rounded',         // Rounded trigger — left-rounded input style
  SmRounded = 'smRounded',     // Small rounded trigger — compact variant
  Tall = 'tall',               // Tall vertical merger — multi-input combiner
  Splitter = 'splitter',       // Tall vertical splitter — single-in, multi-out
  Engine = 'engine',           // CortixEngine — main AI processor with sub-ports
  DualOut = 'dualOut',         // Dual output — If/Else, Router
}

/* ═══════════════════════════════════════════════════
   ENGINE SUB-PORT DEFINITIONS
   ═══════════════════════════════════════════════════ */

/** A loaded sub-port attachment on CortixEngine nodes */
export interface EngineSubPort {
  label: string;
  icon: string;
  color: string;
}

/** Sub-port slots for CortixEngine nodes (3 columns below node body) */
export interface EngineSubPorts {
  ext: EngineSubPort | null;   // Extension attachment square or [+]
  tool: EngineSubPort | null;  // Tool attachment square or [+]
  data: EngineSubPort | null;  // Patient data category binding (Labs, Meds, etc.) or null
}

/* ═══════════════════════════════════════════════════
   PORT DEFINITIONS
   ═══════════════════════════════════════════════════ */

/** Connection port definition (n8n: CanvasConnectionPort) */
export interface CanvasConnectionPort {
  id: string;
  label: string;
  dataType: PortDataType;
  required?: boolean;
  maxConnections?: number;
}

/** Port with computed render data for handle positioning */
export interface CanvasPortWithRenderData extends CanvasConnectionPort {
  handleId: string;
  connectionsCount: number;
  isConnecting: boolean;
  position: Position;
  offset?: { top?: string; left?: string };
}

/* ═══════════════════════════════════════════════════
   FILE ATTACHMENTS (CortixEngine-specific)
   ═══════════════════════════════════════════════════ */

export interface NodeFileAttachment {
  name: string;
  size: number;
  type: string;       // MIME type
  base64?: string;    // File content as base64
  uploadedAt: string;
}

/* ═══════════════════════════════════════════════════
   NODE DATA — the core data model
   (n8n: CanvasNodeData, extended for clinical use)
   ═══════════════════════════════════════════════════ */

export interface ClinicalNodeData {
  // ── Identity ──
  label: string;
  description: string;
  icon: string;               // key into IC icon map

  // ── Clinical Domain ──
  category: NodeCategory;
  shape: NodeShape;
  systemPrompt?: string;      // LLM system prompt for this node
  userInput?: string;         // User-provided data/context
  editable?: boolean;         // Custom node — user can edit label + prompt

  // ── Ports ──
  inputPorts: CanvasConnectionPort[];
  outputPorts: CanvasConnectionPort[];

  // ── Execution State ──
  execution: {
    status: ExecutionStatus;
    running: boolean;
  };
  result?: string;

  // ── Attachments ──
  attachments?: NodeFileAttachment[];

  // ── Render ──
  render: {
    type: CanvasNodeRenderType;
    options?: Record<string, unknown>;
  };

  // ── Per-node visual overrides ──
  accentColor?: string;        // hex color override (bypasses category colors)
  subtitle?: string;           // primary subtitle (colored by accent)
  subtitle2?: string;          // secondary dim subtitle (8px dimgray, Pill only)
  action?: boolean;            // show rod+button on right edge of node
  subs?: EngineSubPorts;       // Engine sub-port slots (3 columns below body)
  engineIcon?: string;         // sidebar icon override (e.g., 'bot' for Engine nodes)

  // ── Extensibility ──
  [key: string]: unknown;
}

/* ═══════════════════════════════════════════════════
   REACT FLOW NODE & EDGE TYPES
   ═══════════════════════════════════════════════════ */

export type CanvasNode = Node<ClinicalNodeData>;

export interface CanvasConnectionData {
  source: CanvasConnectionPort;
  target: CanvasConnectionPort;
  status?: 'idle' | 'running' | 'complete' | 'error';
  [key: string]: unknown;
}

export type CanvasEdge = Edge<CanvasConnectionData>;

export interface CanvasConnectionCreateData {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  data: {
    source: CanvasConnectionPort;
    target: CanvasConnectionPort;
  };
}

/* ═══════════════════════════════════════════════════
   CONTEXT INJECTION INTERFACES
   (n8n: CanvasInjectionData, CanvasNodeInjectionData)
   Translated from Vue Ref<T> to plain T for React state
   ═══════════════════════════════════════════════════ */

export interface CanvasContextData {
  initialized: boolean;
  isExecuting: boolean;
  connectingHandle: ConnectStartEvent | undefined;
  viewport: Viewport;
  isPaneMoving: boolean;
}

export interface CanvasNodeContextData {
  id: string;
  data: ClinicalNodeData;
  label: string;
  selected: boolean;
  readOnly: boolean;
}

export interface CanvasNodeHandleContextData {
  label: string | undefined;
  mode: CanvasConnectionMode;
  dataType: PortDataType;
  index: number;
  isRequired: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isReadOnly: boolean;
  maxConnections: number | undefined;
}

/* ═══════════════════════════════════════════════════
   EVENTS
   ═══════════════════════════════════════════════════ */

export type ConnectStartEvent = {
  event?: MouseEvent;
} & OnConnectStartParams;

export type CanvasNodeMoveEvent = {
  id: string;
  position: { x: number; y: number };
};

/* ═══════════════════════════════════════════════════
   PATIENT RECORD (for Synthesizer's built-in patient panel)
   ═══════════════════════════════════════════════════ */

export interface PatientRecord {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  labs: string;
  medications: string;
  symptoms: string;
  history: string;
  imaging: string;
  notes: string;
}

/* ═══════════════════════════════════════════════════
   AGENT MESSAGE (for LLM API calls)
   ═══════════════════════════════════════════════════ */

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/* ═══════════════════════════════════════════════════
   SYNTHESIS PROJECT (per-patient pipeline save)
   ═══════════════════════════════════════════════════ */

export interface SynthesisProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: ClinicalNodeData;
    width?: number;
    height?: number;
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle?: string;
    target: string;
    targetHandle?: string;
    type?: string;
  }>;
}

/* ═══════════════════════════════════════════════════
   SYNTHESIZER PROPS (context injection from parent)
   ═══════════════════════════════════════════════════ */

export interface SynthesizerProps {
  mode?: 'standalone' | 'patient-bound';
  platform?: 'radix' | 'cortixhealth' | null;
  externalPatient?: PatientRecord;
  project?: SynthesisProject | null;
  onSaveProject?: (project: SynthesisProject) => void;
}

/* ═══════════════════════════════════════════════════
   UTILITY TYPES
   ═══════════════════════════════════════════════════ */

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};
