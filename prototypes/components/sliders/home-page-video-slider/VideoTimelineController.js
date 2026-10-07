import { gsap } from "gsap";
import {
  homepageTimelineItems,
  playbackRate,
  loopDuration,
} from "./SliderConfig.js";

import { AudioTimeline } from "./AudioTimeline.js";
import { PlayerAnalysisTimeline } from "./PlayerAnalysisTimeline.js";

export class VideoTimelineController {

  constructor (elements, pixiRenderer) {
    this.elements = elements;
    this.video = elements.video;
    this.pixiRenderer = pixiRenderer;
    this.videoTimeline = null;
    const coachingSentences = homepageTimelineItems.flatMap(
      ({ feedback }) => feedback,
    );

    this.currentTimelineData = null;
    this.audioTimeline = new AudioTimeline(elements, coachingSentences);
    this.playerAnalysisTimeline = new PlayerAnalysisTimeline(pixiRenderer);
  }

  init () {
    this.video.muted = true;
    this.video.defaultPlaybackRate = playbackRate;
    this.video.playbackRate = playbackRate;
    this.createVideoTimeline();
    this.audioTimeline.createTimeline();
  }

  createVideoTimeline () {
    this.videoTimeline = gsap.timeline({
      paused: true,
      repeat: -1,
    });

    this.videoTimeline.call(() => this.onVideoResume(0), null, 0);
    for (const timelineItem of homepageTimelineItems) {
      this.videoTimeline.addPause(
        timelineItem.time / playbackRate,
        () => this.onVideoPause(timelineItem),
      );
    }
    this.videoTimeline.call(() => this.onVideoResume(0), null, loopDuration);
  }

  playTimeline() {
    if (this.currentTimelineData) {
      this.playerAnalysisTimeline.resume();
      return;
    }
    this.videoTimeline.play();
    if (this.video.paused) this.onVideoResume();
  }

  play () {
    this.playTimeline();
    this.audioTimeline.play();
  }


  pause() {
    this.videoTimeline?.pause();
    this.playerAnalysisTimeline.pause();
    this.video.pause();
    
    if (this.video.error) this.playerAnalysisTimeline.clear();
  }

  destroy() {
    this.videoTimeline?.kill();
    this.playerAnalysisTimeline.destroy();
    this.audioTimeline.destroy();
    this.video.pause();
  }

  onVideoResume(time) {
    this.currentTimelineData = null;
    this.playerAnalysisTimeline.clear();
    if (time !== undefined) this.video.currentTime = time;
    this.videoTimeline.resume();
    this.video.play().catch(() => this.pause());
  }

  onVideoPause (timelineItem) {
    this.videoTimeline.pause();
    this.currentTimelineData = timelineItem;
    this.video.pause();
    this.video.currentTime = timelineItem.time;
    this.playerAnalysisTimeline.play(timelineItem, () => this.onVideoResume());
  }
}
