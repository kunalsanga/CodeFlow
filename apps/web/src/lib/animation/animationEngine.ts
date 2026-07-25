import { springPhysics, gentleSpring } from "./motionPresets";

export class AnimationEngine {
  private speed: number = 1.0;

  public setSpeed(multiplier: number) {
    this.speed = Math.max(0.1, multiplier);
  }

  public getSpringConfig() {
    return {
      type: "spring" as const,
      stiffness: springPhysics.stiffness * this.speed,
      damping: springPhysics.damping
    };
  }

  public getDuration(baseSeconds: number): number {
    return Math.max(0.05, baseSeconds / this.speed);
  }
}

export const animationEngine = new AnimationEngine();
