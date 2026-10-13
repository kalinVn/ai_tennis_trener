# Debug Frontend Plan — Execution Report

## Execution Record

- Command: `debug_frontend_plan`
- Run context: repeated execution requested by the user after the frontend specifications were synchronized; the complete plan was regenerated from the current authoritative sources and independently validated.
- Explicit specification path: `docs/frontend/frontend.md`
- Outcome: `valid`
- Validator invocations: `2`
- Correction attempts: `1`
- Reason the correction loop stopped: the second independent validation returned `status: valid`, no errors, one non-blocking warning, and the exact unchanged corrected plan.
- Starting repository status: contained the existing frontend-specification, prototype, test, and Claude-to-Codex synchronization changes, plus the previous debug output pair. Those changes were not produced by this debug run.
- Production frontend evidence: `frontend/` contains only `frontend/index.html`, so the frontend type is `new`.
- Local reference check: all local Markdown links in the root and supporting frontend specifications resolved to existing paths.
- Prototype check: the catalog, referenced page/layout/component prototypes, and ownership directories exist. Prototype source was inspected only for the organization explicitly permitted by `docs/frontend/frontend.md`.

### Sources Inspected

- `AGENTS.md`
- `.codex/commands/debug_frontend_plan.md`
- `.codex/rules/frontend-planning.md`
- `.codex/workflows/frontend-planning.md`
- `.codex/skills/plan-new-frontend-design.md`
- `.codex/skills/frontend-plan-validator.md`
- `.codex/references/frontend-architecture.md`
- `docs/frontend/frontend.md`
- `docs/frontend/layouts.md`
- `docs/frontend/pages-and-routes.md`
- `docs/frontend/components.md`
- `docs/frontend/integration-contracts.md`
- `docs/frontend/frontend-project-structure.md`
- `claude/rules/frontend/frontend-design-system.md`
- The frontend architecture files selected by `.codex/references/frontend-architecture.md`
- The prototype directory/file organization selected by the `Project Structure` section of `docs/frontend/frontend.md`

### Source Precedence and Architectural Evidence

- `docs/frontend/frontend.md` and its declared supporting specifications govern scope, routes, layouts, component contracts, integrations, and placement.
- Referenced prototypes provide visual direction and declared mappings; they are not production code.
- Shared design rules provide lower-priority defaults.
- The approved structure is shallow and responsibility-based and prohibits a frontend `modules/` feature-root layer.
- Small Cards/Fields families remain simple; the Home Page Video Slider remains a genuinely complex local system with one owner per lifecycle/resource.
- `AuthStore` owns authentication workflow state, `UserStore` owns the atomic authenticated-data snapshot, feature stores own only transient workflows, services own external communication, and composables own reusable browser/UI lifecycles.

## Frontend Implementation Plan

> Status: independently validated. This is the exact unchanged plan returned by the successful second validation.

# Frontend Implementation Plan

## Frontend Type

```text
new
```

The production Vue application is not established: `frontend/` currently contains only `frontend/index.html`. Plan all implementation under `frontend/` without treating prototype code as production code.

## Source Authority and Scope

- Root specification: `docs/frontend/frontend.md`.
- Authoritative supporting specifications: `docs/frontend/layouts.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`, `docs/frontend/integration-contracts.md`, and `docs/frontend/frontend-project-structure.md`.
- Visual catalog and mappings: `prototypes/design/index.html`, `prototypes/design/pages/`, and `prototypes/design/components/`; dedicated public/authenticated navigation prototypes override older embedded navigation examples.
- Shared design constraints: `claude/rules/frontend/frontend-design-system.md`.
- Architecture context: the frontend-code-architect responsibility, ownership, lifecycle, placement, and review references selected by `.codex/references/frontend-architecture.md`.
- The specifications override prototypes; prototypes override shared design defaults. Backend contracts in `integration-contracts.md` are proposed and require backend confirmation before live integration.
- Preserve Vue 3.5+ as the documented minimum, TypeScript, Vite, Pinia, and Vue Router. Do not implement backend authentication authority, computer vision, coaching decisions, TTS generation, payment processing, or webhook handling in the browser.

