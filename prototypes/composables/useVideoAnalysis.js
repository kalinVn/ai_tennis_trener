import { ref, shallowRef, toValue, onScopeDispose } from 'vue'
import { createTrainingTransport } from '../services/trainingTransport.js'

export function useVideoAnalysis(video, options = {}) {
  const isAnalyzing = ref(false)
  const isStarting = ref(false)
  const analysisResult = shallowRef(null)
  const error = ref('')
  let generation = 0
  let timer = null
  let transport = null
  let canvas = null
  let encoding = false

  function stopAnalysis() {
    generation++
    clearTimeout(timer)
    timer = null
    isAnalyzing.value = isStarting.value = false
    transport?.disconnect()
    transport = null
    if (canvas) { canvas.width = canvas.height = 0; canvas = null }
  }

  function fail(reason) {
    error.value = reason instanceof Error ? reason.message : String(reason)
    stopAnalysis()
  }

  async function startAnalysis() {
    if (isAnalyzing.value || isStarting.value) return
    const element = toValue(video)
    if (!element?.srcObject?.getVideoTracks().some(track => track.readyState === 'live')) {
      error.value = 'Start the camera before video analysis.'
      return
    }
    error.value = ''
    analysisResult.value = null
    isStarting.value = true
    const run = ++generation
    const fps = Math.min(10, Math.max(1, Number(toValue(options.fps)) || 5))
    const maxWidth = Math.min(1920, Math.max(160, Number(toValue(options.maxWidth)) || 640))
    const factory = options.transportFactory || createTrainingTransport
    try {
      transport = factory({
        url: toValue(options.endpoint),
        onMessage(message) {
          if (run !== generation) return
          if (message.type === 'analysis_error') {
            fail(message.payload?.message || 'Backend analysis failed.')
            return
          }
          // Preserve extensible backend events; no per-frame inference in the browser.
          analysisResult.value = message
          options.onResult?.(message)
        },
        onError(reason) { if (run === generation) fail(reason) },
        onClose() { if (run === generation) fail('Analysis connection closed.') },
      })
      await transport.connect()
      if (run !== generation) return
      isStarting.value = false
      isAnalyzing.value = true
      canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Frame capture is unavailable.')

      async function capture() {
        if (run !== generation) return
        const started = performance.now()
        try {
          if (!encoding && !document.hidden && element.readyState >= 2 && element.videoWidth && element.videoHeight) {
            encoding = true
            try {
              const width = Math.min(maxWidth, element.videoWidth)
              canvas.width = width
              canvas.height = Math.max(1, Math.round(element.videoHeight * width / element.videoWidth))
              context.drawImage(element, 0, 0, canvas.width, canvas.height)
              const frame = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8))
              if (run !== generation) return
              if (!frame) throw new Error('Could not encode a camera frame.')
              await transport.sendFrame(frame)
            } finally { encoding = false }
          }
        } catch (reason) { if (run === generation) fail(reason); return }
        if (run === generation) timer = setTimeout(capture, Math.max(0, 1000 / fps - (performance.now() - started)))
      }
      capture()
    } catch (reason) { if (run === generation) fail(reason) }
  }

  onScopeDispose(stopAnalysis)
  return { isAnalyzing, isStarting, analysisResult, error, startAnalysis, stopAnalysis }
}
