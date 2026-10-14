import { defineStore } from 'pinia'
import {
  createDemoCheckoutSession,
  verifyDemoCheckoutSession,
} from '../services/demoCheckoutService.js'

const supportedStatuses = new Set(['pending', 'succeeded', 'failed', 'cancelled', 'expired'])

export const useCheckoutStore = defineStore('prototype-checkout', {
  state: () => ({
    planId: 'performance',
    selectedProvider: '',
    checkoutSessionId: '',
    status: 'pending',
    displayText: '',
    pending: false,
    error: '',
  }),
  actions: {
    initialize({ planId, status } = {}) {
      if (planId && planId !== this.planId) {
        this.planId = planId
        this.selectedProvider = ''
        this.checkoutSessionId = ''
        this.displayText = ''
        this.error = ''
      }
      const normalizedStatus = status === 'success' ? 'succeeded' : status
      if (supportedStatuses.has(normalizedStatus)) this.status = normalizedStatus
    },
    async startCheckout(provider) {
      if (this.pending) return
      this.selectedProvider = provider
      this.pending = true
      this.error = ''
      try {
        const result = await createDemoCheckoutSession({ planId: this.planId, provider })
        this.checkoutSessionId = result.checkoutSessionId
        this.status = result.status
        this.displayText = result.displayText
      } catch (error) {
        this.status = 'failed'
        this.error = error instanceof Error ? error.message : 'Checkout could not be started.'
      } finally {
        this.pending = false
      }
    },
    async refreshStatus() {
      if (this.pending) return
      this.pending = true
      this.error = ''
      try {
        const result = await verifyDemoCheckoutSession(this.checkoutSessionId)
        this.status = result.status
        this.displayText = result.displayText
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Checkout status could not be verified.'
      } finally {
        this.pending = false
      }
    },
  },
})
