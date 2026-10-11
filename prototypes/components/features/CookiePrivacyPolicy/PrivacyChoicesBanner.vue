<script setup>
import Button from '../../../design/components/buttons/Button.vue'
import TextButton from '../../../design/components/buttons/TextButton.vue'

defineEmits(['accept-all', 'reject-all', 'manage-preferences', 'open-cookie-policy', 'open-privacy-policy'])
</script>

<template>
  <aside class="privacy-banner" aria-label="Cookie consent" role="region">
    <div class="privacy-banner__inner">
      <div class="privacy-banner__copy">
        <div class="privacy-banner__eyebrow">Your privacy choices</div>
        <h2>Cookies and related technologies</h2>
        <p>We use essential cookies for the application to work and, with your choice, cookies for analytics, preferences, and marketing or tracking.</p>
        <div class="privacy-banner__links">
          <TextButton @click="$emit('open-cookie-policy')">Cookie Policy</TextButton>
          <TextButton @click="$emit('open-privacy-policy')">Privacy Policy</TextButton>
        </div>
      </div>
      <div class="privacy-banner__actions">
        <Button variant="primary" @click="$emit('accept-all')">Accept All</Button>
        <Button variant="secondary" @click="$emit('reject-all')">Reject All</Button>
        <Button variant="ghost" aria-haspopup="dialog" @click="$emit('manage-preferences')">Manage Preferences</Button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.privacy-banner { box-sizing: border-box; position: fixed; z-index: 90; right: 0; bottom: 0; left: 0; width: 100%; margin: 0; padding: 18px max(18px, calc((100vw - 1120px) / 2)); border: 0; border-top: 1px solid rgba(255,255,255,.16); border-radius: 0; background: rgba(13,25,19,.94); box-shadow: 0 -10px 30px rgba(0,0,0,.25); backdrop-filter: blur(12px); color: #f4f7f5; font: 16px/1.55 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.privacy-banner__inner { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 24px; max-width: 1120px; margin: 0 auto; }
.privacy-banner__copy { min-width: 0; }
.privacy-banner__eyebrow { margin-bottom: 4px; color: #b7ff4a; font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.privacy-banner h2 { margin: 0 0 6px; font-size: 21px; letter-spacing: -.02em; }
.privacy-banner p { margin: 0; color: #a8b5ae; }
.privacy-banner__links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 2px; }
.privacy-banner__actions { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
@media (max-width: 820px) {
  .privacy-banner__inner { grid-template-columns: 1fr; align-items: start; }
  .privacy-banner__actions { justify-content: stretch; }
  .privacy-banner__actions :deep(.button) { flex: 1 1 180px; }
}
@media (max-width: 600px) {
  .privacy-banner { max-height: 100dvh; overflow-y: auto; padding: 16px; }
  .privacy-banner__actions { display: grid; }
  .privacy-banner__actions :deep(.button) { width: 100%; min-height: 48px; }
}
</style>
