/**
 * CanvasEdge — custom edge with smart A* routing + status colors
 * Source: n8n CanvasEdge.vue (233 lines) + @jalez/react-flow-smart-edge
 *
 * Renders edges with:
 * - A* pathfinding that routes AROUND nodes (via getSmartEdge)
 * - Fallback to n8n-style bezier/smooth-step when pathfinding fails
 * - Status-based coloring (green success, red error, amber running)
 * - Hover toolbar for delete action
 */

import React, { useMemo, useState, useCallback } from 'react';
import type { EdgeProps, Edge } from '@xyflow/react';
import { BaseEdge, EdgeLabelRenderer, useNodes, BezierEdge, getSmoothStepPath } from '@xyflow/react';
import { getSmartEdge, svgDrawSmoothLinePath, pathfindingAStarDiagonal } from '@jalez/react-flow-smart-edge';
import { Trash2 } from 'lucide-react';
import { SW, EDGE_STYLE } from '../../../canvas.constants';
import { getEdgeRenderData } from './utils/getEdgeRenderData';
import type { CanvasConnectionData } from '../../../canvas.types';

type ClinicalEdge = Edge<CanvasConnectionData>;

const CanvasEdge: React.FC<EdgeProps<ClinicalEdge>> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    selected,
  } = props;
  const data = props.data as CanvasConnectionData | undefined;
  // ReactFlow passes animated from edge config — use for neon pulse
  const isAnimated = (props as any).animated ?? false;
  const nodes = useNodes();

  const [hovered, setHovered] = useState(false);

  // ── Smart edge: A* pathfinding around nodes ──
  const smartResult = useMemo(() => {
    if (!nodes || nodes.length === 0) return null;
    return getSmartEdge({
      sourcePosition,
      targetPosition,
      sourceX,
      sourceY,
      targetX,
      targetY,
      nodes,
      options: {
        nodePadding: 45,
        gridRatio: 10,
        drawEdge: svgDrawSmoothLinePath,
        generatePath: pathfindingAStarDiagonal,
      },
    });
  }, [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, nodes]);

  // ── Fallback: n8n-style bezier/smooth-step routing ──
  const fallbackData = useMemo(() =>
    getEdgeRenderData(
      { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition },
      { connectionType: 'main' },
    ),
    [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition],
  );

  // ── Status-based edge color (from n8n CanvasEdge.vue) ──
  const edgeColor = useMemo(() => {
    const status = data?.status;
    if (status === 'complete') return '#22c55e'; // var(--color--success)
    if (status === 'error') return '#ef4444';    // var(--color--danger)
    if (status === 'running') return '#22c55e';  // var(--color--success) — matches neon border glow
    return EDGE_STYLE.stroke;
  }, [data?.status]);

  const edgeStyle: React.CSSProperties = useMemo(() => ({
    stroke: edgeColor,
    strokeWidth: EDGE_STYLE.strokeWidth,
    transition: 'stroke 0.3s ease',
    ...(isAnimated ? {
      animation: 'edge-pulse 1s ease-in-out infinite',
      filter: `drop-shadow(0 0 4px ${edgeColor})`,
    } : {}),
  }), [edgeColor, isAnimated]);

  // ── Delete handler ──
  const handleDelete = useCallback(() => {
    window.dispatchEvent(new CustomEvent('canvas:delete-edge', { detail: { edgeId: id } }));
  }, [id]);

  // ── Determine path + label position ──
  const useSmartPath = smartResult !== null;
  if (!useSmartPath && process.env.NODE_ENV === 'development') {
    console.warn(`[CanvasEdge] Smart-edge failed for edge ${id}, using smooth-step fallback`);
  }
  const labelX = useSmartPath ? smartResult.edgeCenterX : fallbackData.labelPosition[0];
  const labelY = useSmartPath ? smartResult.edgeCenterY : fallbackData.labelPosition[1];

  return (
    <>
      {/* ── Edge path ── */}
      <g
        data-testid="edge"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {useSmartPath ? (
          <BaseEdge
            id={id}
            path={smartResult.svgPathString}
            style={edgeStyle}
            interactionWidth={40}
          />
        ) : (
          fallbackData.segments.map((segment, index) => (
            <BaseEdge
              key={`${id}-${index}`}
              id={`${id}-${index}`}
              path={segment[0]}
              style={edgeStyle}
              interactionWidth={40}
            />
          ))
        )}
      </g>

      {/* ── Edge label / toolbar (shown on hover) ── */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && (
            <button
              onClick={handleDelete}
              title="Delete connection"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(28,28,36,0.95)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                padding: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              <Trash2 size={10} strokeWidth={SW} />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CanvasEdge;

