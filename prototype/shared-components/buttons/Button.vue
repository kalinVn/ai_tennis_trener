<script setup>
import { useButtonController } from '../../../prototypes/composables/ButtonController.js'
import './main.scss'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
const { isDisabled, handleClick } = useButtonController(props, emit)
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    :class="[
      'button',
      `button--${variant}`,
      `button--${size}`,
      { 'button--loading': loading },
    ]"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner" aria-hidden="true" />
    <span class="button__content"><slot /></span>
  </button>
</template>
