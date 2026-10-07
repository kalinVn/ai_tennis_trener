import { Application, Graphics, Text } from "pixi.js";
import {
  overlayConfig,
} from "./SliderConfig.js";

export class PixiRenderer {
  constructor({ canvas, video }) {
    this.app = new Application();
    this.canvas = canvas;
    this.video = video;
    this.graphics = null;
    this.labels = [];
    this.currentPositionParameters = null;
    this.initialized = false;
    
  }

  async init() {
    
    await this.app.init({
      canvas: this.canvas,
      backgroundAlpha: 0,
      antialias: true,
      autoStart: false,
      autoDensity: true,
      resolution: devicePixelRatio || 1,
      preference: "webgl",
    });
    this.initialized = true;
    
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
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

    this.app.stage.addChild(this.graphics, ...this.labels);
  }

  destroy () {
    if (this.initialized) {
      this.app.destroy(false, { children: true });
    }
  }

  updateRendererSize () {
    const canvasBounds = this.canvas.getBoundingClientRect();
    const videoBounds = this.video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (
      this.app.screen.width !== canvasBounds.width ||
      this.app.screen.height !== canvasBounds.height ||
      this.app.renderer.resolution !== dpr
    ) {
      this.app.renderer.resize(canvasBounds.width, canvasBounds.height, dpr);
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
    }
    return { canvasBounds, videoBounds };
  }

  preparePlayerParameters (currentPositionParameters) {
    if (!this.initialized) return;
    this.currentPositionParameters = currentPositionParameters;
    const { canvasBounds, videoBounds } = this.updateRendererSize();
    this.graphics.clear();
    this.labels.forEach((label) => {
      label.visible = false;
    });
    
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

    this.geometry = { scale, left, top, width: canvasBounds.width };
  }

  render() {
    if (this.initialized) this.app.render();
  }

  clearPlayerParameters () {
    if (!this.initialized) return;

    this.currentPositionParameters = null;
    this.graphics.clear();
    this.labels.forEach((label) => { label.visible = false; });
    this.render();
  }

  drawSegment (currentPositionParameters, segment, index, drawing) {
    if (!this.initialized) return;
    const { scale, left, top } = this.geometry;
    const [[x1, y1]] = segment;

    this.graphics.moveTo(left + x1 * scale, top + y1 * scale);
    this.graphics.lineTo(
      left + drawing.end[0] * scale,
      top + drawing.end[1] * scale,
    );

    this.graphics.stroke({
      color: overlayConfig.lineColor,
      width: Math.max(
        overlayConfig.minLineWidth,
        overlayConfig.lineWidth * scale,
      ),
      cap: "round",
    });

    if (currentPositionParameters.labels[index]) {
      this.drawLabel(
        this.labels[index],
        currentPositionParameters,
        this.geometry,
        segment,
        index,
        drawing.labelAlpha,
      );
    }
  }

  drawLabel(label, currentPositionParameters, geometry, segment, index, alpha) {
    const { scale, left, top, width } = geometry;
    const [[x1, y1], [x2, y2]] = segment;
    const lowerIndex =
      index - (currentPositionParameters.segments.length - overlayConfig.lowerBodyCount);
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
    label.alpha = alpha;
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
    label.text = currentPositionParameters.labels[index];
  }

}
