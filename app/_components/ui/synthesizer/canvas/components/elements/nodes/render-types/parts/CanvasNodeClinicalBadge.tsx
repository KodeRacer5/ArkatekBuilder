/**
 * CanvasNodeClinicalBadge — clinical category badge
 * Replaces n8n's CanvasNodeSettingsIcons.vue (168 lines)
 *
 * n8n shows settings like "always output data", "retry on fail", etc.
 * CortixEngine shows clinical indicators:
 * - Category icon (colored)
 * - "has data" indicator when userInput is set
 * - Attachment count badge
 */

import React from 'react';
import { IC, SW, C } from '../../../../../canvas.constants';
import { useCanvasNode } from '../../../../../hooks/useCanvasNode';

const CanvasNodeClinicalBadge: React.FC = () => {
  const { category, hasUserInput, hasAttachments, attachmentCount } = useCanvasNode();
  const colors = C[category];

  return (
    <div className="flex items-center gap-1">
      {/* Data indicator */}
      {hasUserInput && (
        <div
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: colors.accent,
            opacity: 0.6,
          }}
          title="Has user data"
        />
      )}

      {/* Attachment count */}
      {hasAttachments && (
        <div
          style={{
            fontSize: '7px',
            fontWeight: 300,
            color: colors.accent,
            opacity: 0.5,
            padding: '0 2px',
          }}
          title={`${attachmentCount} file(s) attached`}
        >
          {attachmentCount}f
        </div>
      )}
    </div>
  );
};

export default CanvasNodeClinicalBadge;
