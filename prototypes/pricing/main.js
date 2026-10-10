import { createApp } from 'vue'
import PaymentCardPlan from '../components/cards/PaymentCardPlan.vue'

const target = document.getElementById('pricing-plans-root')
if (target) {
  createApp({
    components: { PaymentCardPlan },
    setup() {
      const plans = [
        { planName: 'Starter', price: '€9', description: 'Core analysis and training history.' },
        { planName: 'Performance', price: '€19', selected: true, description: 'Realtime coaching, richer insights and progress tools.' },
        { planName: 'Pro', price: '€39', description: 'Advanced training insights and premium tools.' },
      ]
      // Preserve the existing demo registration action; no checkout or billing integration.
      function choosePlan() { window.openAuth('register') }
      return { plans, choosePlan }
    },
    template: `<PaymentCardPlan v-for="plan in plans" :key="plan.planName" v-bind="plan"
      billing-period="month" :action-label="'Choose ' + plan.planName" @action="choosePlan" />`,
  }).mount(target)
}
