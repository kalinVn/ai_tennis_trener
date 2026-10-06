import { Application, Graphics, Text } from "pixi.js";
import {
  lineStepMs,
  lineDrawMs,
  freezeTolerance,
  overlayConfig,
} from "./SliderConfig.js";

export class PixiRenderer {
  constructor({ canvas, video }) {
    this.app = new Application();
    this.canvas = canvas;
    this.video = video;
    this.graphics = null;
    this.labels = [];
    this.annotation = null;
    this.elapsed = 0;
    this.initialized = false;
    this.disposed = false;
  }

  async init() {
    const { app, canvas } = this;
    await app.init({
      canvas,
      backgroundAlpha: 0,
      antialias: true,
      autoStart: false,
      autoDensity: true,
      resolution: devicePixelRatio || 1,
      preference: "webgl",
    });
    this.initialized = true;
    if (this.disposed) {
      app.destroy(false, { children: true });
      return;
    }
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.graphics = new Graphics();
    this.labels = Array.from(
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
    app.stage.addChild(this.graphics, ...this.labels);
  }

  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.initialized) this.app.destroy(false, { children: true });
  }

  resize() {
    this.drawAnnotations(this.annotation, this.elapsed);
  }

  drawAnnotations(activeFreeze, elapsed) {
    if (!this.initialized || this.disposed) return;
    this.annotation = activeFreeze;
    this.elapsed = elapsed;
    const { app, canvas, video, graphics, labels } = this;
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
      !activeFreeze ||
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
      this.drawSegment(activeFreeze, geometry, segment, index, elapsed);
    });
    app.render();
  }

  drawSegment(freeze, geometry, segment, index, elapsed) {
    const { graphics } = this;
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
      this.drawLabel(
        this.labels[index],
        freeze,
        geometry,
        segment,
        index,
        progress,
      );
    }
  }

  drawLabel(label, freeze, geometry, segment, index, progress) {
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
}