## Project Structure

Use the shallow responsibility-based structure defined by `docs/frontend/frontend-project-structure.md`; do not add a frontend `modules/` feature-root layer and do not create empty placeholders.

Plan-specific placement:

- Route views: `frontend/src/pages/` for Home, Features, Login, Register, Training, Pricing, Dashboard, History, Session Review, Subscription, Profile, Settings, Not Found, and Checkout.
- Layout shells: `frontend/src/layouts/PublicLayout.vue` and `frontend/src/layouts/AuthenticationLayout.vue`.
- Shared UI: responsibility-based subdirectories under `frontend/src/components/`, retaining component families such as `buttons/`, `fields/`, `forms/`, `cards/`, `navigation/`, `tables/`, and `modal/`.
- Feature UI: focused subdirectories under `frontend/src/components/` such as `auth/`, `cookie-privacy/`, `features/`, `training/`, `checkout/`, and `home/`; feature-specific files stay local until actual reuse justifies promotion.
- The complex Home slider remains a cohesive directory under `frontend/src/components/home/home-page-video-slider/`, with its Vue owner, controller, renderer, timelines, configuration, component styles, local asset, README, and focused tests. Preserve one owner per renderer/timeline/resource and idempotent asynchronous cleanup; do not impose this multi-file pattern on simple components.
- Reusable behavior: `frontend/src/composables/`, including field behavior, Button UI behavior, authenticated initialization, and camera/video/media lifecycle where these are reusable. Keep feature-only behavior with its owner: `useCookieConsent.ts` stays beside `CookiePrivacyPolicy` under `frontend/src/components/cookie-privacy/`, and slider-only collaborators stay with the slider.
- External communication: `frontend/src/services/` for the authenticated HTTP client, auth, unified user-data, sessions/reviews, billing, browser media/provider boundaries, and training WebSocket transport. Use `frontend/src/proxy/` only if a real adapter boundary is required.
- Shared state: `frontend/src/stores/AuthStore.ts`, `UserStore.ts`, `TrainingSessionStore.ts`, and `CheckoutStore.ts`. Avoid per-page copies of authoritative persisted data.
- Router and guards: `frontend/src/router/`; runtime config, fixed values, helpers, integrations, directives, assets, global CSS/tokens, and tests use the corresponding approved top-level source directories.
- `frontend/src/App.vue` mounts `CookiePrivacyPolicy` once above both layout families. Pages and layouts must not duplicate it.

## Design Foundation

1. Derive production design tokens for color, typography, spacing, radius, borders, shadows, transitions, widths, breakpoints, and semantic states from the referenced prototypes, reusing shared CSS custom properties rather than copying prototype CSS blindly.
2. Implement consistent focus-visible, hover, active, disabled, loading, validation, success, warning, error, connected, disconnected, and selected states without using color alone.
3. Use semantic HTML, associated labels, accessible names for icon-only controls, modal focus behavior, live announcements for important asynchronous states, adequate contrast, practical touch targets, and reduced-motion handling.
4. Keep desktop, tablet, and mobile presentation within one design language; stack content, adapt navigation, preserve media proportions, and prevent unintended horizontal overflow. Training must expose a safe, understandable mobile state.
5. Preserve page-specific layout/content in pages; reusable visual behavior belongs to shared components or explicit variants.

## Layouts and Global Shell

### Public Layout

Implement branding, `TopNav`, responsive content outlet, and footer only, following `prototypes/design/layouts/public.html` and the higher-priority `prototypes/design/components/navigation/public-navigation.html`. Footer legal actions open the global policy/preferences feature rather than navigating to separate policy pages.

### Authentication Layout

Implement `SidebarNav`, authenticated header/identity actions, responsive content outlet, and sidebar legal actions, following `prototypes/design/layouts/authentication.html` and the higher-priority `prototypes/design/components/navigation/authenticated-navigation.html`. Training uses this same shell.

### Global Cookie and Privacy Flow

