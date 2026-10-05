CSS in the prototype Vue components is for visual reference only; production styles may live outside components and use shared design tokens.

### Button

- `Button` is a reusable shared UI component.
- Used for user actions throughout the application.
- Supports the following variants:
  - `primary`
  - `secondary`
- Supports the following sizes:
  - `small`
  - `medium`
  - `large`
- Supports the following states:
  - `default`
  - `hover`
  - `active`
  - `disabled`
  - `loading`
- Supports the following button types:
  - `button`
  - `submit`
- Displays text content and may optionally include an icon.
- Emits a `click` event to the parent component when activated.
- The parent component handles the event and decides which action should be executed.
- The component must not contain page-specific or business logic.
- The component must not directly access application stores, backend APIs, routing logic, or page-specific functionality.
- Actions such as navigation, opening a modal, saving data, updating a store, or starting a feature are handled by the parent component.

#### Design Reference

Visual design prototypes for the Button component:

`prototypes/design/components/buttons`

Use these prototypes as the source of truth for the visual appearance of the Button, including variants, sizes, states, spacing, colors, typography, borders, and interaction states.

#### Implementation Reference

Vue implementation prototype for the shared Button component:

`prototypes/design/components/buttons`

This reference defines the expected Vue component structure, props, emitted events, controller logic, and SCSS organization.

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

Presentational card for a numbered feature, title, and description. The parent supplies the `number`, `title`, and `description` props; pass a string such as `"01"` to preserve leading zeros. It contains no composable, application state, or data access.

- Vue component: [FeatureCard.vue](../../prototypes/components/cards/FeatureCard.vue)
- Visual reference: [feature-card.html](../../prototypes/design/components/cards/feature-card.html)

### TopNav

Reusable public top navigation with the existing AI logo and Tennis AI Coach title, parent-supplied links, and two authentication actions. It owns the responsive menu toggle, Escape dismissal, and resize cleanup. It contains no authentication logic, routing, API access, or store integration.

- `items`: array of `{ label, href, active? }` objects; defaults to an empty array. Use unique `href` values. Optional `active` marks the current page.
- Login uses the shared [Button.vue](../../prototypes/design/components/buttons/Button.vue) with `variant="secondary"` and `size="small"`; clicking emits `login`.
- Start Free uses the same Button with `variant="primary"` and `size="small"`; clicking emits `register`.


#### Visual Design Reference

[public-navigation.html](../../prototypes/design/components/navigation/public-navigation.html) defines the branding, alignment, link states, and mobile menu appearance. The existing [public layout](../../prototypes/design/layouts/public.html) supplies the two-action arrangement.

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

The parent supplies configuration and data through props and owns any integration with Pinia, the specified application state architecture. `BaseTable.vue` contains no store access, duplicated state, API calls, or History-specific business logic.

The table preserves the History panel, headers, borders, spacing, and local horizontal scrolling on phone-sized screens. Scoped CSS is prototype-level visual guidance; production styling can later use external styles or shared design tokens.

- Visual design prototype: [BaseTable.html](../../prototypes/design/components/tables/BaseTable.html)
- Vue component prototype: [BaseTable.vue](../../prototypes/components/tables/BaseTable.vue)

The HTML defines the visual reference; `BaseTable.vue` defines the reusable rendering component. A Vue 3.5+ SFC build environment is required.

### PaymentPlanCard

Reusable presentational subscription card based on the Performance plan card in [Subscription](../../prototypes/design/pages/subscription.html). It displays the plan name, price, billing period, feature list, active badge, and the shared primary Button. A parent can render multiple cards for Change Plan, supplying each plan independently.

- `plan`, `currency`, `value`, `period`: parent-supplied display values; `value` accepts a string or number. The card displays currency before value and `/` before period, without billing calculations or currency conversion.
- `features`: array of feature strings, displayed as a plain list matching the original summary styling.
- `active`: shows the current-plan badge; defaults to `false`.
- `activeLabel`: badge text; defaults to `Active`. The HTML specimen uses `Active · demo` to match the original.
- `actionLabel`: optional button text; otherwise shows `Change plan` when active and `Choose plan` when inactive. Clicking emits `action` for the parent to handle.

The parent owns plan data, store integration, and action handling. The card contains no Pinia access, API calls, subscription logic, or billing state. It reuses [Button.vue](../../prototypes/design/components/buttons/Button.vue) without duplicating its styling.

- Visual design reference: [PaymentPlanCard.html](../../prototypes/design/components/cards/PaymentPlanCard.html)
- Vue prototype: [PaymentPlanCard.vue](../../prototypes/components/cards/PaymentPlanCard.vue)

### CollapseForm

Reusable collapsible form container based on the Tennis Profile section in [Profile](../../prototypes/design/pages/profile.html). `title` is required; `description` is optional. Native `<details>` starts expanded and owns only its local collapse/expand UI state, including keyboard interaction and the plus/minus indicator.

The default slot accepts arbitrary fields, components, or layout containers. The named `footer` slot provides the existing wrapping two-button alignment. The parent supplies shared [Button](../../prototypes/design/components/buttons/Button.vue) instances, their labels, and their actions; use `primary` and `ghost` variants to reproduce Profile's Save/Reset appearance. No fields or buttons are hardcoded into `CollapseForm.vue`.

The parent reads Pinia/store values, passes them to slotted fields, receives field changes, and updates the store from its footer actions. `CollapseForm` holds no form data and never accesses or updates Pinia. It does not render a `<form>` or handle submission; the parent may wrap it in a form and own submit/reset behavior.

