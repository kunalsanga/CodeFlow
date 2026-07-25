import { Variants } from "framer-motion";

export const springPhysics = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25
};

export const gentleSpring = {
  type: "spring" as const,
  stiffness: 250,
  damping: 20
};

export const swapCellVariants: Variants = {
  initial: { y: 0, scale: 1 },
  highlighted: {
    y: -8,
    scale: 1.1,
    transition: springPhysics
  },
  swapping: {
    y: -14,
    scale: 1.15,
    boxShadow: "0px 10px 25px rgba(56, 139, 253, 0.5)",
    transition: springPhysics
  }
};

export const stackFrameVariants: Variants = {
  initial: { y: -30, opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1, transition: springPhysics },
  exit: { y: 30, opacity: 0, scale: 0.95, transition: springPhysics }
};

export const pulseGlowVariants: Variants = {
  idle: { scale: 1, boxShadow: "0 0 0px rgba(0,0,0,0)" },
  active: {
    scale: 1.05,
    boxShadow: "0 0 15px rgba(88, 166, 255, 0.6)",
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 0.8
    }
  }
};
