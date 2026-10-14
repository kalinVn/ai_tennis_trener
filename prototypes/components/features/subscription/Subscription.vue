<script setup>
import PaymentCardPlan from './PaymentCardPlan.vue'
import BillingDetailsCard from './BillingDetailsCard.vue'
import { useSubscription } from './useSubscription.js'

const {
  showPlanOptions,
  plans,
  currentPlan,
  changePlan,
  selectPlan,
  continueToCheckout,
  manageBilling,
} = useSubscription({
  navigate: href => { window.location.href = href },
  notify: message => window.showDemoNote(message),
})
</script>

<template>
  <div class="two-col">
    <PaymentCardPlan
      v-bind="currentPlan"
      @action="changePlan"
      @continue="continueToCheckout"
    />
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
        :key="plan.id"
        v-bind="plan"
        billing-period="month"
        :action-label="'Choose ' + plan.planName"
        @action="selectPlan(plan)"
      />
    </div>
  </section>
</template>
