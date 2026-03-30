/**
 * CanvasNodeToolbar — floating action bar above selected nodes
 * Source: n8n CanvasNodeToolbar.vue (232 lines)
 *
 * Appears above a selected node. Buttons: Execute, Disable/Enable, Delete.
 * n8n uses N8nIconButton; CortixEngine uses Lucide icons + Tailwind-style buttons.
 */

import React, { useCallback } from 'react';
import { Play, Power, Trash2, MoreHorizontal } from 'lucide-react';
import { useCanvasNode } from '../../../hooks/useCanvasNode';
import { SW } from '../../../canvas.constants';
import { CanvasNodeRenderType } from '../../../canvas.types';

interface CanvasNodeToolbarProps {
  readOnly?: boolean;
  onRun?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

const CanvasNodeToolbar: React.FC<CanvasNodeToolbarProps> = ({
  readOnly,
  onRun,
  onToggle,
  onDelete,
  onContextMenu,
}) => {
  const { render, isDisabled, executionRunning } = useCanvasNode();

  const isStickyNote = render.type === CanvasNodeRenderType.StickyNote;
  const showRunButton = render.type === CanvasNodeRenderType.Default
    || render.type === CanvasNodeRenderType.Circle;

  if (readOnly) return null;

  return (
    <div
      className="canvas-node-toolbar"
      style={{
        position: 'absolute',
        top: '-32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '2px',
        background: 'rgba(28,28,36,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '3px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 10,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Execute node */}
      {showRunButton && (
        <button
          onClick={onRun}
          disabled={executionRunning}
          title="Run this node"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            cursor: executionRunning ? 'not-allowed' : 'pointer',
            color: executionRunning ? 'rgba(255,255,255,0.2)' : '#22c55e',
            opacity: executionRunning ? 0.5 : 1,
          }}
        >
          <Play size={13} strokeWidth={SW} />
        </button>
      )}

      {/* Disable/Enable node — hidden for sticky notes */}
      {!isStickyNote && (
        <button
          onClick={onToggle}
          title={isDisabled ? 'Enable node' : 'Disable node'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: isDisabled ? '#ef4444' : 'rgba(255,255,255,0.4)',
          }}
        >
          <Power size={13} strokeWidth={SW} />
        </button>
      )}

      {/* Delete node */}
      <button
        onClick={onDelete}
        title="Delete node"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <Trash2 size={13} strokeWidth={SW} />
      </button>

      {/* Context menu */}
      <button
        onClick={onContextMenu}
        title="More options"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <MoreHorizontal size={13} strokeWidth={SW} />
      </button>
    </div>
  );
};

export default CanvasNodeToolbar;
