import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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

test('Authenticated Pricing navigates to Checkout while Subscription retains its demo actions', () => {
  for (const page of ['pricing', 'subscription']) {
    const root = node('root'), calls = []
    let app
    const code = readFileSync(new URL(`../${page}/main.js`, import.meta.url), 'utf8').replace(/^import .*$/gm, '')
    new Function('createApp', 'PaymentCardPlan', 'BillingDetailsCard', 'document', 'window', code)(
      options => (app = renderer.createApp(options)), PaymentCardPlan, BillingDetailsCard,
      { getElementById: () => root },
      {
        location: { set href(value) { calls.push(value) } },
        showDemoNote: message => calls.push(message),
      },
    )
    const cards = all(root).filter(n => n.type === 'article')
    assert.equal(cards.length, page === 'pricing' ? 3 : 1)
    const buttons = all(root).filter(n => n.type === 'button')
    buttons.forEach(button => button.props.onClick({ type: 'click' }))
    assert.deepEqual(calls, page === 'pricing' ? ['checkout.html', 'checkout.html', 'checkout.html'] : [
      'Plan change is not connected in this prototype.', 'Billing is a visual prototype only.',
    ])
    if (page === 'subscription') {
      assert.match(text(root), /Next renewal: Oct 26, 2026 \(illustrative\)/)
      assert.match(text(root), /Payment method: Not connected/)
    }
    app.unmount()
  }
})

test('PaymentStatusCard reuses one component for all four visual-only states', () => {
  const states = {
    pending: ['Payment pending', 'Check status again'],
    success: ['Payment successful', 'View subscription'],
    failed: ['Payment failed', 'Try again'],
    cancelled: ['Payment cancelled', 'Return to checkout'],
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

test('Subscription omits payment-status controls while the standalone prototype keeps every state', () => {
  const subscription = readFileSync(new URL('../design/pages/subscription.html', import.meta.url), 'utf8')
  const prototype = readFileSync(new URL('../design/components/cards/payment-status-card.html', import.meta.url), 'utf8')
  assert.doesNotMatch(subscription, /Payment status prototypes/)
  assert.doesNotMatch(subscription, /payment-status-card\.html\?status=/)
  for (const status of ['pending', 'success', 'failed', 'cancelled']) {
    assert.match(prototype, new RegExp(`\\?status=${status}`))
  }
  assert.match(prototype, /payment-status\/main\.js/)
})
