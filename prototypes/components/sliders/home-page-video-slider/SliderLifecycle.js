import {
  homepageTimelineItems,
  playbackRate,
  freezeTolerance,
} from "./SliderConfig.js";

export class SliderLifecycle {
  constructor(elements, videoController, pixiRenderer) {
    this.elements = elements;
    this.videoController = videoController;
    this.pixiRenderer = pixiRenderer;
    this.events = new AbortController();
    this.visible = true;
    this.started = false;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.resizeObserver = null;
    this.intersectionObserver = null;
  }

  init() {
    if (this.events.signal.aborted) return;
    this.resizeObserver = new ResizeObserver(() => this.pixiRenderer.resize());
    this.resizeObserver.observe(this.elements.canvas);
    this.listen(window, "resize", () => this.pixiRenderer.resize());
    this.listen(document, "visibilitychange", this.handleVisibility);
    this.listen(window, "pagehide", this.handlePageHide);
    this.listen(window, "pageshow", this.handlePageShow);
    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        this.handleVisibility();
      });
      this.intersectionObserver.observe(this.elements.root);
    }
    // Media seeks and buffering stop only the video clock until frames are ready.
    const { video } = this.elements;
    for (const event of ["seeking", "waiting"]) {
      this.listen(video, event, () => this.videoController.pauseVideo());
    }
    for (const event of ["canplay", "playing", "loadeddata"]) {
      this.listen(video, event, this.handleVisibility);
    }
    this.listen(video, "seeked", this.handleSeeked);
    this.listen(video, "error", this.handleVideoError, { once: true });
    this.listen(
      video,
      "loadeddata",
      () => {
        this.elements.errorMessage.hidden = true;
      },
      { once: true },
    );
  }

  listen(target, event, handler, options = {}) {
    target.addEventListener(event, handler.bind(this), {
      ...options,
      signal: this.events.signal,
    });
  }

  start() {
    if (this.events.signal.aborted) return;
    this.started = true;
    this.handleVisibility();
  }

  handleVisibility() {
    const { video } = this.elements;
    if (
      this.started &&
      this.visible &&
      !document.hidden &&
      !this.reduced &&
      !video.error
    ) {
      if (!video.seeking && video.readyState >= 3) {
        this.videoController.play();
      } else {
        this.videoController.pauseVideo();
      }
    } else {
      this.videoController.pause();
    }
  }

  handleSeeked() {
    const controller = this.videoController;
    const time = this.elements.video.currentTime;
    // An external seek leaves the current cue and resumes the same timeline
    // at the matching video position, skipping earlier freeze holds.
    if (
      controller.activeFreeze &&
      Math.abs(time - controller.activeFreeze.time) > freezeTolerance
    ) {
      controller.activeFreeze = null;
      const earlierHolds = homepageTimelineItems
        .filter((freeze) => freeze.time <= time)
        .reduce((seconds, freeze) => seconds + freeze.duration / 1000, 0);
      const position = time / playbackRate + earlierHolds;
      controller.timeline.time(position, true);
      controller.elements.trackingPhase.textContent = "READY";
      this.pixiRenderer.drawAnnotations(null, 0);
    }
    this.handleVisibility();
  }

  handlePageHide() {
    this.started = false;
    this.videoController.pause();
  }

  handlePageShow() {
    this.start();
  }

  handleVideoError() {
    this.elements.errorMessage.hidden = false;
    this.videoController.pause();
  }

  destroy() {
    if (this.events.signal.aborted) return;
    this.events.abort();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }
}
