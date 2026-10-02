import { createApp } from 'vue'
import TrainingCamera from '../components/training/TrainingCamera.vue'

const target = document.getElementById('training-camera-root')
if (target) {
  // Build-time prototype configuration. No endpoint means camera-only preview.
  createApp(TrainingCamera, { endpoint: import.meta.env.VITE_TRAINING_WS_URL || '' }).mount(target)
}
