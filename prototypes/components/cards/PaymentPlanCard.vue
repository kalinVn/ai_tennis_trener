<script setup>
import Button from '../../../docs/prototypes/design/components/buttons/Button.vue'

defineProps({
  plan: { type: String, required: true },
  currency: { type: String, required: true },
  value: { type: [String, Number], required: true },
  period: { type: String, required: true },
  features: { type: Array, default: () => [] },
  active: { type: Boolean, default: false },
  activeLabel: { type: String, default: 'Active' },
  actionLabel: { type: String, default: '' },
})
const emit = defineEmits(['action'])
</script>

<template>
  <article class="payment-plan-card">
    <span v-if="active" class="payment-plan-card__status">{{ activeLabel }}</span>
    <h2 class="payment-plan-card__name">{{ plan }}</h2>
    <ul class="payment-plan-card__features">
      <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
    </ul>
    <h2 class="payment-plan-card__price">{{ currency }}{{ value }} <span class="payment-plan-card__period">/ {{ period }}</span></h2>
    <Button variant="primary" @click="emit('action')">{{ actionLabel || (active ? 'Change plan' : 'Choose plan') }}</Button>
  </article>
</template>

<style scoped>
/* Visual values from the Subscription page's Performance plan panel. */
.payment-plan-card {
  box-sizing: border-box;
  min-width: 0;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 22px;
  background: #0d1913;
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow-wrap: anywhere;
}
.payment-plan-card__status {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 100px;
  background: #244029;
  color: #b7ff4a;
  padding: 5px 11px;
  font-size: 12px;
}
.payment-plan-card__name, .payment-plan-card__price {
  font-size: clamp(29px, 4vw, 43px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.03em;
  margin: 0 0 12px;
}
.payment-plan-card__name { margin-top: 16px; }
.payment-plan-card__features { list-style: none; padding: 0; margin: 0 0 16px; color: #a8b5ae; }
.payment-plan-card__price { color: #b7ff4a; }
.payment-plan-card__period { color: #a8b5ae; font-size: 16px; }
</style>
