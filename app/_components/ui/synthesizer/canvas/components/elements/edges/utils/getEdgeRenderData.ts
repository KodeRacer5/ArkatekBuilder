/**
 * getEdgeRenderData — edge path computation
 * Source: DIRECT COPY from n8n (pure TypeScript, framework-agnostic)
 *
 * Computes edge SVG paths, handling both forward and backward connections.
 * When source is to the right of target (backward connection), it routes
 * the edge below the nodes to avoid overlap.
 *
 * Adapted: replaced @vue-flow/core imports with @xyflow/react equivalents.
 */

import { getBezierPath, getSmoothStepPath, Position } from '@xyflow/react';

const EDGE_PADDING_BOTTOM = 130;
const EDGE_PADDING_X = 40;
const EDGE_BORDER_RADIUS = 16;
const HANDLE_SIZE = 20;

const isRightOfSourceHandle = (sourceX: number, targetX: number) =>
  sourceX - HANDLE_SIZE > targetX;

export interface EdgeRenderProps {
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}

export function getEdgeRenderData(
  props: EdgeRenderProps,
  options: { connectionType?: string } = {},
) {
  const { targetX, targetY, sourceX, sourceY, sourcePosition, targetPosition } = props;
  const connectionType = options.connectionType ?? 'main';
  const isConnectorStraight = sourceY === targetY;

  // Forward connection or non-main type: use simple bezier
  if (!isRightOfSourceHandle(sourceX, targetX) || connectionType !== 'main') {
    const [path, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    return {
      segments: [[path, labelX, labelY] as [string, number, number]],
      labelPosition: [labelX, labelY] as [number, number],
      isConnectorStraight,
    };
  }

  // Backward connection: route below nodes via smooth step path
  const firstSegmentTargetX = (sourceX + targetX) / 2;
  const firstSegmentTargetY = sourceY + EDGE_PADDING_BOTTOM;

  const [path1, label1X, label1Y] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: firstSegmentTargetX,
    targetY: firstSegmentTargetY,
    sourcePosition,
    targetPosition: Position.Right,
    borderRadius: EDGE_BORDER_RADIUS,
    offset: EDGE_PADDING_X,
  });

  const [path2, label2X, label2Y] = getSmoothStepPath({
    sourceX: firstSegmentTargetX,
    sourceY: firstSegmentTargetY,
    targetX,
    targetY,
    sourcePosition: Position.Left,
    targetPosition,
    borderRadius: EDGE_BORDER_RADIUS,
    offset: EDGE_PADDING_X,
  });

  return {
    segments: [
      [path1, label1X, label1Y] as [string, number, number],
      [path2, label2X, label2Y] as [string, number, number],
    ],
    labelPosition: [firstSegmentTargetX, firstSegmentTargetY] as [number, number],
    isConnectorStraight,
  };
}