Mount one `CookiePrivacyPolicy` from `App.vue`. Compose `PrivacyChoicesBanner`, `CookiePreferencesContent`, `CookiePolicyContent`, and `PrivacyPolicyContent` through the single shared `BaseModal` and shared `TextButton`. Keep the bottom banner visible until Accept All, Reject All, or Save Preferences persists the versioned `tennis-ai-coach.cookie-consent.v1` record. Essential is always enabled; policy modal open/close is informational and does not count as consent. Footer/sidebar Cookie Settings reopens saved preferences. Consent survives routes, refresh, login, and logout and remains independent of authentication.

## Routes, Pages, Access, and Prototype Mapping

| Route | Page/layout | Access and source-backed responsibility | Visual prototype(s) |
| --- | --- | --- | --- |
| `/` | Home / Public | Compose `HomePageInfoSection` and `HomePageVideoSlider`; parent owns CTA navigation. | `prototypes/design/pages/index.html`, `prototypes/components/sections/HomePageInfoSection.vue`, `prototypes/components/sliders/home-page-video-slider/HomePageVideoSlider.vue` |
| `/features` | Features / Public | Page-level title/copy/layout with three instances of the single feature-owned `FeatureCard` and shared Buttons. | `prototypes/design/pages/features.html`, `prototypes/components/cards/FeatureCard.vue`, `prototypes/design/components/cards/feature-card.html` |
| `/login` | Login / Public | `LoginForm`, reCAPTCHA provider token, password login, OAuth entry, MFA continuation, validation/pending/error states; backend owns verification/session issuance. | `prototypes/design/pages/login.html`, `prototypes/pages/LoginPage.vue`, `prototypes/components/forms/LoginForm.vue` |
| `/register` | Register / Public | `RegisterForm`, client-only password confirmation, legal consent, provider reCAPTCHA token, registration/OAuth entry, verification/conflict/error states. | `prototypes/design/pages/register.html`, `prototypes/pages/RegisterPage.vue`, `prototypes/components/forms/RegisterForm.vue` |
| `/training` | Training / Authentication | Compose the existing `TrainingCamera` and `CameraPreviewModal` flow with the page-level prototype; create a session before connecting to the backend-issued WebSocket; complete or abandon explicitly. | `prototypes/design/pages/training.html`, `prototypes/design/pages/camera.html`, `prototypes/components/training/TrainingCamera.vue`, `prototypes/components/modal/CameraPreviewModal.vue` |
| `/pricing` | Pricing / Authentication | Require authentication, use `AuthenticationLayout`, render page-level pricing content with three `PaymentCardPlan` instances, and preserve a validated login return target. | `prototypes/design/pages/pricing.html`, `prototypes/components/cards/PaymentCardPlan.vue`, `prototypes/design/components/cards/payment-card-plan.html`, `prototypes/design/components/cards/payment-card-plan-selected.html` |
| `/dashboard` | Dashboard / Authentication | Read Dashboard aggregates and initial recent session history from `UserStore`; session rows use server ids to open Session Review; no redundant initial GET. | `prototypes/design/pages/dashboard.html` |
| `/history` | History / Authentication | Read initial collection from `UserStore`; use `BaseTable` with Date, Duration, Status, Review Session and pagination; list endpoint only for pagination/explicit refresh. | `prototypes/design/pages/history.html`, `prototypes/components/tables/BaseTable.vue`, `prototypes/design/components/tables/BaseTable.html` |
| `/sessions/:sessionId` | Session Review / Authentication | Validate the opaque route id safely, load authorized review via `sessionService`, keep History active, and expose loading, safe not-found/unauthorized, success, partial, recoverable-error, and unavailable states. | `prototypes/design/pages/history.html`, `prototypes/design/components/training-session-card.html` |
| `/subscription` | Subscription / Authentication | Read initial state from `UserStore`; compose `PaymentCardPlan`, `BillingDetailsCard`, and one `PaymentStatusCard` for pending/success/failed/cancelled; page owns checkout/portal/status actions. | `prototypes/design/components/subscription/subscription.html`, `prototypes/components/cards/PaymentCardPlan.vue`, `prototypes/design/components/cards/payment-card-plan.html`, `prototypes/components/cards/BillingDetailsCard.vue`, `prototypes/design/components/cards/billing-details-card.html`, `prototypes/components/cards/PaymentStatusCard.vue`, `prototypes/design/components/cards/payment-status-card.html` |
| `/profile` | Profile / Authentication | Page-owned Personal Information draft inside `CollapseForm`; initialize from and replace only `UserStore.personalInformation` after normalized PATCH success. | `prototypes/design/pages/profile.html`, `prototypes/components/forms/CollapseForm.vue`, `prototypes/design/components/forms/CollapseForm.html` |
| `/settings` | Settings / Authentication | Page-owned Change Password, Notifications, and Privacy & Data sections using `CollapseForm`; persisted groups replace corresponding `UserStore` sections only after success. | `prototypes/design/pages/settings.html`, `prototypes/components/forms/CollapseForm.vue`, `prototypes/design/components/forms/CollapseForm.html` |
| `/not-found` | Not Found / Public | Render the documented 404 page. Unknown routes redirect here. | `prototypes/design/pages/not-found.html` |
| `/checkout` | Checkout / Authentication | Compose `PerformanceCard`, `OrderSummaryCard`, and `PaymentStatusCard`; start provider-hosted checkout and verify every returned result through the backend. | `prototypes/design/components/checkout/checkout.html`, `prototypes/components/cards/PerformanceCard.vue`, `prototypes/components/cards/OrderSummaryCard.vue`, `prototypes/components/cards/PaymentStatusCard.vue` |

