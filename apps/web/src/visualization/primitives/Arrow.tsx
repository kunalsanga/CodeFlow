import React from 'react';
import { IPoint } from '../types/scene';

interface ArrowProps {
  from: IPoint;
  to: IPoint;
  label?: string;
  dashed?: boolean;
  color?: string;
  strokeWidth?: number;
}

export const Arrow: React.FC<ArrowProps> = ({
  from,
  to,
  label,
  dashed = false,
  color = '#ffffff',
  strokeWidth = 3,
}) => {
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '6,6' : 'none'}
        strokeLinecap="round"
      />
      {label && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 8}
          fill={color}
          fontSize={11}
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default Arrow;
