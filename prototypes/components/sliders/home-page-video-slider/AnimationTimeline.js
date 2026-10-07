import { gsap } from "gsap";
import { lineStepMs, lineDrawMs, overlayConfig } from "./SliderConfig.js";

export class AnimationTimeline {
  constructor(pixiRenderer) {
    this.pixiRenderer = pixiRenderer;
    this.timeline = null;
  }

  play(currentPositionParameters) {
    this.clear();
    const drawings = currentPositionParameters.segments.map(() => ({
      progress: 0,
      labelAlpha: 0,
    }));
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => {
        this.pixiRenderer.preparePlayerParameters(currentPositionParameters);
        currentPositionParameters.segments.forEach((segment, index) => {
          const drawing = drawings[index];
          if (drawing.labelAlpha === 0) return;
          const [[x1, y1], [x2, y2]] = segment;
          this.pixiRenderer.drawSegment(currentPositionParameters, segment, index, {
            end: [
              x1 + (x2 - x1) * drawing.progress,
              y1 + (y2 - y1) * drawing.progress,
            ],
            labelAlpha: drawing.labelAlpha,
          });
        });
        this.pixiRenderer.render();
      },
    });
    drawings.forEach((drawing, index) => {
      this.timeline.to(drawing, {
        progress: 1,
        labelAlpha: overlayConfig.labelAlpha,
        duration: lineDrawMs / 1000,
        ease: "none",
      }, index * lineStepMs / 1000);
    });
    
    // Returned for composition into the analysis phase's GSAP timeline.
    return this.timeline.play();
  }

  pause() {
    this.timeline?.pause();
  }

  resume() {
    this.timeline?.resume();
  }

  clear() {
    this.destroy();
    this.pixiRenderer.clearPlayerParameters();
  }

  destroy() {
    this.timeline?.kill();
    this.timeline = null;
  }
}
