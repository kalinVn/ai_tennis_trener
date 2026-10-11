import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

export const COOKIE_CONSENT_STORAGE_KEY = 'tennis-ai-coach.cookie-consent.v1'
const CONSENT_VERSION = 1

function validConsent(value) {
  const categories = value?.categories
  return value?.version === CONSENT_VERSION &&
    (value?.decided === true || typeof value?.choice === 'string') &&
    categories?.essential === true &&
    typeof categories.analytics === 'boolean' &&
    typeof categories.preference === 'boolean' &&
    typeof categories.marketing === 'boolean'
}

export function useCookieConsent(storageKey = COOKIE_CONSENT_STORAGE_KEY) {
  const activeModal = ref(null)
  const decided = ref(false)
  const categories = reactive({
    essential: true,
    analytics: false,
    preferences: false,
    marketing: false,
  })
  const isBannerVisible = computed(() => !decided.value)

  function readConsent() {
    if (typeof window === 'undefined') return null
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey))
      return validConsent(value) ? value : null
    } catch {
      return null
    }
  }

  function loadConsent() {
    const stored = readConsent()
    decided.value = Boolean(stored)
    categories.essential = true
    categories.analytics = stored?.categories.analytics ?? false
    categories.preferences = stored?.categories.preference ?? false
    categories.marketing = stored?.categories.marketing ?? false
    return stored
  }

  function persist(choice, optionalCategories) {
    categories.essential = true
    categories.analytics = Boolean(optionalCategories.analytics)
    categories.preferences = Boolean(optionalCategories.preferences)
    categories.marketing = Boolean(optionalCategories.marketing)
    decided.value = true
    const consent = {
      version: CONSENT_VERSION,
      decided: true,
      choice,
      categories: {
        essential: true,
        analytics: categories.analytics,
        preference: categories.preferences,
        marketing: categories.marketing,
      },
      updatedAt: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(consent))
    } catch {
      // The current interaction still completes if storage is unavailable.
    }
    activeModal.value = null
    return consent
  }

  function acceptAll() {
    return persist('accept_all', { analytics: true, preferences: true, marketing: true })
  }

  function rejectAll() {
    return persist('reject_all', { analytics: false, preferences: false, marketing: false })
  }

  function savePreferences(selection) {
    return persist('custom', selection)
  }

  function openPreferences() {
    loadConsent()
    activeModal.value = 'preferences'
  }

  function openCookiePolicy() {
    activeModal.value = 'cookie-policy'
  }

  function openPrivacyPolicy() {
    activeModal.value = 'privacy-policy'
  }

  function closeModal() {
    activeModal.value = null
  }

  function syncStorage(event) {
    if (event.key === storageKey) loadConsent()
  }

  loadConsent()
  onMounted(() => window.addEventListener('storage', syncStorage))
  onBeforeUnmount(() => window.removeEventListener('storage', syncStorage))

  return {
    activeModal,
    analytics: computed(() => categories.analytics),
    decided,
    essential: computed(() => categories.essential),
    isBannerVisible,
    marketing: computed(() => categories.marketing),
    preferences: computed(() => categories.preferences),
    acceptAll,
    closeModal,
    loadConsent,
    openCookiePolicy,
    openPreferences,
    openPrivacyPolicy,
    rejectAll,
    savePreferences,
  }
}
