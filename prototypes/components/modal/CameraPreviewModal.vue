<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import Button from '../../../docs/prototypes/design/components/buttons/Button.vue'
import { useVideoAnalysis } from '../../composables/useVideoAnalysis.js'

const props = defineProps({
  stream: { type: Object, required: true },
  endpoint: { type: String, default: '' },
  analysisFps: { type: Number, default: 5 },
})
const emit = defineEmits(['close', 'analysis-result'])
const dialog = ref(null)
const video = ref(null)
const mediaError = ref('')
const microphoneMuted = ref(false)
const { isAnalyzing, isStarting, analysisResult, error, startAnalysis, stopAnalysis } = useVideoAnalysis(video, {
  endpoint: () => props.endpoint,
  fps: () => props.analysisFps,
  onResult: message => emit('analysis-result', message),
})
const feedback = computed(() => {
  if (!isAnalyzing.value) return ''
  const result = analysisResult.value
  if (!['player_feedback', 'training_instruction'].includes(result?.type)) return ''
  if (typeof result.payload?.confidence === 'number' && result.payload.confidence < 0.5) return ''
  const text = result.payload?.text || result.payload?.message
  return typeof text === 'string' ? text : ''
})
let previousOverflow
let disposed = false

function toggleMicrophone() {
  microphoneMuted.value = !microphoneMuted.value
  props.stream.getAudioTracks().forEach(track => { track.enabled = !microphoneMuted.value })
}

function cleanup() {
  if (disposed) return
  disposed = true
  stopAnalysis()
  props.stream.getTracks().forEach(track => {
    track.removeEventListener('ended', close)
    track.stop()
  })
  if (video.value) video.value.srcObject = null
  dialog.value?.close()
  if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow
}

function close() {
  cleanup()
  emit('close')
}

onMounted(async () => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  props.stream.getTracks().forEach(track => track.addEventListener('ended', close))
  video.value.srcObject = props.stream
  try { await video.value.play() }
  catch (reason) { if (!disposed) mediaError.value = reason.message || 'Camera playback failed.' }
})
onBeforeUnmount(cleanup)
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="camera-modal" aria-labelledby="camera-title" @cancel.prevent="close">
      <div class="camera-modal__layout">
        <header class="camera-modal__header">
          <span class="camera-modal__brand" id="camera-title"><span class="camera-modal__logo">AI</span>Live Training</span>
          <span class="camera-modal__badge">CAMERA + MICROPHONE</span>
        </header>
        <div class="camera-modal__preview">
          <video ref="video" autoplay muted playsinline aria-label="Live training camera" />
          <div class="camera-modal__overlay">
            <slot name="overlay" :result="analysisResult">
              <div class="camera-modal__label">
                <strong>{{ feedback || (isAnalyzing ? 'Waiting for backend feedback…' : 'Live camera preview') }}</strong>
              </div>
            </slot>
          </div>
        </div>
        <footer class="camera-modal__footer">
          <div class="camera-modal__status" role="status">
            <span>{{ isAnalyzing ? 'Video analysis running' : isStarting ? 'Connecting analysis…' : 'Camera ready' }} · {{ microphoneMuted ? 'Microphone muted' : 'Microphone active' }}</span>
            <span v-if="!endpoint">Analysis endpoint not configured.</span>
            <span v-if="error || mediaError" role="alert">{{ error || mediaError }}</span>
          </div>
          <Button variant="secondary" :aria-pressed="microphoneMuted" @click="toggleMicrophone">{{ microphoneMuted ? 'Unmute microphone' : 'Mute microphone' }}</Button>
          <Button v-if="isAnalyzing || isStarting" variant="primary" @click="stopAnalysis">Stop Video Analysis</Button>
          <Button v-else variant="primary" :disabled="!endpoint || !!mediaError" @click="startAnalysis">Start Video Analysis</Button>
          <Button variant="secondary" autofocus @click="close">Return to Training</Button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.camera-modal { box-sizing: border-box; position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: #07100c; color: #f4f7f5; font: 16px/1.55 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.camera-modal::backdrop { background: #000b; }
.camera-modal__layout { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; height: 100%; }
.camera-modal__header, .camera-modal__footer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 16px 25px; background: #08140e; }
.camera-modal__header { border-bottom: 1px solid rgba(255,255,255,.12); justify-content: space-between; }
.camera-modal__footer { border-top: 1px solid rgba(255,255,255,.12); max-height: 55dvh; overflow: auto; }
.camera-modal__brand { display: flex; align-items: center; gap: 10px; font-weight: 850; }
.camera-modal__logo { background: #b7ff4a; color: #07100c; border-radius: 11px; display: grid; place-items: center; font-size: 14px; width: 39px; height: 39px; }
.camera-modal__badge { border-radius: 100px; background: #244029; color: #b7ff4a; padding: 5px 11px; font-size: 12px; }
.camera-modal__preview { position: relative; min-height: 0; overflow: hidden; background: radial-gradient(circle at 45% 35%, #345340, #0b1c14 65%); }
.camera-modal__preview video { display: block; width: 100%; height: 100%; object-fit: contain; }
.camera-modal__overlay { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; padding: 16px; }
.camera-modal__label { background: #06100d9e; padding: 8px 12px; border-radius: 10px; max-width: 100%; overflow-wrap: anywhere; text-align: center; }
.camera-modal__label strong { color: #b7ff4a; }
.camera-modal__status { display: grid; color: #a8b5ae; flex: 1 1 240px; overflow-wrap: anywhere; }
@media (max-width: 530px) { .camera-modal__header, .camera-modal__footer { padding: 12px 18px; } .camera-modal__footer :deep(.button) { max-width: 100%; white-space: normal; } }
</style>
