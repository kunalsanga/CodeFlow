// Reusable Animation Engine Primitives for CodeFlow Platform

export const CodeFlowSprings = {
  // Snappy node pop & creation spring
  nodePop: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 25,
  },

  // Physical element drop-in spring (Stack push, Queue enqueue, Heap drop)
  nodeDropIn: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 22,
    mass: 0.8,
  },

  // Physical swap transition (Array elements swap, Linked List reversal)
  swapTransition: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 28,
  },

  // Dynamic pointer reconnection SVG arrow transition
  pointerReconnect: {
    type: 'spring' as const,
    stiffness: 250,
    damping: 24,
  },

  // Tree rotation transition
  rotateTree: {
    type: 'spring' as const,
    stiffness: 280,
    damping: 26,
  },

  // Highlight pulse transition
  pulseHighlight: {
    duration: 0.35,
    ease: 'easeInOut' as const,
  },
};
