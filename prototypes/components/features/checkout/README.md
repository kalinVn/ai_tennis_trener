# Checkout feature

`Checkout.vue` is the feature component for the complete Checkout UI. It
composes these focused child components from the same directory:

- `ChoosePlanCard.vue` presents the selected plan and exposes the payment-actions slot.
- `PaymentStatusCard.vue` presents pending, failed, cancelled, and expired payment states.
- `OrderSummaryCard.vue` replaces the status card after backend-verified success.
- `useCheckout.js` adapts transient `CheckoutStore` state and actions for the composition.

The child cards remain presentational. `Checkout.vue` composes them, while
`useCheckoutStore` and the checkout service own transient workflow and server
communication boundaries. Backend-verified subscription truth remains in
`UserStore.subscription`.
