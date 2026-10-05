import { Application, Graphics, Text } from "pixi.js";
import {
  lineStepMs,
  lineDrawMs,
  freezeTolerance,
  overlayConfig,
} from "./sliderConfig.js";

export function createPixiRenderer({ canvas, video }) {
  const renderer = {
    app: new Application(),
    canvas,
    video,
    initialized: false,
    disposed: false,
  };
  return {
    init: () => initializeRenderer(renderer),
    draw: (state, elapsed) => drawAnnotations(renderer, state, elapsed),
    destroy: () => destroyRenderer(renderer),
  };
}

async function initializeRenderer(renderer) {
  const { app, canvas } = renderer;
  await app.init({
    canvas,
    backgroundAlpha: 0,
    antialias: true,
    autoStart: false,
    autoDensity: true,
    resolution: devicePixelRatio || 1,
    preference: "webgl",
  });
  renderer.initialized = true;
  if (renderer.disposed) {
    app.destroy(false, { children: true });
    return;
  }
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  renderer.graphics = new Graphics();
  renderer.labels = Array.from(
    { length: overlayConfig.labelCount },
    () =>
      new Text({
        text: "",
        style: {
          fontFamily: overlayConfig.fontFamily,
          fontSize: overlayConfig.fontSize,
          fill: overlayConfig.labelColor,
        },
      }),
  );
  app.stage.addChild(renderer.graphics, ...renderer.labels);
}

function destroyRenderer(renderer) {
  if (renderer.disposed) return;
  renderer.disposed = true;
  if (renderer.initialized) renderer.app.destroy(false, { children: true });
}

function drawAnnotations(renderer, state, elapsed) {
  const { app, canvas, video, graphics, labels } = renderer;
  const { held, settled, activeFreeze } = state;
  const canvasBounds = canvas.getBoundingClientRect();
  const videoBounds = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  if (
    app.screen.width !== canvasBounds.width ||
    app.screen.height !== canvasBounds.height ||
    app.renderer.resolution !== dpr
  ) {
    app.renderer.resize(canvasBounds.width, canvasBounds.height, dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }
  graphics.clear();
  labels.forEach((label) => {
    label.visible = false;
  });
  if (
    !held ||
    !settled ||
    !video.paused ||
    video.seeking ||
    Math.abs(video.currentTime - activeFreeze.time) > freezeTolerance
  ) {
    app.render();
    return;
  }
  // Centered cover crop; transformed bounds already include scale(1.07).
  const scale = Math.max(
    videoBounds.width / overlayConfig.sourceWidth,
    videoBounds.height / overlayConfig.sourceHeight,
  );
  const left =
    videoBounds.left -
    canvasBounds.left +
    (videoBounds.width - overlayConfig.sourceWidth * scale) / 2;
  const top =
    videoBounds.top -
    canvasBounds.top +
    (videoBounds.height - overlayConfig.sourceHeight * scale) / 2;

  const geometry = { scale, left, top, width: canvasBounds.width };
  activeFreeze.segments.forEach((segment, index) => {
    drawSegment(renderer, activeFreeze, geometry, segment, index, elapsed);
  });
  app.render();
}

function drawSegment(renderer, freeze, geometry, segment, index, elapsed) {
  const { graphics } = renderer;
  const { scale, left, top } = geometry;
  const [[x1, y1], [x2, y2]] = segment;
  const progress = Math.min(
    1,
    Math.max(0, (elapsed - index * lineStepMs) / lineDrawMs),
  );
  if (progress === 0) return;

  graphics.moveTo(left + x1 * scale, top + y1 * scale);
  graphics.lineTo(
    left + (x1 + (x2 - x1) * progress) * scale,
    top + (y1 + (y2 - y1) * progress) * scale,
  );
  graphics.stroke({
    color: overlayConfig.lineColor,
    width: Math.max(
      overlayConfig.minLineWidth,
      overlayConfig.lineWidth * scale,
    ),
    cap: "round",
  });
  if (freeze.labels[index]) {
    drawLabel(
      renderer.labels[index],
      freeze,
      geometry,
      segment,
      index,
      progress,
    );
  }
}

function drawLabel(label, freeze, geometry, segment, index, progress) {
  const { scale, left, top, width } = geometry;
  const [[x1, y1], [x2, y2]] = segment;
  const lowerIndex =
    index - (freeze.segments.length - overlayConfig.lowerBodyCount);
  const lowerBody = lowerIndex >= 0;
  const compact = width <= overlayConfig.compactWidth;
  // Compact layouts keep leg data left of the player, clear of the right UI.
  const labelLeft = lowerBody ? compact || lowerIndex % 2 === 0 : index === 0;
  const offsetY = lowerBody
    ? compact
      ? overlayConfig.compactLowerOffsets[lowerIndex]
      : overlayConfig.lowerOffset
    : compact && index === 1
      ? overlayConfig.compactUpperOffset
      : overlayConfig.upperOffset;
  // Illustrative values, anchored to the source-video geometry, not measurements.
  label.visible = true;
  label.alpha = progress * overlayConfig.labelAlpha;
  label.position.set(
    left +
      ((x1 + x2) / 2) * scale +
      (labelLeft ? overlayConfig.leftOffset : overlayConfig.rightOffset),
    top + ((y1 + y2) / 2) * scale + offsetY,
  );
  const rotationLimit = lowerBody
    ? overlayConfig.lowerRotationLimit
    : overlayConfig.upperRotationLimit;
  label.rotation = Math.max(
    -rotationLimit,
    Math.min(rotationLimit, Math.atan2(y2 - y1, x2 - x1)),
  );
  label.style.fontSize = Math.max(
    overlayConfig.minFontSize,
    Math.min(overlayConfig.maxFontSize, overlayConfig.fontSize * scale),
  );
  label.anchor.set(labelLeft ? 1 : 0, 1);
  label.text = freeze.labels[index];
}
