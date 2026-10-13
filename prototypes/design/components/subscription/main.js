import { createApp } from 'vue'
import PaymentCardPlan from '../../../components/cards/PaymentCardPlan.vue'
import BillingDetailsCard from '../../../components/cards/BillingDetailsCard.vue'

const target = document.getElementById('subscription-cards-root')
if (target) {
  createApp({
    components: { PaymentCardPlan, BillingDetailsCard },
    data() {
      return {
        showPlanOptions: false,
        currentPlan: {
          planName: 'No selected plan',
          description: "You cannot use the application's training services until you select a plan.",
          actionLabel: 'Change plan',
        },
        plans: [
          { planName: 'Starter', price: '€9', description: 'Core analysis and training history.' },
          { planName: 'Performance', price: '€19', selected: true, description: 'Realtime coaching, richer insights and session review tools.' },
          { planName: 'Pro', price: '€39', description: 'Advanced training insights and premium tools.' },
        ],
      }
    },
    methods: {
      changePlan() {
        this.showPlanOptions = true
      },
      choosePlan() {
        window.location.href = '../checkout/checkout.html'
      },
      manageBilling() {
        window.showDemoNote('Billing is a visual prototype only.')
      },
    },
    template: `
      <div class="two-col">
        <PaymentCardPlan v-bind="currentPlan" @action="changePlan" />
        <BillingDetailsCard
          renewal-text="Next renewal: Oct 26, 2026 (illustrative)."
          payment-method-text="Payment method: Not connected."
          @action="manageBilling"
        />
      </div>
      <section v-if="showPlanOptions" id="subscription-plan-options" class="section" aria-live="polite">
        <h2>Choose a plan</h2>
        <p>Select the subscription that best fits your training.</p>
        <div class="plan-grid">
          <PaymentCardPlan
            v-for="plan in plans"
            :key="plan.planName"
            v-bind="plan"
            billing-period="month"
            :action-label="'Choose ' + plan.planName"
            @action="choosePlan"
          />
        </div>
      </section>
    `,
  }).mount(target)
}
