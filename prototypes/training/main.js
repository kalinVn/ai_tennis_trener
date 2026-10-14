import { createApp } from 'vue'
import CameraPreviewModal from '../components/modal/CameraPreviewModal.vue'

const target = document.getElementById('camera-preview-modal-root')
if (target) {
  // Build-time prototype configuration. No endpoint means camera-only preview.
  createApp(CameraPreviewModal, { endpoint: import.meta.env.VITE_TRAINING_WS_URL || '' }).mount(target)
}
