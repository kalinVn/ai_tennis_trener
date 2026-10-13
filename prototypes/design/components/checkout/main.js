import { createApp, ref } from 'vue'
import PerformanceCard from '../../../components/cards/PerformanceCard.vue'
import OrderSummaryCard from '../../../components/cards/OrderSummaryCard.vue'
import PaymentStatusCard from '../../../components/cards/PaymentStatusCard.vue'

// Checkout owns the prototype data and action handling; cards only present props.
const target = document.getElementById('checkout-cards-root')
if (target) {
  createApp({
    components: { PerformanceCard, OrderSummaryCard, PaymentStatusCard },
    setup() {
      const supportedStatuses = ['pending', 'success', 'failed', 'cancelled', 'expired']
      const requestedStatus = new URLSearchParams(window.location.search).get('status')
      const checkoutStatus = ref(supportedStatuses.includes(requestedStatus) ? requestedStatus : 'pending')
      const selectedProvider = ref('')
      const performance = {
        headingId: 'selected-plan-heading', badge: 'Selected plan · demo',
        plan: 'Performance', description: 'Realtime coaching, richer insights and session review tools.',
        price: '€19', period: '/ month',
        billingNote: 'Billing period: monthly. Illustrative pricing from the prototype.',
        backLabel: 'Back to plans', backHref: '../subscription/subscription.html',
      }
      const summary = {
        headingId: 'order-heading', title: 'Order summary', plan: 'Performance',
        billingPeriod: 'Monthly', subtotal: '€19.00', tax: 'Not calculated in demo', total: '€19.00',
        paymentStatus: 'Paid',
        note: 'This success state represents a payment already verified by the backend. No card details are sent to or stored by this frontend.',
        actionLabel: 'View subscription', cancelLabel: 'Back to plans', cancelHref: '../subscription/subscription.html',
      }
      function startPayment(provider) {
        selectedProvider.value = provider
        checkoutStatus.value = 'pending'
      }
      function handleStatusAction() {
        if (checkoutStatus.value === 'pending') checkoutStatus.value = 'success'
        else checkoutStatus.value = 'pending'
      }
      function viewSubscription() {
        window.location.href = '../subscription/subscription.html'
      }
      return { performance, summary, checkoutStatus, selectedProvider, startPayment, handleStatusAction, viewSubscription }
    },
    template: `
      <div class="stack">
        <PerformanceCard v-bind="performance">
          <template #payment-actions>
            <div class="cta" aria-label="Payment provider">
              <button class="btn primary payment-provider-action" type="button" @click="startPayment('Stripe')">
                <svg class="payment-provider-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#635bff"/><text x="12" y="17" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">S</text></svg>
                <span>Pay with Stripe</span>
              </button>
              <button class="btn payment-provider-action" type="button" @click="startPayment('PayPal')">
                <svg class="payment-provider-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#0070e0"/><text x="12" y="17" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">P</text></svg>
                <span>Pay with PayPal</span>
              </button>
            </div>
          </template>
        </PerformanceCard>
        <p v-if="selectedProvider" class="settings-note" role="status" aria-live="polite">
          {{ selectedProvider }} selected. The hosted payment session is pending in this prototype.
        </p>
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
    `,
  }).mount(target)
}
