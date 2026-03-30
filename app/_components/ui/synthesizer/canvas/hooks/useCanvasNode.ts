/**
 * useCanvasNode — per-node state consumer hook
 * Source: n8n composables/useCanvasNode.ts (112 lines)
 *
 * Translates Vue inject() + computed() to React useContext() + useMemo().
 * Extended with CortixEngine clinical derivations.
 */

import { useMemo } from 'react';
import { useCanvasNodeContext } from '../contexts/CanvasNodeContext';
import type { ClinicalNodeData, ExecutionStatus, NodeCategory, NodeShape, EngineSubPorts } from '../canvas.types';
import { CanvasNodeRenderType, CanvasConnectionMode } from '../canvas.types';

/** Default node data when context is not yet populated */
const DEFAULT_DATA: ClinicalNodeData = {
  label: '',
  description: '',
  icon: '',
  category: 'unknown',
  shape: 'rect',
  inputPorts: [],
  outputPorts: [],
  execution: { status: 'idle', running: false },
  render: { type: CanvasNodeRenderType.Default, options: {} },
};

export function useCanvasNode() {
  const nodeCtx = useCanvasNodeContext();

  const data = nodeCtx.data ?? DEFAULT_DATA;

  // ── Identity ──
  const id = nodeCtx.id;
  const label = nodeCtx.label || data.label;

  // ── Ports ──
  const inputs = useMemo(() => data.inputPorts, [data.inputPorts]);
  const outputs = useMemo(() => data.outputPorts, [data.outputPorts]);

  // ── State ──
  const isDisabled = false; // future: data.disabled
  const isReadOnly = nodeCtx.readOnly;
  const isSelected = nodeCtx.selected;

  // ── Execution ──
  const executionStatus: ExecutionStatus = data.execution.status;
  const executionRunning = data.execution.running;
  const hasRunData = !!data.result;

  // ── Clinical Domain ──
  const category: NodeCategory = data.category;
  const shape: NodeShape = data.shape;
  const hasUserInput = !!data.userInput;
  const systemPrompt = data.systemPrompt || '';
  const description = data.description;
  const icon = data.icon;

  // ── Render Type ──
  const render = data.render;

  // ── Per-node visual overrides ──
  const accentColor = data.accentColor;
  const subtitle = data.subtitle || '';
  const subtitle2 = data.subtitle2 || '';
  const subs = data.subs as EngineSubPorts | undefined;
  const action = data.action ?? false;

  // ── Attachments ──
  const hasAttachments = (data.attachments?.length ?? 0) > 0;
  const attachmentCount = data.attachments?.length ?? 0;

  return {
    // Context data
    id,
    label,
    data,

    // Ports
    inputs,
    outputs,

    // State
    isDisabled,
    isReadOnly,
    isSelected,

    // Execution
    executionStatus,
    executionRunning,
    hasRunData,

    // Clinical
    category,
    shape,
    hasUserInput,
    systemPrompt,
    description,
    icon,

    // Render
    render,

    // Per-node overrides
    accentColor,
    subtitle,
    subtitle2,
    subs,
    action,

    // Attachments
    hasAttachments,
    attachmentCount,
  };
}