Router guards must distinguish public access, authenticated access, unknown routes, `401` refresh/sign-in recovery, and `403` authorization failure. Preserve a validated internal return target. Navigation visibility is not authorization.

## Shared Components

Implement the contracts from `docs/frontend/components.md` without page business logic:

- `Button`, `TextButton`, `BaseModal`.
- `DateField`, `NumberField`, `SelectField`, `TextField`, and `RecaptchaField`, with parent-owned values and the documented shared/specialized field composables.
- `CollapseForm` as a generic native-details container with default/footer slots and no store/form schema ownership.
- `TopNav` and `SidebarNav`, including their documented responsive menu/drawer lifecycle cleanup.
- `BaseTable`, preserving generic props/slots and its documented conditional Session Name + Focus transformation.
- `PaymentCardPlan` and `BillingDetailsCard` as presentational cards with parent-owned actions.
- `SocialAuthButton` and `SocialAuthButtons`, with OAuth initiation owned above the presentational controls.

Do not invent unsupported Button variants/sizes/navigation props or duplicate generic modal/navigation/form systems.

## Feature Components

- Home: `HomePageInfoSection`; `HomePageVideoSlider` plus its local controller, Pixi renderer, timelines, lifecycle/configuration, component CSS, asset, and tests. Keep illustrative overlays explicitly non-live and release Pixi, GSAP, media, listeners, timers, and observers idempotently, including destruction during asynchronous initialization.
- Authentication: `LoginForm` and `RegisterForm`, composing shared fields, reCAPTCHA, and social-auth controls while delegating auth/network authority to store/services.
- Cookie/privacy: `CookiePrivacyPolicy` and its four documented internal components with local `useCookieConsent`; reuse `BaseModal`/`TextButton`.
- Subscription/checkout: `PaymentStatusCard`, `PerformanceCard`, and `OrderSummaryCard`, all presentational; parent pages own requests, redirects, verification, and store updates.
- Training: `TrainingCamera` and `CameraPreviewModal`, with `useCameraSession` owning camera/microphone acquisition and track release, `useCameraPreviewModal` owning dialog/media attachment and mute/presentation lifecycle, `useVideoAnalysis` owning paced JPEG capture/cancellation, `trainingTransport` owning the WebSocket, and `TrainingSessionStore` owning the active session/phase and current backend feedback.
- Features: keep one feature-owned `FeatureCard` implementation at `frontend/src/components/features/FeatureCard.vue`; the Features page supplies its content and shared Button actions.

## State, Services, and Integration Boundaries

### Authentication

`AuthStore` owns short-lived access-token and authentication workflow state only. Keep the access token in memory; the Secure, HttpOnly, SameSite refresh cookie remains unreadable to JavaScript. Centralize one refresh-and-single-retry policy and clear both AuthStore and UserStore on logout or terminal authentication failure. Services implement password auth, reCAPTCHA token submission, OAuth start, MFA verification, refresh, and logout using shared error envelopes without exposing secrets.

