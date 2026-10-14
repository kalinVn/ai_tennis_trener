import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCheckoutStore } from '../../../stores/useCheckoutStore.js'

const plans = {
  starter: {
    name: 'Starter',
    description: 'Core analysis and training history.',
    price: '€9',
  },
  performance: {
    name: 'Performance',
    description: 'Realtime coaching, richer insights and session review tools.',
    price: '€19',
  },
  pro: {
    name: 'Pro',
    description: 'Advanced training insights and premium tools.',
    price: '€39',
  },
}

export function useCheckout({ planId = 'performance', status = 'pending', navigate } = {}) {
  const store = useCheckoutStore()
  store.initialize({ planId: plans[planId] ? planId : 'performance', status })
  const { selectedProvider, displayText, pending, error } = storeToRefs(store)

  const selectedPlan = computed(() => plans[store.planId] || plans.performance)
  const checkoutStatus = computed(() => store.status === 'succeeded' ? 'success' : store.status)
  const performance = computed(() => ({
    headingId: 'selected-plan-heading',
    badge: 'Selected plan · demo',
    plan: selectedPlan.value.name,
    description: selectedPlan.value.description,
    price: selectedPlan.value.price,
    period: '/ month',
    billingNote: 'Billing period: monthly. Illustrative plan price from the prototype.',
    backLabel: 'Back to plans',
    backHref: '../subscription/subscription.html',
  }))
  const summary = computed(() => ({
    headingId: 'order-heading',
    title: 'Order summary',
    plan: selectedPlan.value.name,
    billingPeriod: 'Monthly',
    subtotal: `${selectedPlan.value.price}.00`,
    tax: 'Not calculated in demo',
    total: `${selectedPlan.value.price}.00`,
    paymentStatus: 'Paid',
    note: 'This success state represents a payment already verified by the backend. No card details are sent to or stored by this frontend.',
    actionLabel: 'View subscription',
    cancelLabel: 'Back to plans',
    cancelHref: '../subscription/subscription.html',
  }))

  async function startPayment(provider) {
    await store.startCheckout(provider)
  }

  async function handleStatusAction() {
    if (store.status === 'pending') await store.refreshStatus()
    else await store.startCheckout(store.selectedProvider || 'Stripe')
  }

  function viewSubscription() {
    navigate?.('../subscription/subscription.html')
  }

  return {
    checkoutStatus,
    selectedProvider,
    displayText,
    pending,
    error,
    performance,
    summary,
    startPayment,
    handleStatusAction,
    viewSubscription,
  }
}
