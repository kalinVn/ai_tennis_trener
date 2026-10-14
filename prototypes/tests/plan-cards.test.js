import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import * as Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { parse, compileScript } from '@vue/compiler-sfc'
import { useButtonController } from '../composables/ButtonController.js'
import { useSubscription } from '../components/features/subscription/useSubscription.js'
import { useCheckoutStore } from '../stores/useCheckoutStore.js'

// Compile the real SFCs and exercise their rendered controls without a browser.
function component(path, bindings = {}) {
  const { descriptor } = parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
  let code = compileScript(descriptor, { id: path, inlineTemplate: true }).content
  code = code.replace(/import \{([^}]+)\} from ["']vue["']/g,
    (_, names) => `const {${names.replace(/ as /g, ': ')}} = Vue`)
    .replace(/^import .*$/gm, '').replace('export default', 'return')
  return new Function('Vue', ...Object.keys(bindings), code)(Vue, ...Object.values(bindings))
}
const Button = component('../design/components/buttons/Button.vue', { useButtonController })
const PaymentCardPlan = component('../components/features/subscription/PaymentCardPlan.vue', { Button })
const BillingDetailsCard = component('../components/features/subscription/BillingDetailsCard.vue', { Button })
const PaymentStatusCard = component('../components/features/checkout/PaymentStatusCard.vue', { Button })
const OrderSummaryCard = component('../components/features/checkout/OrderSummaryCard.vue')
const node = type => ({ type, props: {}, children: [], text: '', parent: null })
const renderer = Vue.createRenderer({
  createElement: node, createText: text => ({ ...node('#text'), text }),
  createComment: text => ({ ...node('#comment'), text }),
  setText: (n, text) => { n.text = text },
  setElementText: (n, text) => { n.text = text; n.children = [] },
  patchProp: (n, key, _, value) => { n.props[key] = value },
  insert(n, parent, anchor) {
    if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1)
    n.parent = parent
    const index = anchor ? parent.children.indexOf(anchor) : -1
    parent.children.splice(index < 0 ? parent.children.length : index, 0, n)
  },
  remove(n) { n.parent?.children.splice(n.parent.children.indexOf(n), 1) },
  parentNode: n => n.parent,
  nextSibling: n => n.parent?.children[n.parent.children.indexOf(n) + 1],
})
const all = n => [n, ...n.children.flatMap(all)]
const text = n => n.text + n.children.map(text).join('')

test('selected plan updates presentation without emitting or changing price; action stays parent-owned', async () => {
  const selected = Vue.ref(false)
  let actions = 0
  const root = node('root')
  const app = renderer.createApp({ setup: () => () => Vue.h(PaymentCardPlan, {
    planName: 'Starter', price: '€9', billingPeriod: 'month', selected: selected.value,
    onAction: () => actions++,
  }) })
  app.mount(root)
  const button = () => all(root).find(n => n.type === 'button')
  assert.match(button().props.class, /button--secondary/)
  selected.value = true
  await Vue.nextTick()
  assert.match(root.children[0].props.class, /payment-plan-card--selected/)
  assert.match(text(root), /Most popular/)
  assert.match(text(root), /€9/)
  assert.match(button().props.class, /button--primary/)
  assert.equal(actions, 0)
  button().props.onClick({ type: 'click' })
  assert.equal(actions, 1)
  app.unmount()
})

test('Subscription state selects a plan before continuing to Checkout', () => {
  const calls = []
  const state = useSubscription({
    navigate: href => calls.push(href),
    notify: message => calls.push(message),
  })

  assert.equal(state.selectedPlan.value, null)
  assert.equal(state.currentPlan.value.planName, 'No selected plan')
  assert.equal(state.currentPlan.value.price, undefined)
  state.continueToCheckout()
  assert.deepEqual(calls, [])

  state.changePlan()
  assert.equal(state.showPlanOptions.value, true)
  state.selectPlan(state.plans.value[0])
  assert.equal(state.showPlanOptions.value, true)
  assert.equal(state.currentPlan.value.planName, 'Starter')
  assert.equal(state.currentPlan.value.price, '€9')
  assert.equal(state.currentPlan.value.actionLabel, 'Change plan')
  assert.equal(state.currentPlan.value.continueActionLabel, 'Continue')

  state.continueToCheckout()
  state.manageBilling()
  assert.deepEqual(calls, [
    '../checkout/checkout.html?plan=starter',
    'Billing is a visual prototype only.',
  ])
})

test('current plan card emits separate Change plan and Continue actions', () => {
  const root = node('root')
  let changes = 0
  let continues = 0
  const app = renderer.createApp({
    setup: () => () => Vue.h(PaymentCardPlan, {
      planName: 'Starter', price: '€9', billingPeriod: 'month',
      statusLabel: 'Selected plan', actionLabel: 'Change plan',
      continueActionLabel: 'Continue',
      onAction: () => changes++, onContinue: () => continues++,
    }),
  })
  app.mount(root)
  const buttons = all(root).filter(n => n.type === 'button')
  assert.equal(buttons.length, 2)
  assert.match(text(root), /Selected plan/)
  assert.match(text(root), /Change plan/)
  assert.match(text(root), /Continue/)
  buttons[0].props.onClick({ type: 'click' })
  buttons[1].props.onClick({ type: 'click' })
  assert.equal(changes, 1)
  assert.equal(continues, 1)
  app.unmount()
})

