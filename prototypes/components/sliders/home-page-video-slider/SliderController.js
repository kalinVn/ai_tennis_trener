import { AIMotionTrackingPanel } from "./AIMotionTrackingPanel.js";
import { PixiRenderer } from "./PixiRenderer.js";
import { VideoTimelineController } from "./VideoTimelineController.js";
import { SliderLifecycle } from "./SliderLifecycle.js";

export class SliderController {
  constructor(elements) {
    this.elements = elements;
    this.pixiRenderer = null;
    this.videoController = null;
    this.sliderLifecycle = null;
    this.aiMotionTrackingPanel = null;
  }

  async init() {
    for (const name of [
      "root",
      "video",
      "canvas",
      "audioIndicator",
      "coachingMessage",
      "trackingPhase",
      "errorMessage",
    ]) {
      if (!this.elements?.[name]) {
        throw new Error(`HomePageVideoSlider requires the ${name} element.`);
      }
    }

    this.pixiRenderer = new PixiRenderer(this.elements);
    this.videoController = new VideoTimelineController(
      this.elements,
      this.pixiRenderer,
    );
    this.sliderLifecycle = new SliderLifecycle(
      this.elements,
      this.videoController,
    );
    this.videoController.pause();
    await this.pixiRenderer.init();
    if (this.pixiRenderer.disposed) return;
    this.videoController.init();
    this.sliderLifecycle.init();
    this.aiMotionTrackingPanel = new AIMotionTrackingPanel(this.elements);
  }

  play() {
    if (!this.pixiRenderer?.initialized || this.pixiRenderer.disposed) return;
    this.videoController.play();
    this.aiMotionTrackingPanel?.play();
  }

  destroy() {
    this.aiMotionTrackingPanel?.destroy();
    this.aiMotionTrackingPanel = null;
    this.sliderLifecycle?.destroy();
    this.videoController?.destroy();
    this.pixiRenderer?.destroy();
  }
}
