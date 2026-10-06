import { PixiRenderer } from "./PixiRenderer.js";
import { VideoController } from "./VideoController.js";
import { SliderLifecycle } from "./SliderLifecycle.js";

export class SliderController {
  constructor(elements) {
    this.elements = elements;
    this.pixiRenderer = null;
    this.videoController = null;
    this.sliderLifecycle = null;
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
    this.videoController = new VideoController(
      this.elements,
      this.pixiRenderer,
    );
    this.sliderLifecycle = new SliderLifecycle(
      this.elements,
      this.videoController,
      this.pixiRenderer,
    );
    this.videoController.pause();
    await this.pixiRenderer.init();
    if (this.pixiRenderer.disposed) return;
    this.videoController.init();
    this.sliderLifecycle.init();
  }

  play() {
    this.sliderLifecycle.start();
  }

  destroy() {
    this.sliderLifecycle?.destroy();
    this.videoController?.destroy();
    this.pixiRenderer?.destroy();
  }
}
