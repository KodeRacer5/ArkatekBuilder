/**
 * CanvasNodeEngine — CortixEngine AI processor node (260x120 body + sub-port area)
 *
 * Per v2 spec:
 * - ALWAYS labeled "CortixEngine" — function name goes in subtitle only
 * - Icon: bot (Lucide)
 * - Sub-port labels: Extension, Tool, Data
 * - Data sub-port is ALWAYS null — only shows [+] button
 * - No truncation on any label/subtitle
 * - Rod+button on right edge (all nodes)
 * - Sub-port diamonds are visual-only in Phase 1 (not ReactFlow Handles)
 */

import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useReactFlow } from '@xyflow/react';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, resolveNodeColors, NODE_ACCENT_COLORS, HEALTH_ACCENT_COLORS } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';
import CanvasEngineSubPort from './parts/CanvasEngineSubPort';
import { EXTENSION_PACKS } from '../../../../../tabs/data/extensionPackData';
import { useSynthesizerConfig } from '../../../../../execution/SynthesizerConfigContext';
import type { EngineSubPort } from '../../../../canvas.types';

/** Available extensions for the sub-port picker, derived from extension packs */
interface PickerEntry {
  label: string;
  icon: string;
  color: string;
}

/** Patient data category entries for the Data sub-port picker — RADIX */
const RADIX_DATA_ENTRIES: PickerEntry[] = [
  { label: 'Labs',        icon: 'flask-conical', color: NODE_ACCENT_COLORS.lab        || '#6bc1ff' },
  { label: 'Medications', icon: 'pill',          color: NODE_ACCENT_COLORS.meds       || '#5ba0d0' },
  { label: 'Symptoms',    icon: 'activity',      color: NODE_ACCENT_COLORS.symptoms   || '#d070b0' },
  { label: 'History',     icon: 'user',          color: NODE_ACCENT_COLORS.history    || '#c3af9b' },
  { label: 'Imaging',     icon: 'image',         color: NODE_ACCENT_COLORS.imaging    || '#a0afc3' },
  { label: 'All Data',    icon: 'database',      color: NODE_ACCENT_COLORS.history    || '#c3af9b' },
];

/** Data entries for CortixHealth — biometrics, vitals, profile */
const HEALTH_DATA_ENTRIES: PickerEntry[] = [
  { label: 'Bracelet Feed',  icon: 'watch',          color: HEALTH_ACCENT_COLORS.bracelet      || '#00d4aa' },
  { label: 'Wearable Import', icon: 'cloud-download', color: HEALTH_ACCENT_COLORS.wearableImport || '#00b894' },
  { label: 'Manual Vitals',  icon: 'clipboard',      color: HEALTH_ACCENT_COLORS.manualVitals   || '#6bc1ff' },
  { label: 'Health Goals',   icon: 'target',         color: HEALTH_ACCENT_COLORS.goals          || '#6bc1ff' },
  { label: 'Health Conditions', icon: 'clipboard',   color: HEALTH_ACCENT_COLORS.conditions     || '#c3af9b' },
  { label: 'Dietary Restrictions', icon: 'utensils', color: HEALTH_ACCENT_COLORS.dietary        || '#d070b0' },
];

/** RADIX extension pack keys */
const RADIX_EXT_PACKS = ['appraise', 'apply', 'clinical', 'pathways'];
const RADIX_TOOL_PACKS = ['dataout', 'skills'];

/** CortixHealth extension pack keys */
const HEALTH_EXT_PACKS = ['nutrition', 'natmed', 'exercise'];
const HEALTH_TOOL_PACKS = ['skills'];

