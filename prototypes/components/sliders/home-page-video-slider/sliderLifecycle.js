// Browser events and scheduling are local to each mounted slider.
export function createSliderLifecycle(
  elements,
  controller,
  draw,
  updateCoaching,
) {
  const lifecycle = {
    elements,
    controller,
    draw,
    updateCoaching,
    events: new AbortController(),
    frameId: 0,
    disposed: false,
    resizeObserver: null,
    intersectionObserver: null,
  };
  // Install cleanup before starting any browser resources.
  return {
    start: () => startLifecycle(lifecycle),
    destroy: () => destroyLifecycle(lifecycle),
  };
}

function listen(lifecycle, target, event, callback, options = {}) {
  target.addEventListener(event, callback, {
    ...options,
    signal: lifecycle.events.signal,
  });
}

function scheduleFrame(lifecycle) {
  lifecycle.frameId = requestAnimationFrame(() => updateFrame(lifecycle));
}

function restartFrames(lifecycle) {
  cancelAnimationFrame(lifecycle.frameId);
  scheduleFrame(lifecycle);
}

function updateFrame(lifecycle) {
  const { controller, draw, updateCoaching } = lifecycle;
  const { state } = controller;
  if (lifecycle.disposed || !state.visible || document.hidden) return;
  controller.loop();
  if (state.held && state.settled) draw();
  updateCoaching();
  if (!state.reduced) scheduleFrame(lifecycle);
}

function handleVisibility(lifecycle) {
  const { controller, elements, updateCoaching } = lifecycle;
  if (document.hidden) {
    controller.suspend();
    elements.video.pause();
  } else {
    controller.resume();
    controller.play();
    restartFrames(lifecycle);
  }
  updateCoaching();
}

function handleIntersection(lifecycle, entries) {
  const { controller, elements, updateCoaching } = lifecycle;
  controller.state.visible = entries[0].isIntersecting;
  if (controller.state.visible) {
    restartFrames(lifecycle);
    controller.resume();
    controller.play();
  } else {
    cancelAnimationFrame(lifecycle.frameId);
    controller.suspend();
    elements.video.pause();
  }
  updateCoaching();
}

function attachVideoEvents(lifecycle) {
  const { elements, controller, updateCoaching } = lifecycle;
  const { video, errorMessage } = elements;
  listen(lifecycle, video, "seeked", controller.seeked);
  listen(lifecycle, video, "playing", () => {
    if (controller.state.held) video.pause();
    updateCoaching();
  });
  for (const event of ["pause", "waiting", "seeking", "ended", "loadeddata"]) {
    listen(lifecycle, video, event, updateCoaching);
  }
  // Also enforce the loop when animation frames are throttled.
  listen(lifecycle, video, "timeupdate", controller.loop);
  listen(
    lifecycle,
    video,
    "error",
    () => {
      errorMessage.hidden = false;
      controller.clear();
    },
    { once: true },
  );
  listen(
    lifecycle,
    video,
    "loadeddata",
    () => {
      errorMessage.hidden = true;
    },
    { once: true },
  );
  listen(lifecycle, video, "canplay", controller.play);
}

function startLifecycle(lifecycle) {
  const { elements, controller, draw } = lifecycle;
  attachVideoEvents(lifecycle);
  lifecycle.resizeObserver = new ResizeObserver(draw);
  lifecycle.resizeObserver.observe(elements.canvas);
  listen(lifecycle, window, "resize", draw);
  listen(lifecycle, document, "visibilitychange", () =>
    handleVisibility(lifecycle),
  );
  listen(lifecycle, window, "pagehide", controller.suspend);
  listen(lifecycle, window, "pageshow", () => {
    controller.resume();
    controller.play();
    restartFrames(lifecycle);
  });
  if ("IntersectionObserver" in window) {
    lifecycle.intersectionObserver = new IntersectionObserver((entries) =>
      handleIntersection(lifecycle, entries),
    );
    lifecycle.intersectionObserver.observe(elements.root);
  }
  scheduleFrame(lifecycle);
  controller.start();
}

function destroyLifecycle(lifecycle) {
  if (lifecycle.disposed) return;
  lifecycle.disposed = true;
  lifecycle.events.abort();
  lifecycle.controller.suspend();
  cancelAnimationFrame(lifecycle.frameId);
  lifecycle.elements.video.pause();
  lifecycle.elements.audioIndicator.dataset.active = "false";
  lifecycle.resizeObserver?.disconnect();
  lifecycle.intersectionObserver?.disconnect();
}
