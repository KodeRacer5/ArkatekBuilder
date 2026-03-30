/**
 * useRunPipeline — pipeline execution hook
 * 
 * Executes nodes in topological order with:
 * - Shared JSON session context (accumulates across pipeline)
 * - Recipe-driven system prompts (universal template + config table)
 * - Structured JSON output parsing
 * - Programmatic Organize node logic (split/merge/combine)
 * - Data node passthrough for Acquire/Web/System
 */

import { useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { AgentService } from './AgentService';
import { topologicalSort, buildPatientContextString } from '../canvas/canvas.utils';
import type { ClinicalNodeData, PatientRecord, EngineSubPort } from '../canvas/canvas.types';
import {
  createSessionContext,
  buildNodeSystemPrompt,
  buildNodeUserMessage,
  parseNodeOutput,
} from './recipes';
import type { CortixNodeOutput, CortixSessionContext } from './recipes';

/** Map Data sub-port labels to PatientRecord field names */
const DATA_LABEL_TO_FIELD: Record<string, keyof PatientRecord> = {
  'Labs': 'labs', 'Medications': 'medications', 'Symptoms': 'symptoms',
  'History': 'history', 'Imaging': 'imaging',
};

/** Build focused patient context when a Data sub-port category is attached */
function buildFocusedPatientContext(
  patient: PatientRecord, dataSub: EngineSubPort | null | undefined, fullContext: string,
): string {
  if (!dataSub || dataSub.label === 'All Data') return fullContext;
  const field = DATA_LABEL_TO_FIELD[dataSub.label];
  if (!field) return fullContext;
  const value = patient[field];
  if (!value) return fullContext;
  return `Patient: ${patient.name} (MRN: ${patient.mrn})\n\n--- ${dataSub.label} ---\n${value}\n\n[Focus: ${dataSub.label} data only]`;
}

/** FIELD_MAP for data node passthrough */
const FIELD_MAP: Record<string, keyof PatientRecord> = {
  labs: 'labs', medications: 'medications', symptoms: 'symptoms',
  history: 'history', imaging: 'imaging',
};

/**
 * Execute a data passthrough node (Acquire/Web/System).
 * Returns the passthrough text.
 */
function executeDataNode(nd: ClinicalNodeData, patient: PatientRecord, patientContext: string): string {
  const outType = nd.outputPorts[0]?.dataType;
  const field = outType ? FIELD_MAP[outType] : undefined;
  if (field && patient[field]) return patient[field] as string;
  if (nd.userInput) return nd.userInput as string;
  return patientContext;
}

/**
 * Execute Splitter — distribute upstream JSON by field categories.
 * Returns result string (JSON) representing the split operation.
 */
function executeSplitter(
  upstream: string[], outputPortCount: number, sessionContext: CortixSessionContext,
): string {
  // Collect all findings/flags/values from session context
  const allFindings = sessionContext.nodeOutputs.flatMap(o => o.data.findings);
  const allFlags = sessionContext.nodeOutputs.flatMap(o => o.data.flags);
  const allValues = sessionContext.nodeOutputs.reduce((acc, o) => ({ ...acc, ...o.data.values }), {} as Record<string, any>);
  const allSources = sessionContext.nodeOutputs.flatMap(o => o.data.sources);

  // Distribute across output ports by category
  const buckets = [allFindings, allFlags, allValues, allSources];
  const splitResult: Record<string, any>[] = [];
  for (let i = 0; i < outputPortCount; i++) {
    splitResult.push(buckets[i % buckets.length] ?? []);
  }
  return JSON.stringify({ split: splitResult, portCount: outputPortCount });
}

/**
 * Execute Merger/Combine — deep merge upstream JSON outputs.
 * Returns merged result string (JSON).
 */
function executeMerger(upstream: string[], sessionContext: CortixSessionContext): string {
  const merged = {
    findings: [] as any[], flags: [] as any[],
    values: {} as Record<string, any>, sources: [] as any[],
  };

  // Merge from direct upstream
  for (const raw of upstream) {
    const parsed = parseNodeOutput(raw);
    if (parsed?.data) {
      if (parsed.data.findings) merged.findings.push(...parsed.data.findings);
      if (parsed.data.flags) merged.flags.push(...parsed.data.flags);
      if (parsed.data.values) Object.assign(merged.values, parsed.data.values);
      if (parsed.data.sources) merged.sources.push(...parsed.data.sources);
    } else {
      // Raw text upstream — wrap as a finding
      merged.findings.push({ id: `raw-${Date.now()}`, label: 'Upstream Data', detail: raw, confidence: 1.0 });
    }
  }

  return JSON.stringify({ status: 'complete', data: merged });
}

/**
 * Build a CortixNodeOutput from an LLM response.
 */
function buildNodeOutput(
  nodeId: string, nodeType: string, raw: string, model: string,
): CortixNodeOutput {
  const parsed = parseNodeOutput(raw);
  if (parsed && parsed.data) {
    return {
      nodeId, nodeType, status: parsed.status || 'complete',
      data: {
        findings: parsed.data.findings || [],
        flags: parsed.data.flags || [],
        values: parsed.data.values || {},
        sources: parsed.data.sources || [],
      },
      meta: {
        model,
        confidence: parsed.meta?.confidence ?? 0,
        reasoning: parsed.meta?.reasoning ?? '',
        steps_completed: 1,
      },
    };
  }
  // Fallback: model didn't return valid JSON — wrap raw text
  return {
    nodeId, nodeType, status: 'complete',
    data: {
      findings: [{ id: 'f-raw', label: nodeType, detail: raw, confidence: 0.5 }],
      flags: [], values: {}, sources: [],
    },
    meta: { model, confidence: 0.5, reasoning: 'Raw text response — JSON parse failed', steps_completed: 1 },
  };
}

interface UseRunPipelineParams {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  patient: PatientRecord;
  onStart?: () => void;
  onComplete?: () => void;
  onNodeComplete?: (nodeId: string, nodeData: ClinicalNodeData, result: string) => void;
}

/** Organize node labels that use programmatic logic instead of LLM */
const ORGANIZE_LABELS = ['Splitter', 'Split', 'Merger', 'Combine', 'Merge'];

export function useRunPipeline({
  nodes, edges, setNodes, setEdges, patient,
  onStart, onComplete, onNodeComplete,
}: UseRunPipelineParams) {

  const executePipeline = useCallback(async () => {
    onStart?.();

    const patientContext = buildPatientContextString(patient);
    const patientRecord: Record<string, string> = {};
    for (const [k, v] of Object.entries(patient)) {
      if (typeof v === 'string' && v.trim()) patientRecord[k] = v;
    }

    const sessionContext = createSessionContext(
      `pipeline-${Date.now()}`, patientRecord, 'default',
    );

    const order = topologicalSort(
      nodes.map(n => n.id),
      edges.map(e => ({ source: e.source, target: e.target })),
    );

    const results = new Map<string, string>();

    for (const nodeId of order) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;
      const nd = node.data as ClinicalNodeData;

      // Animate incoming edges
      const activeEdgeIds = edges.filter(e => e.target === nodeId).map(e => e.id);
      setEdges(eds => eds.map(e =>
        activeEdgeIds.includes(e.id)
          ? { ...e, animated: true, data: { ...e.data, status: 'running' } }
          : e,
      ));

      // Set node to running
      setNodes(nds => nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, execution: { status: 'running', running: true } } }
          : n,
      ));

      // Gather upstream results
      const upstream = edges
        .filter(e => e.target === nodeId)
        .map(e => results.get(e.source))
        .filter(Boolean) as string[];

      let result: string;
      let succeeded = false;

      try {
        // ── DATA NODE: passthrough ──
        if (nd.category === 'data' && nd.inputPorts.length === 0) {
          result = executeDataNode(nd, patient, patientContext);
          succeeded = true;

        // ── ORGANIZE NODE: programmatic logic ──
        } else if (ORGANIZE_LABELS.includes(nd.label)) {
          if (nd.label === 'Splitter' || nd.label === 'Split') {
            result = executeSplitter(upstream, nd.outputPorts.length, sessionContext);
          } else {
            result = executeMerger(upstream, sessionContext);
          }
          succeeded = true;

        // ── THINKING NODE: recipe-driven LLM call ──
        } else {
          const systemPrompt = buildNodeSystemPrompt(nd.label);
          const userMessage = buildNodeUserMessage(sessionContext, upstream, nd.userInput as string);

          const nodeContext = nd.subs?.data
            ? buildFocusedPatientContext(patient, nd.subs.data, patientContext)
            : patientContext;

          result = await AgentService.execute(systemPrompt, upstream, userMessage, nodeContext);

          // Parse and accumulate into session context
          const nodeOutput = buildNodeOutput(nodeId, nd.label, result, AgentService.model);
          sessionContext.nodeOutputs.push(nodeOutput);
          succeeded = true;

          if (nd.category === 'output') {
            onNodeComplete?.(nodeId, nd, result);
          }
        }

        results.set(nodeId, result);
        setNodes(nds => nds.map(n =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, execution: { status: 'complete', running: false }, result } }
            : n,
        ));

      } catch (err: any) {
        setNodes(nds => nds.map(n =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, execution: { status: 'error', running: false }, result: err.message } }
            : n,
        ));
      }

      // Stop edge animation
      const edgeStatus = succeeded ? 'complete' : 'error';
      setEdges(eds => eds.map(e =>
        activeEdgeIds.includes(e.id)
          ? { ...e, animated: false, data: { ...e.data, status: edgeStatus } }
          : e,
      ));
    }

    onComplete?.();
  }, [nodes, edges, setNodes, setEdges, patient, onStart, onComplete, onNodeComplete]);

  const executeNode = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const nd = node.data as ClinicalNodeData;

    onStart?.();

    const patientContext = buildPatientContextString(patient);
    const patientRecord: Record<string, string> = {};
    for (const [k, v] of Object.entries(patient)) {
      if (typeof v === 'string' && v.trim()) patientRecord[k] = v;
    }

    // Build session context from existing node results on canvas
    const sessionContext = createSessionContext(
      `single-${Date.now()}`, patientRecord, 'default',
    );
    for (const n of nodes) {
      const nData = n.data as ClinicalNodeData;
      if (nData.result && n.id !== nodeId) {
        const nodeOutput = buildNodeOutput(n.id, nData.label, nData.result, AgentService.model);
        sessionContext.nodeOutputs.push(nodeOutput);
      }
    }

    // Animate incoming edges
    const activeEdgeIds = edges.filter(e => e.target === nodeId).map(e => e.id);
    setEdges(eds => eds.map(e =>
      activeEdgeIds.includes(e.id)
        ? { ...e, animated: true, data: { ...e.data, status: 'running' } }
        : e,
    ));

    // Set node to running
    setNodes(nds => nds.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, execution: { status: 'running', running: true } } }
        : n,
    ));

    // Gather upstream
    const upstream = edges
      .filter(e => e.target === nodeId)
      .map(e => {
        const srcNode = nodes.find(n => n.id === e.source);
        return (srcNode?.data as ClinicalNodeData)?.result;
      })
      .filter(Boolean) as string[];

    let succeeded = false;

    try {
      let result: string;

      if (nd.category === 'data' && nd.inputPorts.length === 0) {
        result = executeDataNode(nd, patient, patientContext);
      } else if (ORGANIZE_LABELS.includes(nd.label)) {
        if (nd.label === 'Splitter' || nd.label === 'Split') {
          result = executeSplitter(upstream, nd.outputPorts.length, sessionContext);
        } else {
          result = executeMerger(upstream, sessionContext);
        }
      } else {
        const systemPrompt = buildNodeSystemPrompt(nd.label);
        const userMessage = buildNodeUserMessage(sessionContext, upstream, nd.userInput as string);
        const nodeContext = nd.subs?.data
          ? buildFocusedPatientContext(patient, nd.subs.data, patientContext)
          : patientContext;
        result = await AgentService.execute(systemPrompt, upstream, userMessage, nodeContext);
      }

      setNodes(nds => nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, execution: { status: 'complete', running: false }, result } }
          : n,
      ));
      succeeded = true;

      if (nd.category === 'output') {
        onNodeComplete?.(nodeId, nd, result);
      }
    } catch (err: any) {
      setNodes(nds => nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, execution: { status: 'error', running: false }, result: err.message } }
          : n,
      ));
    }

    const edgeStatus = succeeded ? 'complete' : 'error';
    setEdges(eds => eds.map(e =>
      activeEdgeIds.includes(e.id)
        ? { ...e, animated: false, data: { ...e.data, status: edgeStatus } }
        : e,
    ));

    onComplete?.();
  }, [nodes, edges, setNodes, setEdges, patient, onStart, onComplete, onNodeComplete]);

  return { executePipeline, executeNode };
}
