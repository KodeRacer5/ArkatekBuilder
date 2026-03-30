/**
 * CortixEngine Synthesizer — public entry point
 *
 * Composes all decomposed components into a complete Synthesizer view.
 * This replaces the 823-line CortixEngineSynthesizer.tsx monolith.
 *
 * Layout: Toolbar (top) → TabBar → [Sidebar | Canvas/TabContent | PatientWorkspace?] (body)
 * All node types, palette, execution, and patient data are managed here.
 *
 * Supports two modes:
 *   - 'standalone' (default): own patient panel, save downloads JSON
 *   - 'patient-bound': external patient data, project load/save, auto-save
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Canvas from './canvas/components/Canvas';
import CanvasRunPipelineButton from './canvas/components/elements/buttons/CanvasRunPipelineButton';
import NodeCreator from './sidebar/NodeCreator';
import SynthesizerToolbar from './toolbar/SynthesizerToolbar';
import PatientWorkspace from './patient/PatientWorkspace';
import { usePatientContext } from './patient/usePatientContext';
import { useRunPipeline } from './execution/useRunPipeline';
import { AgentService } from './execution/AgentService';
import SynthesizerConfigContext from './execution/SynthesizerConfigContext';
import {
  generateNodeId,
  buildPatientContextString,
  instantiatePipeline,
  parseCanvasConnectionHandleString,
  arePortsCompatible,
} from './canvas/canvas.utils';
import { NODE_DIMENSIONS } from './canvas/canvas.constants';
import type {
  ClinicalNodeData,
  CanvasConnectionData,
  SynthesizerProps,
  SynthesisProject,
  PatientRecord,
} from './canvas/canvas.types';
import { CanvasNodeRenderType } from './canvas/canvas.types';

// Tab components
import CanvasTabBar from './tabs/CanvasTabBar';
import TabPreloadedModules from './tabs/TabPreloadedModules';
import TabExtensionPacks from './tabs/TabExtensionPacks';
import TabEmptyState from './tabs/TabEmptyState';
import TabNodeGrid from './tabs/TabNodeGrid';
import TabNotes from './tabs/TabNotes';
import TabSettings from './tabs/TabSettings';
import type { PipelineModuleNode, PipelineEdge } from './tabs/data/preloadedModules';
import { mkData } from './store/useNodeTypesStore';

// Multi-canvas selector
import CanvasSelector, { type CanvasTab } from './toolbar/CanvasSelector';

const AUTOSAVE_DELAY = 2000;

/** Stored canvas data for non-active canvases */
interface CanvasSnapshot {
  nodes: Node[];
  edges: Edge[];
}

