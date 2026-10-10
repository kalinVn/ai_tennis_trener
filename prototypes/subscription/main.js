import { createApp } from 'vue'
import PaymentCardPlan from '../components/cards/PaymentCardPlan.vue'
import BillingDetailsCard from '../components/cards/BillingDetailsCard.vue'

const target = document.getElementById('subscription-cards-root')
if (target) {
  createApp({
    components: { PaymentCardPlan, BillingDetailsCard },
    setup() {
      const plan = {
        planName: 'Performance plan', price: '€19', billingPeriod: 'month (example)',
        description: 'Realtime coaching, richer insights and progress tools.',
        statusLabel: 'Active · demo', actionLabel: 'Change plan',
      }
      function changePlan() { window.showDemoNote('Plan change is not connected in this prototype.') }
      function manageBilling() { window.showDemoNote('Billing is a visual prototype only.') }
      return { plan, changePlan, manageBilling }
    },
    template: `<PaymentCardPlan v-bind="plan" @action="changePlan" />
      <BillingDetailsCard renewal-text="Next renewal: Oct 26, 2026 (illustrative)."
        payment-method-text="Payment method: Not connected." @action="manageBilling" />`,
  }).mount(target)
}
