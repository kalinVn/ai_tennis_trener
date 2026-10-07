import { gsap } from "gsap";
import { AnimationTimeline } from "./AnimationTimeline.js";

export class PlayerAnalysisTimeline {
  constructor(pixiRenderer) {
    this.timeline = null;
    this.animationTimeline = new AnimationTimeline(pixiRenderer);
  }

  play(currentPositionParameters, onComplete) {
    this.destroy();
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.animationTimeline.clear();
        onComplete();
      },
    });
    this.timeline.add(this.animationTimeline.play(currentPositionParameters), 0);
    this.timeline.call(
      () => this.animationTimeline.pause(),
      null,
      currentPositionParameters.duration / 1000,
    );
    this.timeline.play();
  }

  pause() {
    this.timeline?.pause();
  }

  resume() {
    this.timeline?.resume();
  }

  clear() {
    this.destroy();
    this.animationTimeline.clear();
  }

  destroy() {
    this.timeline?.kill();
    this.timeline = null;
    this.animationTimeline.destroy();
  }
}