/** Flatten extension packs into picker entries per slot type */
function getPickerEntries(slot: 'ext' | 'tool' | 'data', platform: string | null): PickerEntry[] {
  const isHealth = platform === 'cortixhealth';

  if (slot === 'data') return isHealth ? HEALTH_DATA_ENTRIES : RADIX_DATA_ENTRIES;

  const packs = slot === 'ext'
    ? (isHealth ? HEALTH_EXT_PACKS : RADIX_EXT_PACKS)
    : (isHealth ? HEALTH_TOOL_PACKS : RADIX_TOOL_PACKS);

  const entries: PickerEntry[] = [];
  for (const key of packs) {
    const pack = EXTENSION_PACKS[key];
    if (!pack) continue;
    for (const node of pack.nodes) {
      const displayLabel = node.label === 'CortixEngine'
        ? (node.subtitle || 'CortixEngine')
        : node.label;
      entries.push({
        label: displayLabel,
        icon: node.engineIcon || node.icon,
        color: node.accentColor || pack.accent,
      });
    }
  }
  return entries;
}

const CanvasNodeEngine: React.FC = () => {
  const {
    id, label, data, icon, executionStatus, executionRunning,
    isSelected, subtitle, subs, action,
  } = useCanvasNode();
  const { setNodes } = useReactFlow();
  const { platform } = useSynthesizerConfig();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(data.userInput || '');
  const [pickerSlot, setPickerSlot] = useState<'ext' | 'tool' | 'data' | null>(null);

  const pickerEntries = useMemo(() =>
    pickerSlot ? getPickerEntries(pickerSlot, platform) : [],
    [pickerSlot, platform],
  );

  const saveInput = useCallback(() => {
    setEditing(false);
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, userInput: inputVal } } : n
    ));
  }, [id, inputVal, setNodes]);

  const attachExtension = useCallback((slot: 'ext' | 'tool' | 'data', entry: PickerEntry) => {
    const newSub: EngineSubPort = { label: entry.label, icon: entry.icon, color: entry.color };
    setNodes(nds => nds.map(n => {
      if (n.id !== id) return n;
      const currentSubs = (n.data as any).subs ?? { ext: null, tool: null, data: null };
      return { ...n, data: { ...n.data, subs: { ...currentSubs, [slot]: newSub } } };
    }));
    setPickerSlot(null);
  }, [id, setNodes]);

  const detachExtension = useCallback((slot: 'ext' | 'tool' | 'data') => {
    setNodes(nds => nds.map(n => {
      if (n.id !== id) return n;
      const currentSubs = (n.data as any).subs ?? { ext: null, tool: null, data: null };
      return { ...n, data: { ...n.data, subs: { ...currentSubs, [slot]: null } } };
    }));
  }, [id, setNodes]);

  const colors = resolveNodeColors(data);
  // Always show bot on canvas — extension panel may use a different icon
  const Icon = IC['bot'];

  const nodeClasses = clsx(
    'canvas-node',
    'canvas-node-engine',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  // Sub-ports data (defaults if not provided)
  const subPorts = subs ?? { ext: null, tool: null, data: null };

  return (
    <div style={{ position: 'relative', width: 260 }}>
      {/* ── Main body (260x120) ── */}
      <div
        className={nodeClasses}
        onDoubleClick={() => setExpanded(!expanded)}
        style={{
          width: '260px',
          height: '120px',
          borderRadius: '9px',
          background: 'rgba(32,32,40,0.95)',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 18px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'visible',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon size={48} color={colors.accent} strokeWidth={SW} />}
        </div>

        {/* Label (always "CortixEngine") + subtitle (function name) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {platform === 'cortixhealth' ? 'CortixHealth' : 'CortixEngine'}
          </div>
          {subtitle && (
            <div
              style={{
                color: colors.accent,
                fontSize: '10px',
                fontWeight: 300,
                marginTop: '3px',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Status icons */}
        <div style={{ flexShrink: 0 }}>
          <CanvasNodeStatusIcons />
        </div>

      </div>

      {/* ── Sub-port area (absolute, below body — matches prototype .sub-area) ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '100%',
          width: '260px',
          display: 'flex',
          justifyContent: 'space-evenly',
          zIndex: 4,
        }}
      >
        {/* Extension sub-port — offset left */}
        <div style={{ marginLeft: '-10px', position: 'relative' }}>
          <CanvasEngineSubPort
            slot="ext"
            subPort={subPorts.ext}
            accentColor={colors.accent}
            onClickEmpty={(s) => setPickerSlot(s)}
            onClickLoaded={() => detachExtension('ext')}
          />
          {pickerSlot === 'ext' && <SubPortPicker entries={pickerEntries} slot="ext" onSelect={attachExtension} onClose={() => setPickerSlot(null)} />}
        </div>
        {/* Tool sub-port — offset center */}
        <div style={{ marginLeft: '40px', position: 'relative' }}>
          <CanvasEngineSubPort
            slot="tool"
            subPort={subPorts.tool}
            accentColor={colors.accent}
            onClickEmpty={(s) => setPickerSlot(s)}
            onClickLoaded={() => detachExtension('tool')}
          />
          {pickerSlot === 'tool' && <SubPortPicker entries={pickerEntries} slot="tool" onSelect={attachExtension} onClose={() => setPickerSlot(null)} />}
        </div>
        {/* Data sub-port — offset right, patient data category picker.
            handleId makes the diamond a real ReactFlow Handle target (connector ⑤)
            so Acquire/data nodes can wire patient information into this Engine. */}
        <div style={{ marginLeft: '10px', position: 'relative' }}>
          <CanvasEngineSubPort
            slot="data"
            subPort={subPorts.data}
            accentColor={colors.accent}
            handleId="input|any|0|data-in"
            onClickEmpty={(s) => setPickerSlot(s)}
            onClickLoaded={() => detachExtension('data')}
          />
          {pickerSlot === 'data' && <SubPortPicker entries={pickerEntries} slot="data" onSelect={attachExtension} onClose={() => setPickerSlot(null)} />}
        </div>
      </div>

      {/* Expanded panel (absolute, below sub-ports) */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 120px)',
            width: '260px',
            background: 'rgba(28,28,36,0.95)',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', fontWeight: 300, marginBottom: '6px' }}>
            {data.description}
          </div>

          {/* Editable instructions */}
          {editing ? (
            <textarea
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
              onBlur={saveInput}
              onKeyDown={e => { if (e.key === 'Escape') setEditing(false); }}
              className="nodrag nowheel"
              style={{
                width: '100%',
                minHeight: '50px',
                background: 'rgba(0,0,0,0.25)',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 300,
                padding: '6px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="Add processing instructions..."
            />
          ) : (
            <div
              onClick={e => { e.stopPropagation(); setEditing(true); }}
              className="nodrag"
              style={{
                padding: '6px',
                borderRadius: '6px',
                cursor: 'text',
                border: `1px dashed ${colors.border}`,
                minHeight: '28px',
                fontSize: '10px',
                fontWeight: 300,
                color: data.userInput ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
              }}
            >
              {data.userInput || 'Click to add processing instructions...'}
            </div>
          )}

          {data.result && (
            <div
              style={{
                marginTop: '6px',
                padding: '6px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
                maxHeight: '60px',
                overflow: 'hidden',
              }}
            >
              {typeof data.result === 'string' ? data.result.slice(0, 200) : 'Results available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** Inline dropdown for selecting an extension to attach to a sub-port */
const SubPortPicker: React.FC<{
  entries: PickerEntry[];
  slot: 'ext' | 'tool' | 'data';
  onSelect: (slot: 'ext' | 'tool' | 'data', entry: PickerEntry) => void;
  onClose: () => void;
}> = ({ entries, slot, onSelect, onClose }) => {
  if (entries.length === 0) return null;

  return (
    <>
      {/* Backdrop to close picker */}
      <div
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
        }}
      />
      <div
        className="nodrag nowheel"
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '4px',
          width: '180px',
          maxHeight: '200px',
          overflowY: 'auto',
          background: 'rgba(28,28,36,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 100,
          padding: '4px 0',
        }}
      >
        {entries.map((entry, i) => {
          const EntryIcon = IC[entry.icon];
          return (
            <div
              key={`${entry.label}-${i}`}
              onClick={(e) => { e.stopPropagation(); onSelect(slot, entry); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.6)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {EntryIcon && <EntryIcon size={14} color={entry.color} strokeWidth={SW} />}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CanvasNodeEngine;
