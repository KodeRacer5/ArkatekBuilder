/**
 * CanvasNodeDefault — rect card node (data inputs, investigation targets, custom)
 * Source: n8n CanvasNodeDefault.vue (449 lines) + current RectNode
 *
 * n8n structure: icon circle left → label + subtitle right → status icons
 * CortixEngine additions: textarea for userInput, file attachment, clinical badge
 *
 * Uses clsx() for n8n's class computation pattern.
 * Uses canvas-animations.css for running/success/error states.
 */

import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { useReactFlow } from '@xyflow/react';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import { IC, SW, C } from '../../../../canvas.constants';
import CanvasNodeStatusIcons from './parts/CanvasNodeStatusIcons';
import CanvasNodeClinicalBadge from './parts/CanvasNodeClinicalBadge';
import type { ClinicalNodeData, NodeFileAttachment } from '../../../../canvas.types';

const CanvasNodeDefault: React.FC = () => {
  const {
    id, label, data, category, icon, executionStatus, executionRunning,
    hasUserInput, isSelected,
  } = useCanvasNode();
  const { setNodes } = useReactFlow();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(data.userInput || '');
  const [editLabel, setEditLabel] = useState(label);
  const [editPrompt, setEditPrompt] = useState(data.systemPrompt || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = C[category];
  const Icon = IC[icon];
  const PaperclipIcon = IC['paperclip'];

  // ── n8n class computation pattern ──
  const nodeClasses = clsx(
    'canvas-node',
    isSelected && 'canvas-node-selected',
    (executionRunning || executionStatus === 'running') && 'canvas-node-running',
    executionStatus === 'complete' && 'canvas-node-success',
    executionStatus === 'error' && 'canvas-node-error',
  );

  const saveInput = useCallback(() => {
    setEditing(false);
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, userInput: inputVal } } : n
    ));
  }, [id, inputVal, setNodes]);

  const saveCustom = useCallback(() => {
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, label: editLabel, systemPrompt: editPrompt } } : n
    ));
  }, [id, editLabel, editPrompt, setNodes]);

  const handleFileAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const attachment: NodeFileAttachment = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
        uploadedAt: new Date().toISOString(),
      };
      setNodes(nds => nds.map(n =>
        n.id === id ? { ...n, data: { ...n.data, attachments: [...((n.data as ClinicalNodeData).attachments || []), attachment] } } : n
      ));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [id, setNodes]);

  const removeAttachment = useCallback((idx: number) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== id) return n;
      const atts = [...((n.data as ClinicalNodeData).attachments || [])];
      atts.splice(idx, 1);
      return { ...n, data: { ...n.data, attachments: atts } };
    }));
  }, [id, setNodes]);

  return (
    <div style={{ position: 'relative', width: 170 }}>
      {/* ── Rect card: n8n structure (icon left, label right) ── */}
      <div
        className={nodeClasses}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '170px',
          height: '56px',
          borderRadius: 'var(--canvas-node--border-radius, 10px)',
          background: 'rgba(32,32,40,0.95)',
          border: '3px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 14px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: executionRunning
            ? '0 0 14px rgba(34, 197, 94, 0.3)'
            : '0 2px 10px rgba(0,0,0,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {/* Icon circle (n8n pattern: colored circle with icon) */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon size={16} color={colors.accent} strokeWidth={SW} />}
        </div>

        {/* Label + subtitle area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#fff',
              fontSize: '11px',
              fontWeight: 300,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label}
          </div>
          {hasUserInput ? (
            <div style={{ color: colors.accent, fontSize: '8px', fontWeight: 300, opacity: 0.6, marginTop: '2px' }}>
              has data
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px', fontWeight: 300, marginTop: '2px' }}>
              click to expand
            </div>
          )}
        </div>

        {/* Status + badge (n8n: status icons on right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <CanvasNodeClinicalBadge />
          <CanvasNodeStatusIcons />
        </div>

        {/* Data indicator bar (bottom accent line) */}
        {hasUserInput && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '20px',
              right: '20px',
              height: '2px',
              borderRadius: '1px',
              background: colors.accent,
              opacity: 0.3,
            }}
          />
        )}
      </div>

      {/* ── Expanded panel: input + results ── */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '6px',
            width: '230px',
            background: 'rgba(28,28,36,0.95)',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          {/* Description */}
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', fontWeight: 300, marginBottom: '8px' }}>
            {data.description}
          </div>

          {/* User input textarea */}
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
                minHeight: '60px',
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
              placeholder={
                category === 'unknown' ? 'Add investigation context...' :
                category === 'data' ? 'Enter patient data...' : 'Add instructions...'
              }
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
                minHeight: '32px',
                fontSize: '10px',
                fontWeight: 300,
                color: data.userInput ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
              }}
            >
              {data.userInput ||
                (category === 'unknown' ? 'Click to add context...' :
                 category === 'data' ? 'Click to add data...' : 'Click to add instructions...')}
            </div>
          )}

          {/* Editable fields for custom nodes */}
          {data.editable && (
            <div style={{ marginTop: '8px', borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', fontWeight: 300, marginBottom: '4px' }}>
                NODE NAME
              </div>
              <input
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                onBlur={saveCustom}
                className="nodrag"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '4px 6px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', fontWeight: 300, marginTop: '6px', marginBottom: '4px' }}>
                SYSTEM PROMPT
              </div>
              <textarea
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
                onBlur={saveCustom}
                className="nodrag nowheel"
                style={{
                  width: '100%',
                  minHeight: '40px',
                  background: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '9px',
                  padding: '4px 6px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* File attachment */}
          <div style={{ marginTop: '8px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.pdf,.csv,.json,.xml,.html"
              onChange={handleFileAttach}
              style={{ display: 'none' }}
            />
            <div
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="nodrag"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px',
                borderRadius: '6px',
                border: '1px dashed rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.15)',
                cursor: 'pointer',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {PaperclipIcon && <PaperclipIcon size={10} strokeWidth={SW} />}
              Attach File
            </div>
            {/* Attachment list */}
            {data.attachments && data.attachments.length > 0 && (
              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {data.attachments.map((att, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '3px 6px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.1)',
                    }}
                  >
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
                      {att.name}
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginLeft: '4px' }}>
                        ({(att.size / 1024).toFixed(1)} KB)
                      </span>
                    </span>
                    <span
                      onClick={e => { e.stopPropagation(); removeAttachment(i); }}
                      className="nodrag"
                      style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result preview */}
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
              {typeof data.result === 'string' ? data.result.slice(0, 140) : 'Results available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasNodeDefault;
