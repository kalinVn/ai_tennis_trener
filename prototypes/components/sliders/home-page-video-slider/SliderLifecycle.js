export class SliderLifecycle {
  constructor(elements, videoController) {
    this.elements = elements;
    this.videoController = videoController;
    this.events = new AbortController();
  }

  init() {
    if (this.events.signal.aborted) return;
    this.elements.video.addEventListener(
      "error",
      () => this.handleVideoError(),
      { once: true, signal: this.events.signal },
    );
  }

  handleVideoError() {
    this.elements.errorMessage.hidden = false;
    this.videoController.pause();
  }

  destroy() {
    this.events.abort();
  }
}
