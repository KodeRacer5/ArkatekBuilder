/**
 * PipelineNodePreview — visual-only node shape at 0.75x scale
 *
 * Renders a miniature node shape with proper border, icon, and label
 * for use in preloaded module pipeline previews.
 * Not interactive — purely visual representation.
 */

import React from 'react';
import { IC, SW, resolveNodeColors } from '../canvas/canvas.constants';
import type { ClinicalNodeData } from '../canvas/canvas.types';
import { CanvasNodeRenderType } from '../canvas/canvas.types';

interface PipelineNodePreviewProps {
  node: ClinicalNodeData & { renderType?: string };
}

/** Map renderType string to shape dimensions and border-radius at 0.75x scale */
function getShapeStyle(renderType?: string): React.CSSProperties {
  switch (renderType) {
    case 'engine':
      return { width: 195, height: 68, borderRadius: '7px' };
    case 'square':
      return { width: 128, height: 42, borderRadius: '7px' };
    case 'pill':
      return { width: 195, height: 68, borderRadius: '35px' };
    case 'rounded':
      return { width: 160, height: 68, borderRadius: '35px 7px 7px 35px' };
    case 'smRounded':
      return { width: 90, height: 68, borderRadius: '35px 7px 7px 35px' };
    case 'tall':
    case 'splitter':
      return { width: 105, height: 56, borderRadius: '7px' };
    case 'circle':
      return { width: 48, height: 48, borderRadius: '50%' };
    default: // 'default' / rect
      return { width: 128, height: 42, borderRadius: '7px' };
  }
}

function getIconSize(renderType?: string): number {
  switch (renderType) {
    case 'engine':
    case 'pill':
    case 'rounded':
    case 'dualOut':
      return 16;
    case 'square':
      return 12;
    case 'tall':
    case 'splitter':
      return 16;
    case 'circle':
      return 16;
    default:
      return 12;
  }
}

const PipelineNodePreview: React.FC<PipelineNodePreviewProps> = ({ node }) => {
  const colors = resolveNodeColors(node);
  const Icon = IC[node.icon];
  const shapeStyle = getShapeStyle(node.renderType);
  const iconSize = getIconSize(node.renderType);
  const isTall = node.renderType === 'tall' || node.renderType === 'splitter';

  const displayLabel = node.label === 'CortixEngine' ? (node.subtitle || 'CortixEngine') : node.label;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
        flexShrink: 0,
      }}
    >
      {/* Node shape — all types use horizontal icon + label inside */}
      <div
        style={{
          ...shapeStyle,
          background: '#222120',
          border: '2px solid #5a5a5a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isTall ? 'center' : 'flex-start',
          flexDirection: isTall ? 'column' : 'row',
          gap: '6px',
          padding: isTall ? '8px 0' : '0 10px',
          overflow: 'hidden',
        }}
      >
        {Icon && <Icon size={iconSize} color={colors.accent} strokeWidth={SW} style={{ flexShrink: 0 }} />}
        <span style={{
          color: '#C8C5BC',
          fontSize: '9px',
          fontWeight: 300,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: isTall ? '40px' : `${(shapeStyle.width as number) - 40}px`,
        }}>
          {displayLabel}
        </span>
        {/* Engine subtitle */}
        {node.renderType === 'engine' && node.subtitle && node.label === 'CortixEngine' && (
          <span style={{
            color: colors.accent,
            fontSize: '8px',
            fontWeight: 300,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: `${(shapeStyle.width as number) - 80}px`,
            marginLeft: '-2px',
          }}>
            {node.subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default PipelineNodePreview;
