/**
 * TabEmptyState — generic placeholder for unimplemented tabs
 */

import React from 'react';
import { IC } from '../canvas/canvas.constants';

interface TabEmptyStateProps {
  tabName: string;
  tabIcon: string;
  description?: string;
}

const DESCRIPTIONS: Record<string, string> = {
  'Custom Modules': 'Load a preloaded module, modify it on the canvas, and save to create your first custom module.',
  'Skills': 'Create reusable skills with custom prompts, tools, and workflows.',
  'Web': 'Search the web, PubMed, clinical trials, and Cochrane reviews from a single interface.',
  'System': 'Manage session memory, EHR connections, report delivery, and audit logging.',
};

const TabEmptyState: React.FC<TabEmptyStateProps> = ({ tabName, tabIcon, description }) => {
  const Icon = IC[tabIcon];
  const desc = description || DESCRIPTIONS[tabName] || 'This feature is coming soon.';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '40px',
        color: '#5A5754',
      }}
    >
      {Icon && <Icon size={32} strokeWidth={1} />}
      <div style={{ fontSize: '14px', fontWeight: 300 }}>{tabName}</div>
      <div style={{ fontSize: '10px', fontWeight: 300, maxWidth: '300px', textAlign: 'center', lineHeight: 1.5 }}>
        {desc}
      </div>
      <div
        style={{
          marginTop: '8px',
          padding: '4px 12px',
          borderRadius: '4px',
          border: '1px solid #2A2928',
          fontSize: '9px',
          fontWeight: 300,
        }}
      >
        Coming soon
      </div>
    </div>
  );
};

export default TabEmptyState;
