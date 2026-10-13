CSS in the prototype Vue components is for visual reference only; production styles may live outside components and use shared design tokens.

### Button

`Button = presentation + UI state + event emission`. This is the authoritative project Button contract. Start Training, Save, Reset, and similar labels are usages of this shared component, never separate reusable button components.

#### Props and States

| Prop | Supported values / type | Default |
| --- | --- | --- |
| `variant` | `primary`, `secondary`, `ghost` | `primary` |
| `size` | `small`, `medium` | `medium` |
| `type` | `button`, `submit`, `reset` | `button` |
| `disabled` | Boolean | `false` |
| `loading` | Boolean | `false` |

Supported UI states are default, hover, active, focus-visible, disabled, and loading. Loading displays the existing spinner and sets `aria-busy`; either `disabled` or `loading` disables activation. Content comes from the default slot, including text and optional icons. Native attributes such as accessible names and pressed/expanded state remain supported.

`primary` uses the accent fill; `secondary` uses the panel fill; `ghost` uses a transparent background with the shared border and interaction styles. Ghost is already implemented in the shared stylesheet and required by the [Profile](../../prototypes/design/pages/profile.html), [Settings](../../prototypes/design/pages/settings.html) and [CollapseForm](../../prototypes/design/components/forms/CollapseForm.html) reset-action designs. Existing styled links may also use ghost CSS; that does not imply a Button navigation prop. No subtle or destructive variants are defined. The existing implementation supports small/medium only, not a large size.

#### Emits and Ownership

Emits:

- `click` — forwards the original DOM event when activation is enabled.

The component has no business logic, callback props (`callback`, `onAction`, or similar), store/API access, or page-specific actions. The parent handles `click`; action logic belongs to the page, owning feature, composable, or appropriate store/service. Form submission/reset remains owned by the parent form.

```vue
<Button @click="startTraining">
  Start Training
</Button>
```

The existing [ButtonController.js](../../prototypes/composables/ButtonController.js) exports `useButtonController`: it derives `isDisabled` from disabled/loading, suppresses disabled clicks, and emits enabled clicks. This is UI behavior, not an action dispatcher. Planned production placement is `frontend/src/components/buttons/Button.vue` plus `frontend/src/composables/ButtonController.ts`, preserving that separation in TypeScript. These planned files are not claimed to exist.

#### Navigation

The inspected Button renders a native button and does not support a `to` prop or `RouterLink` mode. Preserve the existing parent-owned navigation convention: an action may invoke the owning page/feature handler, while link destinations use the existing link/navigation components. Do not implement separate navigation logic in page-specific button components or document an unsupported `to` API. Navigation destinations and access policy stay outside Button.

#### References

- [Button.vue](../../prototypes/design/components/buttons/Button.vue): current props, slot, event wiring and native button semantics.
- [main.scss](../../prototypes/design/components/buttons/main.scss): variants, sizes, focus, disabled/loading and reduced-motion styles.
- [Button visual prototypes](../../prototypes/design/components/buttons): visual examples; their page labels do not define additional components.

### TextButton

`TextButton` is the shared lightweight action control for places where a filled primary, secondary, or ghost Button would add too much visual weight. Cookie Policy, Privacy Policy, Cookie Settings, and Manage Preferences are representative usages, not component-owned behavior. It renders a native `button` and contains no navigation, persistence, modal, cookie, or other feature logic.

#### Props and States

| Prop | Supported values / type | Default |
| --- | --- | --- |
| `type` | `button`, `submit`, `reset` | `button` |
| `disabled` | Boolean | `false` |
| `tone` | `accent`, `inherit` | `accent` |

Content comes from the default slot. `accent` uses the shared accent color; `inherit` adopts the surrounding text color for visually integrated footer, sidebar, or inline actions. Native attributes, including `aria-label`, `aria-describedby`, `aria-expanded`, and `aria-controls`, fall through to the native button. Parent-supplied `class` and `style` are valid extension points for local layout only; consumers must not replace the component's interaction states or turn it into a feature-specific variant.

Supported states are default, hover, active, focus-visible, and disabled. The component intentionally has no loading state, icon API, size system, routing mode, or feature-specific variants.

#### Emits and Ownership

Emits:

- `click` — forwards the original DOM event for enabled activation.

The parent handles the action. Native button semantics provide Enter/Space keyboard activation, and a disabled button is not focusable or activatable. Focus-visible uses the shared cyan outline and does not rely on color alone.

```vue
<TextButton aria-haspopup="dialog" @click="openPreferences">
  Manage Preferences
</TextButton>
```

#### References

- Vue component: [TextButton.vue](../../prototypes/design/components/buttons/TextButton.vue)
- Component styling: [text-button.scss](../../prototypes/design/components/buttons/text-button.scss)
- Live visual prototype: [text-button.html](../../prototypes/design/components/buttons/text-button.html)

### BaseModal

`BaseModal` is the shared generic modal shell. It renders a native modal dialog, backdrop, viewport-safe panel, header, top-right close button, and internally scrollable content area. It contains no cookie, privacy, camera, saving, acceptance, routing, API, or other feature logic. The existing full-screen camera modal remains specialized because its media lifecycle and full-viewport layout are materially different.

