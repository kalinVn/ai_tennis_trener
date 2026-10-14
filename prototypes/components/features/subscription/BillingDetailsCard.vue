<script setup>
import Button from '../../../design/components/buttons/Button.vue'

defineProps({
  title: { type: String, default: 'Billing details' },
  renewalText: { type: String, required: true },
  paymentMethodText: { type: String, required: true },
  actionLabel: { type: String, default: 'Manage billing' },
})
const emit = defineEmits(['action'])
</script>

<template>
  <section class="panel billing-details-card">
    <h3>{{ title }}</h3>
    <p>{{ renewalText }}</p>
    <p>{{ paymentMethodText }}</p>
    <Button variant="secondary" @click="emit('action')">{{ actionLabel }}</Button>
  </section>
</template>
