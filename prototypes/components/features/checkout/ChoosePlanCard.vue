<script setup>
// Checkout owns navigation and payment actions supplied around this presentation.
defineProps({
  headingId: { type: String, required: true },
  badge: { type: String, required: true },
  plan: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, required: true },
  billingNote: { type: String, required: true },
  backLabel: { type: String, required: true },
  backHref: { type: String, required: true },
})
</script>

<template>
  <section class="panel" :aria-labelledby="headingId">
    <span class="pill">{{ badge }}</span>
    <h2 :id="headingId" style="margin-top:16px">{{ plan }}</h2>
    <p>{{ description }}</p>
    <h3 class="accent">{{ price }} <span class="muted">{{ period }}</span></h3>
    <p>{{ billingNote }}</p>
    <a class="btn small" :href="backHref">{{ backLabel }}</a>
    <slot name="payment-actions" />
  </section>
</template>
