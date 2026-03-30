/**
 * TabNodeGrid — square-grid display for a NODE_PALETTE category
 *
 * Renders nodes as 120x120 draggable squares matching the HTML prototype
 * ext-square-grid pattern. Uses CollapsibleSection for template-standard headers.
 * Used for Skills, Web, System tabs.
 */

import React, { useState, useCallback } from 'react';
import { NODE_PALETTE, HEALTH_NODE_PALETTE } from '../store/useNodeTypesStore';
import { IC, SW, resolveNodeColors } from '../canvas/canvas.constants';
import type { ClinicalNodeData } from '../canvas/canvas.types';
import CollapsibleSection from './CollapsibleSection';

interface TabNodeGridProps {
  paletteKey: string;
  title: string;
  badge: string;
  onTabChange: (tab: string | null) => void;
  platform?: 'radix' | 'cortixhealth' | null;
}

const TabNodeGrid: React.FC<TabNodeGridProps> = ({
  paletteKey,
  title,
  badge,
  onTabChange,
  platform = 'cortixhealth',
}) => {
  const palette = platform === 'cortixhealth' ? HEALTH_NODE_PALETTE : NODE_PALETTE;
  const nodes = palette[paletteKey] || [];
  const [isOpen, setIsOpen] = useState(true);

  if (nodes.length === 0) {
    return (
      <div style={{ flex: 1, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ color: '#5A5754', fontSize: '12px' }}>
          No items in {paletteKey}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      <CollapsibleSection
        title={title}
        badge={badge}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          {nodes.map((node, idx) => (
            <GridSquareNode key={idx} node={node} onTabChange={onTabChange} />
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
};

/** Single draggable square node — 120x120 */
const GridSquareNode: React.FC<{
  node: ClinicalNodeData;
  onTabChange: (tab: string | null) => void;
}> = ({ node, onTabChange }) => {
  const colors = resolveNodeColors(node);
  const Icon = IC[node.icon];

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('application/cortix-node', JSON.stringify(node));
    e.dataTransfer.effectAllowed = 'move';
    onTabChange(null);
  }, [node, onTabChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div
        draggable
        onDragStart={handleDragStart}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '9px',
          background: '#222120',
          border: '3px solid #5a5a5a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'grab',
          transition: 'all 0.12s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#7a7a7a';
          e.currentTarget.style.boxShadow = '0 2px 12px #222120';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#5a5a5a';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {Icon && <Icon size={42} color="#8A8680" strokeWidth={SW} />}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.75)',
        fontSize: '10px',
        fontWeight: 300,
        textAlign: 'center',
        maxWidth: '130px',
        lineHeight: 1.3,
      }}>
        {node.label}
      </div>
      <div style={{
        color: '#5A5754',
        fontSize: '8px',
        fontWeight: 300,
        textAlign: 'center',
        maxWidth: '130px',
        lineHeight: 1.3,
      }}>
        {node.description}
      </div>
    </div>
  );
};

export default TabNodeGrid;
