import { createPixiRenderer } from "./pixiRenderer.js";
import { createVideoController } from "./videoController.js";
import { updateCoaching } from "./coachingDisplay.js";
import { createSliderLifecycle } from "./sliderLifecycle.js";

// Vue owns the DOM refs; this helper owns only per-instance runtime resources.
export function createHomePageVideoSlider(elements) {
  const renderer = createPixiRenderer(elements);
  const draw = () => renderer.draw(controller.state, controller.elapsed());
  const refreshCoaching = () =>
    updateCoaching(elements, controller.state, controller.elapsed());
  const controller = createVideoController(elements.video, {
    draw,
    updateCoaching: refreshCoaching,
  });
  const lifecycle = createSliderLifecycle(
    elements,
    controller,
    draw,
    refreshCoaching,
  );
  const slider = { elements, renderer, lifecycle, disposed: false };
  elements.video.pause();

  return {
    ready: initializeSlider(slider),
    destroy: () => destroySlider(slider),
  };
}

async function initializeSlider(slider) {
  try {
    await slider.renderer.init();
    if (!slider.disposed) slider.lifecycle.start();
  } catch (error) {
    if (slider.disposed) return;
    destroySlider(slider);
    slider.elements.errorMessage.textContent =
      "Video analysis preview unavailable.";
    slider.elements.errorMessage.hidden = false;
    console.error("HomePageVideoSlider initialization failed", error);
  }
}

function destroySlider(slider) {
  if (slider.disposed) return;
  slider.disposed = true;
  slider.lifecycle.destroy();
  slider.renderer.destroy();
}
