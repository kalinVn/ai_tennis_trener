<script setup>
import { ref } from 'vue'
import Button from '../../design/components/buttons/Button.vue'

defineProps({
  loginHref: { type: String, default: 'login.html' },
})

const password = ref('')
const confirmPassword = ref('')
const message = ref('')

function submitRegistration() {
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords must match.'
    return
  }
  password.value = ''
  confirmPassword.value = ''
  message.value = 'Prototype only. No account was created and no details were sent.'
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
          <input id="register-first-name" name="first_name" type="text" autocomplete="given-name" placeholder="First name" required />
        </div>
        <div class="field">
          <label for="register-last-name">Surname</label>
          <input id="register-last-name" name="last_name" type="text" autocomplete="family-name" placeholder="Surname" required />
        </div>
        <div class="field wide">
          <label for="register-email">Email</label>
          <input id="register-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
        </div>
        <div class="field wide">
          <label for="register-phone">Phone</label>
          <input id="register-phone" name="phone" type="tel" autocomplete="tel" placeholder="+359 88 123 4567" required />
        </div>
        <div class="field">
          <label for="register-password">Password</label>
          <input id="register-password" v-model="password" name="password" type="password" autocomplete="new-password" placeholder="Create a password" minlength="12" required />
        </div>
        <div class="field">
          <label for="register-confirm-password">Confirm password</label>
          <input id="register-confirm-password" v-model="confirmPassword" name="confirm_password" type="password" autocomplete="new-password" placeholder="Repeat your password" minlength="12" required />
        </div>
        <label class="agreement wide" for="register-agreement">
          <input id="register-agreement" name="agreement" type="checkbox" required />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
      </div>
      <Button class="auth-submit" type="submit">Create Account</Button>
    </form>

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
.auth-status { margin: 18px 0 0; padding: 12px 14px; border: 1px solid rgba(183,255,74,.38); border-radius: 12px; background: #1a3021; font-size: 13px; }
.auth-switch { margin: 22px 0 0; text-align: center; font-size: 14px; }
.auth-switch a { color: var(--accent, #b7ff4a); font-weight: 700; }
@media (max-width: 620px) { .auth-card { padding: 24px 18px; } .form-grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
</style>
