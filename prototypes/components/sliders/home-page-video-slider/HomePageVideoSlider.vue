<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createHomePageVideoSlider } from './slider.js'
import videoUrl from './assets/2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_04.webm'

const root = ref(null)
let slider
onMounted(() => { slider = createHomePageVideoSlider(root.value) })
onBeforeUnmount(() => { slider?.destroy() })
</script>

<template>
<div ref="root" class="court video-demo-court" data-slider="video-demo-court">
<div class="real-video-viewport">
<!-- Video: NaBUru38 / Wikimedia Commons, CC BY-SA 4.0; blurred with illustrative overlays. See components/home_page_slider/README.md for attribution. -->
<video class="real-video" data-slider="rally-video" :src="videoUrl" muted loop playsinline preload="metadata" aria-label="Blurred tennis rally demonstration">


</video>
<div class="video-shade"></div>
<canvas class="freeze-points" data-slider="freeze-points" aria-hidden="true"></canvas>
</div>
<div class="video-overlay-top">
<span class="video-pill"><strong>●</strong> Camera · Connected</span>
<span class="video-pill"><strong>●</strong> Analysis · Active</span>
<span class="video-pill"><strong>●</strong> Audio · Connected</span>
</div>
<div class="coaching-audio" data-slider="coaching-audio" data-active="false">
<div class="coaching-mic" role="img" aria-label="Coaching audio feedback" title="Coaching feedback">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>
</div>
<p class="coaching-message" aria-live="off"><span data-slider="coaching-message" hidden></span><span class="coaching-waiting" aria-label="Analyzing">•••</span></p>
</div>
<aside class="ai-telemetry" aria-label="Illustrative motion tracking preview">
<h3>● AI MOTION TRACKING</h3>
<div class="ai-row"><span>Mode</span><strong>Serve preview</strong></div>
<div class="ai-row"><span>Overlay</span><strong>Arm / leg</strong></div>
<div class="ai-row"><span>Phase</span><strong data-slider="tracking-phase">READY</strong></div>
</aside>
<div data-slider="video-load-error" class="video-load-error" hidden>Video unavailable.</div>
</div>
</template>

<style scoped src="./slider.css"></style>
