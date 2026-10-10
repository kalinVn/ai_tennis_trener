## Required Pages and Routes


### Home Page
- purpose: `Main public entry page of the application`
- route: `/`
- layout: `Public Layout`
- Example Prototype: `design/pages/index.html`
- name: `home`
- description: `Left Section: application branding and introductory information, main headline, short introductory description, two primary action buttons, small statistic or information cards. Right Section: Animated Banner, animated visual preview of the Tennis AI Coach training and AI analysis experience.HomePageInfoSection renders the left section directly from the Home Page prototype, with CTA actions using shared Button and parent-owned handlers; do not introduce additional static-section or page-specific button components.`
- required shared components: `Button`
- required feature components: `HomePageInfoSection`, `HomePageVideoSlider`
- dependencies: None

### Features
- purpose: `Public page that presents the core capabilities of the product and helps users understand what it can do.`
- route: `/features`
- layout: `Public Layout`
- Example Prototype: `design/pages/features.html`
- name: `feature`
- description: `Main Section: headline, short description, three FeatureCard items, and two primary buttons. The Features page should follow the Public Layout and match the prototype directly for the page title, secondary description, and all other page-level content; only the Feature Cards and buttons should use reusable components.`
- required shared components: `Button`, `FeatureCard`
- required feature components: None
- dependencies: None

### Training
- purpose: `Primary page for real-time training where the user records strokes, sees instant analysis, and receives guidance.`
- route: `/training`
- layout: `Training Layout`
- Example Prototype: `design/pages/training.html`
- name: `training`
- description: `Follow the referenced Training HTML prototype for the page title, secondary text, section titles, descriptions, fields, labels, buttons/actions, and all other page-level content. The current prototype contains the camera preview/entry area and Coaching Cue, Connection, and Session panels; it contains no collapsible form sections, so do not invent any. Where the referenced prototype contains collapsible form sections, use the existing CollapseForm component. The Training page component owns and creates each such form configuration, deriving its title, secondary description, fields, labels, relevant field configuration, buttons/actions, and other required content directly from that prototype. Supply the corresponding CollapseForm instances through their existing title/description props and page-rendered default/footer slots; Training-specific data, configuration, form handling, and actions belong to the page, while CollapseForm remains generic and reusable. Implement all remaining elements directly as page-level DOM/layout matching the prototype; do not extract static sections into new components. Keep the shared Button for Start Training near the camera preview. Preserve the existing camera/full-screen training modal or camera training flow, reusing its implementation without duplicate camera logic or a second training flow. Do not invent fields, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `Button`; `CollapseForm` only for collapsible form sections present in the referenced prototype (none in the current prototype).
- required feature components: None
- dependencies: None

### Pricing
- purpose: `Pricing page, presents the available subscription plans and helps users choose the right plan`
- route: `/pricing`
- Layout: `Public Layout`
- Example Prototype: `design/pages/pricing.html`
- name: `pricing`
- description: `Follow the Pricing prototype directly for the complete page structure and all page-level content. Use the shared PaymentCardPlan component for the Starter, Performance, and Pro pricing plan cards. All other headings, descriptions, sections, labels, supporting content, and layout remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `PaymentCardPlan`
- required feature components: None
- dependencies: None

