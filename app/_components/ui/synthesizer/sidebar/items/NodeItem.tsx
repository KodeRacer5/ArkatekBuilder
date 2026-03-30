/**
 * NodeItem — draggable palette item
 * Source: n8n NodeItem.vue + CortixEngineSynthesizer PaletteItem
 *
 * Shows node icon, label, and description.
 * Draggable to the canvas to create a new node.
 */

import React, { useCallback } from 'react';
import { IC, SW, resolveNodeColors } from '../../canvas/canvas.constants';
import type { ClinicalNodeData } from '../../canvas/canvas.types';

interface NodeItemProps {
  data: ClinicalNodeData;
}

const NodeItem: React.FC<NodeItemProps> = ({ data }) => {
  const Icon = IC[data.icon];
  const isCircle = data.shape === 'circle';
  // Neutral monochrome — no colored icons in sidebar
  const neutralColors = {
    accent: '#E8E4D8',
    border: '#4A4745',
    bg: 'rgba(255,255,255,0.02)',
  };

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('application/cortix-node', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }, [data]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 8px',
        borderRadius: '6px',
        cursor: 'grab',
        transition: 'background 0.12s',
        background: 'transparent',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: isCircle ? '50%' : '6px',
          flexShrink: 0,
          background: neutralColors.bg,
          border: `1px solid ${neutralColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Icon && <Icon size={16} color={neutralColors.accent} strokeWidth={SW} />}
      </div>

      {/* Label + description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#FFFEF8', fontSize: '13px', fontWeight: 300 }}>
          {data.subtitle || data.label}
        </div>
        <div
          style={{
            color: data.subtitle && data.accentColor ? data.accentColor : '#4bab13',
            fontSize: '11px',
            fontWeight: 300,
            whiteSpace: 'nowrap',
            overflow: 'visible',
            opacity: data.subtitle && data.accentColor ? 0.7 : 1,
          }}
        >
          {data.subtitle ? data.label : data.description}
        </div>
      </div>
    </div>
  );
};

export default NodeItem;
