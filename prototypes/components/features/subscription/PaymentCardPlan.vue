<script setup>
import Button from '../../../design/components/buttons/Button.vue'

defineProps({
  planName: { type: String, required: true },
  price: { type: String, default: '' },
  billingPeriod: { type: String, default: '' },
  description: { type: String, default: '' },
  features: { type: Array, default: () => [] },
  statusLabel: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  selectedLabel: { type: String, default: 'Most popular' },
  actionLabel: { type: String, default: '' },
  continueActionLabel: { type: String, default: '' },
})
const emit = defineEmits(['action', 'continue'])
</script>

<template>
  <article class="payment-plan-card" :class="{ 'payment-plan-card--selected': selected }">
    <div v-if="selected && selectedLabel" class="eyebrow payment-plan-card__selected-label">{{ selectedLabel }}</div>
    <span v-if="statusLabel" class="payment-plan-card__status">{{ statusLabel }}</span>
    <h2 class="payment-plan-card__name">{{ planName }}</h2>
    <p v-if="description" class="payment-plan-card__description">{{ description }}</p>
    <ul v-if="features.length" class="payment-plan-card__features">
      <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
    </ul>
    <h2 v-if="price" class="payment-plan-card__price">{{ price }} <span v-if="billingPeriod" class="payment-plan-card__period">/ {{ billingPeriod }}</span></h2>
    <div class="payment-plan-card__actions">
      <Button :variant="continueActionLabel ? 'secondary' : (selected || statusLabel ? 'primary' : 'secondary')" @click="emit('action')">{{ actionLabel || (statusLabel ? 'Change plan' : 'Choose plan') }}</Button>
      <Button v-if="continueActionLabel" variant="primary" @click="emit('continue')">{{ continueActionLabel }}</Button>
    </div>
  </article>
</template>

<style scoped>
/* Visual values from the Subscription page's Performance plan panel. */
.payment-plan-card {
  display: flex;
  flex-direction: column;
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
.payment-plan-card--selected { outline: 2px solid #b7ff4a80; }
.payment-plan-card__actions, .payment-plan-card__status { align-self: flex-start; }
.payment-plan-card__actions { display: flex; flex-wrap: wrap; gap: 10px; }
/* Subscription plan-grid compact hierarchy; Subscription retains its current-plan layout. */
:global(.plan-grid) .payment-plan-card__selected-label { order: 0; }
:global(.plan-grid) .payment-plan-card__name { order: 1; margin: 0 0 10px; font-size: 21px; line-height: 1.55; letter-spacing: normal; }
:global(.plan-grid) .payment-plan-card__price { order: 2; margin: 0; color: #b7ff4a; font-size: 43px; line-height: 1.55; letter-spacing: normal; }
:global(.plan-grid) .payment-plan-card__period { font-size: 13.3333px; }
:global(.plan-grid) .payment-plan-card__features { order: 3; margin: 0; color: #a8b5ae; }
:global(.plan-grid) .payment-plan-card__description { order: 3; }
:global(.plan-grid) .payment-plan-card__actions { order: 4; width: 100%; }
:global(.plan-grid) .payment-plan-card__actions > .button { width: 100%; }
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
.payment-plan-card__description { margin: 0 0 16px; color: #a8b5ae; }
.payment-plan-card__price { color: #b7ff4a; }
.payment-plan-card__period { color: #a8b5ae; font-size: 16px; }
</style>
