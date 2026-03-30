/**
 * TabNotes — Notes tab panel
 *
 * Shows "Add Note to Canvas" button with pre-selectable colors.
 * Designed as a quick access point for canvas annotations.
 */

import React, { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { SW } from '../canvas/canvas.constants';

const NOTE_COLORS = [
  { label: 'Yellow', dot: '#FFEA6B' },
  { label: 'Orange', dot: '#FFAB6B' },
  { label: 'Green', dot: '#82D182' },
  { label: 'Teal', dot: '#A2D9CE' },
  { label: 'Blue', dot: '#BADCFF' },
  { label: 'Purple', dot: '#C7B1D4' },
  { label: 'Pink', dot: '#FFB6B9' },
];

interface TabNotesProps {
  onAddNote: (color?: number) => void;
}

const TabNotes: React.FC<TabNotesProps> = ({ onAddNote }) => {
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div style={{ padding: '24px 32px', flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <StickyNote size={18} strokeWidth={SW} style={{ color: '#FFEA6B' }} />
          <h2 style={{ color: '#C8C5BC', fontSize: '14px', fontWeight: 500, margin: 0 }}>
            Canvas Notes
          </h2>
        </div>

        <p style={{ color: '#5A5754', fontSize: '11px', fontWeight: 300, lineHeight: 1.5, marginBottom: '20px' }}>
          Add sticky notes to annotate your canvas. Notes support basic markdown:
          headings (#, ##), <strong>bold</strong> (**text**), and lists (- item).
          Double-click a note to edit, resize by dragging corners.
        </p>

        {/* Color selection */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#8A8680', fontSize: '10px', fontWeight: 300, marginBottom: '8px' }}>
            Note color
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {NOTE_COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                title={c.label}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: c.dot,
                  border: i === selectedColor ? '2px solid #C8C5BC' : '1px solid #3A3836',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'border 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={() => onAddNote(selectedColor)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(255,234,107,0.3)',
            background: 'rgba(255,234,107,0.08)',
            color: '#FFEA6B',
            fontSize: '11px',
            fontWeight: 400,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          <StickyNote size={13} strokeWidth={SW} />
          Add Note to Canvas
        </button>
      </div>
    </div>
  );
};

export default TabNotes;
