<script setup>
import Button from '../../design/components/buttons/Button.vue'
import CameraPreviewModal from '../modal/CameraPreviewModal.vue'
import { useCameraSession } from '../../composables/useCameraSession.js'

defineProps({ endpoint: { type: String, default: '' } })
const { stream, isRequesting, error, startCamera, stopCamera } = useCameraSession()
</script>

<template>
  <div class="training-camera">
    <Button variant="primary" :loading="isRequesting" @click="startCamera">{{ isRequesting ? 'Requesting camera and microphone…' : 'Start Training' }}</Button>
    <Button v-if="isRequesting" variant="secondary" @click="stopCamera">Cancel</Button>
    <p v-if="error" role="alert">{{ error }}</p>
    <CameraPreviewModal v-if="stream" :stream="stream" :endpoint="endpoint" @close="stopCamera" />
  </div>
</template>

<style scoped>
.training-camera { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.training-camera p { width: 100%; margin: 0; color: #a8b5ae; }
</style>
