import { typingStepMs, freezeTolerance } from "./sliderConfig.js";

export function updateCoaching(elements, state, elapsedHold) {
  const { video, audioIndicator, coachingMessage, trackingPhase } = elements;
  const { visible, held, settled, activeFreeze, reduced } = state;
  const onScreen = visible && !document.hidden && !video.error;
  const isCoaching =
    held &&
    settled &&
    video.paused &&
    !video.seeking &&
    Math.abs(video.currentTime - activeFreeze.time) < freezeTolerance;
  if (audioIndicator)
    audioIndicator.dataset.active = String(
      onScreen &&
        !video.seeking &&
        (isCoaching || (!video.paused && video.readyState >= 3)),
    );
  if (trackingPhase)
    trackingPhase.textContent = isCoaching ? "ANALYZING" : "READY";
  if (!coachingMessage) return;
  if (!onScreen || !isCoaching || video.readyState < 2) {
    coachingMessage.hidden = true;
    return;
  }
  // Coaching and technical annotations share the existing hold clock.
  const elapsed = Math.min(elapsedHold, activeFreeze.duration);
  const interval = activeFreeze.duration / activeFreeze.feedback.length;
  const index = Math.min(
    Math.floor(elapsed / interval),
    activeFreeze.feedback.length - 1,
  );
  const text = activeFreeze.feedback[index];
  const letters = reduced
    ? text.length
    : Math.floor((elapsed - index * interval) / typingStepMs) + 1;
  const typed = text.slice(0, letters);
  if (coachingMessage.textContent !== typed)
    coachingMessage.textContent = typed;
  // Expose the complete cue without announcing every individual character.
  coachingMessage.setAttribute("aria-label", text);
  coachingMessage.hidden = false;
}