#### Props and States

| Prop | Type | Default / requirement |
| --- | --- | --- |
| `open` | Boolean | `false` |
| `title` | String | Required; labels the dialog heading |

Supported states are closed, open, content-overflow/scrolling, and responsive desktop/mobile sizing. The component does not maintain a feature-specific state machine. The parent owns the `open` value and active content selection.

#### Emits and Close Behavior

Emits:

- `close` — requests that the parent close the modal.

The standard close button appears at the top right and emits `close`. Escape and a direct backdrop click use the same close path. Closing the shell only dismisses it: it never implies save, accept, reject, submit, or navigation behavior. The owning parent responds to `close` by updating its `open` state.

#### Slots and Dynamic Content

| Slot | Purpose |
| --- | --- |
| default | Arbitrary modal body content supplied by the parent |
| `eyebrow` | Optional short context label above the title |

The parent may pass ordinary slot content or render its selected Vue component in the default slot. Dynamic selection follows normal Vue composition, conceptually `BaseModal → active content component`; `BaseModal` neither imports nor enumerates its consumers. Cookie policy, privacy policy, and preferences content are consumers of this contract, not part of it.

```vue
<BaseModal :open="isOpen" :title="activeTitle" @close="isOpen = false">
  <component :is="activeContentComponent" />
</BaseModal>
```

#### Behavior and Accessibility

When opened, the native `dialog.showModal()` behavior provides modal focus containment. The close control receives initial focus, has an accessible name, and remains keyboard visible. The component stores the previously focused element, locks document scrolling while open, and restores both scrolling and focus on close or cleanup. The title is connected through `aria-labelledby`. Tall content scrolls inside the body while the header and close control remain visible; horizontal overflow is contained. Width, maximum height, and mobile spacing remain bounded by the viewport.

#### References

- Vue component and scoped shell styling: [BaseModal.vue](../../prototypes/components/modal/BaseModal.vue)
- Live generic prototype with custom and scrollable dynamic content: [modals.html](../../prototypes/design/components/modals.html)
- Prototype mount: [baseModalPrototype.js](../../prototypes/components/modal/baseModalPrototype.js)

### CookiePrivacyPolicy

[CookiePrivacyPolicy.vue](../../prototypes/components/features/CookiePrivacyPolicy/CookiePrivacyPolicy.vue) is the single public feature component for the complete cookie/privacy flow. The shared application shell mounts it independently from authentication state across public and authenticated pages. Its internal `PrivacyChoicesBanner` renders a slightly translucent, full-viewport-width bar attached to the bottom edge and visually integrated with the application/footer.

The main actions are `Accept All`, `Reject All`, and `Manage Preferences`. Accept All enables every optional category; Reject All disables every optional category while Essential remains enabled and core registration, login, session, security, and transactional behavior remain available. Manage Preferences opens `BaseModal` with `CookiePreferencesContent` and `Save Preferences`.

| Category | Prototype behavior |
| --- | --- |
| Essential Cookies | Always enabled and disabled for editing; covers authentication, session handling, security, and required application state. |
| Analytics Cookies | Optional checkbox for anonymous or aggregated product/traffic analytics. |
| Preference Cookies | Optional checkbox for interface or experience preferences. |
| Marketing Cookies | Optional checkbox for advertising, remarketing, pixels, or other optional tracking. |

`CookiePrivacyPolicy` renders one `BaseModal` and selects its active content dynamically: `CookiePreferencesContent`, `CookiePolicyContent`, or `PrivacyPolicyContent`. Policy bodies scroll independently over the current route. Opening or closing either policy is informational only: it neither writes consent nor hides the banner. Closing unsaved preferences also leaves the previous state unchanged.

The feature-local [useCookieConsent.js](../../prototypes/components/features/CookiePrivacyPolicy/useCookieConsent.js) owns consent categories, decision state, the active modal, persistence, and all consent actions. It preserves the existing versioned `tennis-ai-coach.cookie-consent.v1` browser `localStorage` contract, including compatibility with already-saved records. Valid consent hides the banner across navigation, refresh, login, and logout. Invalid, removed, or future-version data shows it again. Privacy Policy, Cookie Policy, and Cookie Settings actions use `TextButton` in the public footer or authenticated sidebar legal area; Cookie Settings reopens the same saved preferences flow without bringing back the initial banner.

`CookiePrivacyPolicy` has no props or emitted events. It owns composition of the feature-local state and components described below.

#### PrivacyChoicesBanner

[PrivacyChoicesBanner.vue](../../prototypes/components/features/CookiePrivacyPolicy/PrivacyChoicesBanner.vue) is the fixed consent-decision banner. It has no props. It emits `accept-all`, `reject-all`, `manage-preferences`, `open-cookie-policy`, and `open-privacy-policy`; the parent owns every resulting consent or modal action. It composes the shared `Button` and `TextButton` primitives and contains no persistence logic.

#### CookiePreferencesContent

[CookiePreferencesContent.vue](../../prototypes/components/features/CookiePrivacyPolicy/CookiePreferencesContent.vue) renders the preference form used inside `BaseModal`.

