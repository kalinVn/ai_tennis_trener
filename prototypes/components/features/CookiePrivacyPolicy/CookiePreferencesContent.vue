<script setup>
import { reactive, watch } from 'vue'
import Button from '../../../design/components/buttons/Button.vue'

const props = defineProps({
  analytics: { type: Boolean, default: false },
  preferences: { type: Boolean, default: false },
  marketing: { type: Boolean, default: false },
})
const emit = defineEmits(['save'])
const selection = reactive({
  analytics: props.analytics,
  preferences: props.preferences,
  marketing: props.marketing,
})

watch(() => [props.analytics, props.preferences, props.marketing], ([analytics, preferences, marketing]) => {
  selection.analytics = analytics
  selection.preferences = preferences
  selection.marketing = marketing
})

function save() {
  emit('save', { ...selection })
}
</script>

<template>
  <form class="cookie-preferences" @submit.prevent="save">
    <div class="cookie-preferences__grid">
      <label class="cookie-category">
        <span class="cookie-category__heading"><span>Essential</span><span class="cookie-category__pill">Required</span></span>
        <span>Authentication, sessions, security, consent storage, and core application functionality.</span>
        <input type="checkbox" checked disabled aria-label="Essential cookies are always enabled" />
      </label>
      <label class="cookie-category">
        <span class="cookie-category__heading">Analytics</span>
        <span>Anonymous or aggregated product usage, performance, and error measurement.</span>
        <input v-model="selection.analytics" type="checkbox" />
      </label>
      <label class="cookie-category">
        <span class="cookie-category__heading">Preferences</span>
        <span>Optional interface, language, accessibility, and experience settings.</span>
        <input v-model="selection.preferences" type="checkbox" />
      </label>
      <label class="cookie-category">
        <span class="cookie-category__heading">Marketing</span>
        <span>Optional campaign measurement, remarketing, and advertising-related activity.</span>
        <input v-model="selection.marketing" type="checkbox" />
      </label>
    </div>
    <footer class="cookie-preferences__footer">
      <p>Your choice is stored in this browser. Rejecting optional categories does not block core application functionality.</p>
      <Button type="submit" variant="primary">Save Preferences</Button>
    </footer>
  </form>
</template>

<style scoped>
.cookie-preferences { margin: 0; }
.cookie-preferences__grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; padding: 22px; }
.cookie-category { position: relative; display: grid; gap: 6px; min-width: 0; padding: 15px 52px 15px 15px; border: 1px solid rgba(255,255,255,.12); border-radius: 14px; background: #09150f; color: #a8b5ae; cursor: pointer; }
.cookie-category:has(input:disabled) { cursor: default; }
.cookie-category__heading { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; color: #f4f7f5; font-weight: 750; }
.cookie-category__pill { padding: 3px 8px; border-radius: 999px; background: #244029; color: #b7ff4a; font-size: 11px; text-transform: uppercase; }
.cookie-category input { position: absolute; top: 17px; right: 17px; width: 18px; height: 18px; margin: 0; accent-color: #b7ff4a; }
.cookie-category:focus-within { outline: 2px solid #65e8ff; outline-offset: 3px; }
.cookie-preferences__footer { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 20px 22px; border-top: 1px solid rgba(255,255,255,.12); }
.cookie-preferences__footer p { margin: 0; color: #a8b5ae; font-size: 13px; }
.cookie-preferences__footer :deep(.button) { flex: 0 0 auto; white-space: nowrap; }
@media (max-width: 600px) {
  .cookie-preferences__grid { grid-template-columns: 1fr; padding: 18px; }
  .cookie-preferences__footer { align-items: stretch; flex-direction: column; padding: 18px; }
  .cookie-preferences__footer :deep(.button) { width: 100%; min-height: 48px; }
}
</style>
