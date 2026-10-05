import test from 'node:test';
import { setMaxListeners } from 'node:events';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

async function banner(destroyBeforeReady = false) {
  let now = 0, id = 0;
  const frames = new Map(), timers = new Map();
  const video = Object.assign(new EventTarget(), {
    currentTime: 0, duration: 7, readyState: 4, paused: false, error: null,
    play() { this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve(); },
    pause() { this.paused = true; this.dispatchEvent(new Event('pause')); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 450 }),
  });
  const indicator = { dataset: {} }, message = { hidden: true, textContent: '', style: {}, setAttribute(name, value) { this[name] = value; } };
  const labels = [];
  const context = { save() {}, restore() {}, translate() {}, rotate() {}, fillText(text) { labels.push(text); }, setTransform() { labels.length = 0; }, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {} };
  const canvas = { style: {}, getContext: () => context, getBoundingClientRect: video.getBoundingClientRect };
  const elements = { 'rally-video': video, 'video-demo-court': {}, 'video-load-error': {},
    'coaching-audio': indicator, 'coaching-message': message, 'freeze-points': canvas };
  const document = Object.assign(new EventTarget(), { hidden: false, getElementById: id => elements[id] });
  let destroys = 0, disconnects = 0;
  const root = { querySelector(selector) {
    if (selector === 'video') return video;
    if (selector === 'canvas') return canvas;
    return elements[selector.match(/data-slider="([^"]+)"/)[1]];
  }};
  const source = readFileSync(new URL('../components/sliders/home-page-video-slider/slider.js', import.meta.url), 'utf8')
    .replace(/^import .*\n/, '').replace('export function', 'function');
  const create = runInNewContext(source + '\ncreateHomePageVideoSlider', {
    Application: class {
      async init() { this.canvas = canvas; this.screen = {width: 800,height: 450}; this.renderer = {resolution: 1, resize() {}}; this.children = []; this.stage = {addChild: (...children) => this.children.push(...children)}; }
      render() { labels.length = 0; this.children.slice(1).filter(x => x.visible).forEach(x => labels.push(x.text)); }
      destroy() { destroys++; }
    },
    Graphics: class { clear() {} moveTo() { return this; } lineTo() { return this; } stroke() {} },
    Text: class { constructor() { this.style = {}; this.position = {set() {}}; this.anchor = {set() {}}; } },
    document, window: Object.assign(new EventTarget(), { devicePixelRatio: 1 }), Event, AbortController: class extends AbortController { constructor() { super(); setMaxListeners(30, this.signal); } },
    devicePixelRatio: 1, console,
    performance: { now: () => now }, matchMedia: () => ({ matches: false }),
    ResizeObserver: class { observe() {} disconnect() { disconnects++; } },
    requestAnimationFrame: cb => { frames.set(++id, cb); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: (cb, delay) => { timers.set(++id, { cb, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
  });
  const instance = create(root);
  if (destroyBeforeReady) instance.destroy();
  await instance.ready;
  function tick(ms = 0) {
    now += ms;
    for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.cb(); }
    const pending = [...frames.values()]; frames.clear(); pending.forEach(cb => cb(now));
  }
  function hold(time) {
    video.currentTime = time; tick(); video.dispatchEvent(new Event('seeked')); tick(300);
  }
  return { video, document, message, indicator, tick, hold, labels, instance, resources: () => ({destroys, disconnects, timers: timers.size, frames: frames.size}) };
}

test('pause coaching and labels follow both hold clocks and clear on resume', async () => {
  const b = await banner(); b.tick();
  assert.equal(b.indicator.dataset.active, 'true'); assert.ok(b.message.hidden);
  b.hold(2.9); assert.ok(b.video.paused);
  assert.equal(b.message.textContent, 'Good a');
  assert.deepEqual(b.labels, ['Angle: 42°']);
  b.tick(100); assert.deepEqual(b.labels, ['Angle: 42°', 'Vector: [0.74, -0.31]']);
  b.tick(1200); assert.equal(b.message.textContent, 'Good arm position');
  b.tick(1400); assert.equal(b.message.textContent, 'Bend your knees');
  b.tick(2499); assert.ok(b.video.paused);
  b.tick(1); assert.ok(!b.video.paused); assert.ok(b.message.hidden); assert.deepEqual(b.labels, []);
  b.hold(3.7); assert.equal(b.message['aria-label'], 'Keep the racket position stable');
  assert.deepEqual(b.labels, ['Rotation: 27°']);
  b.tick(2300); assert.equal(b.message.textContent, 'Follow through');
  assert.deepEqual(b.labels, ['Rotation: 27°', 'ΔX: 18 px', 'Knee Flexion: 38°', 'Hip Height: 76 cm', 'L-Foot: [0.18, 0.94]', 'R-Foot: [-0.12, 0.91]']);
  b.tick(899); assert.ok(b.video.paused);
  b.tick(1); assert.ok(!b.video.paused); assert.ok(b.message.hidden); assert.deepEqual(b.labels, []);
  assert.equal(b.video.playbackRate, .3);
  b.video.currentTime = 4.5; b.tick(); assert.equal(b.video.currentTime, 0);
  b.hold(2.9); assert.equal(b.message.textContent, 'Good a');
});

test('hidden tabs suspend the hold; external seeking clears temporary analysis', async () => {
  const b = await banner(); b.hold(2.9); const partial = b.message.textContent;
  b.document.hidden = true; b.document.dispatchEvent(new Event('visibilitychange'));
  b.tick(10000); assert.ok(b.message.hidden); assert.ok(b.video.paused);
  assert.equal(b.indicator.dataset.active, 'false');
  b.document.hidden = false; b.document.dispatchEvent(new Event('visibilitychange')); b.tick();
  assert.equal(b.message.textContent, partial);
  b.video.currentTime = 3.2; b.video.seeking = true; b.video.dispatchEvent(new Event('seeking'));
  assert.ok(b.message.hidden);
  b.video.seeking = false; b.video.dispatchEvent(new Event('seeked')); b.tick(10000);
  assert.ok(b.message.hidden); assert.deepEqual(b.labels, []);
});


test('lower-body values appear only as their own strokes start drawing', async () => {
  for (const [time, firstLegIndex] of [[2.9, 2], [3.7, 4]]) {
    const b = await banner();
    if (time === 3.7) { b.hold(2.9); b.tick(5200); }
    b.hold(time);
    b.tick(firstLegIndex * 350 - 300);
    assert.equal(b.labels.length, 2);
    for (let i = 0; i < 4; i++) {
      b.tick(i === 0 ? 1 : 350);
      assert.equal(b.labels.length, 3 + i);
      assert.match(b.labels.at(-1), [/Knee Flexion/, /Hip Height/, /L-Foot/, /R-Foot/][i]);
    }
    b.tick(6000); assert.deepEqual(b.labels, []);
  }
});


test('destroy during a hold releases timers, animation frames, observers and media listeners', async () => {
  const b = await banner(); b.hold(2.9); b.instance.destroy(); b.instance.destroy();
  assert.deepEqual(b.resources(), {destroys: 1, disconnects: 1, timers: 0, frames: 0});
  assert.ok(b.video.paused);
  b.document.dispatchEvent(new Event('visibilitychange')); b.tick(10000);
  assert.ok(b.video.paused); assert.equal(b.resources().frames, 0);
});

test('unmount during async Pixi initialization destroys the renderer without starting a loop', async () => {
  const b = await banner(true);
  assert.deepEqual(b.resources(), {destroys: 1, disconnects: 0, timers: 0, frames: 0});
  assert.ok(b.video.paused);
});
