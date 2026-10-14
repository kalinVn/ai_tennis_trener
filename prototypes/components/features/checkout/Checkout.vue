<script setup>
import ChoosePlanCard from './ChoosePlanCard.vue'
import OrderSummaryCard from './OrderSummaryCard.vue'
import PaymentStatusCard from './PaymentStatusCard.vue'
import { useCheckout } from './useCheckout.js'

const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)
const {
  checkoutStatus,
  selectedProvider,
  displayText,
  pending,
  error,
  performance,
  summary,
  startPayment,
  handleStatusAction,
  viewSubscription,
} = useCheckout({
  planId: params.get('plan') || 'performance',
  status: params.get('status') || 'pending',
  navigate: href => { window.location.href = href },
})
</script>

<template>
  <div class="stack">
    <ChoosePlanCard v-bind="performance">
      <template #payment-actions>
        <div class="cta" aria-label="Payment provider">
          <button class="btn primary payment-provider-action" type="button" :disabled="pending" @click="startPayment('Stripe')">
            <svg class="payment-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="24" height="24" rx="5" fill="#635bff" />
              <text x="12" y="17" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">S</text>
            </svg>
            <span>Pay with Stripe</span>
          </button>
          <button class="btn payment-provider-action" type="button" :disabled="pending" @click="startPayment('PayPal')">
            <svg class="payment-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="24" height="24" rx="5" fill="#0070e0" />
              <text x="12" y="17" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">P</text>
            </svg>
            <span>Pay with PayPal</span>
          </button>
        </div>
      </template>
    </ChoosePlanCard>
    <p v-if="selectedProvider" class="settings-note" role="status" aria-live="polite">
      {{ selectedProvider }} selected. {{ displayText || 'The hosted payment session is pending in this prototype.' }}
    </p>
    <p v-if="error" class="settings-note" role="alert">{{ error }}</p>
  </div>

  <OrderSummaryCard
    v-if="checkoutStatus === 'success'"
    v-bind="summary"
    @complete="viewSubscription"
  />
  <PaymentStatusCard
    v-else
    :status="checkoutStatus"
    @action="handleStatusAction"
  />
</template>
