'use client';

import React, { useMemo } from 'react';
import { ISemanticIR } from '@/types/semantic/ir';
import { LinearPlugin, UniversalRenderer } from '@/visualization';

interface LinkedListProps {
  semanticIR: ISemanticIR;
}

export const LinkedListRenderer: React.FC<LinkedListProps> = ({ semanticIR }) => {
  // Translate Semantic IR snapshot to Scene Graph via LinearPlugin
  const scene = useMemo(() => {
    return LinearPlugin.buildScene(semanticIR as any);
  }, [semanticIR]);

  // Execute zero business logic — delegate rendering to Universal Renderer
  return <UniversalRenderer scene={scene} />;
};

export default LinkedListRenderer;
