<script setup>
import { ref } from 'vue'
import Button from '../../design/components/buttons/Button.vue'
import { hasValidationErrors, validateLogin } from '../../utils/validators/authValidators.js'
import RecaptchaField from '../fields/RecaptchaField.vue'
import SocialAuthButtons from './SocialAuthButtons.vue'

defineProps({
  registerHref: { type: String, default: 'register.html' },
})

const email = ref('')
const password = ref('')
const recaptchaVerified = ref(false)
const message = ref('')
const errors = ref({})

function submitLogin() {
  errors.value = validateLogin({
    email: email.value,
    password: password.value,
    recaptchaVerified: recaptchaVerified.value,
  })
  if (hasValidationErrors(errors.value)) {
    message.value = 'Check the highlighted fields and try again.'
    return
  }
  password.value = ''
  recaptchaVerified.value = false
  message.value = 'Prototype only. No credentials were sent and no session was created.'
}

function previewSocialLogin(provider) {
  message.value = `${provider} login is a visual prototype only. No OAuth flow was started.`
}
</script>

<template>
  <section class="auth-card" aria-labelledby="login-title">
    <div class="eyebrow">Welcome back</div>
    <h1 id="login-title">Login</h1>
    <p class="auth-intro">Sign in to continue to your tennis workspace.</p>

    <form @submit.prevent="submitLogin">
      <div class="field">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          :aria-invalid="Boolean(errors.email)"
          aria-describedby="login-email-error"
          required
        />
        <p v-if="errors.email" id="login-email-error" class="field-error">{{ errors.email }}</p>
      </div>
      <div class="field">
        <label for="login-password">Password</label>
        <input
          id="login-password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          placeholder="Enter your password"
          :aria-invalid="Boolean(errors.password)"
          aria-describedby="login-password-error"
          required
        />
        <p v-if="errors.password" id="login-password-error" class="field-error">{{ errors.password }}</p>
      </div>
      <RecaptchaField id="login-recaptcha" v-model="recaptchaVerified" />
      <p v-if="errors.recaptcha" class="field-error">{{ errors.recaptcha }}</p>
      <Button class="auth-submit" type="submit">Login</Button>
    </form>

    <div class="auth-divider"><span>or continue with</span></div>
    <SocialAuthButtons action-label="Login" @select="previewSocialLogin" />

    <p v-if="message" class="auth-status" role="status" aria-live="polite">{{ message }}</p>
    <p class="auth-switch">New to Tennis AI Coach? <a :href="registerHref">Create Account</a></p>
  </section>
</template>

<style scoped>
.auth-card { box-sizing: border-box; width: min(460px, 100%); padding: 30px; border: 1px solid var(--border, rgba(255,255,255,.12)); border-radius: 24px; background: var(--panel, #0d1913); }
h1 { margin: 0 0 10px; font-size: clamp(36px, 8vw, 52px); }
.auth-intro { margin-bottom: 24px; }
.field { display: grid; gap: 7px; margin-bottom: 18px; }
label { color: var(--muted, #a8b5ae); font-size: 13px; }
input { box-sizing: border-box; width: 100%; height: 51px; padding: 12px 14px; border: 1px solid var(--border, rgba(255,255,255,.12)); border-radius: 12px; background: #09130e; color: var(--text, #f4f7f5); font: inherit; }
input:focus-visible, a:focus-visible { outline: 2px solid var(--accent2, #65e8ff); outline-offset: 2px; }
.auth-submit { width: 100%; }
.auth-submit { margin-top: 18px; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 16px; color: var(--muted, #a8b5ae); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.auth-divider::before, .auth-divider::after { content: ''; height: 1px; flex: 1; background: var(--border, rgba(255,255,255,.12)); }
.auth-status { margin: 18px 0 0; padding: 12px 14px; border: 1px solid rgba(183,255,74,.38); border-radius: 12px; background: #1a3021; font-size: 13px; }
.field-error { margin: 0; color: #ff9b9b; font-size: 12px; }
.auth-switch { margin: 22px 0 0; text-align: center; font-size: 14px; }
.auth-switch a { color: var(--accent, #b7ff4a); font-weight: 700; }
@media (max-width: 530px) { .auth-card { padding: 24px 18px; } }
</style>
