import test, { afterEach } from "node:test";
import gsapPackage from "gsap/dist/gsap.js";
const { gsap } = gsapPackage;
const timelines = [];
afterEach(() => {
  timelines.splice(0).forEach((timeline) => timeline.kill());
  gsap.ticker.sleep();
});
import { setMaxListeners } from "node:events";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

async function banner(destroyBeforeReady = false, options = {}) {
  let now = 0,
    id = 0;
  const frames = new Map(),
    timers = new Map();
  const video = Object.assign(new EventTarget(), {
    currentTime: 0,
    duration: 7,
    readyState: 4,
    paused: false,
    error: null,
    play() {
      this.paused = false;
      this.dispatchEvent(new Event("playing"));
      return Promise.resolve();
    },
    pause() {
      this.paused = true;
      this.dispatchEvent(new Event("pause"));
    },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 450 }),
  });
  const indicator = { dataset: {} },
    message = {
      hidden: true,
      textContent: "",
      style: {},
      setAttribute(name, value) {
        this[name] = value;
      },
    };
  const labels = [];
  const canvas = {
    style: {},
    getBoundingClientRect: video.getBoundingClientRect,
  };
  const errorMessage = { hidden: true };
  let intersectionCallback;
  const document = Object.assign(new EventTarget(), { hidden: false });
  let initializationCount = 0;
  let initializationError = null;
  let destroys = 0,
    disconnects = 0;
  const source = buildSync({
    entryPoints: [
      fileURLToPath(
        new URL(
          "../components/sliders/home-page-video-slider/SliderController.js",
          import.meta.url,
        ),
      ),
    ],
    bundle: true,
    write: false,
    format: "cjs",
    external: ["pixi.js", "gsap"],
  }).outputFiles[0].text;
  const sandbox = {
    Application: class {
      async init() {
        initializationCount++;
        if (options.failInitialization) throw new Error("Renderer unavailable");
        this.canvas = canvas;
        this.screen = { width: 800, height: 450 };
        this.renderer = { resolution: 1, resize() {} };
        this.children = [];
        this.stage = {
          addChild: (...children) => this.children.push(...children),
        };
      }
      render() {
        labels.length = 0;
        this.children
          .slice(1)
          .filter((x) => x.visible)
          .forEach((x) => labels.push(x.text));
      }
      destroy() {
        destroys++;
      }
    },
    Graphics: class {
      clear() {}
      moveTo() {
        return this;
      }
      lineTo() {
        return this;
      }
      stroke() {}
    },
    Text: class {
      constructor() {
        this.style = {};
        this.position = { set() {} };
        this.anchor = { set() {} };
      }
    },
    document,
    window: Object.assign(new EventTarget(), { devicePixelRatio: 1 }),
    Event,
    AbortController: class extends AbortController {
      constructor() {
        super();
        setMaxListeners(30, this.signal);
      }
    },
    devicePixelRatio: 1,
    console,
    performance: { now: () => now },
    matchMedia: () => ({ matches: Boolean(options.reducedMotion) }),
    ResizeObserver: class {
      observe() {}
      disconnect() {
        disconnects++;
      }
    },
    requestAnimationFrame: (cb) => {
      frames.set(++id, cb);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (cb, delay) => {
      timers.set(++id, { cb, at: now + delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  if (options.observeIntersection) {
    sandbox.IntersectionObserver = class {
      constructor(callback) {
        intersectionCallback = callback;
      }
      observe() {}
      disconnect() {
        disconnects++;
      }
    };
    sandbox.window.IntersectionObserver = sandbox.IntersectionObserver;
  }
  sandbox.module = { exports: {} };
  sandbox.require = (name) => {
    if (name === "gsap")
      return {
        gsap: {
          timeline(options) {
            const timeline = gsap.timeline(options);
            timelines.push(timeline);
            return timeline;
          },
        },
      };
    assert.equal(name, "pixi.js");
    return sandbox;
  };
  runInNewContext(source, sandbox);
  const elements = {
    root: {},
    video,
    canvas,
    audioIndicator: indicator,
    coachingMessage: message,
    trackingPhase: {},
    errorMessage,
  };
  if (options.missingElement) delete elements[options.missingElement];
  const instance = new sandbox.module.exports.SliderController(elements);
  const initializing = instance.init();
  if (destroyBeforeReady) instance.destroy();
  try {
    await initializing;
    if (!options.deferPlayback) instance.play();
  } catch (error) {
    initializationError = error;
    instance.destroy();
  }
  gsap.ticker.sleep();
  const timeline = instance.videoController?.timeline;
  const audioTimeline = instance.videoController?.audioTimeline;
  function tick(ms = 0) {
    if (timeline?.parent && !timeline.paused()) {
      timeline.totalTime(timeline.totalTime() + ms / 1000, false);
    }
    if (audioTimeline?.parent && !audioTimeline.paused()) {
      audioTimeline.totalTime(audioTimeline.totalTime() + ms / 1000, false);
    }
    gsap.ticker.sleep();
  }
  function hold(time) {
    const holdTween = timeline
      .getChildren()
      .find((child) => child.vars.elapsed === (time === 2.9 ? 5500 : 3500));
    const position = holdTween.startTime();
    const cycleStart =
      Math.floor(timeline.totalTime() / timeline.duration()) *
      timeline.duration();
    tick((cycleStart + position - timeline.totalTime()) * 1000);
    video.dispatchEvent(new Event("seeked"));
    tick(300);
  }
  return {
    video,
    document,
    message,
    indicator,
    tick,
    hold,
    labels,
    instance,
    timeline,
    audioTimeline,
    errorMessage,
    initializationCount: () => initializationCount,
    initializationError,
    setVisible: (visible) =>
      intersectionCallback([{ isIntersecting: visible }]),
    resources: () => ({
      destroys,
      disconnects,
      timers: timers.size,
      frames: frames.size,
    }),
  };
}

test("body annotations follow freeze clocks while coaching spans playback", async () => {
  const b = await banner();
  b.tick();
  assert.equal(b.indicator.dataset.active, "true");
  assert.equal(b.message.hidden, false);
  b.hold(2.9);
  assert.ok(b.video.paused);
  assert.equal(b.message["aria-label"], "Toss the ball higher");
  assert.deepEqual(b.labels, ["Angle: 42°"]);
  b.tick(100);
  assert.deepEqual(b.labels, ["Angle: 42°", "Vector: [0.74, -0.31]"]);
  b.tick(1200);
  assert.equal(b.message.textContent, "Toss the ball higher");
  b.tick(1400);
  assert.equal(b.message.textContent, "Toss the ball higher");
  b.tick(2499);
  assert.ok(b.video.paused);
  b.tick(1);
  assert.ok(!b.video.paused);
  assert.equal(b.message.hidden, false);
  assert.deepEqual(b.labels, []);
  b.hold(3.7);
  assert.equal(b.message["aria-label"], "...");
  assert.deepEqual(b.labels, ["Rotation: 27°"]);
  b.tick(2300);
  assert.equal(b.message.textContent, "Follow through");
  assert.deepEqual(b.labels, [
    "Rotation: 27°",
    "ΔX: 18 px",
    "Knee Flexion: 38°",
    "Hip Height: 76 cm",
    "L-Foot: [0.18, 0.94]",
    "R-Foot: [-0.12, 0.91]",
  ]);
  b.tick(899);
  assert.ok(b.video.paused);
  b.tick(1);
  assert.ok(!b.video.paused);
  assert.equal(b.message.hidden, false);
  assert.deepEqual(b.labels, []);
  assert.equal(b.video.playbackRate, 0.3);
  b.tick((b.timeline.duration() - b.timeline.totalTime()) * 1000);
  assert.equal(b.video.currentTime, 0);
  b.hold(2.9);
  assert.equal(b.message["aria-label"], "Toss the ball higher");
});

test("hidden tabs suspend the hold; external seeking clears temporary analysis", async () => {
  const b = await banner();
  b.hold(2.9);
  const partial = b.message.textContent;
  b.document.hidden = true;
  b.document.dispatchEvent(new Event("visibilitychange"));
  b.tick(10000);
  assert.ok(b.message.hidden);
  assert.ok(b.video.paused);
  assert.equal(b.indicator.dataset.active, "false");
  b.document.hidden = false;
  b.document.dispatchEvent(new Event("visibilitychange"));
  b.tick();
  assert.equal(b.message.textContent, partial);
  const audioPosition = b.audioTimeline.totalTime();
  b.video.currentTime = 3.2;
  b.video.seeking = true;
  b.video.dispatchEvent(new Event("seeking"));
  assert.equal(b.message.hidden, false);
  b.video.seeking = false;
  b.video.dispatchEvent(new Event("seeked"));
  b.tick();
  assert.equal(b.message.hidden, false);
  assert.equal(b.audioTimeline.totalTime(), audioPosition);
  assert.deepEqual(b.labels, []);
  assert.ok(!b.video.paused);
});

test("lower-body values appear only as their own strokes start drawing", async () => {
  for (const [time, firstLegIndex] of [
    [2.9, 2],
    [3.7, 4],
  ]) {
    const b = await banner();
    if (time === 3.7) {
      b.hold(2.9);
      b.tick(5200);
    }
    b.hold(time);
    b.tick(firstLegIndex * 350 - 300);
    assert.equal(b.labels.length, 2);
    for (let i = 0; i < 4; i++) {
      b.tick(i === 0 ? 1 : 350);
      assert.equal(b.labels.length, 3 + i);
      assert.match(
        b.labels.at(-1),
        [/Knee Flexion/, /Hip Height/, /L-Foot/, /R-Foot/][i],
      );
    }
    b.tick(
      (time === 2.9 ? 5500 : 3500) - b.instance.videoController.cue.elapsed,
    );
    assert.deepEqual(b.labels, []);
  }
});

test("destroy during a hold releases timers, animation frames, observers and media listeners", async () => {
  const b = await banner();
  b.hold(2.9);
  b.instance.destroy();
  b.instance.destroy();
  assert.deepEqual(b.resources(), {
    destroys: 1,
    disconnects: 1,
    timers: 0,
    frames: 0,
  });
  assert.ok(b.video.paused);
  b.document.dispatchEvent(new Event("visibilitychange"));
  b.tick(10000);
  assert.ok(b.video.paused);
  assert.equal(b.resources().frames, 0);
});

test("unmount during async Pixi initialization destroys the renderer without starting a loop", async () => {
  const b = await banner(true);
  assert.deepEqual(b.resources(), {
    destroys: 1,
    disconnects: 0,
    timers: 0,
    frames: 0,
  });
  assert.ok(b.video.paused);
});

test("offscreen holds preserve their clock and release both observers", async () => {
  const b = await banner(false, { observeIntersection: true });
  b.hold(2.9);
  const partial = b.message.textContent;
  b.setVisible(false);
  b.tick(10000);
  assert.ok(b.video.paused);
  assert.ok(b.message.hidden);
  assert.equal(b.indicator.dataset.active, "false");
  assert.equal(b.resources().frames, 0);
  b.setVisible(true);
  b.tick();
  assert.equal(b.message.textContent, partial);
  b.tick(5199);
  assert.ok(b.video.paused);
  b.tick(1);
  assert.ok(!b.video.paused);
  b.instance.destroy();
  assert.deepEqual(b.resources(), {
    destroys: 1,
    disconnects: 2,
    timers: 0,
    frames: 0,
  });
});

test("reduced motion stays paused without recurring animation or coaching", async () => {
  const b = await banner(false, { reducedMotion: true });
  b.tick();
  b.video.dispatchEvent(new Event("canplay"));
  b.video.currentTime = 2.9;
  b.video.dispatchEvent(new Event("timeupdate"));
  b.tick(10000);
  assert.ok(b.video.paused);
  assert.ok(b.message.hidden);
  assert.equal(b.indicator.dataset.active, "false");
  assert.deepEqual(b.labels, []);
  assert.equal(b.resources().frames, 0);
  assert.equal(b.resources().timers, 0);
  b.instance.destroy();
});

test("video errors clear an active hold, overlay and coaching state", async () => {
  const b = await banner();
  b.hold(2.9);
  b.video.error = { code: 3 };
  b.video.dispatchEvent(new Event("error"));
  assert.equal(b.errorMessage.hidden, false);
  assert.ok(b.message.hidden);
  assert.equal(b.indicator.dataset.active, "false");
  assert.deepEqual(b.labels, []);
  assert.equal(b.resources().timers, 0);
  b.instance.destroy();
});

test("play only starts the initialized slider without reinitializing it", async () => {
  const b = await banner();
  assert.equal(b.initializationCount(), 1);
  assert.equal(b.resources().frames, 0);
  b.instance.play();
  assert.equal(b.initializationCount(), 1);
  assert.equal(b.resources().frames, 0);
  b.instance.destroy();
  b.instance.play();
  assert.ok(b.video.paused);
  assert.deepEqual(b.resources(), {
    destroys: 1,
    disconnects: 1,
    timers: 0,
    frames: 0,
  });
});

test("initialization failures propagate to the caller without starting playback", async () => {
  const b = await banner(false, { failInitialization: true });
  assert.equal(b.initializationError.message, "Renderer unavailable");
  assert.equal(b.errorMessage.hidden, true);
  assert.ok(b.video.paused);
  assert.equal(b.initializationCount(), 1);
  assert.equal(b.resources().frames, 0);
  assert.equal(b.resources().timers, 0);
});

test("init validates every required element before creating resources", async () => {
  for (const missingElement of [
    "root",
    "video",
    "canvas",
    "audioIndicator",
    "coachingMessage",
    "trackingPhase",
    "errorMessage",
  ]) {
    const b = await banner(false, { missingElement });
    assert.equal(
      b.initializationError.message,
      `HomePageVideoSlider requires the ${missingElement} element.`,
    );
    assert.equal(b.initializationCount(), 0);
    assert.deepEqual(b.resources(), {
      destroys: 0,
      disconnects: 0,
      timers: 0,
      frames: 0,
    });
  }
});

test("both GSAP timelines repeat without growing or rebuilding", async () => {
  const b = await banner();
  const timeline = b.timeline;
  const children = timeline.getChildren();
  const audioChildren = b.audioTimeline.getChildren();
  assert.equal(b.audioTimeline.repeat(), -1);
  assert.ok(Math.abs(b.audioTimeline.duration() - timeline.duration()) < 0.000001);
  assert.equal(timeline.repeat(), -1);
  assert.ok(Math.abs(timeline.duration() - 24) < 0.000001);
  for (let cycle = 0; cycle < 3; cycle++) {
    b.hold(2.9);
    assert.equal(b.video.currentTime, 2.9);
    assert.equal(b.message["aria-label"], "Toss the ball higher");
    b.tick(5200);
    b.hold(3.7);
    assert.equal(b.video.currentTime, 3.7);
    assert.equal(b.message["aria-label"], "...");
    b.tick(3200);
    b.tick(
      ((cycle + 1) * timeline.duration() - timeline.totalTime()) * 1000 + 0.001,
    );
    assert.equal(b.video.currentTime, 0);
    assert.equal(b.instance.videoController.timeline, timeline);
    assert.deepEqual(timeline.getChildren(), children);
    assert.deepEqual(b.audioTimeline.getChildren(), audioChildren);
  }
  b.instance.destroy();
  assert.equal(timeline.parent, null);
  assert.equal(b.audioTimeline.parent, null);
});

test("buffering and seeking pause only the video clock until media is ready", async () => {
  const b = await banner();
  b.tick(1000);
  b.video.readyState = 2;
  b.video.dispatchEvent(new Event("waiting"));
  const beforeBuffer = b.timeline.totalTime();
  const audioBeforeBuffer = b.audioTimeline.totalTime();
  b.tick(10000);
  assert.equal(b.timeline.totalTime(), beforeBuffer);
  assert.equal(b.audioTimeline.totalTime(), audioBeforeBuffer + 10);
  assert.ok(b.video.paused);
  b.video.readyState = 4;
  b.video.dispatchEvent(new Event("canplay"));
  b.tick(1000);
  assert.equal(b.timeline.totalTime(), beforeBuffer + 1);
  assert.equal(b.audioTimeline.totalTime(), audioBeforeBuffer + 11);
  assert.ok(!b.video.paused);

  b.hold(2.9);
  b.video.seeking = true;
  b.video.dispatchEvent(new Event("seeking"));
  const beforeSeek = b.timeline.totalTime();
  b.tick(10000);
  assert.equal(b.timeline.totalTime(), beforeSeek);
  assert.equal(b.message.hidden, false);
  assert.equal(b.indicator.dataset.active, "true");
  b.video.seeking = false;
  b.video.dispatchEvent(new Event("seeked"));
  b.tick(5199);
  assert.ok(b.video.paused);
  b.tick(1);
  assert.ok(!b.video.paused);
  b.instance.destroy();
});

test("freeze callbacks pause only the video while the timeline advances the cue", async () => {
  const b = await banner();
  const holdTween = b.timeline
    .getChildren()
    .find((child) => child.vars.elapsed === 5500);
  b.tick((holdTween.startTime() + 0.1 - b.timeline.totalTime()) * 1000);
  assert.equal(b.timeline.paused(), false);
  assert.equal(b.video.currentTime, 2.9);
  assert.ok(b.video.paused);
  assert.ok(Math.abs(b.instance.videoController.cue.elapsed - 100) < 0.001);
  b.tick(5399);
  assert.ok(b.video.paused);
  b.tick(1);
  assert.ok(!b.video.paused);
  b.instance.destroy();
});

test("audio timing runs independently of video playback and body analysis", async () => {
  const b = await banner();
  const controller = b.instance.videoController;
  b.timeline.pause();
  b.video.currentTime = 1;
  b.video.paused = false;
  b.audioTimeline.totalTime(0.3, false);
  assert.equal(controller.activeFreeze, null);
  assert.equal(b.message.textContent, "Good a");
  assert.equal(b.indicator.dataset.active, "true");
  assert.deepEqual(b.labels, []);
  b.video.pause();
  b.audioTimeline.totalTime(6, false);
  assert.equal(b.message.textContent, "Bend your knees");
  assert.deepEqual(b.labels, []);
  b.instance.destroy();
});

test("body analysis updates only during freeze tweens and never changes audio UI", async () => {
  const b = await banner();
  const controller = b.instance.videoController;
  const calls = [];
  const render = controller.renderPlayerBodyAnalysis.bind(controller);
  controller.renderPlayerBodyAnalysis = (item) => {
    calls.push(item.time);
    render(item);
  };
  b.tick(1000);
  assert.deepEqual(calls, []);
  b.hold(2.9);
  assert.ok(calls.length > 0);
  const text = b.message.textContent;
  const active = b.indicator.dataset.active;
  controller.renderPlayerBodyAnalysis(controller.activeFreeze);
  assert.equal(b.message.textContent, text);
  assert.equal(b.indicator.dataset.active, active);
  b.tick(5200);
  calls.length = 0;
  b.tick(1000);
  assert.deepEqual(calls, []);
  assert.deepEqual(b.labels, []);
  b.instance.destroy();
});

test("playback rejection suspends both clocks and hides audio UI", async () => {
  const b = await banner();
  b.video.play = () => Promise.reject(new Error("Playback unavailable"));
  b.instance.videoController.beginPlayback();
  await Promise.resolve();
  assert.ok(b.timeline.paused());
  assert.ok(b.audioTimeline.paused());
  assert.ok(b.video.paused);
  assert.ok(b.message.hidden);
  assert.equal(b.indicator.dataset.active, "false");
  b.instance.destroy();
});

test("sentences occupy equal slots with typing, replacement and clean replay", async () => {
  const b = await banner();
  const sentences = [
    "Good arm position", "Bend your knees", "Toss the ball higher",
    "Keep the racket position stable", "Follow through",
  ];
  const slot = b.audioTimeline.duration() / sentences.length;
  assert.equal(slot, 4.8);
  assert.equal(b.message.textContent, "G");
  for (let index = 0; index < sentences.length; index++) {
    b.audioTimeline.totalTime(index * slot + 0.001, false);
    assert.equal(b.message.textContent, sentences[index][0]);
    assert.equal(b.message["aria-label"], sentences[index]);
    assert.equal(b.message.hidden, false);
    b.audioTimeline.totalTime(index * slot + slot - 1.501, false);
    assert.equal(b.message.textContent, sentences[index]);
    b.audioTimeline.totalTime(index * slot + slot - 1.5, false);
    assert.equal(b.message.textContent, "...");
    assert.equal(b.message.hidden, false);
    assert.equal(b.indicator.dataset.active, "true");
    b.audioTimeline.totalTime((index + 1) * slot - 0.001, false);
    assert.equal(b.message.textContent, "...");
  }
  b.audioTimeline.totalTime(b.audioTimeline.duration() + 0.001, false);
  assert.equal(b.message.textContent, "G");
  const position = b.audioTimeline.totalTime();
  const count = timelines.length;
  b.instance.play();
  b.instance.play();
  assert.equal(b.instance.videoController.audioTimeline, b.audioTimeline);
  assert.equal(b.audioTimeline.totalTime(), position);
  assert.equal(timelines.length, count);
  b.instance.destroy();
});

test("initialization leaves audio uncreated until playback starts", async () => {
  const b = await banner(false, { deferPlayback: true });
  assert.equal(b.instance.videoController.audioTimeline, null);
  assert.ok(b.message.hidden);
  b.instance.play();
  const audio = b.instance.videoController.audioTimeline;
  assert.ok(audio);
  assert.equal(audio.paused(), false);
  assert.equal(b.message.textContent, "G");
  b.instance.destroy();
});
