<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineProps({
  trainingHref: { type: String, default: 'training.html' },
  dashboardHref: { type: String, default: 'dashboard.html' },
})
const copy = ref(null)
let observer
function alignHeadline() {
  if (!copy.value) return
  for (const name of ['win', 'train']) {
    const width = copy.value.querySelector(`[data-align="${name}"]`).getBoundingClientRect().width
    copy.value.style.setProperty(`--${name}-boundary`, `${width}px`)
  }
}
onMounted(() => {
  alignHeadline()
  observer = new ResizeObserver(alignHeadline)
  observer.observe(copy.value.querySelector('h1'))
  window.addEventListener('resize', alignHeadline)
  document.fonts.ready.then(alignHeadline)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', alignHeadline)
})
</script>

<template>
<div ref="copy" class="hero-copy">
<div class="eyebrow">● Live AI coaching · Camera-first training</div>
<h1><span data-align="train">Train smarter.</span><br>Move better.<br><span data-align="win" style="color:var(--accent)">Win more.</span></h1>
<p>Your camera becomes a private tennis coach. Analyze movement, review key moments, and receive focused feedback without turning the interface into a cockpit.</p>
<div class="cta">
<a class="btn primary" :href="trainingHref">Start training</a>
<a class="btn" :href="dashboardHref">Open dashboard</a>
</div>
<div class="stats">
<div class="stat"><strong>&lt; 1s</strong><span>Target feedback loop</span></div>
<div class="stat"><strong>Live</strong><span>Camera analysis UI</span></div>
<div class="stat"><strong>1 cue</strong><span>At the right moment</span></div>
</div>
</div>
</template>

<style scoped>
.hero-copy {position:relative;z-index:2;min-width:0}
</style>