| Prop | Type | Default |
| --- | --- | --- |
| `analytics` | Boolean | `false` |
| `preferences` | Boolean | `false` |
| `marketing` | Boolean | `false` |

The component keeps an editable local selection synchronized with those props. Essential remains checked and disabled. Submitting emits `save` with `{ analytics, preferences, marketing }`; the parent persists the result and decides whether to close the modal or hide the banner.

#### CookiePolicyContent

[CookiePolicyContent.vue](../../prototypes/components/features/CookiePrivacyPolicy/CookiePolicyContent.vue) is presentational, scroll-ready Cookie Policy content rendered through the shared modal body. It has no props or emitted events and performs no consent action or persistence.

#### PrivacyPolicyContent

[PrivacyPolicyContent.vue](../../prototypes/components/features/CookiePrivacyPolicy/PrivacyPolicyContent.vue) is presentational, scroll-ready Privacy Policy content rendered through the shared modal body. It has no props or emitted events and performs no consent action or persistence.

- Public feature: [CookiePrivacyPolicy.vue](../../prototypes/components/features/CookiePrivacyPolicy/CookiePrivacyPolicy.vue)
- Internal feature components: [CookiePrivacyPolicy directory](../../prototypes/components/features/CookiePrivacyPolicy)
- Shared shell components: [BaseModal.vue](../../prototypes/components/modal/BaseModal.vue) and [TextButton.vue](../../prototypes/design/components/buttons/TextButton.vue)
- Visual design prototype: [cookie-consent-banner.html](../../prototypes/design/components/cookie-consent-banner.html)
- Feature mount adapter: [mountCookiePrivacyPolicy.js](../../prototypes/components/features/CookiePrivacyPolicy/mountCookiePrivacyPolicy.js), loaded once per multi-page prototype by the shared [app.js](../../prototypes/design/app.js) shell. It remains inside the feature rather than introducing an application module. The vanilla implementation in `app.js` exists only as a direct-`file://` preview fallback.

### Field

The field prototypes in `prototypes/components/fields/` demonstrate a label and native control with standard Vue `v-model`. They are reference implementations, without application, store, or API integration.

#### Shared Composable

[useField.js](../../prototypes/composables/useField.js) provides shared value updates, reset-to-initial-value behavior, and label detection. It is a composable, not a visual component. Each field-specific composable composes `useField` and adds only its specialized behavior.

The parent owns the value. The Vue component binds the control to its field-specific composable, and updates pass through `useField` to emit `update:modelValue`.

```text
useField
   ↓
useTextField / useNumberField / useSelectField / useDateField
   ↓
Corresponding Vue component
```

#### TextField

Single-line text input. Use it for names and other short free-text values.

`useTextField` composes the shared `useField` composable and adds text-clearing behavior.

- Vue component: [TextField.vue](../../prototypes/components/fields/TextField.vue)
- Composable: [useTextField.js](../../prototypes/composables/useTextField.js)
- Visual prototype: [text-field.html](../../prototypes/design/components/fields/text-field.html)



#### NumberField

Numeric input that converts entered values to numbers and represents an empty field as `null`. Use it for quantities or other numeric values.

`useNumberField` composes the shared `useField` composable and adds numeric conversion and unit increment/decrement behavior.

- Vue component: [NumberField.vue](../../prototypes/components/fields/NumberField.vue)
- Composable: [useNumberField.js](../../prototypes/composables/useNumberField.js)
- Visual prototype: [number-field.html](../../prototypes/design/components/fields/number-field.html)

#### SelectField

Native selection from supplied options, supporting single or multiple values. Use it when users choose from a predefined set of options.

`useSelectField` composes the shared `useField` composable and adds option selection and selected-option lookup.

- Vue component: [SelectField.vue](../../prototypes/components/fields/SelectField.vue)
- Composable: [useSelectField.js](../../prototypes/composables/useSelectField.js)
- Visual prototype: [select-field.html](../../prototypes/design/components/fields/select-field.html)

#### DateField

Native date input using `YYYY-MM-DD` strings without timezone conversion. Use it for calendar dates that do not require a time of day.

`useDateField` composes the shared `useField` composable and adds date assignment and clearing behavior.

- Vue component: [DateField.vue](../../prototypes/components/fields/DateField.vue)
- Composable: [useDateField.js](../../prototypes/composables/useDateField.js)
- Visual prototype: [date-field.html](../../prototypes/design/components/fields/date-field.html)

#### Usage and Source of Truth

These prototypes require a Vue 3 SFC build environment. Pass a unique `id` and a parent-owned `v-model`. Labels are optional; provide `aria-label` when omitting a visible label. Native attributes are forwarded to the control.

Use the linked HTML prototypes for visual design and the Vue files and composables for current props, events, and behavior. Keep shared behavior in `useField` and field-specific behavior in the corresponding composable; do not duplicate those implementations in this document.

### FeatureCard

Feature-specific presentational card for the Features page, not a shared UI primitive. Keep one production implementation at `frontend/src/components/features/FeatureCard.vue`; the Features page imports that implementation rather than duplicating the card or placing it in a shared component family. The parent supplies the `number`, `title`, and `description` props; pass a string such as `"01"` to preserve leading zeros. It contains no composable, application state, or data access.

