/**
 * CanvasHandleMainOutput — visual for main output handles (circle+rod+[+])
 * Source: n8n CanvasHandleMainOutput.vue → HTML prototype alignment
 *
 * Output handles are now circle+rod+[+] assemblies (styled by CanvasHandleRenderer).
 * This component provides optional label rendering.
 */

import React from 'react';
import { useCanvasNodeHandle } from '../../../../hooks/useCanvasNodeHandle';

const CanvasHandleMainOutput: React.FC = () => {
  const { label } = useCanvasNodeHandle();

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
          {label}
        </div>
      )}
    </div>
  );
};

export default CanvasHandleMainOutput;
