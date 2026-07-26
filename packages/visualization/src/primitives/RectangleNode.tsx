import React from 'react';
import { ISceneNode } from '../types/scene';

interface RectangleNodeProps {
  node: ISceneNode;
}

export const RectangleNode: React.FC<RectangleNodeProps> = ({ node }) => {
  const { position, label, subLabel, state, style } = node;

  const bgColor = style?.backgroundColor || (state === 'active' ? '#facc15' : state === 'visited' ? '#4ade80' : '#ffffff');
  const textColor = style?.textColor || '#0d1117';
  const borderColor = style?.borderColor || '#ffffff';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="flex flex-col items-center justify-center select-none z-10 transition-all duration-300"
    >
      {subLabel && (
        <span className="text-[10px] font-black uppercase text-yellow-300 mb-1 bg-black/40 px-1.5 py-0.5 rounded font-mono">
          {subLabel}
        </span>
      )}
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: borderColor,
        }}
        className="px-5 py-3 rounded-xl border-4 flex items-center justify-center font-mono font-black text-lg shadow-2xl transition-all duration-300 min-w-[70px]"
      >
        {label}
      </div>
    </div>
  );
};

export default RectangleNode;
