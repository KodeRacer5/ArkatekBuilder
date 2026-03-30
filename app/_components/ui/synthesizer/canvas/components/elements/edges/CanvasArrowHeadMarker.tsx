/**
 * CanvasArrowHeadMarker — SVG arrow marker definition
 * Source: n8n CanvasArrowHeadMarker.vue
 *
 * Defines an SVG <marker> element used by edges as arrowheads.
 * Placed inside the ReactFlow SVG via a <defs> block.
 */

import React from 'react';

interface CanvasArrowHeadMarkerProps {
  id: string;
  color?: string;
}

const CanvasArrowHeadMarker: React.FC<CanvasArrowHeadMarkerProps> = ({
  id,
  color = 'rgba(195,175,155,0.5)',
}) => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker
          id={id}
          viewBox="-10 -10 20 20"
          refX="0"
          refY="0"
          markerWidth="12.5"
          markerHeight="12.5"
          markerUnits="strokeWidth"
          orient="auto-start-reverse"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            points="-5,-4 0,0 -5,4 -5,-4"
            strokeWidth="2"
            stroke={color}
            fill={color}
          />
        </marker>
      </defs>
    </svg>
  );
};

export default CanvasArrowHeadMarker;
