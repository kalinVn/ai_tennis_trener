import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import * as Vue from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'
import { useButtonController } from '../composables/ButtonController.js'

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
const PaymentCardPlan = component('../components/cards/PaymentCardPlan.vue', { Button })
const BillingDetailsCard = component('../components/cards/BillingDetailsCard.vue', { Button })
const PaymentStatusCard = component('../components/cards/PaymentStatusCard.vue', { Button })
const OrderSummaryCard = component('../components/cards/OrderSummaryCard.vue')
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

test('Subscription is the only plan-selection surface and continues to Checkout', async () => {
  const root = node('root'), calls = []
  let app
  const code = readFileSync(new URL('../design/components/subscription/main.js', import.meta.url), 'utf8').replace(/^import .*$/gm, '')
  new Function('createApp', 'PaymentCardPlan', 'BillingDetailsCard', 'document', 'window', code)(
    options => (app = renderer.createApp(options)), PaymentCardPlan, BillingDetailsCard,
    { getElementById: () => root },
    {
      location: { set href(value) { calls.push(value) } },
      showDemoNote: message => calls.push(message),
    },
  )
  assert.equal(all(root).filter(n => n.type === 'article').length, 1)
  assert.match(text(root), /No selected plan/)
  assert.match(text(root), /cannot use the application's training services until you select a plan/)
  const initialButtons = all(root).filter(n => n.type === 'button')
  initialButtons[0].props.onClick({ type: 'click' })
  await Vue.nextTick()
  assert.equal(all(root).filter(n => n.type === 'article').length, 4)
  assert.match(text(root), /Starter/)
  assert.match(text(root), /Most popular/)
  assert.match(text(root), /Pro/)
  assert.match(text(root), /€9/)
  initialButtons[1].props.onClick({ type: 'click' })
  all(root).filter(n => n.type === 'button').at(-1).props.onClick({ type: 'click' })
  assert.deepEqual(calls, ['Billing is a visual prototype only.', '../checkout/checkout.html'])
  assert.match(text(root), /Next renewal: Oct 26, 2026 \(illustrative\)/)
  assert.match(text(root), /Payment method: Not connected/)
  app.unmount()
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
  const checkout = readFileSync(new URL('../design/components/checkout/checkout.html', import.meta.url), 'utf8')
  const checkoutEntry = readFileSync(new URL('../design/components/checkout/main.js', import.meta.url), 'utf8')

  assert.equal(existsSync(subscription), true)
  assert.equal(existsSync(new URL('../design/pages/checkout.html', import.meta.url)), false)
  assert.equal(existsSync(new URL('../design/pages/pricing.html', import.meta.url)), false)
  assert.equal(existsSync(new URL('../pricing/main.js', import.meta.url)), false)
  assert.equal(existsSync(new URL('../components/subscription/subscription.html', import.meta.url)), false)
  assert.doesNotMatch(checkout, /Payment information|Cardholder name|Card number|Security code/)
  assert.doesNotMatch(checkoutEntry, /PaymentInformationCard|cardNumberDisplay|securityCodeDisplay/)
  assert.match(checkout, /Pay with Stripe/)
  assert.match(checkout, /Pay with PayPal/)
  assert.equal((checkout.match(/payment-provider-icon/g) || []).length >= 3, true)
  assert.match(checkout, /Payment pending/)
  assert.match(checkout, /Status<\/th><td><span class="pill">Paid/)
  assert.match(checkoutEntry, /checkoutStatus === 'success'/)
  assert.match(checkoutEntry, /PaymentStatusCard/)
})
