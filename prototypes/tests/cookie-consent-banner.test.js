import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const feature = 'components/features/CookiePrivacyPolicy/'

test('CookiePrivacyPolicy is one public feature composed from focused internal components', () => {
  for (const file of [
    'CookiePrivacyPolicy.vue',
    'PrivacyChoicesBanner.vue',
    'CookiePolicyContent.vue',
    'PrivacyPolicyContent.vue',
    'CookiePreferencesContent.vue',
    'mountCookiePrivacyPolicy.js',
    'useCookieConsent.js',
  ]) assert.ok(existsSync(new URL(feature + file, root)), file)

  const source = read(feature + 'CookiePrivacyPolicy.vue')
  assert.match(source, /BaseModal/)
  assert.match(source, /PrivacyChoicesBanner/)
  assert.match(source, /<component/)
  assert.match(source, /:is="activeComponent"/)
  assert.match(source, /Cookie Settings/)
  assert.match(source, /TextButton/)
  assert.match(source, /useCookieConsent/)

  const banner = read(feature + 'PrivacyChoicesBanner.vue')
  for (const action of ['Accept All', 'Reject All', 'Manage Preferences', 'Cookie Policy', 'Privacy Policy']) {
    assert.match(banner, new RegExp(action))
  }
  assert.match(banner, /position: fixed/)
  assert.match(banner, /width: 100%/)
  assert.match(banner, /border-radius: 0/)
})

test('shared BaseModal and TextButton stay presentation-only and accessible', () => {
  const modal = read('components/modal/BaseModal.vue')
  assert.match(modal, /<dialog/)
  assert.match(modal, /@cancel\.prevent="close"/)
  assert.match(modal, /showModal\(\)/)
  assert.match(modal, /overflow-y: auto/)
  assert.match(modal, /overflow-x: hidden/)
  assert.match(modal, /scrollbar-color:/)
  assert.doesNotMatch(modal, /cookie|localStorage/i)

  const textButton = read('design/components/buttons/TextButton.vue')
  const textButtonStyles = read('design/components/buttons/text-button.scss')
  assert.match(textButton, /<button/)
  assert.match(textButton, /<slot/)
  assert.match(textButton, /defineEmits\(\['click'\]\)/)
  assert.match(textButton, /:disabled="disabled"/)
  assert.match(textButton, /text-button--\$\{tone\}/)
  assert.match(textButtonStyles, /focus-visible/)
  assert.match(textButtonStyles, /:disabled/)
  assert.doesNotMatch(textButton, /cookie|localStorage|loading/i)
})

test('TextButton and BaseModal have live, generic component prototypes', () => {
  const textButtonPrototype = read('design/components/buttons/text-button.html')
  const textButtonMount = read('design/components/buttons/text-button.js')
  assert.match(textButtonPrototype, /text-button\.js/)
  assert.match(textButtonMount, /Cookie Policy/)
  assert.match(textButtonMount, /Privacy Policy/)
  assert.match(textButtonMount, /Cookie Settings/)
  assert.match(textButtonMount, /Manage Preferences/)

  const modalPrototype = read('design/components/modals.html')
  const modalMount = read('components/modal/baseModalPrototype.js')
  assert.match(modalPrototype, /baseModalPrototype\.js/)
  assert.match(modalMount, /BaseModal/)
  assert.match(modalMount, /activeContent/)
  assert.match(modalMount, /Scrollable custom content/)
  assert.doesNotMatch(modalMount, /cookie|privacy|localStorage/i)
})

test('feature-local consent state preserves the existing versioned storage contract', () => {
  const consent = read(feature + 'useCookieConsent.js')
  assert.match(consent, /tennis-ai-coach\.cookie-consent\.v1/)
  assert.match(consent, /essential: true/)
  assert.match(consent, /accept_all/)
  assert.match(consent, /reject_all/)
  assert.match(consent, /analytics: false, preferences: false, marketing: false/)
  assert.match(consent, /window\.localStorage\.setItem/)
  assert.match(consent, /activeModal\.value = null/)

  const preferences = read(feature + 'CookiePreferencesContent.vue')
  assert.match(preferences, /checked disabled/)
  assert.match(preferences, /v-model="selection\.analytics"/)
  assert.match(preferences, /v-model="selection\.preferences"/)
  assert.match(preferences, /v-model="selection\.marketing"/)
  assert.match(preferences, /Save Preferences/)

  assert.match(read(feature + 'CookiePolicyContent.vue'), /Opening or closing this policy does not save a consent decision/)
  assert.match(read(feature + 'PrivacyPolicyContent.vue'), /Your rights and choices/)
})

test('the shared HTML shell mounts the Vue feature across both layout families', () => {
  const shell = read('design/app.js')
  assert.match(shell, /CookiePrivacyPolicy\/mountCookiePrivacyPolicy\.js/)
  assert.match(shell, /cookiePrivacyApp\.js/)
  assert.match(shell, /location\.protocol !== 'file:'/)
  assert.match(shell, /direct-file preview fallback/)
  assert.match(read(feature + 'mountCookiePrivacyPolicy.js'), /CookiePrivacyPolicy/)

  for (const page of ['index.html', 'features.html', 'pricing.html', 'login.html', 'register.html', 'dashboard.html', 'training.html', 'history.html', 'subscription.html', 'profile.html', 'settings.html', 'checkout.html', 'not-found.html']) {
    assert.match(read(`design/pages/${page}`), /src="\.\.\/app\.js"/)
  }

  assert.equal(existsSync(new URL('design/pages/cookie-policy.html', root)), false)
  assert.equal(existsSync(new URL('design/pages/privacy-policy.html', root)), false)
})

test('prototype specimen and documentation reference the public feature', () => {
  const specimen = read('design/components/cookie-consent-banner.html')
  assert.match(specimen, /CookiePrivacyPolicy/)
  assert.doesNotMatch(specimen, /CookieConsentBanner/)

  const docs = read('../docs/frontend/components.md')
  assert.match(docs, /### CookiePrivacyPolicy/)
  assert.match(docs, /BaseModal/)
  assert.match(docs, /TextButton/)
  assert.match(docs, /useCookieConsent/)
  assert.match(docs, /buttons\/text-button\.html/)
  assert.match(docs, /components\/modals\.html/)
})