- Vue component: [FeatureCard.vue](../../prototypes/components/cards/FeatureCard.vue)
- Visual reference: [feature-card.html](../../prototypes/design/components/cards/feature-card.html)

### RecaptchaField

Shared verification-field presentation used by both LoginForm and RegisterForm. The prototype exposes an accessible required checkbox through `v-model`, shows a reCAPTCHA-style label, and explicitly identifies itself as a visual prototype.

Production must replace the prototype confirmation with a provider-issued, short-lived token and send that token with the authentication request. The backend must verify the token, intended action, hostname, expiry, and provider result before processing Login or Register; the checkbox state is never a security signal.

- Vue component prototype: [RecaptchaField.vue](../../prototypes/components/fields/RecaptchaField.vue)
- Visual design prototype: [recaptcha-field.html](../../prototypes/design/components/fields/recaptcha-field.html)
- Page placements: [Login](../../prototypes/design/pages/login.html) and [Register](../../prototypes/design/pages/register.html)

### LoginForm

Dedicated login form containing an email field, password field, shared RecaptchaField, primary Login action, and Create Account navigation to the Register page. It composes SocialAuthButtons for Google, Facebook, and Apple. The prototype reports the selected provider without starting OAuth, authenticating, or retaining credentials.

- Vue component prototype: [LoginForm.vue](../../prototypes/components/forms/LoginForm.vue)
- Page prototype: [LoginPage.vue](../../prototypes/pages/LoginPage.vue)
- Runnable design prototype: [login.html](../../prototypes/design/pages/login.html)

### RegisterForm

Dedicated registration form containing first name, surname, email, phone, password, confirm-password, required terms/privacy agreement, and the shared RecaptchaField. It provides the primary Create Account action, an existing-account Login link, and SocialAuthButtons for Google, Facebook, and Apple. Social registration requires the terms/privacy checkbox first. The prototype performs only same-form password confirmation and visual feedback; it does not create an account, submit credentials, issue a provider token, start OAuth, or implement OTP/MFA.

- Vue component prototype: [RegisterForm.vue](../../prototypes/components/forms/RegisterForm.vue)
- Page prototype: [RegisterPage.vue](../../prototypes/pages/RegisterPage.vue)
- Runnable design prototype: [register.html](../../prototypes/design/pages/register.html)

### SocialAuthButtons

Shared Google, Facebook, and Apple authentication actions used by LoginForm and RegisterForm. It renders one SocialAuthButton per provider. The parent owns the OAuth start behavior and error state.

`SocialAuthButton` props:

- `provider` (required): `google`, `facebook`, or `apple`; selects the label and provider icon.
- `actionLabel`: leading label such as `Login` or `Continue`; defaults to `Continue`.
- `disabled`: disables the individual action.
- `loading`: disables the button, exposes its busy state, and changes the label to the provider connection state.
- event: `click(provider)`.

`SocialAuthButtons` props:

- `actionLabel`: forwarded to all three buttons.
- `disabled`: disables the group.
- `pendingProvider`: empty or one of the three provider keys; marks that provider busy and disables the other actions.
- event: `select(provider)`.

Production maps each selection to `POST /api/v1/auth/oauth/{provider}/start` and navigates only to the backend-returned provider authorization URL. Provider callbacks and token exchange are backend-owned; no provider secret or provider token belongs in this component.

- Vue button component: [SocialAuthButton.vue](../../prototypes/components/forms/SocialAuthButton.vue)
- Vue component prototype: [SocialAuthButtons.vue](../../prototypes/components/forms/SocialAuthButtons.vue)
- Visual design prototype: [social-auth-buttons.html](../../prototypes/design/components/buttons/social-auth-buttons.html)
- Page placements: [Login](../../prototypes/design/pages/login.html) and [Register](../../prototypes/design/pages/register.html)

### TopNav

Reusable public top navigation with the existing AI logo and Tennis AI Coach title and parent-supplied links. The current Vue prototype exposes login and register events; parent-owned handlers navigate Login to the dedicated Login page and Start Free/Register to the dedicated Register page. The approved visible navigation follows the dedicated prototype and Navigation Requirements in frontend.md. It owns the responsive menu toggle, Escape dismissal, and resize cleanup. It contains no authentication logic, routing, API access, or store integration.

- `items`: array of `{ label, href, active? }` objects; defaults to an empty array. Use unique `href` values. Optional `active` marks the current page.
- Login uses the shared [Button.vue](../../prototypes/design/components/buttons/Button.vue) with `variant="secondary"` and `size="small"`; clicking emits `login`.
- Start Free uses the same Button with `variant="primary"` and `size="small"`; clicking emits `register`.


#### Visual Design Reference

[public-navigation.html](../../prototypes/design/components/navigation/public-navigation.html) defines the branding, alignment, actions, link states, and mobile menu appearance. It takes precedence over the older two-action arrangement in the public layout.

#### Vue Implementation Reference

[TopNav.vue](../../prototypes/components/navs/TopNav.vue) defines the reusable component structure, props, menu interactions, and action events. It requires Vue 3.5+ (for instance-specific menu IDs) and an SFC/SCSS-capable build environment.

### SidebarNav

