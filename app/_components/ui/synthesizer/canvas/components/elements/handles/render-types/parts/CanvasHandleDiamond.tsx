/**
 * CanvasHandleDiamond — rotated square connection indicator
 * CortixEngine-specific (n8n doesn't have diamond handles)
 *
 * A 45-degree rotated square used as a connection point visual.
 * Matches the DH (Diamond Handle) style from canvas.constants.
 */

import React from 'react';
import { DH } from '../../../../../canvas.constants';

interface CanvasHandleDiamondProps {
  connected?: boolean;
  color?: string;
}

const CanvasHandleDiamond: React.FC<CanvasHandleDiamondProps> = ({
  connected = false,
  color = '#5A5754',
}) => {
  return (
    <div
      style={{
        ...DH,
        background: connected ? color : DH.background,
        borderColor: connected ? color : undefined,
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export default CanvasHandleDiamond;
