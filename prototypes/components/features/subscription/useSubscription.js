import { computed, ref } from 'vue'

const planCatalog = [
  {
    id: 'starter',
    planName: 'Starter',
    price: '€9',
    description: 'Core analysis and training history.',
  },
  {
    id: 'performance',
    planName: 'Performance',
    price: '€19',
    selected: true,
    description: 'Realtime coaching, richer insights and session review tools.',
  },
  {
    id: 'pro',
    planName: 'Pro',
    price: '€39',
    description: 'Advanced training insights and premium tools.',
  },
]

export function useSubscription({ navigate, notify } = {}) {
  const showPlanOptions = ref(false)
  const selectedPlan = ref(null)
  const plans = ref(planCatalog.map(plan => ({ ...plan })))

  const currentPlan = computed(() => selectedPlan.value
    ? {
        ...selectedPlan.value,
        selected: false,
        statusLabel: 'Selected plan',
        billingPeriod: 'month',
        actionLabel: 'Change plan',
        continueActionLabel: 'Continue',
      }
    : {
        planName: 'No selected plan',
        description: "You cannot use the application's training services until you select a plan.",
        actionLabel: 'Change plan',
      })

  function changePlan() {
    showPlanOptions.value = true
  }

  function selectPlan(plan) {
    selectedPlan.value = { ...plan }
  }

  function continueToCheckout() {
    if (!selectedPlan.value) return
    navigate?.(`../checkout/checkout.html?plan=${encodeURIComponent(selectedPlan.value.id)}`)
  }

  function manageBilling() {
    notify?.('Billing is a visual prototype only.')
  }

  return {
    showPlanOptions,
    selectedPlan,
    plans,
    currentPlan,
    changePlan,
    selectPlan,
    continueToCheckout,
    manageBilling,
  }
}
