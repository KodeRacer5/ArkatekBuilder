/**
 * CanvasNodeTooltip — hover tooltip showing node description
 * Source: n8n CanvasNodeTooltip.vue
 *
 * Shows the node's description text on hover.
 * Simple tooltip implementation matching the dark theme.
 */

import React, { useState } from 'react';
import { useCanvasNode } from '../../../../../hooks/useCanvasNode';

interface CanvasNodeTooltipProps {
  visible?: boolean;
  children: React.ReactNode;
}

const CanvasNodeTooltip: React.FC<CanvasNodeTooltipProps> = ({ visible, children }) => {
  const { description } = useCanvasNode();
  const [hovered, setHovered] = useState(false);

  const showTooltip = visible ?? hovered;

  if (!description) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '6px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(22,22,28,0.95)',
            border: '1px solid #3A3836',
            boxShadow: '0 2px 8px #222120',
            maxWidth: '200px',
            whiteSpace: 'normal',
          }}
        >
          <div
            style={{
              color: '#8A8680',
              fontSize: '9px',
              fontWeight: 300,
              lineHeight: 1.3,
            }}
          >
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasNodeTooltip;
