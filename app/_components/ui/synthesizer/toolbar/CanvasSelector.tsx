/**
 * CanvasSelector — multi-canvas tab bar
 *
 * Renders below the main toolbar (where InvestigationTargets used to be).
 * Shows canvas tabs with:
 * - Active canvas highlighted
 * - [+] button to create a new canvas
 * - [x] button on each tab to close (minimum 1 canvas)
 * - Double-click to rename
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { SW } from '../canvas/canvas.constants';

export interface CanvasTab {
  id: string;
  name: string;
}

interface CanvasSelectorProps {
  canvases: CanvasTab[];
  activeCanvasId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const CanvasSelector: React.FC<CanvasSelectorProps> = ({
  canvases,
  activeCanvasId,
  onSwitch,
  onAdd,
  onClose,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const startRename = useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setEditVal(currentName);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && editVal.trim()) {
      onRename(editingId, editVal.trim());
    }
    setEditingId(null);
  }, [editingId, editVal, onRename]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '4px 14px',
        background: 'rgba(22,22,28,0.98)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        overflowX: 'auto',
      }}
    >
      {canvases.map(c => {
        const isActive = c.id === activeCanvasId;
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            onClick={() => !isEditing && onSwitch(c.id)}
            onDoubleClick={() => startRename(c.id, c.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '4px',
              background: isActive ? 'rgba(195,175,155,0.08)' : 'transparent',
              border: `1px solid ${isActive ? '#2A2928' : '#2A2928'}`,
              cursor: 'pointer',
              transition: 'all 0.12s',
              flexShrink: 0,
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="nodrag"
                style={{
                  width: '80px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#C2B9A7',
                  fontSize: '9px',
                  fontWeight: 400,
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              />
            ) : (
              <span
                style={{
                  color: isActive ? '#C2B9A7' : '#5A5754',
                  fontSize: '9px',
                  fontWeight: isActive ? 400 : 300,
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </span>
            )}

            {/* Close button (only if more than 1 canvas) */}
            {canvases.length > 1 && (
              <X
                size={8}
                color={isActive ? '#5A5754' : 'rgba(255,255,255,0.12)'}
                strokeWidth={SW}
                style={{ cursor: 'pointer', flexShrink: 0 }}
                onClick={e => {
                  e.stopPropagation();
                  onClose(c.id);
                }}
              />
            )}
          </div>
        );
      })}

      {/* Add canvas button */}
      <button
        onClick={onAdd}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '4px',
          border: '1px solid #2A2928',
          background: 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <Plus size={10} color="#5A5754" strokeWidth={SW} />
      </button>
    </div>
  );
};

export default CanvasSelector;
