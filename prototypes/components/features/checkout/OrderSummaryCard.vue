<script setup>
// Checkout supplies backend-verified display values and owns every action.
defineProps({
  headingId: { type: String, required: true },
  title: { type: String, required: true },
  plan: { type: String, required: true },
  billingPeriod: { type: String, required: true },
  subtotal: { type: String, required: true },
  tax: { type: String, required: true },
  total: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  note: { type: String, required: true },
  actionLabel: { type: String, required: true },
  cancelLabel: { type: String, required: true },
  cancelHref: { type: String, required: true },
  statusMessage: { type: String, default: '' },
})
const emit = defineEmits(['complete'])
</script>

<template>
  <section class="panel" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ title }}</h2>
    <table class="data-table" style="min-width:0" :aria-label="title">
      <tbody>
        <tr><th scope="row">Plan</th><td>{{ plan }}</td></tr>
        <tr><th scope="row">Billing period</th><td>{{ billingPeriod }}</td></tr>
        <tr><th scope="row">Subtotal</th><td>{{ subtotal }}</td></tr>
        <tr><th scope="row">Tax</th><td>{{ tax }}</td></tr>
        <tr><th scope="row">Demo total</th><td><strong class="accent">{{ total }}</strong></td></tr>
        <tr><th scope="row">Status</th><td><span class="pill">{{ paymentStatus }}</span></td></tr>
      </tbody>
    </table>
    <p class="settings-note">{{ note }}</p>
    <div class="cta">
      <button class="btn primary" type="button" @click="emit('complete')">{{ actionLabel }}</button>
      <a class="btn ghost" :href="cancelHref">{{ cancelLabel }}</a>
    </div>
    <p class="callout" role="status" aria-live="polite" :hidden="!statusMessage">{{ statusMessage }}</p>
  </section>
</template>