### Authenticated Data

After Login, MFA, OAuth, or recoverable reload establishes the session, call `GET /api/v1/user/data` once and atomically populate `UserStore` with account, personalInformation, subscription, dashboard, sessionHistory, and settings. Dashboard, Profile, Settings, Subscription, and History read that snapshot. Successful section PATCH operations replace only the normalized corresponding section. Local drafts/pending/errors remain page-local.

### Training

Create the session before media transmission and connect only to the backend-issued short-lived WebSocket URL. Send each JSON frame metadata message immediately followed by its binary JPEG with no interleaving. Process only active-session events; preserve backend `strokeId`/`strokeNumber`, text, confidence and kind. Queue optional temporary backend-generated `audioUrl` playback without persisting it or generating TTS. Stop frames on disconnect; normal stop sends `stop_analysis` and completes, while early exit abandons. One owner releases tracks, capture loops, socket, timers, listeners, playback, and modal resources.

### History and Review

`UserStore.sessionHistory` is the only initial/history collection owner. `UserStore` also owns the current authorized Session Review result loaded on demand; that route-specific result is separate from, and does not duplicate, the authoritative history collection. `sessionService` only performs later-page, explicit-refresh, and route-specific review requests, then the owning store receives the normalized result.

### Billing

`CheckoutStore` owns only transient checkout initiation/verification phase, selected-plan return context, and the checkout-return polling lifecycle; persisted subscription truth remains `UserStore.subscription`. Start through `POST /api/v1/billing/checkout-sessions` with `planId` and validated `returnPath`, redirect only to returned `checkoutUrl`, and verify through `GET /api/v1/billing/checkout-sessions/{checkoutSessionId}`. Never infer success from browser redirects/query parameters.

When verification returns `pending`, `CheckoutStore` schedules a bounded, backoff-based retry of the backend-authoritative checkout-session GET, prevents overlapping requests, and exposes pending plus recoverable network-error states. It cancels timers and in-flight requests when the flow reaches `succeeded`, `cancelled`, `failed`, or `expired`, when the user explicitly stops/retries, or when the owning route is left. After `succeeded`, refresh `UserStore.subscription` through `GET /api/v1/subscriptions/status`; if that endpoint still returns a pending subscription state, apply the same cancellable bounded retry discipline until `active`, `paid`, `failed`, a user-visible timeout, or a recoverable failure. Retry limits/delays remain configuration values confirmed during backend adoption rather than invented provider guarantees.

Manage Billing calls the documented customer-portal session endpoint. Never send payment amounts/card credentials or call the backend-only Stripe webhook.

## Required UI and Recovery States

Implement initial/loading, empty or insufficient, success, validation, recoverable error, unavailable, and disconnected states wherever applicable, using the authoritative page matrix. In particular:

- Preserve usable stored snapshots during recoverable Dashboard/History/Profile/Settings failures.
- Separate signed-out, authentication lookup failure, MFA challenge, challenge expiry, and authorization denial.
- Separate camera/device failure, WebSocket disconnection, waiting for analysis, partial/low-confidence evidence, normal completion, and abandonment.
- Separate no subscription, unknown/unavailable subscription, checkout pending, backend-verified success, cancelled, failed, expired, provider/network error, and bounded retry timeout; never convert timeout into success.
- Never display mocked or fabricated analysis, history, or payment outcomes as production truth.

## Acceptance and Test Plan

