/**
 * CategorySection — 3-level collapsible category accordion
 * L1: Category header (Action, Goal, Input, etc.)
 * L2: Sub-category header (Body & Physical, Patient Data, Analyzers, etc.)
 * L3: Node items (draggable to canvas)
 */
import React, { useMemo, useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ClinicalNodeData } from '../../canvas/canvas.types';
import NodeItem from './NodeItem';

interface CategorySectionProps {
  name: string;
  items?: ClinicalNodeData[];
  subCategories?: Record<string, ClinicalNodeData[]>;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery?: string;
}

/** Sub-category (L2) — collapsible group within a category */
const SubCategorySection: React.FC<{
  name: string;
  items: ClinicalNodeData[];
  searchQuery?: string;
  defaultOpen?: boolean;
}> = ({ name, items, searchQuery, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const filteredItems = useMemo(() => {
    if (!searchQuery?.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  if (searchQuery?.trim() && filteredItems.length === 0) return null;

  // Auto-open when searching
  const effectiveOpen = isOpen || (!!searchQuery?.trim() && filteredItems.length > 0);

  return (
    <div style={{ marginBottom: '1px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 6px 5px 16px',
          borderRadius: '3px',
          cursor: 'pointer',
          background: effectiveOpen ? 'rgba(255,255,255,0.015)' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{
            color: effectiveOpen ? '#E8DED0' : '#C2B9A7',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {name}
          </span>
          <span style={{
            color: '#B8B2A8',
            fontSize: '10px',
            fontWeight: 300,
          }}>
            
          </span>
        </div>
        {effectiveOpen ? (
          <ChevronDown size={12} color="#B8B2A8" strokeWidth={1} />
        ) : (
          <ChevronRight size={12} color="#B8B2A8" strokeWidth={1} />
        )}
      </div>
      {effectiveOpen && (
        <div style={{ padding: '2px 0 4px 8px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {filteredItems.map((item, i) => (
            <NodeItem key={i} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategorySection: React.FC<CategorySectionProps> = ({
  name,
  items,
  subCategories,
  isOpen,
  onToggle,
  searchQuery,
}) => {
  // Flat items filtering
  const filteredItems = useMemo(() => {
    if (!items || !searchQuery?.trim()) return items || [];
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  // Check if any sub-category has matches
  const hasSubMatches = useMemo(() => {
    if (!subCategories || !searchQuery?.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(subCategories).some(subItems =>
      subItems.some(item =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      )
    );
  }, [subCategories, searchQuery]);

  // Hide if no matches at all
  if (searchQuery?.trim()) {
    if (items && filteredItems.length === 0) return null;
    if (subCategories && !hasSubMatches) return null;
  }

  return (
    <div style={{ marginBottom: '1px' }}>
      {/* L1 Category header */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 6px',
          borderRadius: '4px',
          cursor: 'pointer',
          background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
        }}
      >
        <span style={{
          color: isOpen ? '#4bab13' : '#E8DED0',
          fontSize: '13px',
          fontWeight: 300,
          letterSpacing: '0.04em',
        }}>
          {name}
        </span>
        {isOpen ? (
          <ChevronDown size={12} color="#5A5754" strokeWidth={1} />
        ) : (
          <ChevronRight size={12} color="#B8B2A8" strokeWidth={1} />
        )}
      </div>

      {/* Content: flat items OR nested sub-categories */}
      {isOpen && items && (
        <div style={{ padding: '2px 0 6px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {filteredItems.map((item, i) => (
            <NodeItem key={i} data={item} />
          ))}
        </div>
      )}
      {isOpen && subCategories && (
        <div style={{ padding: '2px 0 6px' }}>
          {Object.entries(subCategories).map(([subName, subItems]) => (
            <SubCategorySection
              key={subName}
              name={subName}
              items={subItems}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
