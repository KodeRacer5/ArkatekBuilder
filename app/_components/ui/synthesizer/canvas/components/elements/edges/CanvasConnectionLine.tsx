/**
 * CanvasConnectionLine — while-dragging connection line
 * Source: n8n CanvasConnectionLine.vue
 *
 * Rendered while the user drags from an output handle to create
 * a new connection. Has a 300ms fade-in to prevent flickering
 * when the intent is to click the plus button rather than drag.
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { ConnectionLineComponentProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';

const CanvasConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}) => {
  // ── 300ms delayed visibility (n8n pattern: prevent flicker) ──
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const [path] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <defs>
        <marker
          id="connection-line-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(195,175,155,0.6)" />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="rgba(195,175,155,0.6)"
        strokeWidth={2}
        markerEnd="url(#connection-line-arrow)"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />
    </g>
  );
};

export default CanvasConnectionLine;
