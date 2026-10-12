<script setup>
import { computed } from 'vue'
import Button from '../../design/components/buttons/Button.vue'

const props = defineProps({
  provider: {
    type: String,
    required: true,
    validator: value => ['google', 'facebook', 'apple'].includes(value),
  },
  actionLabel: { type: String, default: 'Continue' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])

const providerLabel = computed(() => ({
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
})[props.provider])
</script>

<template>
  <Button class="social-auth-button" variant="secondary" :disabled="disabled" :loading="loading" @click="$emit('click', provider)">
    <svg v-if="provider === 'google'" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10.1 10.1 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.8A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z"/>
    </svg>
    <svg v-else-if="provider === 'facebook'" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.1A12 12 0 1 0 10.1 24v-8.4h-3v-3.5h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.9V24A12 12 0 0 0 24 12.1Z"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M17.1 12.7c0-2.7 2.2-4 2.3-4.1a5 5 0 0 0-3.9-2.1c-1.7-.2-3.2 1-4.1 1s-2.1-1-3.5-.9a5.2 5.2 0 0 0-4.4 2.7c-1.9 3.3-.5 8.1 1.3 10.7.9 1.3 2 2.7 3.4 2.6 1.3-.1 1.9-.9 3.5-.9s2.1.9 3.6.8c1.5 0 2.4-1.3 3.3-2.6a11.6 11.6 0 0 0 1.5-3.1 4.7 4.7 0 0 1-3-4.1ZM14.4 4.8A4.8 4.8 0 0 0 15.5 1a4.9 4.9 0 0 0-3.3 1.8A4.6 4.6 0 0 0 11 6.4a4 4 0 0 0 3.4-1.6Z"/>
    </svg>
    {{ loading ? `Connecting to ${providerLabel}…` : `${actionLabel} with ${providerLabel}` }}
  </Button>
</template>

<style scoped>
.social-auth-button { width: 100%; }
.social-auth-button :deep(.button__content) { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
.social-auth-button svg { width: 20px; height: 20px; flex: 0 0 20px; }
</style>
