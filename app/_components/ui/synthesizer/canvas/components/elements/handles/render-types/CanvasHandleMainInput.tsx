/**
 * CanvasHandleMainInput — visual for main input handles (rect style)
 * Source: n8n CanvasHandleMainInput.vue → HTML prototype alignment
 *
 * Input handles are now solid rects (styled by CanvasHandleRenderer).
 * This component provides optional label rendering.
 */

import React from 'react';
import { useCanvasNodeHandle } from '../../../../hooks/useCanvasNodeHandle';

const CanvasHandleMainInput: React.FC = () => {
  const { label, isRequired } = useCanvasNodeHandle();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        pointerEvents: 'none',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: '8px',
            fontWeight: 300,
            color: '#5A5754',
            whiteSpace: 'nowrap',
          }}
        >
          {label}{isRequired && <span style={{ color: '#ef4444' }}>*</span>}
        </div>
      )}
    </div>
  );
};

export default CanvasHandleMainInput;
