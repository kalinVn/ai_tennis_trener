import {
  freezes,
  playbackRate,
  loopDuration,
  freezeTolerance,
} from "./sliderConfig.js";

export function createVideoController(video, { draw, updateCoaching }) {
  const state = {
    video,
    draw,
    updateCoaching,
    nextFreeze: 0,
    activeFreeze: null,
    held: false,
    settled: false,
    holdTimer: null,
    remaining: 0,
    timerStarted: 0,
    visible: true,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  return {
    state,
    elapsed: () => holdElapsed(state),
    play: () => playWhenAllowed(state),
    suspend: () => suspendHoldTimer(state),
    resume: () => resumeHoldTimer(state),
    seeked: () => handleSeeked(state),
    loop: () => loopVideo(state),
    clear: () => clearHold(state),
    start: () => startVideo(state),
  };
}

function startVideo(state) {
  const { video } = state;
  // HTML5 playback remains muted, looping, inline. No custom player controls.
  video.muted = true;
  video.defaultPlaybackRate = playbackRate;
  video.playbackRate = playbackRate;
  if (state.reduced) video.pause();
  playWhenAllowed(state);
}

function holdElapsed(state) {
  if (!state.activeFreeze) return 0;
  const runningElapsed =
    state.holdTimer === null ? 0 : performance.now() - state.timerStarted;
  return state.activeFreeze.duration - state.remaining + runningElapsed;
}

function playWhenAllowed(state) {
  if (!state.held && state.visible && !document.hidden && !state.reduced) {
    state.video.play().catch(() => {});
  }
}

function suspendHoldTimer(state) {
  if (state.holdTimer === null) return;
  clearTimeout(state.holdTimer);
  state.holdTimer = null;
  state.remaining = Math.max(
    0,
    state.remaining - (performance.now() - state.timerStarted),
  );
}

function resumeHoldTimer(state) {
  if (
    !state.held ||
    !state.settled ||
    state.holdTimer !== null ||
    !state.visible ||
    document.hidden
  )
    return;

  state.timerStarted = performance.now();
  state.holdTimer = setTimeout(() => finishHold(state), state.remaining);
}

function finishHold(state) {
  state.holdTimer = null;
  state.held = false;
  state.settled = false;
  state.draw();
  state.updateCoaching();
  playWhenAllowed(state);
}

function clearHold(state) {
  suspendHoldTimer(state);
  state.held = false;
  state.settled = false;
  state.draw();
  state.updateCoaching();
}

function handleSeeked(state) {
  const { video, activeFreeze } = state;
  if (
    state.held &&
    Math.abs(video.currentTime - activeFreeze.time) < freezeTolerance
  ) {
    state.settled = true;
    state.draw();
    resumeHoldTimer(state);
  } else if (state.held) {
    clearHold(state);
  }
  if (!state.held) {
    const index = freezes.findIndex(
      (freeze) => freeze.time > video.currentTime,
    );
    state.nextFreeze = index < 0 ? freezes.length : index;
  }
}

function loopVideo(state) {
  const { video } = state;
  const end = Math.min(loopDuration * playbackRate, video.duration);
  if (state.held) return;
  const upcoming = freezes[state.nextFreeze];
  if (
    !state.reduced &&
    upcoming &&
    !video.paused &&
    end > upcoming.time &&
    video.currentTime >= upcoming.time
  ) {
    state.activeFreeze = upcoming;
    state.nextFreeze++;
    state.held = true;
    state.remaining = upcoming.duration;
    state.settled = false;
    video.pause();
    video.currentTime = upcoming.time;
    return;
  }
  if (Number.isFinite(end) && end > 0 && video.currentTime >= end) {
    state.nextFreeze = 0;
    video.currentTime = 0;
  }
}
