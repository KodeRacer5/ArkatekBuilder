/**
 * CanvasNodeRenderer — render type dispatch
 * Source: n8n CanvasNodeRenderer.vue (39 lines)
 *
 * Simple switch on data.render.type to select the correct node component.
 * n8n pattern: factory/strategy that centralizes render type routing.
 */

import React from 'react';
import { useCanvasNode } from '../../../hooks/useCanvasNode';
import { CanvasNodeRenderType } from '../../../canvas.types';
import CanvasNodeDefault from './render-types/CanvasNodeDefault';
import CanvasNodeCircle from './render-types/CanvasNodeCircle';
import CanvasNodeStickyNote from './render-types/CanvasNodeStickyNote';
import CanvasNodePill from './render-types/CanvasNodePill';
import CanvasNodeSquare from './render-types/CanvasNodeSquare';
import CanvasNodeRounded from './render-types/CanvasNodeRounded';
import CanvasNodeSmRounded from './render-types/CanvasNodeSmRounded';
import CanvasNodeTall from './render-types/CanvasNodeTall';
import CanvasNodeSplitter from './render-types/CanvasNodeSplitter';
import CanvasNodeEngine from './render-types/CanvasNodeEngine';
import CanvasNodeDualOut from './render-types/CanvasNodeDualOut';

const CanvasNodeRenderer: React.FC = () => {
  const { render } = useCanvasNode();

  switch (render.type) {
    case CanvasNodeRenderType.Default:
      return <CanvasNodeDefault />;
    case CanvasNodeRenderType.Circle:
      return <CanvasNodeCircle />;
    case CanvasNodeRenderType.StickyNote:
      return <CanvasNodeStickyNote />;
    case CanvasNodeRenderType.Pill:
      return <CanvasNodePill />;
    case CanvasNodeRenderType.Square:
      return <CanvasNodeSquare />;
    case CanvasNodeRenderType.Rounded:
      return <CanvasNodeRounded />;
    case CanvasNodeRenderType.SmRounded:
      return <CanvasNodeSmRounded />;
    case CanvasNodeRenderType.Tall:
      return <CanvasNodeTall />;
    case CanvasNodeRenderType.Splitter:
      return <CanvasNodeSplitter />;
    case CanvasNodeRenderType.Engine:
      return <CanvasNodeEngine />;
    case CanvasNodeRenderType.DualOut:
      return <CanvasNodeDualOut />;
    default:
      return <CanvasNodeDefault />;
  }
};

export default CanvasNodeRenderer;
