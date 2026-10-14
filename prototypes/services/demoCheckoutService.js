const supportedPlans = new Set(['starter', 'performance', 'pro'])
const supportedProviders = new Set(['Stripe', 'PayPal'])

export async function createDemoCheckoutSession({ planId, provider }) {
  if (!supportedPlans.has(planId)) throw new Error('Select a supported plan before checkout.')
  if (!supportedProviders.has(provider)) throw new Error('Select Stripe or PayPal before checkout.')
  await Promise.resolve()
  return {
    checkoutSessionId: `demo_checkout_${provider.toLowerCase()}_${planId}`,
    provider,
    status: 'pending',
    displayText: 'The hosted payment session is pending in this prototype.',
  }
}

export async function verifyDemoCheckoutSession(checkoutSessionId) {
  if (!checkoutSessionId) throw new Error('No checkout session is available to verify.')
  await Promise.resolve()
  return {
    status: 'succeeded',
    displayText: 'The demo checkout session was verified successfully.',
  }
}
