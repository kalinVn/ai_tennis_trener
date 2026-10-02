import test from 'node:test'
import assert from 'node:assert/strict'
import { effectScope, shallowRef } from 'vue'
import { useVideoAnalysis } from '../composables/useVideoAnalysis.js'
import { useCameraSession } from '../composables/useCameraSession.js'
import { createTrainingTransport } from '../services/trainingTransport.js'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
function harness({ connect, encode } = {}) {
  const sent = []
  let disconnects = 0
  let callbacks
  let canvas
  globalThis.document = { hidden: false, createElement: () => (canvas = {
    width: 0, height: 0,
    getContext: () => ({ drawImage() {} }),
    toBlob: encode || (callback => callback(new Blob(['jpeg'], { type: 'image/jpeg' }))),
  }) }
  const video = shallowRef({ readyState: 4, videoWidth: 1280, videoHeight: 720, srcObject: { getVideoTracks: () => [{ readyState: 'live' }] } })
  const scope = effectScope()
  const analysis = scope.run(() => useVideoAnalysis(video, {
    fps: 10,
    transportFactory: options => {
      callbacks = options
      return { connect: connect || (() => Promise.resolve()), disconnect: () => disconnects++, sendFrame: frame => sent.push(frame) }
    },
  }))
  return { analysis, scope, sent, get callbacks() { return callbacks }, get canvas() { return canvas }, get disconnects() { return disconnects } }
}

test('one bounded analysis loop, resized JPEGs, result handling and stop without camera teardown', async () => {
  const h = harness()
  await Promise.all([h.analysis.startAnalysis(), h.analysis.startAnalysis()])
  await delay(250)
  assert(h.sent.length >= 2 && h.sent.length <= 3)
  assert.equal(h.canvas.width, 640)
  assert.equal(h.canvas.height, 360)
  assert.equal(h.sent[0].type, 'image/jpeg')
  h.callbacks.onMessage({ type: 'pose_analysis', payload: { detected: true } })
  assert.equal(h.analysis.analysisResult.value.type, 'pose_analysis')
  h.analysis.stopAnalysis()
  const count = h.sent.length
  await delay(140)
  assert.equal(h.sent.length, count)
  assert.equal(h.analysis.isAnalyzing.value, false)
  assert.equal(h.canvas.width, 0)
  h.scope.stop()
})

test('stop during encode prevents late frames and stale messages; restart does not overlap encoding', async () => {
  let finish
  const h = harness({ encode: callback => { finish = callback } })
  await h.analysis.startAnalysis()
  const oldCallback = h.callbacks.onMessage
  h.analysis.stopAnalysis()
  await h.analysis.startAnalysis()
  finish(new Blob(['old']))
  await delay(10)
  assert.equal(h.sent.length, 0)
  oldCallback({ type: 'player_feedback', payload: { text: 'stale' } })
  assert.equal(h.analysis.analysisResult.value, null)
  h.scope.stop()
})

test('cancel while connecting and backend errors clean up the session', async () => {
  let resolve
  const h = harness({ connect: () => new Promise(done => { resolve = done }) })
  const pending = h.analysis.startAnalysis()
  assert.equal(h.analysis.isStarting.value, true)
  h.analysis.stopAnalysis()
  resolve()
  await pending
  assert.equal(h.analysis.isAnalyzing.value, false)
  assert.equal(h.sent.length, 0)
  h.scope.stop()
  const next = harness()
  await next.analysis.startAnalysis()
  next.callbacks.onMessage({ type: 'analysis_error', payload: { message: 'Unavailable' } })
  assert.equal(next.analysis.error.value, 'Unavailable')
  assert.equal(next.analysis.isAnalyzing.value, false)
  assert.equal(next.disconnects, 1)
  next.scope.stop()
})

test('camera requests include audio, stop/unmount release all tracks, late permission results are released', async () => {
  let resolve, constraints
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: {
    getUserMedia: options => { constraints = options; return new Promise(done => { resolve = done }) },
  } } })
  let stops = 0
  const video = { stop: () => stops++ }, audio = { stop: () => stops++ }
  const stream = { getTracks: () => [video, audio], getVideoTracks: () => [video], getAudioTracks: () => [audio] }
  const scope = effectScope()
  const camera = scope.run(useCameraSession)
  const pending = camera.startCamera()
  assert.equal(constraints.audio, true)
  camera.stopCamera()
  resolve(stream)
  await pending
  assert.equal(stops, 2)
  assert.equal(camera.stream.value, null)
  const again = camera.startCamera()
  resolve(stream)
  await again
  assert.equal(camera.stream.value, stream)
  scope.stop()
  assert.equal(stops, 4)
  assert.equal(camera.stream.value, null)
})

test('permission rejection stays in Training with a useful error', async () => {
  navigator.mediaDevices.getUserMedia = async () => { throw new Error('Permission denied') }
  const scope = effectScope(), camera = scope.run(useCameraSession)
  await camera.startCamera()
  assert.equal(camera.error.value, 'Permission denied')
  assert.equal(camera.stream.value, null)
  assert.equal(camera.isRequesting.value, false)
  scope.stop()
})

test('transport validates endpoints, sends bounded frames and dispatches extensible messages', async () => {
  let instance
  globalThis.WebSocket = class {
    static OPEN = 1
    readyState = 1
    bufferedAmount = 0
    frames = []
    constructor() { instance = this; queueMicrotask(() => this.onopen?.()) }
    send(frame) { this.frames.push(frame) }
    close() { this.closed = true }
  }
  const messages = [], errors = []
  const transport = createTrainingTransport({ url: 'ws://localhost/analysis', onMessage: value => messages.push(value), onError: value => errors.push(value) })
  await transport.connect()
  assert.equal(transport.sendFrame(new Blob(['frame'])), true)
  instance.bufferedAmount = 3 * 1024 * 1024
  assert.equal(transport.sendFrame(new Blob(['drop'])), false)
  assert.equal(instance.frames.length, 1)
  instance.onmessage({ data: JSON.stringify({ type: 'ball_position', payload: {} }) })
  assert.equal(messages[0].type, 'ball_position')
  instance.onmessage({ data: 'bad JSON' })
  assert.equal(errors.length, 1)
  transport.disconnect()
  assert(instance.closed)
  await assert.rejects(createTrainingTransport({ url: '' }).connect(), /No analysis endpoint/)
  await assert.rejects(createTrainingTransport({ url: 'https://example.com' }).connect(), /ws:\/\//)
})
