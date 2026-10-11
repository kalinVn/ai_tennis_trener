<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseModal from '../../modal/BaseModal.vue'
import TextButton from '../../../design/components/buttons/TextButton.vue'
import CookiePolicyContent from './CookiePolicyContent.vue'
import CookiePreferencesContent from './CookiePreferencesContent.vue'
import PrivacyChoicesBanner from './PrivacyChoicesBanner.vue'
import PrivacyPolicyContent from './PrivacyPolicyContent.vue'
import { useCookieConsent } from './useCookieConsent.js'

const {
  activeModal,
  analytics,
  isBannerVisible,
  marketing,
  preferences,
  acceptAll,
  closeModal,
  openCookiePolicy,
  openPreferences,
  openPrivacyPolicy,
  rejectAll,
  savePreferences,
} = useCookieConsent()

const legalTarget = ref(null)
const legalTargetKind = ref('footer')
const contentByModal = {
  preferences: CookiePreferencesContent,
  'cookie-policy': CookiePolicyContent,
  'privacy-policy': PrivacyPolicyContent,
}
const titleByModal = {
  preferences: 'Manage Cookie Preferences',
  'cookie-policy': 'Cookie Policy',
  'privacy-policy': 'Privacy Policy',
}
const activeComponent = computed(() => contentByModal[activeModal.value] || null)
const activeTitle = computed(() => titleByModal[activeModal.value] || 'Privacy Choices')
const activeContentProps = computed(() => activeModal.value === 'preferences' ? {
  analytics: analytics.value,
  preferences: preferences.value,
  marketing: marketing.value,
} : {})

let targetFrame
function resolveLegalTarget() {
  legalTarget.value = document.querySelector('.public-footer .footer-row')
  if (!legalTarget.value) {
    legalTarget.value = document.querySelector('.app-shell .sidebar')
    legalTargetKind.value = 'sidebar'
  } else {
    legalTargetKind.value = 'footer'
  }
}

onMounted(() => {
  // Page-specific Vue entries (Login/Register) replace their static fallback
  // during the same load. Resolve the legal target after that render settles.
  targetFrame = requestAnimationFrame(resolveLegalTarget)
})
onBeforeUnmount(() => cancelAnimationFrame(targetFrame))
</script>

<template>
  <PrivacyChoicesBanner
    v-if="isBannerVisible"
    @accept-all="acceptAll"
    @reject-all="rejectAll"
    @manage-preferences="openPreferences"
    @open-cookie-policy="openCookiePolicy"
    @open-privacy-policy="openPrivacyPolicy"
  />

  <BaseModal :open="Boolean(activeModal)" :title="activeTitle" @close="closeModal">
    <template #eyebrow>Your privacy choices</template>
    <component
      :is="activeComponent"
      v-if="activeComponent"
      v-bind="activeContentProps"
      @save="savePreferences"
    />
  </BaseModal>

  <Teleport v-if="legalTarget" :to="legalTarget">
    <nav
      class="privacy-legal-actions"
      :class="`privacy-legal-actions--${legalTargetKind}`"
      aria-label="Privacy and cookie settings"
    >
      <TextButton @click="openPrivacyPolicy">Privacy Policy</TextButton>
      <TextButton @click="openCookiePolicy">Cookie Policy</TextButton>
      <TextButton @click="openPreferences">Cookie Settings</TextButton>
    </nav>
  </Teleport>
</template>

<style scoped>
.privacy-legal-actions { display: flex; align-items: center; justify-content: flex-end; gap: 14px; flex-wrap: wrap; }
.privacy-legal-actions :deep(.text-button) { min-height: 36px; padding-block: 4px; font-size: 14px; }
.privacy-legal-actions--sidebar { display: grid; justify-items: start; gap: 2px; margin: 24px 12px 0; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.12); }
@media (max-width: 600px) {
  .privacy-legal-actions--footer { justify-content: flex-start; width: 100%; }
}
</style>
