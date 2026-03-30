/**
 * NodeCreator — dual-mode palette sidebar
 * EXPLORE (default): ACTION -> GOAL -> INPUT (agent-guided, beginner)
 * BUILD (toggle): Domain-organized research view (advanced)
 */
import React, { useState, useMemo, useCallback } from 'react';
import { HEALTH_PALETTE_EXPLORE, HEALTH_PALETTE_BUILD } from '../store/healthPalettes';
import type { NestedPalette } from '../store/healthPalettes';
import { NODE_PALETTE } from '../store/useNodeTypesStore';
import type { ClinicalNodeData } from '../canvas/canvas.types';
import CategorySection from './items/CategorySection';

interface NodeCreatorProps {
  onTabChange?: (tab: string | null) => void;
  platform?: 'radix' | 'cortixhealth' | null;
}

type SidebarMode = 'explore' | 'build';

const NodeCreator: React.FC<NodeCreatorProps> = ({ onTabChange, platform = 'cortixhealth' }) => {
  const [mode, setMode] = useState<SidebarMode>('explore');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['Goal']));
  const [searchQuery, setSearchQuery] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);

  // Select palette based on platform and mode
  const palette: NestedPalette = useMemo(() => {
    if (platform !== 'cortixhealth') {
      // Radix mode: wrap NODE_PALETTE as NestedPalette (flat only)
      const flat: NestedPalette = {};
      for (const [k, v] of Object.entries(NODE_PALETTE)) flat[k] = v;
      return flat;
    }
    return mode === 'explore' ? HEALTH_PALETTE_EXPLORE : HEALTH_PALETTE_BUILD;
  }, [platform, mode]);

  const categories = Object.keys(palette);

  const toggleCategory = useCallback((cat: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const handleShowAll = useCallback(() => {
    if (allExpanded) {
      setOpenCategories(mode === 'explore' ? new Set(['Goal']) : new Set());
    } else {
      setOpenCategories(new Set(categories));
    }
    setAllExpanded(!allExpanded);
    setSearchQuery('');
  }, [allExpanded, categories, mode]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(cat => {
      const entry = palette[cat];
      if (Array.isArray(entry)) {
        return entry.some(item =>
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q))
        );
      }
      // Nested: check all sub-categories
      return Object.values(entry).some(subItems =>
        subItems.some(item =>
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q))
        )
      );
    });
  }, [categories, searchQuery, palette]);

  // Reset open categories when mode changes
  const handleModeChange = useCallback((newMode: SidebarMode) => {
    setMode(newMode);
    setSearchQuery('');
    setOpenCategories(newMode === 'explore' ? new Set(['Goal']) : new Set());
    setAllExpanded(false);
  }, []);

  return (
    <div style={{
      width: '240px',
      height: '100%',
      background: '#2A2928',
      borderRight: '1px solid #2A2928',
      overflowY: 'auto',
      padding: '10px',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '0 4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          color: '#E8E4D8',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.12em',
        }}>
          HEALTH PALETTE
        </div>
        <button
          onClick={handleShowAll}
          style={{
            background: 'none',
            border: 'none',
            color: allExpanded ? '#4bab13' : '#E8DED0',
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          {allExpanded ? 'Hide All' : 'See All'}
        </button>
      </div>

      {/* Mode toggle — only for CortixHealth */}
      {platform === 'cortixhealth' && (
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '8px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #2A2928',
        }}>
          <button
            onClick={() => handleModeChange('explore')}
            style={{
              flex: 1,
              padding: '5px 0',
              fontSize: '11px',
              fontWeight: mode === 'explore' ? 500 : 300,
              letterSpacing: '0.08em',
              color: mode === 'explore' ? '#4bab13' : '#E8DED0',
              background: mode === 'explore' ? '#2A2928' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            EXPLORE
          </button>
          <button
            onClick={() => handleModeChange('build')}
            style={{
              flex: 1,
              padding: '5px 0',
              fontSize: '11px',
              fontWeight: mode === 'build' ? 500 : 300,
              letterSpacing: '0.08em',
              color: mode === 'build' ? '#4bab13' : '#E8DED0',
              background: mode === 'build' ? '#2A2928' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            CUSTOMIZE
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '0 0 8px', borderBottom: '1px solid #2A2928', marginBottom: '6px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid #2A2928',
            borderRadius: '6px',
            color: '#E8E4D8',
          fontSize: '11px',
            fontWeight: 300,
            padding: '6px 8px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Category sections */}
      {filteredCategories.map(cat => {
        const entry = palette[cat];
        const isFlat = Array.isArray(entry);
        return (
          <CategorySection
            key={cat}
            name={cat}
            items={isFlat ? entry : undefined}
            subCategories={isFlat ? undefined : entry as Record<string, ClinicalNodeData[]>}
            isOpen={openCategories.has(cat) || (!!searchQuery.trim())}
            onToggle={() => toggleCategory(cat)}
            searchQuery={searchQuery}
          />
        );
      })}
    </div>
  );
};

export default NodeCreator;