Reusable vertical application navigation with the existing AI logo and Coach title is a brand section. It renders only branding and navigation items, with mobile drawer controls; there is no Compose section or additional action area.

The parent/layout owns `items`, an array of `{ label, href, active?, icon? }` entries with unique `href` values. Links navigate normally to application pages; `active` sets the current-page state. Optional `icon` accepts a Vue icon component or registered component name supplied by the parent. Omit it to match the existing text-only design; no icon registry is built into the sidebar.

The component preserves the 244px desktop sidebar and phone drawer breakpoints. On phones, the menu control opens a modal drawer with focus containment, scroll locking, and dismissal through Close, Escape, backdrop, or a link. Resizing and unmounting release the scroll lock. It has no custom navigation events, authentication logic, API access, or store integration.

#### Visual Design Reference

[authenticated-navigation.html](../../prototypes/design/components/navigation/authenticated-navigation.html) defines the sidebar's appearance, branding, link states, and responsive layout.

#### Vue Implementation Reference

[SidebarNav.vue](../../prototypes/components/navs/SidebarNav.vue) defines the reusable component structure and drawer behavior. It uses the shared Button for drawer controls and requires Vue 3.5+ and an SFC/SCSS-capable build environment.

### BaseTable

Reusable presentational table based on the [History / Training Sessions table](../../prototypes/design/pages/history.html). It renders a supplied `title`, dynamic `columns` (`{ key, label }`), and `rows`; each column selects `row[column.key]`. Optional `rowKey` defaults to `id`, falling back to the row index when absent. Per-column `cell-<key>` slots receive `value`, `row`, and `column` for parent-owned formatting such as the existing status pills.

When the supplied columns contain both `Session Name` and `Focus` (matched by normalized label or key), `BaseTable` removes those two columns and appends a `Review` action column. Its default cell links to `row.reviewHref` when supplied, otherwise to `/sessions/{row[rowKey]}`, with the visible label `Review Session`. The `cell-reviewSession` slot can override that cell. If either trigger column is absent, the component returns and renders the original columns unchanged.

The parent supplies configuration and data through props and owns any integration with Pinia, the specified application state architecture. `BaseTable.vue` contains no store access, duplicated state, API calls, or History-specific business logic.

The table preserves the History panel, headers, borders, spacing, and local horizontal scrolling on phone-sized screens. Scoped CSS is prototype-level visual guidance; production styling can later use external styles or shared design tokens.

- Visual design prototype: [BaseTable.html](../../prototypes/design/components/tables/BaseTable.html)
- Vue component prototype: [BaseTable.vue](../../prototypes/components/tables/BaseTable.vue)

The HTML defines the visual reference; `BaseTable.vue` defines the reusable rendering component. A Vue 3.5+ SFC build environment is required.

### PaymentCardPlan

`PaymentCardPlan` is the single shared plan card used by Pricing and Subscription. Documentation, Vue prototypes, page entries, and visual prototypes use this one authoritative identity. Do not create separate plan-card components for performance, selected, or subscription states; selected and current-plan presentation are states of this component.

| Prop | Type / default | Display responsibility |
| --- | --- | --- |
| `planName` | Required string | Plan name |
| `price` | String, empty by default | Parent-formatted price such as `€19`; the component performs no calculation |
| `billingPeriod` | String, empty by default | Text after the slash, such as `month`; hidden when absent |
| `description` | String, empty by default | Existing short plan description; hidden when absent |
| `features` | String array, empty by default | Optional feature list; hidden when empty |
| `statusLabel` | String, empty by default | Current-plan status such as `Active · demo`; independent of selection |
| `selected` | Boolean, `false` | Presentation-only selected outline, label and primary action styling |
| `selectedLabel` | String, `Most popular` | Existing Pricing highlight label; empty hides the label |
| `actionLabel` | String, empty | Explicit button label; otherwise `Change plan` when `statusLabel` exists or `Choose plan` |

The explicit TypeScript-facing contract is:

```ts
export type PaymentCardPlanProps = {
  planName: string
  price?: string
  billingPeriod?: string
  description?: string
  features?: string[]
  statusLabel?: string
  selected?: boolean
  selectedLabel?: string
  actionLabel?: string
}

export type PaymentCardPlanEmits = {
  (event: 'action'): void
}
```

```vue
<PaymentCardPlan
  plan-name="Performance"
  price="€19"
  billing-period="month"
  description="Realtime coaching, richer insights and session review tools."
  :selected="true"
/>
```

Selection does not change plan data, price, subscription state or entitlement. It reproduces Pricing's existing `2px solid #b7ff4a80` outline, Most popular eyebrow and primary Button. Non-selected Pricing cards use a secondary Button. Subscription supplies `statusLabel="Active · demo"` and `actionLabel="Change plan"`; the status label is independent of `selected`. The existing `.pricing` container controls compact title/price/description ordering, while Subscription retains its current-plan hierarchy. These are presentation states of one component.

Emits `action` without a payload through a shared Button `click`. The page owns actions and data. Cards contain no callback prop, store access, backend request, price calculation or billing logic.

