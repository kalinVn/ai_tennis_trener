import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function banner() {
  let now = 0, id = 0;
  const frames = new Map(), timers = new Map();
  const video = Object.assign(new EventTarget(), {
    currentTime: 0, duration: 7, readyState: 4, paused: false, error: null,
    play() { this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve(); },
    pause() { this.paused = true; this.dispatchEvent(new Event('pause')); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 450 }),
  });
  const indicator = { dataset: {} }, message = { hidden: true, textContent: '', style: {}, setAttribute(name, value) { this[name] = value; } };
  const context = { setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {} };
  const canvas = { getContext: () => context, getBoundingClientRect: video.getBoundingClientRect };
  const elements = { 'rally-video': video, 'video-demo-court': {}, 'video-load-error': {},
    'coaching-audio': indicator, 'coaching-message': message, 'freeze-points': canvas };
  const document = Object.assign(new EventTarget(), { hidden: false, getElementById: id => elements[id] });
  runInNewContext(readFileSync(new URL('../Animated_banner/design/video-demo.js', import.meta.url), 'utf8'), {
    document, window: Object.assign(new EventTarget(), { devicePixelRatio: 1 }), Event,
    performance: { now: () => now }, matchMedia: () => ({ matches: false }),
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: cb => { frames.set(++id, cb); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: (cb, delay) => { timers.set(++id, { cb, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
  });
  function tick(ms = 0) {
    now += ms;
    for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.cb(); }
    const pending = [...frames.values()]; frames.clear(); pending.forEach(cb => cb(now));
  }
  function hold(time) {
    video.currentTime = time; tick(); video.dispatchEvent(new Event('seeked')); tick(300);
  }
  return { video, document, message, indicator, tick, hold };
}

test('coaching types throughout playback and both unchanged holds, then restarts with the loop', () => {
  const b = banner(); b.tick();
  assert.equal(b.indicator.dataset.active, 'true');
  assert.equal(b.message.hidden, false); assert.equal(b.message.textContent, 'G');
  b.video.currentTime = .033; b.tick(); assert.equal(b.message.textContent, 'Goo');
  b.video.currentTime = .6; b.tick(); assert.equal(b.message.textContent, 'Good arm position');
  b.video.currentTime = 1.8; b.tick(); assert.equal(b.message.textContent, 'Bend your knees');
  b.hold(2.9);
  assert.ok(b.video.paused); assert.equal(b.message['aria-label'], 'Toss the ball higher');
  b.tick(3000); assert.equal(b.message.textContent, 'Toss the ball higher');
  b.tick(2199); assert.ok(b.video.paused);
  b.tick(1); assert.ok(!b.video.paused); assert.ok(!b.message.hidden);
  assert.equal(b.message['aria-label'], 'Keep the racket position stable');
  b.hold(3.7); assert.ok(b.video.paused);
  assert.equal(b.message['aria-label'], 'Keep the racket position stable');
  b.tick(3199); assert.ok(b.video.paused);
  b.tick(1); assert.ok(!b.video.paused); assert.equal(b.message.textContent, 'Follow through');
  assert.equal(b.video.playbackRate, .3);
  b.video.currentTime = 4.5; b.tick();
  assert.equal(b.video.currentTime, 0); assert.equal(b.message.textContent, 'G');
});

test('manual pauses and hidden tabs freeze typing; seeking selects the new cue', () => {
  const b = banner(); b.video.currentTime = .033; b.tick(); b.video.pause();
  const partial = b.message.textContent; b.tick(10000); assert.equal(b.message.textContent, partial);
  b.video.play(); b.hold(2.9); const heldText = b.message.textContent;
  b.document.hidden = true; b.document.dispatchEvent(new Event('visibilitychange'));
  b.tick(10000); assert.ok(b.message.hidden); assert.ok(b.video.paused);
  assert.equal(b.indicator.dataset.active, 'false');
  b.document.hidden = false; b.document.dispatchEvent(new Event('visibilitychange')); b.tick();
  assert.equal(b.message.textContent, heldText);
  b.video.currentTime = 3.2; b.video.seeking = true; b.video.dispatchEvent(new Event('seeking'));
  assert.ok(b.message.hidden);
  b.video.seeking = false; b.video.dispatchEvent(new Event('seeked')); b.tick();
  assert.equal(b.message.textContent, 'Keep the racket position stable');
  b.tick(10000); assert.equal(b.message.textContent, 'Keep the racket position stable');
});