1. Configure the production Vue 3 + TypeScript + Vite application; add Pinia, Vue Router, SCSS support required by components, Pixi/GSAP required by the slider, and the existing project test toolchain without replacing the approved stack.
2. Unit/component tests: shared component props/events/slots/states/accessibility; field composables; modal focus/scroll restoration; navigation cleanup; cookie persistence/version behavior; store ownership; auth refresh single retry; training lifecycle/cancellation; WebSocket metadata+binary pairing; feedback/audio handling; checkout terminal mapping, bounded backoff, no-overlap, cancellation, route-exit cleanup, timeout, and subscription refresh; slider async initialization/idempotent destruction.
3. Router tests with Vitest: every required route/name/layout/access rule, opaque session parameter handling, protected redirects/return targets, unknown-route behavior, and active navigation.
4. Playwright: public/authenticated navigation, all route loads, login/register interaction states, global consent flow across routes/refresh/auth transitions, History pagination/review navigation, training camera/control/error/disconnect cleanup using mocks, and provider-hosted checkout return verification/retry using intercepted APIs.
5. Responsive and accessibility validation at representative desktop/tablet/mobile viewports: navigation, forms, tables, modal scrolling, banner, cards, Training media proportions/safe mobile state, keyboard operation, focus visibility/restoration, labels, announcements, contrast, reduced motion, and no horizontal overflow.
6. Visual regression screenshots for major pages/states against the mapped prototypes, treating prototypes as visual direction rather than production markup or pixel-perfect authority.
7. Run production build, TypeScript/static checks, ESLint, Vitest, and Playwright. Do not disable failing checks. Report unavailable backend dependencies separately and use clearly identified mocks without claiming live integration.
8. Security/contract checks: no localStorage tokens, raw cards, frontend payment confirmation, provider secrets, unvalidated external redirects, browser CV/coaching/TTS, cross-user Session Review disclosure, or duplicated authoritative store data.

## Open Questions and Blockers

None.

## Build Order

The validated implementation should proceed in this dependency order:

1. Confirm backend-adoption assumptions, dependency versions, and test commands.
2. Establish the approved Vite/TypeScript application structure, global tokens/styles, runtime configuration, shared error handling, and test harness.
3. Implement shared primitives and component families: Button/TextButton, fields/composables, BaseModal, CollapseForm, navigation, table, and cards.
4. Implement Public and Authentication layouts, router definitions/guards, AuthStore, authenticated client, and atomic UserStore initialization.
5. Implement global CookiePrivacyPolicy composition and persistence above both layouts.
6. Implement public pages and authentication forms/services, then Home's simple info section and complex slider with its focused lifecycle tests.
7. Implement authenticated data pages: Dashboard, History, Session Review, Profile, and Settings.
8. Implement TrainingSessionStore, session/media/WebSocket/audio services/composables, TrainingCamera/CameraPreviewModal, and the Training page.
9. Implement Subscription and Checkout pages, transient CheckoutStore, provider redirects, verified return polling, subscription refresh, and customer portal action.
10. Complete responsive/accessibility/visual-state passes, automated tests, production build/static checks, and backend-dependency reporting.
11. Perform final manual verification against the authoritative prototype mappings and acceptance criteria without representing mocked backend behavior as live functionality.

## Validation Findings

The second independent validation returned `status: valid`, `errors: []`, one warning, and the exact unchanged corrected plan in `validated_plan`.

### Correction Applied

- The first validation found ambiguous ownership for the feature-local `useCookieConsent` composable and the current Session Review result. Correction attempt 1 placed `useCookieConsent.ts` beside `CookiePrivacyPolicy`, assigned the current authorized Session Review result to `UserStore` while retaining `sessionService` as data access, and recorded Vue 3.5+ as the documented minimum.
- The corrected plan passed the second independent validation unchanged.

### Warning

- Backend adoption remains pending: endpoint names, WebSocket schemas, bounds, error mappings, idempotency, and provider behavior are proposed rather than backend-confirmed. Confirm, adapt, or version them before live integration and keep fixtures or mocks clearly distinct from production behavior.

### Checks Not Performed

- No implementation, dependency installation, build, lint, unit, component, browser, visual, accessibility, backend, WebSocket, payment-provider, or runtime test was run by this debug command.
- Prototype UI was not analyzed in detail or rendered; only mappings, path existence, and explicitly permitted organization/ownership evidence were checked.

## Stop Status

Planning only. The plan is independently validated with one non-blocking warning. During this debug run only the two declared debug output files were replaced; all pre-existing repository changes were preserved. No application code, canonical plan, source specification, prototype, configuration, dependency, test, build artifact, commit, or deployment was created or modified by the debug command. Implementation was not started.
