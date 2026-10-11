<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value),
  },
})

defineEmits(['click'])
</script>

<template>
  <button class="text-button" :type="type" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped>
.text-button {
  min-height: 44px;
  padding: 8px 2px;
  border: 0;
  background: transparent;
  color: #b7ff4a;
  font: inherit;
  font-weight: 750;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  cursor: pointer;
}
.text-button:hover { color: #d7ff9a; }
.text-button:active { color: #65e8ff; }
.text-button:focus-visible { outline: 2px solid #65e8ff; outline-offset: 3px; border-radius: 4px; }
</style>
