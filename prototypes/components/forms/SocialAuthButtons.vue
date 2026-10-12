<script setup>
import SocialAuthButton from './SocialAuthButton.vue'

defineProps({
  actionLabel: { type: String, default: 'Continue' },
  disabled: { type: Boolean, default: false },
  pendingProvider: {
    type: String,
    default: '',
    validator: value => ['', 'google', 'facebook', 'apple'].includes(value),
  },
})

defineEmits(['select'])

const providers = ['google', 'facebook', 'apple']
</script>

<template>
  <div class="social-actions" aria-label="Social authentication options">
    <SocialAuthButton
      v-for="provider in providers"
      :key="provider"
      :provider="provider"
      :action-label="actionLabel"
      :disabled="disabled || Boolean(pendingProvider)"
      :loading="pendingProvider === provider"
      @click="$emit('select', provider)"
    />
  </div>
</template>

<style scoped>
.social-actions { display: grid; gap: 10px; }
</style>
