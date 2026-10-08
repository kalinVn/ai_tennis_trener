import { createApp } from 'vue'
import PaymentPlanCard from '../components/cards/PaymentPlanCard.vue'

const target = document.getElementById('pricing-plans-root')
if (target) {
  createApp({
    components: { PaymentPlanCard },
    setup() {
      const plans = [
        { plan: 'Starter', value: '9', features: ['Core analysis and training history.'] },
        { plan: 'Performance', value: '19', selected: true, features: ['Realtime coaching, richer insights and progress tools.'] },
        { plan: 'Pro', value: '39', features: ['Advanced training insights and premium tools.'] },
      ]
      // Preserve the existing demo registration action; no checkout or billing integration.
      function choosePlan() { window.openAuth('register') }
      return { plans, choosePlan }
    },
    template: `<PaymentPlanCard v-for="plan in plans" :key="plan.plan" v-bind="plan"
      currency="€" period="month" :action-label="'Choose ' + plan.plan" @action="choosePlan" />`,
  }).mount(target)
}