- Vue implementation: [PaymentCardPlan.vue](../../prototypes/components/cards/PaymentCardPlan.vue).
- Normal design prototype: [payment-card-plan.html](../../prototypes/design/components/cards/payment-card-plan.html).
- Selected design prototype: [payment-card-plan-selected.html](../../prototypes/design/components/cards/payment-card-plan-selected.html). Both files illustrate the same shared Vue component; selected is a presentation state.
- Page owners: [pricing/main.js](../../prototypes/pricing/main.js) and [subscription/main.js](../../prototypes/subscription/main.js). The authenticated Pricing page owns plan selection and continues to the protected Checkout prototype; Subscription preserves the existing informational Change plan message.

### BillingDetailsCard

Reusable billing-details presentation taken directly from Subscription: heading, next-renewal text, payment-method text and Manage billing action. It is distinct from a plan card and adds no billing fields or real integration.

| Prop | Type / default | Display responsibility |
| --- | --- | --- |
| `title` | String, `Billing details` | Card heading |
| `renewalText` | Required string | Existing renewal line, currently `Next renewal: Oct 26, 2026 (illustrative).` |
| `paymentMethodText` | Required string | Existing payment-method line, currently `Payment method: Not connected.` |
| `actionLabel` | String, `Manage billing` | Shared secondary Button label |

The explicit TypeScript-facing contract is:

```ts
export type BillingDetailsCardProps = {
  title?: string
  renewalText: string
  paymentMethodText: string
  actionLabel?: string
}

export type BillingDetailsCardEmits = {
  (event: 'action'): void
}
```

Example usage keeps the two visible billing fields exactly as they appear in Subscription:

```vue
<BillingDetailsCard
  renewal-text="Next renewal: Oct 26, 2026 (illustrative)."
  payment-method-text="Payment method: Not connected."
  @action="openBillingMessage"
/>
```

Emits `action` without a payload via the shared secondary Button. The Subscription page owns the action and existing informational demo message. The component does not add billing address, invoices, card brand, last four digits, expiry, customer identifiers, or real integration because those fields are absent from the current Subscription UI.

Vue implementation: [BillingDetailsCard.vue](../../prototypes/components/cards/BillingDetailsCard.vue). Design prototype: [billing-details-card.html](../../prototypes/design/components/cards/billing-details-card.html). Both use Subscription's existing panel typography, spacing and content. The Compare pricing link stays in the Subscription page and points to the authenticated `pricing.html` prototype.

### PaymentStatusCard

`PaymentStatusCard` is the single presentational component for Subscription payment-return states. It reuses the existing Subscription panel, pill, typography, Button, spacing, radius, width, and responsive behavior rather than defining separate pending, success, failed, and cancelled card structures.

| Prop | Type / default | Display responsibility |
| --- | --- | --- |
| `status` | Required: `pending`, `success`, `failed`, `cancelled` | Selects the corresponding status label, heading, explanatory copy, note, action label, and restrained semantic pill color. |

Emits `action` without a payload when the shared primary/secondary action Button is activated. The parent owns retry, navigation, status refresh, or any later integration. The optional `secondary-action` slot accepts parent-owned navigation such as Back to Subscription. The component performs no request, redirect, payment verification, subscription mutation, or persistence.

The visual `success` state represents an already backend-verified successful outcome; it must never be inferred from a browser redirect or query parameter in production. The prototype query parameter selects only which visual design to preview.

- Vue component: [PaymentStatusCard.vue](../../prototypes/components/cards/PaymentStatusCard.vue)
- Design prototype: [payment-status-card.html](../../prototypes/design/components/cards/payment-status-card.html)
- Prototype mount: [payment-status/main.js](../../prototypes/payment-status/main.js)

### CollapseForm

Reusable collapsible form container based on the remaining Personal Information section in [Profile](../../prototypes/design/pages/profile.html). `title` is required; `description` is optional. Native `<details>` starts expanded and owns only its local collapse/expand UI state, including keyboard interaction and the plus/minus indicator.

The default slot accepts arbitrary fields, components, or layout containers. The named `footer` slot provides the existing wrapping two-button alignment. The parent supplies shared [Button](../../prototypes/design/components/buttons/Button.vue) instances, their labels, and their actions; use `primary` and `ghost` variants to reproduce Profile's Save/Reset appearance. No fields or buttons are hardcoded into `CollapseForm.vue`.

The parent reads Pinia/store values, passes them to slotted fields, receives field changes, and updates the store from its footer actions. `CollapseForm` holds no form data and never accesses or updates Pinia. It does not render a `<form>` or handle submission; the parent may wrap it in a form and own submit/reset behavior.

- Visual design reference: [CollapseForm.html](../../prototypes/design/components/forms/CollapseForm.html)
- Vue prototype: [CollapseForm.vue](../../prototypes/components/forms/CollapseForm.vue)

The HTML demonstrates Personal Information content and footer styling. Its buttons are visual-only; the Vue prototype provides the reusable container and slots. Styling remains prototype-level reference CSS.

### TrainingCamera

[TrainingCamera.vue](../../prototypes/components/training/TrainingCamera.vue) is the Training feature entry for camera and microphone acquisition. Its optional `endpoint` string prop defaults to an empty string and is forwarded to `CameraPreviewModal`. It emits no events.

