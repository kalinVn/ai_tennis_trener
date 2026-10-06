// Illustrative statuses only; these are not live AI observations.
const demoStatuses = [
  "READY",
  "TRACKING PLAYER",
  "ANALYZING MOTION",
  "DETECTING POSE",
  "TRACKING JOINTS",
  "MOTION ANALYSIS",
];

export class AIMotionTrackingPanel {
  constructor(elements) {
    this.elements = elements;
    this.interval = null;
    this.currentIndex = 0;
  }

  play() {
    if (this.interval !== null) return;
    this.update();
    this.interval = setInterval(() => this.update(), 2500);
  }

  update() {
    this.elements.trackingPhase.textContent = demoStatuses[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % demoStatuses.length;
  }

  destroy() {
    if (this.interval === null) return;
    clearInterval(this.interval);
    this.interval = null;
  }
}
