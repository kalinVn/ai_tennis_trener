<script setup>
import { computed } from 'vue'
import Button from '../../design/components/buttons/Button.vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: value => ['pending', 'success', 'failed', 'cancelled', 'expired'].includes(value),
  },
})

defineEmits(['action'])

const contentByStatus = {
  pending: {
    label: 'Payment pending',
    title: 'We are confirming your payment',
    description: 'Your payment is still being verified. Keep this page open or check the status again shortly.',
    note: 'No subscription change is shown until payment confirmation is available.',
    actionLabel: 'Check status again',
  },
  success: {
    label: 'Payment successful',
    title: 'Your subscription is active',
    description: 'This prototype represents a payment that has already been confirmed successfully.',
    note: 'The Performance plan is ready to use in this visual example.',
    actionLabel: 'View subscription',
  },
  failed: {
    label: 'Payment failed',
    title: 'We could not complete the payment',
    description: 'No subscription change was made. Review the payment details before trying again.',
    note: 'No card details are collected or processed by this design prototype.',
    actionLabel: 'Try again',
  },
  cancelled: {
    label: 'Payment cancelled',
    title: 'Checkout was cancelled',
    description: 'No payment was processed and your current subscription was not changed.',
    note: 'You can return to checkout whenever you are ready.',
    actionLabel: 'Return to checkout',
  },
  expired: {
    label: 'Payment session expired',
    title: 'Start a new payment session',
    description: 'The hosted payment session is no longer available and no payment was confirmed.',
    note: 'Your selected plan is preserved so you can safely start again.',
    actionLabel: 'Start again',
  },
}

const content = computed(() => contentByStatus[props.status])
</script>

<template>
  <article class="panel payment-status-card" :class="`payment-status-card--${status}`" role="status" aria-live="polite">
    <span class="pill payment-status-card__pill">{{ content.label }}</span>
    <h2>{{ content.title }}</h2>
    <p class="payment-status-card__description">{{ content.description }}</p>
    <p class="payment-status-card__note">{{ content.note }}</p>
    <div class="payment-status-card__actions">
      <Button :variant="status === 'success' ? 'primary' : 'secondary'" @click="$emit('action')">
        {{ content.actionLabel }}
      </Button>
      <slot name="secondary-action" />
    </div>
  </article>
</template>

<style scoped>
.payment-status-card { width: min(820px, 100%); }
.payment-status-card__pill { margin-bottom: 16px; }
.payment-status-card h2 { margin-bottom: 12px; }
.payment-status-card__description { max-width: 650px; margin-bottom: 10px; }
.payment-status-card__note { max-width: 650px; margin-bottom: 0; font-size: 14px; }
.payment-status-card__actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.payment-status-card--pending .payment-status-card__pill { background: #3a3420; color: #ffc857; }
.payment-status-card--failed .payment-status-card__pill { background: #3a2026; color: #ff6b7a; }
.payment-status-card--cancelled .payment-status-card__pill { background: #24342b; color: #a8b5ae; }
.payment-status-card--expired .payment-status-card__pill { background: #3a2d20; color: #f2b56b; }
@media (max-width: 530px) {
  .payment-status-card__actions { display: grid; }
  .payment-status-card__actions :deep(.button),
  .payment-status-card__actions :deep(.btn) { width: 100%; min-height: 48px; }
}
</style>
