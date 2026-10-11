<script setup>
import { ref } from 'vue'
import Button from '../../design/components/buttons/Button.vue'

defineProps({
  registerHref: { type: String, default: 'register.html' },
})

const email = ref('')
const password = ref('')
const message = ref('')

function submitLogin() {
  password.value = ''
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
          required
        />
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
          required
        />
      </div>
      <Button class="auth-submit" type="submit">Login</Button>
    </form>

    <div class="auth-divider"><span>or continue with</span></div>
    <div class="social-actions" aria-label="Social login options">
      <Button class="social-button" variant="secondary" @click="previewSocialLogin('Google')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/>
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10.1 10.1 0 0 0 12 22Z"/>
          <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z"/>
          <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.8A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z"/>
        </svg>
        Login with Google
      </Button>
      <Button class="social-button" variant="secondary" @click="previewSocialLogin('Facebook')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#1877F2" d="M24 12.1A12 12 0 1 0 10.1 24v-8.4h-3v-3.5h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.9V24A12 12 0 0 0 24 12.1Z"/>
        </svg>
        Login with Facebook
      </Button>
      <Button class="social-button" variant="secondary" @click="previewSocialLogin('Apple')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M17.1 12.7c0-2.7 2.2-4 2.3-4.1a5 5 0 0 0-3.9-2.1c-1.7-.2-3.2 1-4.1 1s-2.1-1-3.5-.9a5.2 5.2 0 0 0-4.4 2.7c-1.9 3.3-.5 8.1 1.3 10.7.9 1.3 2 2.7 3.4 2.6 1.3-.1 1.9-.9 3.5-.9s2.1.9 3.6.8c1.5 0 2.4-1.3 3.3-2.6a11.6 11.6 0 0 0 1.5-3.1 4.7 4.7 0 0 1-3-4.1ZM14.4 4.8A4.8 4.8 0 0 0 15.5 1a4.9 4.9 0 0 0-3.3 1.8A4.6 4.6 0 0 0 11 6.4a4 4 0 0 0 3.4-1.6Z"/>
        </svg>
        Login with Apple
      </Button>
    </div>

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
.auth-submit, .social-button { width: 100%; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 16px; color: var(--muted, #a8b5ae); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.auth-divider::before, .auth-divider::after { content: ''; height: 1px; flex: 1; background: var(--border, rgba(255,255,255,.12)); }
.social-actions { display: grid; gap: 10px; }
.social-button :deep(.button__content) { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
.social-button svg { width: 20px; height: 20px; flex: 0 0 20px; }
.auth-status { margin: 18px 0 0; padding: 12px 14px; border: 1px solid rgba(183,255,74,.38); border-radius: 12px; background: #1a3021; font-size: 13px; }
.auth-switch { margin: 22px 0 0; text-align: center; font-size: 14px; }
.auth-switch a { color: var(--accent, #b7ff4a); font-weight: 700; }
@media (max-width: 530px) { .auth-card { padding: 24px 18px; } }
</style>
