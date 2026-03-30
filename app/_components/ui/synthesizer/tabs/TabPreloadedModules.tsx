/**
 * TabPreloadedModules — full pipeline node preview (HTML prototype alignment)
 *
 * Displays preloaded pipeline modules with:
 * - Template-standard CollapsibleSection headers (uppercase + badge + chevron)
 * - Dark container with title, tag pill, and description
 * - Horizontal scrollable node row at 0.75x scale
 * - Edge lines between nodes
 * - See All / Hide All controls
 */

import React, { useState, useCallback } from 'react';
import { PRELOADED_MODULES, HEALTH_PRELOADED_MODULES, type PipelineModule, type PipelineModuleNode, type PipelineEdge } from './data/preloadedModules';
import PipelineNodePreview from './PipelineNodePreview';
import CollapsibleSection from './CollapsibleSection';
import SeeAllHideAll from './SeeAllHideAll';

/** Badge text per category — matches HTML prototype */
const CATEGORY_BADGES: Record<string, string> = {
  'Diagnostic': 'clinical investigation',
  'Pharmacology': 'medication & interaction',
  'Treatment': 'care pathway',
  'Risk': 'patient safety',
  'Supplement Planning': 'supplement & nutrition',
  'Nutrition': 'meal & nutrient planning',
  'Movement & Recovery': 'exercise & recovery',
  'Natural Remedies': 'herbal & homeopathic',
  'Wellness Tracking': 'progress & reporting',
};

interface TabPreloadedModulesProps {
  onLoadPipeline: (nodes: PipelineModuleNode[], topology?: PipelineEdge[]) => void;
  onClose: () => void;
  platform?: 'radix' | 'cortixhealth' | null;
}

const TabPreloadedModules: React.FC<TabPreloadedModulesProps> = ({ onLoadPipeline, onClose, platform = 'cortixhealth' }) => {
  const modules = platform === 'cortixhealth' ? HEALTH_PRELOADED_MODULES : PRELOADED_MODULES;
  const categories = Array.from(new Set(modules.map(m => m.category)));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = useCallback((cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      <SeeAllHideAll
        onSeeAll={() => setExpanded(new Set(categories))}
        onHideAll={() => setExpanded(new Set())}
      />

      {categories.map(cat => {
        const catModules = modules.filter(m => m.category === cat);
        /** Template titles: "Diagnostic Modules", "Pharmacology Modules", etc. */
        const title = cat === 'Risk' ? 'Risk & Safety'
          : cat === 'Treatment' ? 'Treatment Planning'
          : `${cat} Modules`;

        return (
          <CollapsibleSection
            key={cat}
            title={title}
            badge={CATEGORY_BADGES[cat]}
            isOpen={expanded.has(cat)}
            onToggle={() => toggle(cat)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {catModules.map((mod, i) => (
                <PipelinePreviewCard key={i} module={mod} onLoad={() => onLoadPipeline(mod.nodes, mod.topology)} />
              ))}
            </div>
          </CollapsibleSection>
        );
      })}
    </div>
  );
};

/** Single pipeline card with full node preview row */
const PipelinePreviewCard: React.FC<{ module: PipelineModule; onLoad: () => void }> = ({ module, onLoad }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(21,21,24,0.4)',
        border: '1px solid #2A2928',
        borderRadius: '12px',
        padding: '20px 24px',
        transition: 'all 0.15s',
        ...(hovered ? { borderColor: '#3A3836' } : {}),
      }}
    >
      {/* Header row: title + tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div style={{ color: '#F5F4F0', fontSize: '14px', fontWeight: 300 }}>
          {module.title}
        </div>
        <div
          style={{
            color: '#8A8680',
            fontSize: '9px',
            padding: '2px 8px',
            borderRadius: '10px',
            border: '1px solid #2A2928',
            background: 'rgba(255,255,255,0.02)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: '12px',
          }}
        >
          {module.tag}
        </div>
      </div>

      {/* Description */}
      <div style={{ color: '#8A8680', fontSize: '10px', fontWeight: 300, lineHeight: 1.4, marginBottom: '14px' }}>
        {module.desc}
      </div>

      {/* Pipeline node row — horizontal scrollable at 0.75x scale */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0px',
            transform: 'scale(0.75)',
            transformOrigin: 'left center',
            minWidth: 'max-content',
          }}
        >
          {module.nodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <PipelineNodePreview node={node} />
              {idx < module.nodes.length - 1 && (
                <div
                  style={{
                    width: '32px',
                    height: '2px',
                    background: '#5a5a5a',
                    flexShrink: 0,
                    marginTop: node.renderType === 'default' || !node.renderType ? '-12px' : '0px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Load button — bottom left */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
        <button
          onClick={e => { e.stopPropagation(); onLoad(); }}
          style={{
            padding: '4px 14px',
            borderRadius: '5px',
            border: '1px solid #2A2928',
            background: hovered ? 'rgba(195,175,155,0.08)' : 'transparent',
            color: '#8A8175',
            fontSize: '10px',
            fontWeight: 300,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          Load to Canvas
        </button>
      </div>
    </div>
  );
};

export default TabPreloadedModules;