The component composes shared `Button`, [useCameraSession.js](../../prototypes/composables/useCameraSession.js), and `CameraPreviewModal`. It owns Start Training, the temporary requesting/cancel state, permission-error presentation, and stopping the camera session when the modal closes. Media acquisition and stream cleanup remain in `useCameraSession`; analysis and modal presentation remain outside this component.

### CameraPreviewModal

[CameraPreviewModal.vue](../../prototypes/components/modal/CameraPreviewModal.vue) converts the [camera design](../../prototypes/design/pages/camera.html) into a viewport-sized modal inside Training without replacing the Training page or navigating.

The modal accepts `stream`, `endpoint`, and optional `analysisFps` (default 5). It emits `analysis-result` for parent-owned session handling and `close` after releasing media. The optional `overlay` slot receives the latest backend `result`. Microphone capture is active with a local mute control; video playback stays muted to prevent microphone loopback. No microphone upload or coaching-audio protocol is invented.

[useVideoAnalysis.js](../../prototypes/composables/useVideoAnalysis.js) owns a single paced capture/resize/JPEG loop (default maximum width 640px, 5 FPS; configurable up to 10 FPS), result/error state, and cancellation. [trainingTransport.js](../../prototypes/services/trainingTransport.js) owns WebSocket connection, bounded sending, message reception, and disconnect. No browser inference or fabricated coaching is performed. Stop Video Analysis stops only analysis; Return to Training, Escape, device loss, or unmount stop analysis and all camera/microphone tracks.

No backend-approved production transport contract exists yet. The proposed frontend-facing lifecycle creates the training session before analysis, uses only the short-lived WebSocket URL returned by the backend, asks the backend to finalize the session's canonical feedback and summary on completion, and abandons early exits as incomplete; see [integration contract examples](integration-contracts.md#training-session-and-analysis-transport). The proposed live transport sends binary JPEG frames and receives versioned JSON messages. The inspected prototype currently uses binary JPEG frames and JSON `{ type, payload }` messages as visual/behavioral guidance only. It accepts events including `stroke_analysis`, `player_feedback`, `ball_position`, `player_position`, `pose_analysis`, `training_instruction`, and `analysis_error`. Feedback text uses `payload.text` or `payload.message`; explicitly low-confidence text is withheld. The host/backend must provide authentication and validate this prototype contract before real integration. No endpoint is hardcoded; without one, only camera/microphone preview is available.

For production Vue/behavior separation, place the modal view at `frontend/src/components/training/CameraPreviewModal.vue` and its existing inline UI behavior in `frontend/src/composables/useCameraPreviewModal.ts`: dialog lifecycle, media attachment/detachment, microphone mute, feedback derivation, scroll restoration and closure. This is a planned extraction of inspected behavior, not an existing file or new feature. Keep capture/cancellation in `frontend/src/composables/useVideoAnalysis.ts`, transport in `frontend/src/services/trainingTransport.ts`, and camera acquisition/track ownership in `frontend/src/composables/useCameraSession.ts`. The modal requests track release through that owner on close/device loss/unmount; it does not independently stop the same tracks again. The feature forwards results to session state and the existing overlay slot. These mappings define responsibility without adding business logic to any Button.

Run the Training prototype using [prototypes/README.md](../../prototypes/README.md). Existing field composables now have one canonical copy under `prototypes/composables/`; field behavior is unchanged.

### Checkout cards

The [Checkout HTML prototype](../../prototypes/design/pages/checkout.html) remains the single page-level visual reference for its three Checkout feature cards. The Vue cards reuse its classes from [style.css](../../prototypes/design/style.css), preserving headings, spacing, fields, table structure, and actions. No separate card pages are required.

The existing prototype [Checkout entry](../../prototypes/checkout/main.js) mounts the Checkout plan-summary component and supplies all dynamic display values through props and owns the demo checkout action and feedback state. Cards contain no composables, fetching, store access, payment calculations, or page-level business logic. Static labels match the prototype. Use unique `headingId` / `idPrefix` values when rendering multiple instances.

#### PerformanceCard

[PerformanceCard.vue](../../prototypes/components/cards/PerformanceCard.vue) is the existing Checkout order-summary presentation, not the selectable Pricing/Subscription plan card. Checkout is outside the plan-card unification scope: it shows a selected order's description, formatted price, billing note and back link, without Choose/Change plan actions or a feature list.

Its existing required string props are `headingId`, `badge`, `plan`, `description`, `price`, `period`, `billingNote`, `backLabel`, and `backHref`. The page owns formatting and navigation destinations. It performs no billing calculation or transaction. Do not merge these props into PaymentCardPlan merely to reconcile the older proposed architecture.

#### PaymentInformationCard

[PaymentInformationCard.vue](../../prototypes/components/cards/PaymentInformationCard.vue) presents exactly the four disabled fields in Checkout: Cardholder name, Card number, Expiry date, and Security code.

All props are required strings: `idPrefix`, `title`, `description`, `cardholderDisplay`, `cardNumberDisplay`, `expiryDisplay`, and `securityCodeDisplay`. Only demo or masked display values belong in these props. Inputs remain disabled; the card does not collect, emit, submit, or store payment credentials. Real checkout remains subject to the protected payment-provider integration specified by the project.

