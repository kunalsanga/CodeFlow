// Standardized Framer Motion Animation Primitives for CodeFlow Platform

export const CodeFlowSprings = {
  // Snappy node creation spring
  nodePop: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 25,
  },

  // Smooth edge growth & layout shift
  layoutShift: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },

  // Highlight pulse transition
  pulseHighlight: {
    duration: 0.35,
    ease: 'easeInOut' as const,
  },
};