- Visual design reference: [CollapseForm.html](../../prototypes/design/components/forms/CollapseForm.html)
- Vue prototype: [CollapseForm.vue](../../prototypes/components/forms/CollapseForm.vue)

The HTML demonstrates the original Tennis Profile content and footer styling. Its buttons are visual-only; the Vue prototype provides the reusable container and slots. Styling remains prototype-level reference CSS.

### CameraPreviewModal

[CameraPreviewModal.vue](../../prototypes/components/modal/CameraPreviewModal.vue) converts the [camera design](../../prototypes/design/pages/camera.html) into a viewport-sized modal inside Training. [TrainingCamera.vue](../../prototypes/components/training/TrainingCamera.vue) requests camera and microphone through [useCameraSession.js](../../prototypes/composables/useCameraSession.js), then mounts the modal without replacing Training or navigating.

The modal accepts `stream`, `endpoint`, and optional `analysisFps` (default 5). It emits `analysis-result` for parent-owned session handling and `close` after releasing media. The optional `overlay` slot receives the latest backend `result`. Microphone capture is active with a local mute control; video playback stays muted to prevent microphone loopback. No microphone upload or coaching-audio protocol is invented.

[useVideoAnalysis.js](../../prototypes/composables/useVideoAnalysis.js) owns a single paced capture/resize/JPEG loop (default maximum width 640px, 5 FPS; configurable up to 10 FPS), result/error state, and cancellation. [trainingTransport.js](../../prototypes/services/trainingTransport.js) owns WebSocket connection, bounded sending, message reception, and disconnect. No browser inference or fabricated coaching is performed. Stop Video Analysis stops only analysis; Return to Training, Escape, device loss, or unmount stop analysis and all camera/microphone tracks.

No real backend transport contract exists yet. The explicit prototype contract is binary JPEG frames sent to a configured WebSocket endpoint and JSON `{ type, payload }` messages returned. It accepts events including `stroke_analysis`, `player_feedback`, `ball_position`, `player_position`, `pose_analysis`, `training_instruction`, and `analysis_error`. Feedback text uses `payload.text` or `payload.message`; explicitly low-confidence text is withheld. The host/backend must provide authentication and validate this prototype contract before real integration. No endpoint is hardcoded; without one, only camera/microphone preview is available.

Run the Training prototype using [prototypes/README.md](../../prototypes/README.md). Existing field composables now have one canonical copy under `prototypes/composables/`; field behavior is unchanged.

### Checkout cards

The [Checkout HTML prototype](../../prototypes/design/pages/checkout.html) remains the single page-level visual reference for these three reusable feature cards. The Vue cards reuse its classes from [style.css](../../prototypes/design/style.css), preserving headings, spacing, fields, table structure, and actions. No separate card pages are required.

The [Checkout entry](../../prototypes/checkout/main.js) supplies all dynamic display values through props and owns the demo checkout action and feedback state. Cards contain no composables, fetching, store access, payment calculations, or page-level business logic. Static labels match the prototype. Use unique `headingId` / `idPrefix` values when rendering multiple instances.

#### PerformanceCard

[PerformanceCard.vue](../../prototypes/components/cards/PerformanceCard.vue) presents the selected Performance plan section, distinct from the subscription `PaymentPlanCard`.

All props are required strings: `headingId`, `badge`, `plan`, `description`, `price`, `period`, `billingNote`, `backLabel`, and `backHref`. The page supplies formatted price and period text; the card performs no formatting or billing calculation. Back to plans is a normal link to the supplied destination.

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

Reusable Home feature section containing the existing eyebrow, headline, description, both CTA links and all three feature cards. Buttons remain inline markup; no separate button components are introduced. `trainingHref` and `dashboardHref` default to the existing Home page destinations. It reuses the Home styles and measures headline alignment on mount, font readiness and resize, cleaning up its observer on unmount. Home mounts it through `prototypes/home/main.js`; direct `file://` previews preserve the equivalent static markup.


### HomePageVideoSlider

- Vue component: `HomePageVideoSlider`
- Vue source: [HomePageVideoSlider.vue](../../prototypes/components/sliders/home-page-video-slider/HomePageVideoSlider.vue)
- HTML prototype: [index.html](../../prototypes/components/sliders/home-page-video-slider/index.html)

Reusable Home feature component containing the application video slider and interactive AI tennis analysis preview. The component uses `Pixi.js` for rendering, animations and visual overlay logic. It includes the video slider, microphone control, audio connection state, three information/status control elements and Motion Tracking visualization. Motion Tracking displays analysis overlays such as body tracking lines, movement vectors, angles and biomechanical values synchronized with the active video sequence. The component owns its video and slider state, microphone interaction, analysis timing, Pixi.js rendering lifecycle, resize handling and cleanup on unmount.
HomePageVideoSlider implementation details: `prototypes/components/sliders/home-page-video-slider/slider.js` owns Pixi initialization, line/text rendering, pause and coaching timing, active microphone/status state, observers, listeners, and cleanup. `HomePageVideoSlider.vue` contains the markup and mount/unmount wiring; `slider.css` preserves the presentation. The component imports its video from its own `assets/` directory. No composable or service is used. HTML-only/file previews retain the original Canvas demo, using the same relocated video asset; Home under Vite mounts the Vue/Pixi component. Microphone/status cues remain illustrative, with no audio recording.
