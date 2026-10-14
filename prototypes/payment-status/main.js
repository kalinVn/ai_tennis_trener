import { createApp, ref } from 'vue'
import PaymentStatusCard from '../components/features/checkout/PaymentStatusCard.vue'

const supportedStatuses = ['pending', 'success', 'failed', 'cancelled']
const requestedStatus = new URLSearchParams(window.location.search).get('status')
const status = supportedStatuses.includes(requestedStatus) ? requestedStatus : 'pending'

document.querySelector(`[data-payment-status-link="${status}"]`)?.setAttribute('aria-current', 'page')

const messages = {
  pending: 'Prototype only: a real page would request the latest server-verified payment status.',
  success: 'Prototype only: no subscription was activated by this action.',
  failed: 'Prototype only: no checkout session was created.',
  cancelled: 'Prototype only: no redirect to a payment provider was started.',
}

const target = document.getElementById('payment-status-root')
if (target) {
  createApp({
    components: { PaymentStatusCard },
    setup() {
      const message = ref('')
      function handleAction() { message.value = messages[status] }
      return { handleAction, message, status }
    },
    template: `<PaymentStatusCard :status="status" @action="handleAction">
      <template #secondary-action><a class="btn" href="../subscription/subscription.html">Back to Subscription</a></template>
    </PaymentStatusCard>
    <p v-if="message" class="callout payment-status-prototype__note" role="status">{{ message }}</p>`,
  }).mount(target)
}