function SynthesizerInner({
  mode = 'standalone',
  platform = 'radix',
  externalPatient,
  project,
  onSaveProject,
}: SynthesizerProps) {
  const isPatientBound = mode === 'patient-bound';
  const isHealth = platform === 'cortixhealth';

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // ── Synthesizer config (bridges Settings UI → AgentService) ──
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cortix-api-key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('cortix-model') || 'anthropic/claude-sonnet-4-20250514');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Sync config to AgentService + localStorage whenever it changes
  useEffect(() => {
    AgentService.apiKey = apiKey;
    localStorage.setItem('cortix-api-key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    AgentService.model = model;
    localStorage.setItem('cortix-model', model);
  }, [model]);

  const configValue = React.useMemo(() => ({
    apiKey,
    model,
    autoSave: autoSaveEnabled,
    platform: platform ?? 'radix' as const,
    setApiKey,
    setModel,
    setAutoSave: setAutoSaveEnabled,
  }), [apiKey, model, autoSaveEnabled, platform]);

  // Track loaded project id to detect switches
  const loadedProjectRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Multi-canvas state ─────────────────────────────────
  const [canvases, setCanvases] = useState<CanvasTab[]>([{ id: 'canvas-1', name: 'Canvas 1' }]);
  const [activeCanvasId, setActiveCanvasId] = useState('canvas-1');
  const canvasStatesRef = useRef<Map<string, CanvasSnapshot>>(new Map());
  const canvasCounterRef = useRef(1);

  const switchCanvas = useCallback((targetId: string) => {
    if (targetId === activeCanvasId) return;
    // Save current canvas state
    canvasStatesRef.current.set(activeCanvasId, {
      nodes: [...nodes],
      edges: [...edges],
    });
    // Load target canvas state
    const target = canvasStatesRef.current.get(targetId);
    setNodes(target?.nodes ?? []);
    setEdges(target?.edges ?? []);
    setActiveCanvasId(targetId);
  }, [activeCanvasId, nodes, edges, setNodes, setEdges]);

  const addCanvas = useCallback(() => {
    canvasCounterRef.current += 1;
    const newId = `canvas-${Date.now()}`;
    const newName = `Canvas ${canvasCounterRef.current}`;
    // Save current canvas before switching
    canvasStatesRef.current.set(activeCanvasId, {
      nodes: [...nodes],
      edges: [...edges],
    });
    // New canvas starts empty
    canvasStatesRef.current.set(newId, { nodes: [], edges: [] });
    setCanvases(prev => [...prev, { id: newId, name: newName }]);
    setNodes([]);
    setEdges([]);
    setActiveCanvasId(newId);
  }, [activeCanvasId, nodes, edges, setNodes, setEdges]);

  const closeCanvas = useCallback((id: string) => {
    if (canvases.length <= 1) return;
    canvasStatesRef.current.delete(id);
    const remaining = canvases.filter(c => c.id !== id);
    setCanvases(remaining);
    if (id === activeCanvasId) {
      const newActive = remaining[0].id;
      const target = canvasStatesRef.current.get(newActive);
      setNodes(target?.nodes ?? []);
      setEdges(target?.edges ?? []);
      setActiveCanvasId(newActive);
    }
  }, [canvases, activeCanvasId, setNodes, setEdges]);

  const renameCanvas = useCallback((id: string, name: string) => {
    setCanvases(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  }, []);

  // ── Patient context ──────────────────────────────────────
  // Standalone: own patient state from hook
  // Patient-bound: use externalPatient passed from parent
  const standaloneCtx = usePatientContext();
  const patient = isPatientBound && externalPatient ? externalPatient : standaloneCtx.patient;
  const setPatient = standaloneCtx.setPatient;
  const patientOpen = isPatientBound ? false : standaloneCtx.isOpen;
  const togglePatient = standaloneCtx.toggleOpen;

  // ── Project hydration ────────────────────────────────────
  // When project changes in patient-bound mode, load its nodes/edges
  useEffect(() => {
    if (!isPatientBound) return;

    const pid = project?.id ?? null;
    if (pid === loadedProjectRef.current) return;
    loadedProjectRef.current = pid;

    if (project) {
      setNodes(project.nodes.map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: {
          ...n.data,
          execution: { status: 'idle' as const, running: false },
          result: undefined,
        },
        width: n.width,
        height: n.height,
      })) as Node[]);
      setEdges(project.edges.map(e => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle,
        target: e.target,
        targetHandle: e.targetHandle,
        type: e.type || 'clinicalEdge',
      })) as Edge[]);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [isPatientBound, project?.id]);

  // ── Auto-save (patient-bound only) ──────────────────────
  const serializeProject = useCallback((): SynthesisProject | null => {
    if (!project) return null;
    return {
      ...project,
      updatedAt: new Date().toISOString(),
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type || 'clinicalNode',
        position: n.position,
        data: {
          ...(n.data as ClinicalNodeData),
          execution: { status: 'idle' as const, running: false },
          result: undefined,
        },
        width: n.width,
        height: n.height,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle ?? undefined,
        target: e.target,
        targetHandle: e.targetHandle ?? undefined,
        type: e.type,
      })),
    };
  }, [project, nodes, edges]);

  // Debounced auto-save on node/edge changes in patient-bound mode
  useEffect(() => {
    if (!isPatientBound || !onSaveProject || !project) return;
    // Don't auto-save during initial hydration
    if (loadedProjectRef.current !== project.id) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      const serialized = serializeProject();
      if (serialized) onSaveProject(serialized);
    }, AUTOSAVE_DELAY);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [isPatientBound, nodes, edges, onSaveProject, project?.id, serializeProject]);

  // Callback when an output node completes — emit event for parent consumption
  const handleNodeComplete = useCallback((nodeId: string, nodeData: ClinicalNodeData, result: string) => {
    window.dispatchEvent(new CustomEvent('synthesizer:output-complete', {
      detail: { nodeId, label: nodeData.label, result },
    }));
  }, []);

  // Pipeline execution
  const { executePipeline, executeNode } = useRunPipeline({
    nodes,
    edges,
    setNodes: setNodes as any,
    setEdges: setEdges as any,
    patient,
    onStart: () => setExecuting(true),
    onComplete: () => setExecuting(false),
    onNodeComplete: handleNodeComplete,
  });

  // Connect handler (with port compatibility validation)
  const onConnect = useCallback((connection: Connection) => {
    const src = parseCanvasConnectionHandleString(connection.sourceHandle || '');
    const tgt = parseCanvasConnectionHandleString(connection.targetHandle || '');
    if (src && tgt && !arePortsCompatible(src.dataType, tgt.dataType)) return;

    setEdges(eds => addEdge({
      ...connection,
      type: 'clinicalEdge',
    }, eds));
  }, [setEdges]);

  // Drop handler (from palette drag & drop)
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

      const dims = NODE_DIMENSIONS[nodeData.render.type] ?? NODE_DIMENSIONS.rect;
      const isStickyNote = nodeData.render.type === CanvasNodeRenderType.StickyNote;
      const newNode: Node = {
        id: generateNodeId(),
        type: 'clinicalNode',
        position,
        data: nodeData,
        width: dims.width,
        height: dims.height,
        ...(isStickyNote ? { zIndex: -1 } : {}),
      };

      setNodes(nds => [...nds, newNode]);
    } catch {
      // Invalid drop data
    }
  }, [screenToFlowPosition, setNodes]);

  // ── Load preloaded pipeline ──────────────────────────────
  const loadPipeline = useCallback((pipelineNodes: PipelineModuleNode[], topology?: PipelineEdge[]) => {
    const { nodes: newNodes, edges: newEdges } = instantiatePipeline(pipelineNodes, topology);

    // Offset new nodes below existing ones so they don't overlap
    setNodes(prev => {
      if (prev.length > 0) {
        const maxY = Math.max(...prev.map(n => (n.position?.y ?? 0) + (n.height ?? 60)));
        const minNewY = Math.min(...newNodes.map(n => n.position?.y ?? 0));
        const offsetY = maxY - minNewY + 80;
        newNodes.forEach(n => { n.position = { x: n.position.x, y: n.position.y + offsetY }; });
      }
      return [...prev, ...newNodes];
    });
    setEdges(prev => [...prev, ...newEdges]);
    setActiveTab(null); // return to canvas
  }, [setNodes, setEdges]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  // Add sticky note at viewport center
  const addStickyNote = useCallback((color: number = 0) => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const noteData: ClinicalNodeData = {
      label: 'Note',
      category: 'custom',
      shape: 'rect',
      description: 'Sticky note',
      icon: 'sticky-note',
      inputPorts: [],
      outputPorts: [],
      execution: { status: 'idle', running: false },
      render: { type: CanvasNodeRenderType.StickyNote, options: { color } },
      action: false,
      userInput: "## I'm a note\n**Double click** to edit me.",
    };

    const newNode: Node = {
      id: generateNodeId(),
      type: 'clinicalNode',
      position,
      data: noteData,
      width: NODE_DIMENSIONS.stickyNote.width,
      height: NODE_DIMENSIONS.stickyNote.height,
      zIndex: -1,
    };

    setNodes(nds => [...nds, newNode]);
    setActiveTab(null);
  }, [screenToFlowPosition, setNodes]);

  // Save template
  const saveTemplate = useCallback(() => {
    // Patient-bound: delegate to parent via onSaveProject
    if (isPatientBound && onSaveProject) {
      const serialized = serializeProject();
      if (serialized) onSaveProject(serialized);
      return;
    }

    // Standalone: download JSON
    const template = {
      nodes: nodes.map(n => ({
        ...n,
        data: {
          ...(n.data as ClinicalNodeData),
          execution: { status: 'idle', running: false },
          result: undefined,
        },
      })),
      edges,
      patient,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synth-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [isPatientBound, onSaveProject, serializeProject, nodes, edges, patient]);

  // Listen for canvas events (delete, run-node, toggle-node)
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
          !selectedIds.includes(e.source) && !selectedIds.includes(e.target) && !e.selected,
        ));
        return nds.filter(n => !n.selected);
      });
    };

    const handleRunNode = (e: Event) => {
      const nodeId = (e as CustomEvent).detail?.nodeId;
      if (nodeId && !executing) {
        executeNode(nodeId);
      }
    };

    const handleToggleNode = (e: Event) => {
      const nodeId = (e as CustomEvent).detail?.nodeId;
      if (nodeId) {
        setNodes(nds => nds.map(n =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, disabled: !(n.data as ClinicalNodeData).disabled } }
            : n,
        ));
      }
    };

    const handleUpdatePorts = (e: Event) => {
      const { nodeId, inputPorts, outputPorts } = (e as CustomEvent).detail ?? {};
      if (!nodeId) return;
      // Remove edges connected to ports that no longer exist
      setEdges(eds => eds.filter(edge => {
        if (outputPorts && edge.source === nodeId) {
          const portIndex = parseInt(edge.sourceHandle?.split('|')[2] ?? '0', 10);
          return portIndex < outputPorts.length;
        }
        if (inputPorts && edge.target === nodeId) {
          const portIndex = parseInt(edge.targetHandle?.split('|')[2] ?? '0', 10);
          return portIndex < inputPorts.length;
        }
        return true;
      }));
      setNodes(nds => nds.map(n => {
        if (n.id !== nodeId) return n;
        const update: any = { ...n.data };
        if (inputPorts) update.inputPorts = inputPorts;
        if (outputPorts) update.outputPorts = outputPorts;
        return { ...n, data: update };
      }));
    };

    window.addEventListener('canvas:delete-node', handleDeleteNode);
    window.addEventListener('canvas:delete-edge', handleDeleteEdge);
    window.addEventListener('canvas:delete-selected', handleDeleteSelected);
    window.addEventListener('canvas:run-node', handleRunNode);
    window.addEventListener('canvas:toggle-node', handleToggleNode);
    window.addEventListener('canvas:update-node-ports', handleUpdatePorts);

    return () => {
      window.removeEventListener('canvas:delete-node', handleDeleteNode);
      window.removeEventListener('canvas:delete-edge', handleDeleteEdge);
      window.removeEventListener('canvas:delete-selected', handleDeleteSelected);
      window.removeEventListener('canvas:run-node', handleRunNode);
      window.removeEventListener('canvas:toggle-node', handleToggleNode);
      window.removeEventListener('canvas:update-node-ports', handleUpdatePorts);
    };
  }, [setNodes, setEdges, executing, executeNode]);

  // Listen for chat → canvas push events
  useEffect(() => {
    const handler = (e: Event) => {
      const { title, content } = (e as CustomEvent).detail;

      // Center on viewport
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
      });

      // Create a connectable data node (Acquire-type with output port)
      const nodeData: ClinicalNodeData = {
        ...mkData(title, 'Chat research data', 'clipboard', 'info-out', 'Information', 'any'),
        userInput: content,
      };
      const newNode: Node = {
        id: `chat-${Date.now()}`,
        type: 'clinicalNode',
        position,
        data: nodeData,
        width: 170,
        height: 56,
      };
      setNodes(nds => [...nds, newNode]);
    };

    window.addEventListener('chat:push-to-canvas', handler);
    return () => window.removeEventListener('chat:push-to-canvas', handler);
  }, [setNodes, screenToFlowPosition]);

  // ── Tab content rendering ──────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return <TabNotes onAddNote={addStickyNote} />;
      case 'preloaded':
        return <TabPreloadedModules onLoadPipeline={loadPipeline} onClose={() => setActiveTab(null)} platform={platform} />;
      case 'extensions':
        return <TabExtensionPacks onTabChange={setActiveTab} />;
      case 'custom':
        return <TabEmptyState tabName="Custom Modules" tabIcon="folder" />;
      case 'skills':
        return <TabNodeGrid paletteKey="Skills" title="User-Defined Skills" badge="custom configurations" onTabChange={setActiveTab} platform={platform} />;
      case 'web':
        return <TabNodeGrid paletteKey="Web" title="Web Access" badge="external sources & retrieval" onTabChange={setActiveTab} platform={platform} />;
      case 'system':
        return <TabNodeGrid paletteKey="System" title="System Tools" badge="infrastructure & persistence" onTabChange={setActiveTab} platform={platform} />;
      /* ── CortixHealth tabs ── */
      case 'biometrics':
        return <TabNodeGrid paletteKey="Biometrics" title="Biometrics" badge="bracelet & wearable data" onTabChange={setActiveTab} platform={platform} />;
      case 'nutrition':
        return <TabNodeGrid paletteKey="Nutrition" title="Nutrition" badge="food & supplements" onTabChange={setActiveTab} platform={platform} />;
      case 'movement':
        return <TabNodeGrid paletteKey="Movement" title="Movement & Recovery" badge="exercise & rest" onTabChange={setActiveTab} platform={platform} />;
      case 'remedies':
        return <TabNodeGrid paletteKey="Remedies" title="Natural Remedies" badge="herbal & homeopathic" onTabChange={setActiveTab} platform={platform} />;
      case 'knowledge':
        return <TabNodeGrid paletteKey="Knowledge" title="Knowledge" badge="compound DB & graphs" onTabChange={setActiveTab} platform={platform} />;
      case 'commerce':
        return <TabNodeGrid paletteKey="Commerce" title="Commerce" badge="verified products" onTabChange={setActiveTab} platform={platform} />;
      case 'safety':
        return <TabNodeGrid paletteKey="Safety" title="Safety" badge="interactions & limits" onTabChange={setActiveTab} platform={platform} />;
      case 'results':
        return <TabNodeGrid paletteKey="Results" title="Results & Tracking" badge="summaries & exports" onTabChange={setActiveTab} platform={platform} />;
      case 'settings':
        return <TabSettings />;
      default:
        return null;
    }
  };

  return (
    <SynthesizerConfigContext.Provider value={configValue}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1A1918' }}>
      {/* Toolbar */}
      <SynthesizerToolbar
        onExecute={executePipeline}
        onClear={clearCanvas}
        onSave={saveTemplate}
        executing={executing}
        onTogglePatient={togglePatient}
        patientOpen={patientOpen}
        hidePatientToggle={isPatientBound}
        title={isPatientBound ? (platform === 'cortixhealth' ? 'HEALTH MAPPER' : 'PATIENT MAPPER') : undefined}
        platform={platform}
      />

      {/* Canvas selector (multi-canvas tabs — replaces former TARGETS row) */}
      <CanvasSelector
        canvases={canvases}
        activeCanvasId={activeCanvasId}
        onSwitch={switchCanvas}
        onAdd={addCanvas}
        onClose={closeCanvas}
        onRename={renameCanvas}
      />

      {/* Tab bar */}
      <CanvasTabBar activeTab={activeTab} onTabChange={setActiveTab} platform={platform} />

      {/* Body: Sidebar | Canvas/TabContent | Patient */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NodeCreator onTabChange={setActiveTab} platform={platform} />

        <div style={{ flex: 1, position: 'relative' }}>
          {/* Canvas stays mounted (hidden when tab active) to preserve ReactFlow state */}
          <div style={{ width: '100%', height: '100%', display: activeTab === null ? 'block' : 'none' }}>
            <Canvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              isExecuting={executing}
              onAddStickyNote={() => addStickyNote(0)}
            >
              <CanvasRunPipelineButton
                isExecuting={executing}
                onClick={executePipeline}
                disabled={nodes.length === 0}
              />
            </Canvas>
          </div>

          {/* Tab content panel */}
          {activeTab !== null && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(22,22,28,0.98)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {renderTabContent()}
            </div>
          )}
        </div>

        {!isPatientBound && patientOpen && (
          <PatientWorkspace patient={patient} setPatient={setPatient} />
        )}
      </div>

      {/* Brand footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#2A2928',
          fontSize: '9px',
          fontWeight: 300,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        Atumnus CortixEngine&#8482; &mdash; Not a medical device
      </div>
    </div>
    </SynthesizerConfigContext.Provider>
  );
}

/**
 * CortixEngineSynthesizer — wrapped in ReactFlowProvider
 */
const CortixEngineSynthesizer: React.FC<SynthesizerProps> = (props) => (
  <ReactFlowProvider>
    <SynthesizerInner {...props} />
  </ReactFlowProvider>
);

export default CortixEngineSynthesizer;
