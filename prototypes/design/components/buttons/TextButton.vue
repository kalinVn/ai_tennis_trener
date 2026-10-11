<script setup>
import './text-button.scss'

defineProps({
  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tone: {
    type: String,
    default: 'accent',
    validator: value => ['accent', 'inherit'].includes(value),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :class="['text-button', `text-button--${tone}`]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
