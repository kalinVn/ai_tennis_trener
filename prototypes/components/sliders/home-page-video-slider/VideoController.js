import { gsap } from "gsap";
import {
  homepageTimelineItems,
  playbackRate,
  loopDuration,
  typingStepMs,
  coachingGapMs,
} from "./SliderConfig.js";

export class VideoController {
  
  constructor(elements, pixiRenderer) {
    this.elements = elements;
    this.video = elements.video;
    this.pixiRenderer = pixiRenderer;
    this.timeline = null;
    this.audioTimeline = null;
    this.coachingSentences = homepageTimelineItems.flatMap(({ feedback }) => feedback);
    this.activeFreeze = null;
    this.cue = { elapsed: 0 };
  }

  init() {
    this.video.muted = true;
    this.video.defaultPlaybackRate = playbackRate;
    this.video.playbackRate = playbackRate;
    this.createTimeline();
  }

  createTimeline() {
    this.timeline = gsap.timeline({
      paused: true,
      repeat: -1,
    });

    let previousTime = 0;

    this.timeline.call(() => this.beginPlayback(0));

    for (const timelineItem of homepageTimelineItems) {
      this.timeline.to(
        {},
        { duration: (timelineItem.time - previousTime) / playbackRate },
      );
      this.timeline.call(() => this.beginFreeze(timelineItem));
      this.timeline.fromTo(
        this.cue,
        { elapsed: 0 },
        {
          elapsed: timelineItem.duration,
          duration: timelineItem.duration / 1000,
          ease: "none",
          immediateRender: false,
          onUpdate: () => this.renderPlayerBodyAnalysis(timelineItem),
        },
      );
      this.timeline.call(() => this.beginPlayback());
      previousTime = timelineItem.time;
    }

    this.timeline.to(
      {},
      {
        duration: loopDuration - previousTime / playbackRate,
      },
    );

    this.timeline.call(() => this.beginPlayback(0));
  }

  playTimeline() {
    this.timeline.play();
    if (!this.activeFreeze && this.video.paused) this.beginPlayback();
  }

  playAudioUI() {
    if (!this.audioTimeline) {
      const totalDuration = loopDuration + homepageTimelineItems.reduce(
        (seconds, { duration }) => seconds + duration / 1000,
        0,
      );
      this.audioTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
        onUpdate: () => this.renderAudioUI(),
      });
      this.audioTimeline.to({}, { duration: totalDuration });
    }
    this.audioTimeline.play();
    this.renderAudioUI();
  }

  play() {
    this.playTimeline();
    this.playAudioUI();
  }

  pauseVideo() {
    this.timeline?.pause();
    this.video.pause();
  }

  pause() {
    this.pauseVideo();
    this.audioTimeline?.pause();
    this.hideAudioUI();
    if (this.video.error) this.pixiRenderer.drawAnnotations(null, 0);
  }

  destroy() {
    this.timeline?.kill();
    this.audioTimeline?.kill();
    this.video.pause();
    this.hideAudioUI();
  }

  beginPlayback(time) {
    this.activeFreeze = null;
    this.elements.trackingPhase.textContent = "READY";
    this.pixiRenderer.drawAnnotations(null, 0);
    if (time !== undefined) this.video.currentTime = time;
    this.video.play().catch(() => this.pause());
  }

  beginFreeze(freeze) {
    this.activeFreeze = freeze;
    this.cue.elapsed = 0;
    this.video.pause();
    this.video.currentTime = freeze.time;
    this.elements.trackingPhase.textContent = "ANALYZING";
  }

  renderPlayerBodyAnalysis(timelineItem) {
    this.pixiRenderer.drawAnnotations(timelineItem, this.cue.elapsed);
  }

  hideAudioUI() {
    this.elements.audioIndicator.dataset.active = "false";
    this.elements.coachingMessage.hidden = true;
  }

  renderAudioUI() {
    if (this.video.error) {
      this.hideAudioUI();
      return;
    }
    const { audioIndicator, coachingMessage } = this.elements;
    audioIndicator.dataset.active = "true";
    if (!this.coachingSentences.length) {
      coachingMessage.hidden = true;
      return;
    }
    const elapsed = this.audioTimeline.time() * 1000;
    const sentenceDuration =
      this.audioTimeline.duration() * 1000 / this.coachingSentences.length;
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