#### OrderSummaryCard

[OrderSummaryCard.vue](../../prototypes/components/cards/OrderSummaryCard.vue) presents the Plan, Billing period, Subtotal, Tax, and Demo total rows, explanatory note, Complete checkout action, Cancel link, and status message.

Required string props: `headingId`, `title`, `plan`, `billingPeriod`, `subtotal`, `tax`, `total`, `note`, `actionLabel`, `cancelLabel`, and `cancelHref`. `statusMessage` is an optional string defaulting to empty. Amounts are supplied as formatted display strings. The action emits `complete` without a payload; the page handles it and supplies any resulting status message. Cancel follows `cancelHref`. The card performs no transaction or subscription logic.

### HomePageInfoSection

- Vue component: `HomePageInfoSection`
- Vue source: [HomePageInfoSection.vue](../../prototypes/components/sections/HomePageInfoSection.vue)
- HTML prototype: [home-page-info-section.html](../../prototypes/design/components/sections/home-page-info-section.html)

Reusable Home feature section containing the existing eyebrow, headline, description, both CTA links and all three feature cards. Production CTA actions use the shared Button contract above, with page/feature-owned handlers; no page-specific button components are introduced. The current prototype still contains inline CTA links and must be adapted during implementation, preserving navigation semantics. `trainingHref` and `dashboardHref` default to the existing Home page destinations. It reuses the Home styles and measures headline alignment on mount, font readiness and resize, cleaning up its observer on unmount. Home mounts it through `prototypes/home/main.js`; direct `file://` previews preserve the equivalent static markup.


### HomePageVideoSlider

- Vue component: `HomePageVideoSlider`
- Authoritative implementation entry: [HomePageVideoSlider.vue](../../prototypes/components/sliders/home-page-video-slider/HomePageVideoSlider.vue). Use this existing Vue component and its local collaborators/styles as the slider reference; no separate slider HTML entry is required.
- Home integration entry: [prototypes/home/main.js](../../prototypes/home/main.js) imports the component and mounts it at `home-slider-root`.

Reusable Home feature component containing the application video slider and interactive AI tennis analysis preview. The component uses `Pixi.js` for rendering, animations and visual overlay logic. It includes the video slider, microphone control, audio connection state, three information/status control elements and Motion Tracking visualization. Motion Tracking displays analysis overlays such as body tracking lines, movement vectors, angles and biomechanical values synchronized with the active video sequence. The component owns its video and slider state, microphone interaction, analysis timing, Pixi.js rendering lifecycle, resize handling and cleanup on unmount.
HomePageVideoSlider implementation details: `HomePageVideoSlider.vue` owns all DOM refs and interacts only with a `SliderController` instance through explicit `init()`, `play()` and `destroy()` calls, handling initialization errors in Vue. `SliderController.js` owns `PixiRenderer`, `VideoTimelineController`, `SliderLifecycle`, and `AIMotionTrackingPanel`, validating required elements before async initialization and coordinating cleanup. `play()` starts playback without calling `init()`. `AIMotionTrackingPanel.js` independently rotates demo Phase statuses every 2.5 seconds in the existing panel; `SliderController` starts its single interval on playback and clears it on destruction. Video pause/resume and seek handlers do not update tracking text. Local `SliderConfig.js` contains static timing and annotation data; `PixiRenderer.js` handles overlays; `VideoTimelineController.js` creates the main timeline and initializes `AudioTimeline` in `init()`. `play()` coordinates video playback and `AudioTimeline.play()` through public APIs. `AudioTimeline.js` owns coaching, typing and microphone UI; `PlayerAnalysisTimeline.js` owns the analysis phase and starts an `AnimationTimeline` GSAP sequence nested within that phase. Segment tweens control drawing order, progress and label alpha; `PixiRenderer` only prepares geometry, draws individual segments/labels and renders the stage. Both GSAP timelines repeat indefinitely. Coaching sentences occupy equal slots across the full configured slider cycle (currently five 4.8-second slots across 24 seconds, each with 3.3 seconds of sentence display and 1.5 seconds of `...`), independently of freezes. Explicit pause points at `timelineItem.time / playbackRate` invoke `onVideoPause()`, stopping the main timeline and video. `PlayerAnalysisTimeline` creates its GSAP timeline only when a hold begins, runs the drawing sequence and invokes `onVideoResume()` after the configured duration; drawing stays in `PixiRenderer`. The controller exposes `init()`, `play()`, `pause()` and `destroy()`; `SliderLifecycle.js` handles only video errors (showing the error UI and pausing video through the controller) and removes its listener on destruction. `SliderController.play()` starts the video controller directly after initialization. Visibility, page hide/show, resize, intersection, readiness, buffering and seek events no longer drive automatic playback control. There is no separate RAF loop, hold timer or Pixi ticker for video timing. All class files use PascalCase names. `slider.css` preserves the presentation. The component imports its video from its own `assets/` directory. No composable or service is used. HTML-only/file previews retain the original Canvas demo, using the same relocated video asset; Home under Vite mounts the Vue/Pixi component. Microphone/status cues remain illustrative, with no audio recording.
