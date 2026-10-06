import { gsap } from "gsap";

export class PlayerAnalysisTimeline {
  constructor(pixiRenderer) {
    this.pixiRenderer = pixiRenderer;
    this.timeline = null;
  }

  play(timelineItem, onComplete) {
    this.timeline?.kill();
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => this.render(timelineItem),
      onComplete,
    });
    this.timeline.call(
      () => this.render(timelineItem),
      null,
      timelineItem.duration / 1000,
    );
    this.timeline.play();
  }

  pause() {
    this.timeline?.pause();
  }

  resume() {
    this.timeline?.resume();
  }

  destroy() {
    this.timeline?.kill();
  }

  render(timelineItem) {
    this.pixiRenderer.showPlayerParameters(timelineItem, this.timeline.time() * 1000);
  }
}
