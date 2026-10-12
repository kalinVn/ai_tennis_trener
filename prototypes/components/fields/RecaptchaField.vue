<script setup>
defineProps({
  id: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="recaptcha-field">
    <label class="recaptcha-field__check" :for="id">
      <input
        :id="id"
        name="recaptcha_confirmation"
        type="checkbox"
        :checked="modelValue"
        required
        :aria-describedby="`${id}-note`"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span>I'm not a robot</span>
    </label>
    <div class="recaptcha-field__brand" aria-hidden="true">
      <span class="recaptcha-field__mark">↻</span>
      <strong>reCAPTCHA</strong>
      <small>Privacy · Terms</small>
    </div>
  </div>
  <p :id="`${id}-note`" class="recaptcha-field__note">
    Visual prototype. Production must use a provider token verified by the backend.
  </p>
</template>

<style scoped>
.recaptcha-field { box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 78px; padding: 12px 14px; border: 1px solid #c9c9c9; border-radius: 4px; background: #f9f9f9; color: #1f1f1f; }
.recaptcha-field__check { display: flex; align-items: center; gap: 12px; color: #1f1f1f; font-size: 15px; cursor: pointer; }
.recaptcha-field__check input { width: 28px; height: 28px; margin: 0; accent-color: #1a73e8; }
.recaptcha-field__check input:focus-visible { outline: 3px solid #65e8ff; outline-offset: 3px; }
.recaptcha-field__brand { display: grid; justify-items: center; flex: 0 0 auto; color: #555; line-height: 1.05; }
.recaptcha-field__mark { color: #1a73e8; font-size: 28px; line-height: 1; }
.recaptcha-field__brand strong { font-size: 11px; font-weight: 600; }
.recaptcha-field__brand small { margin-top: 3px; font-size: 9px; }
.recaptcha-field__note { margin: 6px 0 0; color: var(--muted, #a8b5ae); font-size: 11px; }
@media (max-width: 380px) {
  .recaptcha-field { gap: 8px; padding-inline: 10px; }
  .recaptcha-field__check { gap: 8px; font-size: 14px; }
}
</style>
