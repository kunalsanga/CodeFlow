import React from 'react';
import { ISceneGraph } from '../types/scene';
import { CircleNode } from '../primitives/CircleNode';
import { RectangleNode } from '../primitives/RectangleNode';
import { Arrow } from '../primitives/Arrow';

interface UniversalRendererProps {
  scene: ISceneGraph;
}

export const UniversalRenderer: React.FC<UniversalRendererProps> = ({ scene }) => {
  const { nodes, edges, title, subtitle, theme } = scene;

  // Node position dictionary for fast lookup when drawing edge vector arrows
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div
      style={{ backgroundColor: theme.backgroundColor }}
      className="h-full w-full relative overflow-hidden font-sans select-none flex flex-col p-6"
    >
      {/* Header Info */}
      {(title || subtitle) && (
        <div className="border-b-2 border-white/20 pb-3 mb-4 z-20 flex items-center justify-between">
          <div>
            {title && <h2 className="text-2xl font-black text-white">{title}</h2>}
            {subtitle && <p className="text-xs font-mono text-yellow-300 font-bold">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Canvas Viewport */}
      <div className="flex-1 w-full h-full relative overflow-auto">
        {/* SVG Overlay for Vector Edge Arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {edges.map(edge => {
            const source = nodeMap.get(edge.sourceId);
            const target = nodeMap.get(edge.targetId);
            if (!source || !target) return null;

            return (
              <Arrow
                key={edge.id}
                from={{ x: source.position.x + 35, y: source.position.y + 25 }}
                to={{ x: target.position.x, y: target.position.y + 25 }}
                label={edge.label}
                dashed={edge.dashed}
                color={scene.theme.edgeColor}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 z-10">
          {nodes.map(node => {
            if (node.type === 'circle') {
              return <CircleNode key={node.id} node={node} />;
            }
            return <RectangleNode key={node.id} node={node} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default UniversalRenderer;
