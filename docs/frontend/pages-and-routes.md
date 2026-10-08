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
- description: `Main Section: headline, short description, StatCard usage: None; two primary buttons. The Features page should follow the Public Layout and match the prototype directly for the page title, secondary description, and all other page-level content; only the Feature Cards and buttons should use reusable components.`
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
- description: `Follow the Pricing prototype directly for the complete page structure and all page-level content. Use the shared PaymentPlanCard component for the Starter, Performance, and Pro pricing plan cards. All other headings, descriptions, sections, labels, supporting content, and layout remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `PaymentPlanCard`
- required feature components: None
- dependencies: None

### Dashboard
- purpose: `Provides the user with an overview of their training activity, recent sessions, progress, and quick access to the main application features.`
- route: `/dashboard`
- layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/dashboard.html`
- name: `dashboard`
- description: `Follow the Dashboard prototype directly for all page content, sections, containers, text, and visual structure, implemented as page-level DOM/layout. Do not introduce page-specific shared components or extract static sections into reusable components. Keep Session History available as defined in the prototype. Sidebar and top header remain provided by the Authenticated Application Layout and are not part of the page sections.`
- required shared components: None
- required feature components: None
- dependencies: None


### History
- purpose: `allows the user to review previous training sessions, results, performance metrics, and past coaching feedback`
- Route: `/history`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/history.html`
- description: `Follow the History HTML/design prototype for all sections and page-level elements. Use the existing shared BaseTable component for the session/history table. All other headings, descriptions, controls, containers, filters, surrounding layout, and visual elements remain page-level DOM/layout matching the prototype; do not create additional shared components or extract static sections into reusable components.`
- required shared components: `BaseTable`
- required feature components: None
- dependencies: `TrainingHistoryStore`

### Session Review

- purpose: Review previous training-session results and coaching feedback; the existing visual example mentions key moments, movement trends, and the next recommended focus.
- page/component: **UNRESOLVED** — no dedicated Session Review page or Vue component was found. The existing History prototype contains an inline `Example session review` panel; this does not establish that an embedded panel fulfills the complete required feature.
- route: **UNRESOLVED** — confirm a separate route versus an embedded History surface. `/history` is the existing host route for the prototype panel, not an approved session-detail route.
- name: **UNRESOLVED** — depends on whether a separate route is required.
- layout: `Authenticated Application Layout` for the authenticated review surface, consistent with the existing History example.
- access: Authenticated; backend authorization remains required for session data.
- route parameters: **UNRESOLVED** — session selection and any identifier parameter are not defined by the current authoritative specification.
- navigation destination: Existing visual evidence is the review panel in History. No per-session link or dedicated navigation destination is defined; confirm the entry point and destination before final routing.
- visual references: [History](../../prototypes/design/pages/history.html) and [Training Session Card](../../prototypes/design/components/training-session-card.html). The latter explicitly documents a generic review panel and table, not a standalone session-card implementation.
- module: `sessions`, as required by [Frontend Modules](frontend.md#frontend-modules).
- required resolution: Confirm separate page versus embedded surface, its page/component contract, route path/name if separate, selection parameters, and navigation entry point. These missing decisions block final Session Review planning; do not create placeholder pages or infer a production data contract from sample content.

### Progress

- purpose: Present trends, improvement areas, and the next recommended focus, as required by the `progress` module.
- page/component: **UNRESOLVED** — no dedicated Progress page or Vue component was found. Dashboard metrics are partial visual evidence, not a complete Progress screen definition.
- route: **UNRESOLVED** — confirm a separate route versus an embedded surface; no current authoritative Progress path is defined.
- name: **UNRESOLVED** — depends on the route decision.
- layout: `Authenticated Application Layout`, consistent with the existing authenticated Dashboard and Charts & Progress examples.
- access: Authenticated; backend authorization remains required for progress data.
- route parameters: **UNRESOLVED** — no parameter contract is defined; do not infer filters or ranges from sample statistics.
- navigation destination: **UNRESOLVED** — the dedicated authenticated navigation prototype has no Progress item. Confirm the required entry point and destination rather than silently adding a sidebar link.
- visual references: [Dashboard](../../prototypes/design/pages/dashboard.html) and [Charts & Progress](../../prototypes/design/components/charts-progress.html). The latter shows existing metrics/statistics and explicitly states that charts, progress bars, and legends are missing; it is not a complete page prototype.
- module: `progress`, as required by [Frontend Modules](frontend.md#frontend-modules).
- required resolution: Define the page/component or embedded surface, route path/name if separate, parameter requirements, and navigation destination. These missing decisions block final Progress planning; illustrative statistics must not become fabricated production metrics.

The older [frontend design plan](design-plan.md#required-routes) proposes `/app/sessions/:sessionId` and `/app/progress`, but uses a different `/app/...` route scheme and is not designated as an authoritative specification by `frontend.md`. Its proposed routes, `sessionId` parameter, component names, and navigation behavior are not adopted here. These entries are the single source for the remaining Session Review and Progress routing decisions.

### Subscription
- purpose: `allows the user to view their current subscription plan, manage billing details, and change or upgrade their subscription.`
- Route: `/subscription`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/subscription.html`
- description: `Required section is the Subscription section, which includes a page heading, a short description, and two main cards: the Current Subscription Card and the Billing or Plan Management Card. Render the current plan using shared PaymentPlanCard; active represents the current subscription, while selected only changes presentation. Use BillingDetailsCard for the existing billing panel. Change plan and Manage billing actions belong to the page; preserve informational demo messages. Compare public pricing remains a page-level link to pricing.html.`
- required shared components: `PaymentPlanCard`, `BillingDetailsCard`
- required feature components: None
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
- dependencies: `UserStore`

### Settings

- Route: `/settings`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/settings.html`
- name: `settings`
- description: `Follow the referenced Settings HTML prototype as the source of truth for the page title, secondary text, all collapsible sections, and all other page-level content. Each collapsible section uses the existing shared CollapseForm component. The Settings page owns and creates each section's data/configuration directly from the prototype. Pass only the section title/header and secondary title/description through the existing title and description props. Define and render all section-specific fields, labels, selects, controls, buttons, actions, and other body content in the Settings page, supplying that content through CollapseForm's default slot and its footer slot where appropriate. Field configuration, values, validation, form handling, and action behavior remain owned by the Settings page; do not pass a field schema to CollapseForm or move Settings-specific content or behavior into it. Keep CollapseForm generic and reusable. Do not create separate components for individual Settings sections unless explicitly required elsewhere. Implement all remaining page-level elements directly as DOM/layout matching the Settings prototype. Do not invent fields, controls, buttons, labels, descriptions, states, or components absent from the prototype or explicit project requirements.`
- required shared components: `CollapseForm`
- required feature components: None
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
- description: `The Checkout page contains two main sections: a left section with the existing Checkout PerformanceCard and PaymentInformationCard components stacked vertically, and a right section with an OrderSummaryCard component`
- required shared components: None
- required feature components: `PerformanceCard`, `PaymentInformationCard`, `OrderSummaryCard`
- dependencies: `CheckoutStore`

---
