import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import gsapPackage from "gsap/dist/gsap.js";
import { homepageTimelineItems, overlayConfig } from "../components/sliders/home-page-video-slider/SliderConfig.js";

const { gsap } = gsapPackage;
const source = buildSync({
  entryPoints: [fileURLToPath(new URL("../components/sliders/home-page-video-slider/AnimationTimeline.js", import.meta.url))],
  bundle: true, write: false, format: "cjs", external: ["gsap"],
}).outputFiles[0].text;
const sandbox = { module: { exports: {} }, require: () => ({ gsap }) };
runInNewContext(source, sandbox);
const { AnimationTimeline } = sandbox.module.exports;

test("GSAP sequences segment endpoints and alpha, with restart and cleanup", () => {
  const segments = new Map();
  const animation = new AnimationTimeline({
    preparePlayerParameters() { segments.clear(); },
    drawSegment(item, segment, index, drawing) { segments.set(index, drawing); },
    render() {},
    clearPlayerParameters() { segments.clear(); },
  });
  try {
    const timeline = animation.play(homepageTimelineItems[0]);
    gsap.ticker.sleep();
    timeline.totalTime(0.15, false);
    assert.equal(segments.get(0).end[0], 519);
    assert.equal(segments.get(0).end[1], 372.5);
    assert.equal(segments.get(0).labelAlpha, overlayConfig.labelAlpha / 2);
    assert.equal(segments.has(1), false);
    timeline.totalTime(0.5, false);
    assert.equal(segments.get(0).end[0], 526);
    assert.equal(segments.get(1).labelAlpha, overlayConfig.labelAlpha / 2);
    animation.pause();
    assert.equal(timeline.paused(), true);
    animation.resume();
    assert.equal(timeline.paused(), false);
    const replacement = animation.play(homepageTimelineItems[1]);
    assert.equal(timeline.parent, null);
    assert.equal(segments.size, 0);
    replacement.totalTime(replacement.duration(), false);
    assert.equal(segments.size, 8);
    animation.clear();
    assert.equal(replacement.parent, null);
    assert.equal(animation.timeline, null);
    assert.equal(segments.size, 0);
  } finally {
    animation.destroy();
    gsap.ticker.sleep();
  }
});
