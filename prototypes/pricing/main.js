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
      // Plan selection enters the dedicated registration prototype; no checkout is connected.
      function choosePlan() { window.location.href = 'register.html' }
      return { plans, choosePlan }
    },
    template: `<PaymentCardPlan v-for="plan in plans" :key="plan.planName" v-bind="plan"
      billing-period="month" :action-label="'Choose ' + plan.planName" @action="choosePlan" />`,
  }).mount(target)
}
