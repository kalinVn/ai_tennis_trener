import { ref, shallowRef, onScopeDispose } from 'vue'

export function useCameraSession() {
  const stream = shallowRef(null)
  const isRequesting = ref(false)
  const error = ref('')
  let request = 0

  function stopCamera() {
    request++
    stream.value?.getTracks().forEach(track => track.stop())
    stream.value = null
    isRequesting.value = false
  }

  async function startCamera() {
    if (isRequesting.value || stream.value) return
    error.value = ''
    isRequesting.value = true
    const current = ++request
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires HTTPS or localhost and a supported browser.')
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
      if (current !== request) { media.getTracks().forEach(track => track.stop()); return }
      if (!media.getVideoTracks().length || !media.getAudioTracks().length) {
        media.getTracks().forEach(track => track.stop())
        throw new Error('Both camera and microphone access are required.')
      }
      stream.value = media
    } catch (reason) {
      if (current === request) error.value = reason.message || 'Camera and microphone access failed.'
    } finally { if (current === request) isRequesting.value = false }
  }

  onScopeDispose(stopCamera)
  return { stream, isRequesting, error, startCamera, stopCamera }
}
