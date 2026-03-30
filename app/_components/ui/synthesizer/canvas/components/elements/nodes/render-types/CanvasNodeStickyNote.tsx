/**
 * CanvasNodeStickyNote — resizable, colorable canvas note with markdown
 * Source: n8n CanvasNodeStickyNote.vue
 *
 * Features:
 * - NodeResizer for drag-to-resize (min 150x80, max 600x600)
 * - 7 color themes with inline color picker on select/hover
 * - Basic markdown rendering (headings, bold, lists)
 * - No execution animations (sticky notes never run)
 */

import React, { useState, useCallback } from 'react';
import { useReactFlow, NodeResizer } from '@xyflow/react';
import { useCanvasNode } from '../../../../hooks/useCanvasNode';
import type { ClinicalNodeData } from '../../../../canvas.types';

/* ── 7-color palette: bg, border, dot (for picker) ── */
const STICKY_COLORS = [
  { bg: 'rgba(255, 234, 107, 0.15)', border: 'rgba(255, 234, 107, 0.35)', dot: '#FFEA6B' },  // yellow
  { bg: 'rgba(255, 171, 107, 0.15)', border: 'rgba(255, 171, 107, 0.35)', dot: '#FFAB6B' },  // orange
  { bg: 'rgba(130, 209, 130, 0.15)', border: 'rgba(130, 209, 130, 0.35)', dot: '#82D182' },  // green
  { bg: 'rgba(162, 217, 206, 0.15)', border: 'rgba(162, 217, 206, 0.35)', dot: '#A2D9CE' },  // teal
  { bg: 'rgba(186, 220, 255, 0.15)', border: 'rgba(186, 220, 255, 0.35)', dot: '#BADCFF' },  // blue
  { bg: 'rgba(199, 177, 212, 0.15)', border: 'rgba(199, 177, 212, 0.35)', dot: '#C7B1D4' },  // purple
  { bg: 'rgba(255, 182, 185, 0.15)', border: 'rgba(255, 182, 185, 0.35)', dot: '#FFB6B9' },  // pink
];

const DEFAULT_CONTENT = "## I'm a note\n**Double click** to edit me.";

/** Simple markdown → React elements (no external library) */
function renderSimpleMarkdown(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    // ## H2
    if (line.startsWith('## ')) {
      return <div key={i} style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: 'rgba(255,255,255,0.75)' }}>{applyInline(line.slice(3))}</div>;
    }
    // # H1
    if (line.startsWith('# ')) {
      return <div key={i} style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px', color: 'rgba(255,255,255,0.8)' }}>{applyInline(line.slice(2))}</div>;
    }
    // - list item
    if (line.startsWith('- ')) {
      return <div key={i} style={{ paddingLeft: '12px' }}>{'• '}{applyInline(line.slice(2))}</div>;
    }
    // blank line → spacer
    if (line.trim() === '') {
      return <div key={i} style={{ height: '6px' }} />;
    }
    // plain text
    return <div key={i}>{applyInline(line)}</div>;
  });
}

/** Apply inline formatting: **bold** */
function applyInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<strong key={keyIdx++}>{match[1]}</strong>);
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

const CanvasNodeStickyNote: React.FC = () => {
  const { id, data, isSelected } = useCanvasNode();
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const content = (data.userInput as string) || '';
  const colorIndex = ((data.render.options as any)?.color ?? 0) % STICKY_COLORS.length;
  const color = STICKY_COLORS[colorIndex];
  const showControls = isSelected || isHovered;

  const handleChange = useCallback((val: string) => {
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, userInput: val } } : n
    ));
  }, [id, setNodes]);

  const handleColorChange = useCallback((newIndex: number) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== id) return n;
      const d = n.data as ClinicalNodeData;
      return {
        ...n,
        data: {
          ...d,
          render: { ...d.render, options: { ...(d.render.options ?? {}), color: newIndex } },
        },
      };
    }));
  }, [id, setNodes]);

  return (
    <div
      className="canvas-node canvas-node-stickynote"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        background: color.bg,
        border: `1px solid ${color.border}`,
        padding: '10px',
        cursor: editing ? 'text' : 'pointer',
        position: 'relative',
        boxSizing: 'border-box',
      }}
      onDoubleClick={() => setEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Resize handles — visible on select/hover */}
      <NodeResizer
        isVisible={showControls}
        minWidth={150}
        minHeight={80}
        maxWidth={600}
        maxHeight={600}
        handleStyle={{
          width: '8px',
          height: '8px',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '2px',
        }}
        lineStyle={{
          borderColor: 'transparent',
          borderWidth: '2px',
        }}
      />

      {/* Inline color picker — row of 7 dots */}
      {showControls && (
        <div
          className="nodrag"
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '6px',
          }}
          onClick={e => e.stopPropagation()}
        >
          {STICKY_COLORS.map((c, i) => (
            <button
              key={i}
              className="nodrag"
              onClick={e => { e.stopPropagation(); handleColorChange(i); }}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: c.dot,
                border: i === colorIndex ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
              title={`Color ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content area */}
      {editing ? (
        <textarea
          value={content}
          onChange={e => handleChange(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
          className="nodrag nowheel"
          style={{
            width: '100%',
            height: 'calc(100% - 28px)',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px',
            fontWeight: 300,
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'none',
            lineHeight: 1.5,
          }}
          placeholder={DEFAULT_CONTENT}
        />
      ) : (
        <div
          style={{
            color: content ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {content ? renderSimpleMarkdown(content) : renderSimpleMarkdown(DEFAULT_CONTENT)}
        </div>
      )}
    </div>
  );
};

export default CanvasNodeStickyNote;
