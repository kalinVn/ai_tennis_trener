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
- required shared components: `Button`
- required feature components: `FeatureCard`
- dependencies: None

### Login Page
- purpose: `Allow an existing user to enter email/password credentials or choose a supported social login entry point.`
- route: `/login`
- layout: `Public Layout`
- Example Prototype: `design/pages/login.html`
- name: `login`
- description: `Dedicated public authentication page. Render the LoginForm with email and password fields, the shared RecaptchaField immediately before the primary Login action, a Create Account link to Register, and the shared SocialAuthButtons for Google, Facebook, and Apple. Authentication, OAuth, and reCAPTCHA verification authority remain on the backend; the prototype does not create a session, start an OAuth flow, or issue a real reCAPTCHA token.`
- required shared components: `Button`, `RecaptchaField`, `SocialAuthButtons`
- required feature components: `LoginForm`
- dependencies: None

### Register Page
- purpose: `Allow a new user to enter the details required to create an account and accept the terms/privacy agreement.`
- route: `/register`
- layout: `Public Layout`
- Example Prototype: `design/pages/register.html`
- name: `register`
- description: `Dedicated public registration page. Render the RegisterForm with first name, surname, email, phone, password, confirm-password, terms/privacy agreement, and the shared RecaptchaField immediately before the primary Create Account action, plus SocialAuthButtons for Google, Facebook, and Apple and an existing-account link to Login. Social registration requires legal consent before its backend OAuth start request. The prototype does not create an account, issue a real reCAPTCHA token, start OAuth, or implement OTP/MFA.`
- required shared components: `Button`, `RecaptchaField`, `SocialAuthButtons`
- required feature components: `RegisterForm`
- data contract: `POST /api/v1/auth/register` with the form's first name, surname, email, phone, password, legal consent, and provider reCAPTCHA token; confirm password is client-only. A successful `201 Created` response returns the created public user fields and an email-verification-required state; see [integration contract examples](integration-contracts.md#authentication-and-application-session).
- states: idle, validation error, reCAPTCHA required, submit pending, verification required, conflict, recoverable error, unavailable.
- dependencies: `AuthStore`

### Training
- purpose: `Primary page for real-time training where the user records strokes, sees instant analysis, and receives guidance.`
- route: `/training`
- layout: `Authentication Layout`
- Example Prototype: `design/pages/training.html`
- name: `training`
- description: `Follow the referenced Training HTML prototype for the page title, secondary text, section titles, descriptions, fields, labels, buttons/actions, and all other page-level content. The current prototype contains the camera preview/entry area and Coaching Cue, Connection, and Session panels; it contains no collapsible form sections, so do not invent any. Where the referenced prototype contains collapsible form sections, use the existing CollapseForm component. The Training page component owns and creates each such form configuration, deriving its title, secondary description, fields, labels, relevant field configuration, buttons/actions, and other required content directly from that prototype. Supply the corresponding CollapseForm instances through their existing title/description props and page-rendered default/footer slots; Training-specific data, configuration, form handling, and actions belong to the page, while CollapseForm remains generic and reusable. Implement all remaining elements directly as page-level DOM/layout matching the prototype; do not extract static sections into new components. Keep the shared Button for Start Training near the camera preview. Preserve the existing camera/full-screen training modal or camera training flow, reusing its implementation without duplicate camera logic or a second training flow. Do not invent fields, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `Button`; `CollapseForm` only for collapsible form sections present in the referenced prototype (none in the current prototype).
- required feature components: `TrainingCamera`, `CameraPreviewModal`
- data contract: Create the session with `POST /api/v1/training/sessions` before connecting to the backend-issued analysis WebSocket. Finish normally with `POST /api/v1/training/sessions/{sessionId}/complete`; use `POST /api/v1/training/sessions/{sessionId}/abandon` for cancellation or early exit. Reconnect keeps the same session id. See [integration contract examples](integration-contracts.md#training-session-and-analysis-transport).
- states: idle, creating session, ready, connecting, live, reconnecting, completing, complete, abandoning, incomplete, recoverable error, unavailable.
- dependencies: `AuthStore`, `TrainingSessionStore`

### Pricing
- purpose: `Pricing page, presents the available subscription plans and helps users choose the right plan`
- route: `/pricing`
- Layout: `Authentication Layout`
- access: Authenticated; unauthenticated access follows the protected-route login redirect and preserves only a validated internal return target.
- Example Prototype: `design/pages/pricing.html`
- name: `pricing`
- description: `Follow the Pricing prototype directly for the complete page structure and all page-level content. Use the shared PaymentCardPlan component for the Starter, Performance, and Pro pricing plan cards. All other headings, descriptions, sections, labels, supporting content, and layout remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `PaymentCardPlan`
- required feature components: None
- dependencies: `AuthStore`

