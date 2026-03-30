/**
 * CanvasControlButtons — zoom and view controls
 * Source: n8n CanvasControlButtons.vue
 *
 * Bottom-left controls: Zoom In, Zoom Out, Fit View, separator, Add Note.
 * n8n pattern: floating control panel over the canvas.
 */

import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, StickyNote } from 'lucide-react';
import { SW } from '../../../canvas.constants';

const BUTTON_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '4px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: '#8A8680',
  padding: 0,
};

interface CanvasControlButtonsProps {
  onAddStickyNote?: () => void;
}

const CanvasControlButtons: React.FC<CanvasControlButtonsProps> = ({ onAddStickyNote }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleZoomIn = useCallback(() => zoomIn({ duration: 200 }), [zoomIn]);
  const handleZoomOut = useCallback(() => zoomOut({ duration: 200 }), [zoomOut]);
  const handleFitView = useCallback(() => fitView({ duration: 300, padding: 0.15 }), [fitView]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: '#222120',
        border: '1px solid #2A2928',
        borderRadius: '6px',
        padding: '3px',
        boxShadow: '0 2px 8px #222120',
        zIndex: 5,
      }}
    >
      <button onClick={handleZoomIn} title="Zoom in" style={BUTTON_STYLE}>
        <ZoomIn size={14} strokeWidth={SW} />
      </button>
      <button onClick={handleZoomOut} title="Zoom out" style={BUTTON_STYLE}>
        <ZoomOut size={14} strokeWidth={SW} />
      </button>
      <div style={{ height: '1px', background: '#2A2928', margin: '2px 4px' }} />
      <button onClick={handleFitView} title="Fit view" style={BUTTON_STYLE}>
        <Maximize2 size={14} strokeWidth={SW} />
      </button>
      {onAddStickyNote && (
        <>
          <div style={{ height: '1px', background: '#2A2928', margin: '2px 4px' }} />
          <button onClick={onAddStickyNote} title="Add note" style={BUTTON_STYLE}>
            <StickyNote size={14} strokeWidth={SW} />
          </button>
        </>
      )}
    </div>
  );
};

export default CanvasControlButtons;
