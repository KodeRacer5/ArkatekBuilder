/**
 * CanvasHandleDot — small circle dot indicator
 * Source: n8n CanvasHandleDot.vue
 *
 * Visual indicator for connection state:
 * - Gray when disconnected
 * - Colored when connected
 * - Larger when hovered
 */

import React from 'react';

interface CanvasHandleDotProps {
  connected?: boolean;
  color?: string;
  size?: number;
}

const CanvasHandleDot: React.FC<CanvasHandleDotProps> = ({
  connected = false,
  color = '#5A5754',
  size = 8,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: connected ? color : '#3A3836',
        border: `1px solid ${connected ? color : '#5A5754'}`,
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export default CanvasHandleDot;