test('CheckoutStore owns the transient hosted-checkout session state', async () => {
  setActivePinia(createPinia())
  const store = useCheckoutStore()
  store.initialize({ planId: 'starter', status: 'pending' })
  assert.equal(store.planId, 'starter')
  assert.equal(store.checkoutSessionId, '')

  await store.startCheckout('Stripe')
  assert.equal(store.selectedProvider, 'Stripe')
  assert.equal(store.checkoutSessionId, 'demo_checkout_stripe_starter')
  assert.equal(store.status, 'pending')
  assert.equal(store.pending, false)

  await store.refreshStatus()
  assert.equal(store.status, 'succeeded')
  assert.equal(store.error, '')

  store.initialize({ planId: 'pro', status: 'pending' })
  await store.startCheckout('PayPal')
  assert.equal(store.selectedProvider, 'PayPal')
  assert.equal(store.checkoutSessionId, 'demo_checkout_paypal_pro')
})

test('PaymentStatusCard reuses one component for all five visual-only states', () => {
  const states = {
    pending: ['Payment pending', 'Check status again'],
    success: ['Payment successful', 'View subscription'],
    failed: ['Payment failed', 'Try again'],
    cancelled: ['Payment cancelled', 'Return to checkout'],
    expired: ['Payment session expired', 'Start again'],
  }

  for (const [status, expected] of Object.entries(states)) {
    const root = node('root')
    let actions = 0
    const app = renderer.createApp({
      setup: () => () => Vue.h(PaymentStatusCard, { status, onAction: () => actions++ }),
    })
    app.mount(root)
    const article = all(root).find(n => n.type === 'article')
    assert.match(article.props.class, new RegExp(`payment-status-card--${status}`))
    for (const value of expected) assert.match(text(root), new RegExp(value))
    const action = all(root).find(n => n.type === 'button')
    action.props.onClick({ type: 'click' })
    assert.equal(actions, 1)
    app.unmount()
  }
})

test('successful Checkout summary includes the verified paid status', () => {
  const root = node('root')
  const app = renderer.createApp({
    setup: () => () => Vue.h(OrderSummaryCard, {
      headingId: 'order-heading', title: 'Order summary', plan: 'Performance',
      billingPeriod: 'Monthly', subtotal: '€19.00', tax: 'Not calculated in demo',
      total: '€19.00', paymentStatus: 'Paid', note: 'Backend verified.',
      actionLabel: 'View subscription', cancelLabel: 'Back to plans', cancelHref: '../subscription.html',
    }),
  })
  app.mount(root)
  assert.match(text(root), /Order summary/)
  assert.match(text(root), /Performance/)
  assert.match(text(root), /€19\.00/)
  assert.match(text(root), /Paid/)
  app.unmount()
})

test('Subscription omits payment-status controls while the standalone prototype keeps every state', () => {
  const subscription = readFileSync(new URL('../design/components/subscription/subscription.html', import.meta.url), 'utf8')
  const prototype = readFileSync(new URL('../design/components/cards/payment-status-card.html', import.meta.url), 'utf8')
  assert.doesNotMatch(subscription, /Payment status prototypes/)
  assert.doesNotMatch(subscription, /payment-status-card\.html\?status=/)
  for (const status of ['pending', 'success', 'failed', 'cancelled']) {
    assert.match(prototype, new RegExp(`\\?status=${status}`))
  }
  assert.match(prototype, /payment-status\/main\.js/)
})

test('Subscription and Checkout use colocated design-component entries without raw payment fields', () => {
  const subscription = new URL('../design/components/subscription/subscription.html', import.meta.url)
  const subscriptionEntry = readFileSync(new URL('../design/components/subscription/main.js', import.meta.url), 'utf8')
  const subscriptionPage = readFileSync(new URL('../components/features/subscription/Subscription.vue', import.meta.url), 'utf8')
  const checkout = readFileSync(new URL('../design/components/checkout/checkout.html', import.meta.url), 'utf8')
  const checkoutEntry = readFileSync(new URL('../design/components/checkout/main.js', import.meta.url), 'utf8')
  const checkoutPage = readFileSync(new URL('../components/features/checkout/Checkout.vue', import.meta.url), 'utf8')

  assert.equal(existsSync(subscription), true)
  assert.match(subscriptionEntry, /features\/subscription\/Subscription\.vue/)
  assert.match(subscriptionPage, /PaymentCardPlan/)
  assert.match(subscriptionPage, /BillingDetailsCard/)
  assert.match(subscriptionPage, /useSubscription/)
  assert.equal(existsSync(new URL('../design/pages/checkout.html', import.meta.url)), false)
  assert.equal(existsSync(new URL('../components/subscription/subscription.html', import.meta.url)), false)
  assert.doesNotMatch(checkout, /Payment information|Cardholder name|Card number|Security code/)
  assert.doesNotMatch(checkoutEntry, /PaymentInformationCard|cardNumberDisplay|securityCodeDisplay/)
  assert.match(checkoutEntry, /Checkout\.vue/)
  assert.match(checkoutEntry, /createApp\(Checkout\)\.use\(createPinia\(\)\)\.mount\(target\)/)
  assert.match(checkout, /Pay with Stripe/)
  assert.match(checkout, /Pay with PayPal/)
  assert.equal((checkout.match(/payment-provider-icon/g) || []).length >= 3, true)
  assert.match(checkout, /Payment pending/)
  assert.match(checkout, /Status<\/th><td><span class="pill">Paid/)
  assert.match(checkoutPage, /checkoutStatus === 'success'/)
  assert.match(checkoutPage, /ChoosePlanCard/)
  assert.match(checkoutPage, /OrderSummaryCard/)
  assert.match(checkoutPage, /PaymentStatusCard/)
  assert.match(checkoutPage, /useCheckout/)
})