### Dashboard
- purpose: `Provides the user with an overview of their training activity, recent sessions, progress, and quick access to the main application features.`
- route: `/dashboard`
- layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/dashboard.html`
- name: `dashboard`
- description: `Follow the Dashboard prototype directly for all page content, sections, containers, text, and visual structure, implemented as page-level DOM/layout. Do not introduce page-specific shared components or extract static sections into reusable components. Keep Session History available as defined in the prototype. Each returned session row opens Session Review using its server-supplied session id. Sidebar and top header remain provided by the Authenticated Application Layout and are not part of the page sections.`
- required shared components: None
- required feature components: None
- data contract: `GET /api/v1/dashboard`; example response shape is in [integration contract examples](integration-contracts.md#dashboard-profile-and-settings-data).
- states: loading, empty, success, recoverable error, unavailable.
- dependencies: None


### History
- purpose: `allows the user to review previous training sessions, results, performance metrics, and past coaching feedback`
- Route: `/history`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/history.html`
- description: `Follow the History HTML/design prototype for all sections and page-level elements. Use the existing shared BaseTable component for the session/history table. All other headings, descriptions, controls, containers, filters, surrounding layout, and visual elements remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `BaseTable`
- required feature components: None
- data contract: `GET /api/v1/training/sessions`; example pagination and response shape are in [integration contract examples](integration-contracts.md#session-history-session-review-and-progress-data).
- states: loading, empty, success, recoverable error, unavailable.
- dependencies: `TrainingHistoryStore`

### Session Review

- purpose: Review a previous training session's supported results and coaching feedback, including available key moments, movement trends, and next recommended focus.
- page/component: `frontend/src/pages/SessionReviewPage.vue`.
- route: `/sessions/:sessionId`
- name: `session-review`
- layout: `Authenticated Application Layout`
- access: Authenticated; the backend authorizes access to the requested session.
- route parameters: required `sessionId` opaque identifier. Reject malformed identifiers and show not-found/unauthorized states without leaking whether another user's session exists.
- navigation destination: Session rows on History and Dashboard link to this route using their returned session ids. Session Review is not a top-level sidebar item; History remains the active navigation section.
- data contract: `GET /api/v1/training/sessions/{sessionId}/review`; see [frontend integration contract examples](integration-contracts.md#session-history-session-review-and-progress-data).
- visual references: [History](../../prototypes/design/pages/history.html) and [Training Session Card](../../prototypes/design/components/training-session-card.html). These provide visual cues only; they do not establish data or behavior beyond this entry.
- state owner: `frontend/src/stores/TrainingHistoryStore.ts`; data access: `frontend/src/services/sessionService.ts`.
- states: loading, not found/unauthorized, success, partial/insufficient data, recoverable error, unavailable.

### Progress

- purpose: Present supported trends, improvement areas, and the next recommended focus.
- page/component: `frontend/src/pages/ProgressPage.vue`.
- route: `/progress`
- name: `progress`
- layout: `Authenticated Application Layout`
- access: Authenticated; the backend authorizes progress data.
- route parameters: None. Load the backend-provided default range. Do not add date-range controls until a product requirement calls for them.
- navigation destination: Authenticated sidebar item `Progress`, placed after History. Compact Dashboard progress summaries may link here.
- data contract: `GET /api/v1/progress` using its backend default range; see [frontend integration contract examples](integration-contracts.md#session-history-session-review-and-progress-data).
- visual references: [Dashboard](../../prototypes/design/pages/dashboard.html) and [Charts & Progress](../../prototypes/design/components/charts-progress.html). These are partial visual references; they do not authorize fabricated metrics or charts.
- state owner: `frontend/src/stores/ProgressStore.ts`; data access: `frontend/src/services/progressService.ts`.
- states: loading, empty/insufficient data, success, recoverable error, unavailable.

### Application State Matrix

| Surface | Loading | Empty / partial | Error / unavailable | Success owner |
| --- | --- | --- | --- | --- |
| Dashboard | Dashboard request pending | No sessions/focus is an honest empty state | Retry dashboard request; preserve shell | Server response |
| History | Session list pending | Empty list is successful | Retry current cursor; preserve filters | Server response |
| Session Review | Review request pending | Insufficient supported result is labeled | Safe not-found/unauthorized; retry recoverable failures | Server-authorized review response |
| Progress | Progress request pending | `insufficient_data` or no measurements | Retry same range | Server response; focus is never generated in browser |
| Training | Camera/transport/analysis transitions shown separately | Waiting for first supported result | Camera and transport failures remain distinct | Backend analysis/session events |
| Subscription / Checkout | Subscription or checkout verification pending | No active plan is distinct from unknown state | Retry server/provider state | Backend-verified billing response |
| Profile / Settings | Load/save pending | Optional values can be empty | Retain last confirmed values and user edits | Successful server save |
| Authentication | Session lookup/request pending | Signed out is distinct from lookup failure | Field/challenge/session errors shown | Backend session/auth response |

Recovery behavior and shared error semantics are detailed in [integration contract examples](integration-contracts.md#page-state-and-recovery-matrix).

### Subscription
- purpose: `allows the user to view their current subscription plan, manage billing details, and change or upgrade their subscription.`
- Route: `/subscription`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/subscription.html`
- description: `Required section is the Subscription section, which includes a page heading, a short description, and two main cards: the Current Subscription Card and the Billing or Plan Management Card. Render the current plan using shared PaymentCardPlan; statusLabel represents the current subscription, while selected only changes presentation. Use BillingDetailsCard for the existing billing panel. Change plan and Manage billing actions belong to the page; preserve informational demo messages. Compare public pricing remains a page-level link to pricing.html.`
- required shared components: `PaymentCardPlan`, `BillingDetailsCard`
- required feature components: None
- data contract: `GET /api/v1/billing/subscription` and provider-hosted customer portal; see [integration contract examples](integration-contracts.md#checkout-and-billing).
- states: loading, no active subscription, active, pending change, recoverable error, unavailable.
- dependencies: None

### Profile
- purpose: `Allow authenticated users to view and manage their profile and account information.`
- Route: `/profile`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/profile.html`
- name: `profile`
- description: `Follow the referenced Profile HTML prototype for the page title, secondary text, section titles, secondary descriptions, fields, labels, buttons/actions, and all other page-level content. The four collapsible sections are Personal Information, Tennis Profile (including Training Goals), Physical Information, and Account Overview; each uses the existing CollapseForm component. The Profile page component owns and creates the data/configuration for each section, deriving its title, secondary description, all fields and their labels and relevant configuration (including types, options, validation constraints, and read-only attributes), buttons/actions, and any additional content directly from the prototype. Supply each CollapseForm instance from this page-owned configuration through its existing title/description props and page-rendered default/footer slots for fields, actions, and other content. Profile-specific values, configuration, form handling, and actions remain in the Profile page; CollapseForm stays generic and reusable. Do not create separate components for individual Profile sections unless explicitly required elsewhere. Implement all remaining page-level elements directly as DOM/layout matching the prototype. Do not invent fields, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `CollapseForm`
- required feature components: None
- data contract: `GET/PATCH /api/v1/users/me`; example ownership and response handling are in [integration contract examples](integration-contracts.md#dashboard-profile-and-settings-data).
- states: loading, loaded, validation error, save pending, recoverable error, unavailable.
- dependencies: `UserStore`

### Settings

- Route: `/settings`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/settings.html`
- name: `settings`
- description: `Follow the referenced Settings HTML prototype as the source of truth for the page title, secondary text, all collapsible sections, and all other page-level content. Each collapsible section uses the existing shared CollapseForm component. The Settings page owns and creates each section's data/configuration directly from the prototype. Pass only the section title/header and secondary title/description through the existing title and description props. Define and render all section-specific fields, labels, selects, controls, buttons, actions, and other body content in the Settings page, supplying that content through CollapseForm's default slot and its footer slot where appropriate. Field configuration, values, validation, form handling, and action behavior remain owned by the Settings page; do not pass a field schema to CollapseForm or move Settings-specific content or behavior into it. Keep CollapseForm generic and reusable. Do not create separate components for individual Settings sections unless explicitly required elsewhere. Implement all remaining page-level elements directly as DOM/layout matching the Settings prototype. Do not invent fields, controls, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `CollapseForm`
- required feature components: None
- data contract: `GET/PATCH /api/v1/users/me/preferences`; example ownership and response handling are in [integration contract examples](integration-contracts.md#dashboard-profile-and-settings-data).
- states: loading, loaded, validation error, save pending, recoverable error, unavailable.
- dependencies: `UserStore`

### Not Found

- Route: `/not-found`
- Layout: `Public Layout`
- Example Prototype: `design/pages/not-found.html`
- name: `not-found`
- description: `The page show 404 not found`
- required shared components: None
- required feature components: None
- dependencies: None


### Checkout

- Route: `/checkout`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/checkout.html`
- name: `checkout`
- description: `The Checkout page contains two main sections: a left section with the existing Checkout PerformanceCard and PaymentInformationCard components stacked vertically, and a right section with an OrderSummaryCard component. Start through the provider-hosted checkout contract, verify every return state with the backend, and retain pending/cancelled/failed/expired/recoverable-error states.`
- required shared components: None
- required feature components: `PerformanceCard`, `PaymentInformationCard`, `OrderSummaryCard`
- data contract: provider-hosted checkout start and server-verified return; see [integration contract examples](integration-contracts.md#checkout-and-billing).
- states: pending, succeeded only after backend verification, cancelled, failed, expired, recoverable error, unavailable.
- dependencies: `CheckoutStore`

---
