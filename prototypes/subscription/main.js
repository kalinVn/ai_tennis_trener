import { createApp } from 'vue'
import PaymentPlanCard from '../components/cards/PaymentPlanCard.vue'
import BillingDetailsCard from '../components/cards/BillingDetailsCard.vue'

const target = document.getElementById('subscription-cards-root')
if (target) {
  createApp({
    components: { PaymentPlanCard, BillingDetailsCard },
    setup() {
      const plan = {
        plan: 'Performance plan', currency: '€', value: '19', period: 'month (example)',
        features: ['Realtime coaching, richer insights and progress tools.'],
        active: true, activeLabel: 'Active · demo', actionLabel: 'Change plan',
      }
      function changePlan() { window.showDemoNote('Plan change is not connected in this prototype.') }
      function manageBilling() { window.showDemoNote('Billing is a visual prototype only.') }
      return { plan, changePlan, manageBilling }
    },
    template: `<PaymentPlanCard v-bind="plan" @action="changePlan" />
      <BillingDetailsCard renewal-text="Next renewal: Oct 26, 2026 (illustrative)."
        payment-method-text="Payment method: Not connected." @action="manageBilling" />`,
  }).mount(target)
}
