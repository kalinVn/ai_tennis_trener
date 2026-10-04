import { createApp, ref } from 'vue'
import PerformanceCard from '../components/cards/PerformanceCard.vue'
import PaymentInformationCard from '../components/cards/PaymentInformationCard.vue'
import OrderSummaryCard from '../components/cards/OrderSummaryCard.vue'

// Checkout owns the prototype data and action handling; cards only present props.
const target = document.getElementById('checkout-cards-root')
if (target) {
  createApp({
    components: { PerformanceCard, PaymentInformationCard, OrderSummaryCard },
    setup() {
      const statusMessage = ref('')
      const performance = {
        headingId: 'selected-plan-heading', badge: 'Selected plan · demo',
        plan: 'Performance', description: 'Realtime coaching, richer insights and progress tools.',
        price: '€19', period: '/ month',
        billingNote: 'Billing period: monthly. Illustrative pricing from the prototype.',
        backLabel: 'Back to plans', backHref: 'application-pricing.html',
      }
      const payment = {
        idPrefix: 'payment', title: 'Payment information',
        description: 'Sample card details only. Payment fields are disabled in this prototype.',
        cardholderDisplay: 'Alex Morgan · demo', cardNumberDisplay: '•••• •••• •••• 4242',
        expiryDisplay: 'MM / YY', securityCodeDisplay: '•••',
      }
      const summary = {
        headingId: 'order-heading', title: 'Order summary', plan: 'Performance',
        billingPeriod: 'Monthly', subtotal: '€19.00', tax: 'Not calculated in demo', total: '€19.00',
        note: 'The example total covers one month. No subscription will be created and no card details will be sent or stored.',
        actionLabel: 'Complete checkout (demo)', cancelLabel: 'Cancel', cancelHref: 'application-pricing.html',
      }
      function completeCheckout() {
        statusMessage.value = 'Demo checkout reviewed. No payment was processed and no subscription was created.'
      }
      return { performance, payment, summary, statusMessage, completeCheckout }
    },
    template: `
      <div class="stack">
        <PerformanceCard v-bind="performance" />
        <PaymentInformationCard v-bind="payment" />
      </div>
      <OrderSummaryCard v-bind="summary" :status-message="statusMessage" @complete="completeCheckout" />
    `,
  }).mount(target)
}