### Dashboard
- purpose: `Provides the user with an overview of their training activity, recent sessions, and quick access to the main application features.`
- route: `/dashboard`
- layout: `Authentication Layout`
- Example Prototype: `design/pages/dashboard.html`
- name: `dashboard`
- description: `Follow the Dashboard prototype directly for all page content, sections, containers, text, and visual structure, implemented as page-level DOM/layout. Do not introduce page-specific shared components or extract static sections into reusable components. Keep Session History available as defined in the prototype. Each returned session row opens Session Review using its server-supplied session id. Sidebar and top header remain provided by the Authentication Layout and are not part of the page sections.`
- required shared components: None
- required feature components: None
- data contract: initial Dashboard aggregates and History items come from `GET /api/v1/user/data`; see [authenticated application data](integration-contracts.md#authenticated-application-data-and-persisted-user-updates). The page does not issue a separate initial Dashboard request.
- states: loading, empty, success, recoverable error, unavailable.
- dependencies: `UserStore`


### History
- purpose: `allows the user to review previous training sessions, results, performance metrics, and past coaching feedback`
- Route: `/history`
- Layout: `Authentication Layout`
- Example Prototype: `design/pages/history.html`
- description: `Follow the History HTML/design prototype for all sections and page-level elements. Use the existing shared BaseTable component for the collapsible Training Sessions table, showing only Date, Duration, Status, and a Review Session action linked to /sessions/:sessionId. Keep pagination at the bottom of the section. All other headings, descriptions, controls, containers, filters, surrounding layout, and visual elements remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `BaseTable`
- required feature components: None
- data contract: the initial collection comes from `UserStore.sessionHistory`, populated by `GET /api/v1/user/data`. `GET /api/v1/training/sessions` remains for pagination or explicit refresh and writes its result back to that store section; see [integration contract examples](integration-contracts.md#session-history-and-session-review).
- states: loading, empty, success, recoverable error, unavailable.
- dependencies: `UserStore`

### Session Review

- purpose: Review a previous training session's supported results and coaching feedback, including available key moments, movement trends, and next recommended focus.
- page/component: `frontend/src/pages/SessionReviewPage.vue`.
- route: `/sessions/:sessionId`
- name: `session-review`
- layout: `Authentication Layout`
- access: Authenticated; the backend authorizes access to the requested session.
- route parameters: required `sessionId` opaque identifier. Reject malformed identifiers and show not-found/unauthorized states without leaking whether another user's session exists.
- navigation destination: Session rows on History and Dashboard link to this route using their returned session ids. Session Review is not a top-level sidebar item; History remains the active navigation section.
- data contract: `GET /api/v1/training/sessions/{sessionId}/review`; see [frontend integration contract examples](integration-contracts.md#session-history-and-session-review).
- visual references: [History](../../prototypes/design/pages/history.html) and [Training Session Card](../../prototypes/design/components/training-session-card.html). These provide visual cues only; they do not establish data or behavior beyond this entry.
- state owner: `frontend/src/stores/UserStore.ts`; data access: `frontend/src/services/sessionService.ts`. Route-specific review loading must not create another authoritative history store.
- states: loading, not found/unauthorized, success, partial/insufficient data, recoverable error, unavailable.

### Application State Matrix

| Surface | Loading | Empty / partial | Error / unavailable | Success owner |
| --- | --- | --- | --- | --- |
| Dashboard | Unified user-data request pending | No sessions is an honest empty state | Retry authenticated application initialization; preserve shell | `UserStore.dashboard` and `UserStore.sessionHistory` |
| History | Unified initialization or later-page request pending | Empty initial list is successful | Retry initialization, current cursor, or explicit refresh as applicable | `UserStore.sessionHistory` |
| Session Review | Review request pending | Insufficient supported result is labeled | Safe not-found/unauthorized; retry recoverable failures | Server-authorized review response |
| Training | Camera/transport/analysis transitions shown separately | Waiting for first supported result | Camera and transport failures remain distinct | Backend analysis/session events |
| Subscription / Checkout | Unified initialization or checkout verification pending | No active plan is distinct from unknown state | Retry initialization or server/provider verification | `UserStore.subscription` plus backend-verified checkout refreshes |
| Profile / Settings | Unified initialization or section save pending | Optional values can be empty | Retain last confirmed store values and unsaved user edits | Normalized section response written to `UserStore` |
| Authentication | Session lookup/request pending | Signed out is distinct from lookup failure | Field/challenge/session errors shown | Backend session/auth response |

Recovery behavior and shared error semantics are detailed in [integration contract examples](integration-contracts.md#page-state-and-recovery-matrix).

### Subscription
- purpose: `allows the user to view their current subscription plan, manage billing details, and change or upgrade their subscription.`
- Route: `/subscription`
- Layout: `Authentication Layout`
- Example Prototype: `design/pages/subscription.html`
- description: `Required section is the Subscription section, which includes a page heading, a short description, and two main cards: the Current Subscription Card and the Billing or Plan Management Card. Render the current plan using shared PaymentCardPlan; statusLabel represents the current subscription, while selected only changes presentation. Use BillingDetailsCard for the existing billing panel. Use one PaymentStatusCard implementation for the payment pending, success, failed, and cancelled return-state presentations; do not duplicate the card structure. Change plan, Manage billing, and payment-status actions belong to the page; preserve informational demo messages. Compare pricing remains a page-level link to the authenticated Pricing page.`
- required shared components: `PaymentCardPlan`, `BillingDetailsCard`
- required feature components: `PaymentStatusCard`
- data contract: initial subscription data come from `GET /api/v1/user/data`. Checkout verification, plan changes, and the provider-hosted customer portal remain dedicated operations; see [integration contract examples](integration-contracts.md#checkout-and-billing).
- states: loading, no active subscription, active, pending change, payment pending, payment success after backend verification, payment failed, payment cancelled, recoverable error, unavailable.
- dependencies: `UserStore`

### Profile
- purpose: `Allow authenticated users to view and manage their personal profile information.`
- Route: `/profile`
- Layout: `Authentication Layout`
- Example Prototype: `design/pages/profile.html`
- name: `profile`
- description: `Follow the referenced Profile HTML prototype for the page title, secondary text, and the remaining Personal Information section, which uses the existing CollapseForm component. The Profile page component owns and creates the section's data/configuration, deriving its title, secondary description, fields, labels, relevant configuration, buttons/actions, and any additional content directly from the prototype. Supply the CollapseForm instance through its existing title/description props and page-rendered default/footer slots. Profile-specific values, configuration, form handling, and actions remain in the Profile page; CollapseForm stays generic and reusable. Do not create additional Profile section components unless explicitly required elsewhere. Implement all remaining page-level elements directly as DOM/layout matching the prototype. Do not invent fields, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `CollapseForm`
- required feature components: None
- data contract: initial Personal Information data come from `GET /api/v1/user/data`. The dedicated Personal Information `PATCH` endpoint replaces the normalized `UserStore.personalInformation` section. See [authenticated application data and persisted user updates](integration-contracts.md#authenticated-application-data-and-persisted-user-updates).
- states: loading, loaded, validation error, save pending, recoverable error, unavailable.
- dependencies: `UserStore`

### Settings

- Route: `/settings`
- Layout: `Authentication Layout`
- Example Prototype: `design/pages/settings.html`
- name: `settings`
- description: `Follow the referenced Settings HTML prototype as the source of truth for the page title, secondary text, and the remaining Account Security · Change Password, Notifications, and Privacy & Data sections. Each collapsible section uses the existing shared CollapseForm component. The Settings page owns and creates each section's data/configuration directly from the prototype. Pass only the section title/header and secondary title/description through the existing title and description props. Define and render all section-specific fields, labels, selects, controls, buttons, actions, and other body content in the Settings page, supplying that content through CollapseForm's default slot and its footer slot where appropriate. Field configuration, values, validation, form handling, and action behavior remain owned by the Settings page; do not pass a field schema to CollapseForm or move Settings-specific content or behavior into it. Keep CollapseForm generic and reusable. Do not create separate components for individual Settings sections unless explicitly required elsewhere. Implement all remaining page-level elements directly as DOM/layout matching the prototype. Do not invent fields, controls, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `CollapseForm`
- required feature components: None
- data contract: initial Notifications and Privacy & Data settings come from `GET /api/v1/user/data`. Each independently saved persisted group uses its dedicated `PATCH` endpoint; Change Password, data export, and account deletion remain separate actions. See [authenticated application data and persisted user updates](integration-contracts.md#authenticated-application-data-and-persisted-user-updates).
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
- Layout: `Authentication Layout`
- Example Prototype: `design/pages/checkout.html`
- name: `checkout`
- description: `The Checkout page contains two main sections: a left section with the existing Checkout PerformanceCard and PaymentInformationCard components stacked vertically, and a right section with an OrderSummaryCard component. Start through the provider-hosted checkout contract, verify every return state with the backend, and retain pending/cancelled/failed/expired/recoverable-error states.`
- required shared components: None
- required feature components: `PerformanceCard`, `PaymentInformationCard`, `OrderSummaryCard`
- data contract: provider-hosted checkout start and server-verified return; see [integration contract examples](integration-contracts.md#checkout-and-billing).
- states: pending, succeeded only after backend verification, cancelled, failed, expired, recoverable error, unavailable.
- dependencies: `CheckoutStore`

---
