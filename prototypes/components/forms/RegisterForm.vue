<script setup>
import { ref } from 'vue'
import Button from '../../design/components/buttons/Button.vue'
import { hasValidationErrors, validateRegistration } from '../../utils/validators/authValidators.js'
import RecaptchaField from '../fields/RecaptchaField.vue'
import SocialAuthButtons from './SocialAuthButtons.vue'

defineProps({
  loginHref: { type: String, default: 'login.html' },
})

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const legalConsentAccepted = ref(false)
const recaptchaVerified = ref(false)
const message = ref('')
const errors = ref({})

function submitRegistration() {
  errors.value = validateRegistration({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    legalConsentAccepted: legalConsentAccepted.value,
    recaptchaVerified: recaptchaVerified.value,
  })
  if (hasValidationErrors(errors.value)) {
    message.value = 'Check the highlighted fields and try again.'
    return
  }
  password.value = ''
  confirmPassword.value = ''
  recaptchaVerified.value = false
  message.value = 'Prototype only. No account was created and no details were sent.'
}

function previewSocialRegistration(provider) {
  if (!legalConsentAccepted.value) {
    message.value = 'Accept the Terms of Service and Privacy Policy before continuing.'
    return
  }
  message.value = `${provider} registration is a visual prototype only. No OAuth flow was started.`
}
</script>

<template>
  <section class="auth-card" aria-labelledby="register-title">
    <div class="eyebrow">Start free</div>
    <h1 id="register-title">Create Account</h1>
    <p class="auth-intro">Create your Tennis AI Coach profile.</p>

    <form @submit.prevent="submitRegistration">
      <div class="form-grid">
        <div class="field">
          <label for="register-first-name">First name</label>
          <input id="register-first-name" v-model="firstName" name="first_name" type="text" autocomplete="given-name" placeholder="First name" :aria-invalid="Boolean(errors.firstName)" aria-describedby="register-first-name-error" required />
          <p v-if="errors.firstName" id="register-first-name-error" class="field-error">{{ errors.firstName }}</p>
        </div>
        <div class="field">
          <label for="register-last-name">Surname</label>
          <input id="register-last-name" v-model="lastName" name="last_name" type="text" autocomplete="family-name" placeholder="Surname" :aria-invalid="Boolean(errors.lastName)" aria-describedby="register-last-name-error" required />
          <p v-if="errors.lastName" id="register-last-name-error" class="field-error">{{ errors.lastName }}</p>
        </div>
        <div class="field wide">
          <label for="register-email">Email</label>
          <input id="register-email" v-model="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" :aria-invalid="Boolean(errors.email)" aria-describedby="register-email-error" required />
          <p v-if="errors.email" id="register-email-error" class="field-error">{{ errors.email }}</p>
        </div>
        <div class="field wide">
          <label for="register-phone">Phone</label>
          <input id="register-phone" v-model="phone" name="phone" type="tel" autocomplete="tel" placeholder="+359 88 123 4567" :aria-invalid="Boolean(errors.phone)" aria-describedby="register-phone-error" required />
          <p v-if="errors.phone" id="register-phone-error" class="field-error">{{ errors.phone }}</p>
        </div>
        <div class="field">
          <label for="register-password">Password</label>
          <input id="register-password" v-model="password" name="password" type="password" autocomplete="new-password" placeholder="Create a password" minlength="12" :aria-invalid="Boolean(errors.password)" aria-describedby="register-password-error" required />
          <p v-if="errors.password" id="register-password-error" class="field-error">{{ errors.password }}</p>
        </div>
        <div class="field">
          <label for="register-confirm-password">Confirm password</label>
          <input id="register-confirm-password" v-model="confirmPassword" name="confirm_password" type="password" autocomplete="new-password" placeholder="Repeat your password" minlength="12" :aria-invalid="Boolean(errors.confirmPassword)" aria-describedby="register-confirm-password-error" required />
          <p v-if="errors.confirmPassword" id="register-confirm-password-error" class="field-error">{{ errors.confirmPassword }}</p>
        </div>
        <label class="agreement wide" for="register-agreement">
          <input id="register-agreement" v-model="legalConsentAccepted" name="agreement" type="checkbox" required />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        <p v-if="errors.legalConsent" class="field-error wide">{{ errors.legalConsent }}</p>
        <div class="wide">
          <RecaptchaField id="register-recaptcha" v-model="recaptchaVerified" />
          <p v-if="errors.recaptcha" class="field-error">{{ errors.recaptcha }}</p>
        </div>
      </div>
      <Button class="auth-submit" type="submit">Create Account</Button>
    </form>

    <div class="auth-divider"><span>or continue with</span></div>
    <SocialAuthButtons action-label="Continue" @select="previewSocialRegistration" />

    <p v-if="message" class="auth-status" role="status" aria-live="polite">{{ message }}</p>
    <p class="auth-switch">Already have an account? <a :href="loginHref">Login</a></p>
  </section>
</template>

<style scoped>
.auth-card { box-sizing: border-box; width: min(620px, 100%); padding: 30px; border: 1px solid var(--border, rgba(255,255,255,.12)); border-radius: 24px; background: var(--panel, #0d1913); }
h1 { margin: 0 0 10px; font-size: clamp(36px, 8vw, 52px); }
.auth-intro { margin-bottom: 24px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.field { display: grid; gap: 7px; margin: 0; }
.wide { grid-column: 1 / -1; }
label { color: var(--muted, #a8b5ae); font-size: 13px; }
input:not([type='checkbox']) { box-sizing: border-box; width: 100%; height: 51px; padding: 12px 14px; border: 1px solid var(--border, rgba(255,255,255,.12)); border-radius: 12px; background: #09130e; color: var(--text, #f4f7f5); font: inherit; }
input:focus-visible, a:focus-visible { outline: 2px solid var(--accent2, #65e8ff); outline-offset: 2px; }
.agreement { display: flex; align-items: flex-start; gap: 11px; color: var(--text, #f4f7f5); }
.agreement input { width: 16px; height: 16px; margin: 3px 0 0; accent-color: var(--accent, #b7ff4a); }
.auth-submit { width: 100%; margin-top: 22px; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 16px; color: var(--muted, #a8b5ae); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.auth-divider::before, .auth-divider::after { content: ''; height: 1px; flex: 1; background: var(--border, rgba(255,255,255,.12)); }
.auth-status { margin: 18px 0 0; padding: 12px 14px; border: 1px solid rgba(183,255,74,.38); border-radius: 12px; background: #1a3021; font-size: 13px; }
.field-error { margin: 0; color: #ff9b9b; font-size: 12px; }
.auth-switch { margin: 22px 0 0; text-align: center; font-size: 14px; }
.auth-switch a { color: var(--accent, #b7ff4a); font-weight: 700; }
@media (max-width: 620px) { .auth-card { padding: 24px 18px; } .form-grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
</style>
