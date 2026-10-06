import { gsap } from "gsap";
import {
  homepageTimelineItems,
  loopDuration,
  typingStepMs,
  coachingGapMs,
} from "./SliderConfig.js";

export class AudioTimeline {
  constructor(elements, coachingSentences) {
    this.elements = elements;
    this.coachingSentences = coachingSentences;
    this.timeline = null;
  }

  createTimeline() {
    this.timeline?.kill();
    const totalDuration = loopDuration + homepageTimelineItems.reduce(
      (seconds, { duration }) => seconds + duration / 1000,
      0,
    );
    this.timeline = gsap.timeline({
      paused: true,
      repeat: -1,
      onUpdate: () => this.render(),
    });
    this.timeline.call(() => this.render(), null, totalDuration);
  }

  play() {
    this.timeline.play();
    this.render();
  }

  pause() {
    this.timeline?.pause();
  }

  destroy() {
    this.timeline?.kill();
  }

  render() {
    if (this.elements.video.error) return;
    const { audioIndicator, coachingMessage } = this.elements;
    audioIndicator.dataset.active = "true";
    if (!this.coachingSentences.length) {
      coachingMessage.hidden = true;
      return;
    }
    const elapsed = this.timeline.time() * 1000;
    const sentenceDuration =
      this.timeline.duration() * 1000 / this.coachingSentences.length;
    const index = Math.min(
      Math.floor(elapsed / sentenceDuration),
      this.coachingSentences.length - 1,
    );
    const slotElapsed = elapsed - index * sentenceDuration;
    const textDuration = sentenceDuration - Math.min(coachingGapMs, sentenceDuration / 2);
    const text = slotElapsed >= textDuration ? "..." : this.coachingSentences[index];
    const typingInterval = Math.min(typingStepMs, textDuration / text.length);
    const letters = Math.floor(slotElapsed / typingInterval) + 1;
    const typed = text === "..." ? text : text.slice(0, letters);
    if (coachingMessage.textContent !== typed)
      coachingMessage.textContent = typed;
    coachingMessage.setAttribute("aria-label", text);
    coachingMessage.hidden = false;
  }
}
