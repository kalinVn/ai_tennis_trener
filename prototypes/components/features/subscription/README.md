# Subscription feature

`Subscription.vue` is the feature component for the complete Subscription UI.
It composes these focused child components from the same directory:

- `PaymentCardPlan.vue` presents both the current-plan state and each available plan option.
- `BillingDetailsCard.vue` presents renewal and payment-method information.
- `useSubscription.js` owns the prototype-only plan-selection and navigation behavior.

The child cards remain presentational and communicate through props and events.
Persisted subscription truth belongs to `UserStore.subscription`; the local
composable must not create a second authoritative copy of backend state.
