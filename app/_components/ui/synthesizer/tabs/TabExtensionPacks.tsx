/**
 * TabExtensionPacks — template-aligned two-tier collapsible grid
 *
 * DECOUPLED from chat extensions:
 * - Canvas ALWAYS shows ALL extension nodes — they're visual pipeline building blocks
 * - Chat extensions (sidebar toggles) only control what tools the LLM gets
 * - Small green dot indicator shows which nodes are also chat-enabled
 *
 * Structure matches HTML prototype:
 * - Parent group 1: "Core Extensions" (Acquire/Organize/Appraise/Apply/Assess)
 * - Parent group 2: "Additional Extensions" (Clinical/Pathways/Nutrition/NatMed/Allergy/Exercise/Data&Output)
 */

import React, { useState, useCallback, useMemo } from 'react';
import { EXTENSION_PACKS, extensionIdFromLabel } from './data/extensionPackData';
import { IC, SW, resolveNodeColors } from '../canvas/canvas.constants';
import type { ClinicalNodeData } from '../canvas/canvas.types';
import { useCortix } from '../../../components/CortixContext';
import CollapsibleSection from './CollapsibleSection';
import SeeAllHideAll from './SeeAllHideAll';

const CORE_PACKS = ['acquire', 'organize', 'appraise', 'apply', 'assess'];
const ADDITIONAL_PACKS = ['clinical', 'pathways', 'nutrition', 'natmed', 'allergy', 'exercise', 'dataout'];

const PACK_BADGES: Record<string, string> = {
  acquire: 'gather clinical evidence',
  organize: 'structure the data',
  appraise: 'evaluate the evidence',
  apply: 'test against this patient',
  assess: 'deliver & audit',
  clinical: 'diagnostic & treatment tools',
  pathways: 'metabolic & genetic analysis',
  nutrition: 'dietary planning & reference',
  natmed: 'botanical & holistic reference',
  allergy: 'allergen screening & tracking',
  exercise: 'movement & recovery protocols',
  dataout: 'processing & reporting',
};

interface TabExtensionPacksProps {
  onTabChange: (tab: string | null) => void;
}

const TabExtensionPacks: React.FC<TabExtensionPacksProps> = ({ onTabChange }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [coreOpen, setCoreOpen] = useState(true);
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const { enabledExtensions } = useCortix();

  /** Chat-enabled IDs — for visual indicator only, NOT for filtering */
  const chatEnabledIds = useMemo(
    () => new Set(enabledExtensions.map(e => e.id)),
    [enabledExtensions],
  );

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allPackIds = [...CORE_PACKS, ...ADDITIONAL_PACKS];

  const renderPackSection = (packId: string) => {
    const pack = EXTENSION_PACKS[packId];
    if (!pack) return null;

    return (
      <CollapsibleSection
        key={packId}
        title={pack.label}
        badge={PACK_BADGES[packId]}
        isOpen={expanded.has(packId)}
        onToggle={() => toggle(packId)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          {pack.nodes.map((node, idx) => {
            const nodeExtId = extensionIdFromLabel(node.label, node.subtitle);
            const isChatEnabled = chatEnabledIds.has(nodeExtId);
            return (
              <ExtensionSquareNode
                key={idx}
                node={node}
                chatEnabled={isChatEnabled}
                onTabChange={onTabChange}
              />
            );
          })}
        </div>
      </CollapsibleSection>
    );
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      <SeeAllHideAll
        onSeeAll={() => { setCoreOpen(true); setAdditionalOpen(true); setExpanded(new Set(allPackIds)); }}
        onHideAll={() => { setCoreOpen(false); setAdditionalOpen(false); setExpanded(new Set()); }}
      />

      <ParentGroup title="Core Extensions" isOpen={coreOpen} onToggle={() => setCoreOpen(!coreOpen)}>
        {CORE_PACKS.map(id => renderPackSection(id))}
      </ParentGroup>

      <ParentGroup title="Additional Extensions" isOpen={additionalOpen} onToggle={() => setAdditionalOpen(!additionalOpen)}>
        {ADDITIONAL_PACKS.map(id => renderPackSection(id))}
      </ParentGroup>
    </div>
  );
};

/** Parent group container */
const ParentGroup: React.FC<{
  title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        userSelect: 'none', padding: '10px 0',
        borderBottom: '1px solid #2A2928', marginBottom: '16px',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{
          color: isOpen ? '#C8C5BC' : '#5A5754',
          transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0,
        }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
      <h2 style={{
        fontSize: '16px', fontWeight: 400, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: isOpen ? '#F5F4F0' : '#8A8680',
        margin: 0, transition: 'color 0.2s',
      }}>
        {title}
      </h2>
    </div>
    {isOpen && <div>{children}</div>}
  </div>
);

/** Single draggable extension node — 120x120 square
 *  chatEnabled: green dot indicator when also enabled for chat */
const ExtensionSquareNode: React.FC<{
  node: ClinicalNodeData;
  chatEnabled: boolean;
  onTabChange: (tab: string | null) => void;
}> = ({ node, chatEnabled, onTabChange }) => {
  const colors = resolveNodeColors(node);
  const Icon = IC[node.icon];
  const displayLabel = node.label === 'CortixEngine' ? (node.subtitle || 'CortixEngine') : node.label;

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
          position: 'relative',
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
        {/* Chat-enabled indicator dot */}
        {chatEnabled && (
          <div
            title="Enabled for chat"
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 4px rgba(34,197,94,0.4)',
            }}
          />
        )}
        {Icon && <Icon size={42} color={colors.accent} strokeWidth={SW} />}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.75)', fontSize: '10px', fontWeight: 300,
        textAlign: 'center', maxWidth: '130px', lineHeight: 1.3,
      }}>
        {displayLabel}
      </div>
      <div style={{
        color: '#5A5754', fontSize: '8px', fontWeight: 300,
        textAlign: 'center', maxWidth: '130px', lineHeight: 1.3,
      }}>
        {node.description}
      </div>
    </div>
  );
};

export default TabExtensionPacks;
