# Frontend Planning Debug Report

## 1. Execution Record

- Command: `debug_frontend_plan`.
- Specification: `docs/frontend/frontend.md`.
- Run date: `2026-10-08`.
- Outcome: `blocked`; independent plan validation: `invalid`; `validated_plan: null`.
- Validator invocations: 1. Completed source-based plan reviews: 1. Plan correction attempts: 0.
- The structured result contains 6 errors and 2 warnings. Required product and contract decisions stop further correction attempts under `.codex/workflows/frontend-planning.md`. This is a rejected partial plan, not implementation approval.
- Existing documentation edits were present at entry and are preserved. This execution writes only the English/Bulgarian report pair.

### Sources and Precedence

Inspected planning context: `AGENTS.md`, `.codex/skills/debug-frontend-plan/SKILL.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md`, `.codex/references/frontend-architecture.md` and its relevant references under `claude/skills/frontend-code-architect/`.

Product sources: `docs/frontend/frontend.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`, `docs/frontend/layouts.md`. The old `docs/frontend/design-plan.md` and earlier debug reports are not authoritative replacements for these sources.

Evidence includes the catalog, page/layout/component HTML and shared styles under `prototypes/design/`, dedicated navigation prototypes, field/form/navigation/card/Button/camera samples, the slider Vue entry and controller, `prototypes/home/main.js`, and the organizational auth example under `prototypes/modules/user/`. Prototype code informs reuse and resource ownership, not production backend contracts. The actual `frontend/` directory and referenced paths were checked. The validator independently read current specifications and relevant raw prototypes/code. No browser rendering or implementation tests were performed.

Active instructions preserve TypeScript and backend authority. Current specifications take precedence over prototypes; dedicated navigation takes precedence over embedded navigation; actual visual references take precedence over generic design defaults. The current slider reference is the existing Vue component, Checkout is named `checkout`, and Application Layout points to `prototypes/design/layouts/application.html`. These formerly broken definitions no longer block this candidate.

## 2. Frontend Implementation Plan — Rejected Partial Draft

### Frontend Type

`new`. Application root `frontend/` contains placeholder content; proposed files below are future work. This is a partial plan pending mandatory source decisions.

### Project Structure

Preserve Vue 3, TypeScript, Vite, Vue Router and Pinia. All paths below are relative to `frontend/src/`. Initialize Pinia once. Keep templates/minimal wiring in Vue, behavior in external TypeScript, API access in services, shared state/actions in stores, and local UI state in composables. Never persist secrets. Shared `components/`, `composables/`, `services/`, `stores/`, `router/`, `styles/`, `assets/` remain outside modules. Feature assets and helpers remain with their owner; no empty behavior files for passive views.

| Module | Views under module pages/ | Behavior, services and state under the same module |
| --- | --- | --- |
| `public` | `HomePage.vue`, `FeaturesPage.vue`, `PricingPage.vue`, `NotFoundPage.vue` | `composables/usePricingPage.ts` delegates plan actions to subscription; Home behavior belongs to its features |
| `auth` | Login/registration uses `components/AuthModal.vue`; provider/challenge surfaces await contracts | `composables/useAuthForm.ts`, `services/authService.ts`; shared session owner is application-wide `stores/AuthStore.ts` |
| `dashboard` | `DashboardPage.vue` | `composables/useDashboardPage.ts`, `stores/DashboardStore.ts`, `services/dashboardService.ts` own loading and overview data |
| `training` | `TrainingPage.vue` | `composables/useTrainingPage.ts`, `stores/TrainingSessionStore.ts`; camera/analysis/audio collaborators listed below |
| `sessions` | `HistoryPage.vue`; Session Review surface unresolved | `composables/useHistoryPage.ts`, `stores/TrainingHistoryStore.ts`, `services/sessionService.ts` |
| `progress` | Surface unresolved | Module owns trends and next-focus presentation; concrete files await screen/data decisions |
| `subscription` | `SubscriptionPage.vue`, `CheckoutPage.vue` | `composables/useSubscriptionPage.ts`, `composables/useCheckoutPage.ts`, `stores/SubscriptionStore.ts`, `stores/CheckoutStore.ts`, `services/subscriptionService.ts` |
| `account` | `ProfilePage.vue`, `SettingsPage.vue` | `composables/useProfilePage.ts`, `composables/useSettingsPage.ts`, `stores/UserStore.ts`, `services/accountService.ts` |

Module roots are `modules/<module>/`. Stores call services and own shared actions; pages/features read their store directly. Generic components retain props/events. Do not turn local menus, field drafts or collapse state into application stores.

### Layouts, Routes and Navigation

Use `layouts/PublicLayout.vue`, `AuthenticationLayout.vue`, `ApplicationLayout.vue`, `TrainingLayout.vue`. Public/auth layouts own branding, public navigation, responsive content/footer. Application/training own sidebar and main content; application owns its header. Shared session-aware wiring belongs in `composables/useLayoutNavigation.ts`. Application visual reference is `prototypes/design/layouts/application.html`; dedicated navigation overrides embedded examples.

| Path | Page | Layout | Access / route name |
| --- | --- | --- | --- |
| `/` | HomePage | PublicLayout | Public / `home` |
| `/features` | FeaturesPage | PublicLayout | Public / `feature` |
| `/pricing` | PricingPage | PublicLayout | Public / `pricing` |
| `/training` | TrainingPage | TrainingLayout | Authenticated / `training` |
| `/dashboard` | DashboardPage | ApplicationLayout | Authenticated / `dashboard` |
| `/history` | HistoryPage | ApplicationLayout | Authenticated / no required name supplied |
| `/subscription` | SubscriptionPage | ApplicationLayout | Authenticated / no required name supplied |
| `/profile` | ProfilePage | ApplicationLayout | Authenticated / `profile` |
| `/settings` | SettingsPage | ApplicationLayout | Authenticated / `settings` |
| `/checkout` | CheckoutPage | ApplicationLayout | Authenticated / `checkout` |
| `/not-found` | NotFoundPage | PublicLayout | Public / `not-found` |

Implement registration in `router/index.ts`, access/return handling in `router/guards.ts`; unknown URLs use Not Found. No invented Session Review/Progress/auth routes. Public navigation is Home, Training, Pricing, Login Modal; authenticated navigation is Dashboard, Training, History, Subscription, Profile, Settings, Checkout. Preserve requested destinations through sign-in, update navigation immediately on session changes and redirect authenticated users away from auth when applicable. Backend remains authorization authority. Session Review and Progress are authenticated Application Layout surfaces whose exact page/embedded placement, paths/names, parameters and entry points remain explicitly unresolved in the route specification.

### Components and Page Composition

- `components/buttons/Button.vue` uses `composables/ButtonController.ts`, adapting inspected `useButtonController`. Props: variant primary/secondary/ghost, size small/medium, type button/submit/reset, disabled/loading. States: default, hover, active, focus-visible, disabled, loading. Disabled/loading prevent activation; loading exposes busy/spinner state. Emit `click` with the DOM event; no callback props or business logic. Start Training and View Progress are usages, not components. No existing `to`/RouterLink mode; navigation remains in parent handlers or link components.
- `components/fields/` owns TextField, NumberField, SelectField, DateField Vue views. Shared `composables/useField.ts` plus `useTextField.ts`, `useNumberField.ts`, `useSelectField.ts`, `useDateField.ts` own UI value handling. Preserve parent models, IDs, native attributes, numeric empty null, multiple selection, timezone-free date strings and accessible labels.
- `components/forms/CollapseForm.vue` owns only native expanded/collapsed state, title/description and default/footer slots; no behavior file or schema renderer. Profile owns its four section configurations and fields; Settings owns its actual prototype sections, validation/save/reset and slots. Do not extract section components.
- `components/navs/TopNav.vue`, `SidebarNav.vue` use shared `composables/useTopNav.ts`, `useSidebarNav.ts`. Preserve parent destinations/current state, keyboard/Escape, responsive drawer focus containment, scroll locking and cleanup. Dedicated public navigation controls visible actions; legacy register event does not require another visible button.
- `components/tables/BaseTable.vue` owns presentational title/columns/rows/rowKey/cell slots. `components/cards/FeatureCard.vue` owns number/title/description. Neither accesses services/stores or needs placeholder behavior files.
- `components/cards/PaymentPlanCard.vue` is the single shared plan card for Pricing and Subscription. `selected` Boolean defaults false and changes CSS only; `active` represents current subscription independently. Parent supplies plan/price/features and handles emitted action through shared Button. The later implementation retains PaymentPlanCard for plan selection and the distinct PerformanceCard for Checkout summaries; BillingDetailsCard owns the separate billing panel. The old cross-concept prop-consolidation requirement is superseded.
- `modules/subscription/components/PaymentInformationCard.vue` and `OrderSummaryCard.vue` retain page-supplied display props, unique IDs, disabled masked/sample payment fields and parent-owned completion; no placeholder composables. Checkout retains PerformanceCard on the left above payment information, summary on the right.
- Home uses `modules/public/components/HomePageInfoSection.vue` and `modules/public/composables/useHomePageInfoSection.ts` for existing alignment/cleanup and parent-owned CTA actions through Button. `modules/public/components/home-page-video-slider/HomePageVideoSlider.vue` adapts the real Vue entry. Keep its local `SliderController.ts`, `PixiRenderer.ts`, `VideoTimelineController.ts`, `PlayerAnalysisTimeline.ts`, `AnimationTimeline.ts`, `AudioTimeline.ts`, `AIMotionTrackingPanel.ts`, `SliderLifecycle.ts`, configuration, styles and media together. Controller composes, renderer owns geometry/GPU resources, timelines own timing, each owner cleans up once. Preserve intended playback and illustrative status behavior; source inspection is not proof that prototype lifecycle is production-ready.
- Pricing uses Starter/Performance/Pro instances of the shared card; surrounding DOM remains in-page. Features reuses FeatureCard/Button, with other content inline; StatCard usage is None. Dashboard keeps static sections and Session History in-page; layout supplies header/sidebar. History uses BaseTable. Subscription uses the shared plan card and BillingDetailsCard. Training keeps camera entry plus Coaching Cue, Connection and Session panels inline, with one existing camera/modal flow and no invented collapsible sections.

### Training, Auth and Integration Ownership

Under `modules/training/`, `components/TrainingCamera.vue` uses `composables/useCameraSession.ts` for permission, selected-device persistence/switching, tracks, initialization cancellation and device errors. `components/CameraPreviewModal.vue` uses `composables/useCameraPreviewModal.ts` for dialog/scroll lifecycle, media attachment, local microphone mute, feedback derivation and close. Preview is muted; do not invent microphone upload. The modal requests track release through the camera owner. Closing/Escape/device loss/unmount releases all resources; stopping analysis alone preserves preview.

`composables/useVideoAnalysis.ts` owns paced capture/resize/formatting/cancellation; `services/trainingTransport.ts` owns bounded transmission and connection/message lifecycle. Prototype JPEG/WebSocket and JSON events are not an approved production contract. Feed backend results through the existing overlay slot and session feedback state. `composables/useAudioOutput.ts` owns play/stop/pause/resume/interrupt, latest relevant cue, no overlap, errors and release separately from transport. TrainingSessionStore accumulates stroke successes, mistakes, recommendations and summary; coordinator owns global failure, children clean their own resources. No browser inference, per-frame LLM, fabricated results or low-confidence advice.

Auth covers email/password, Google, Apple, 2FA, required-field validation, requests, restoration while valid, session expiry/logout cleanup, errors and routing. Protocol/provider/challenge details remain external dependencies. Never persist credentials. Checkout uses backend-created provider-hosted checkout or protected provider fields, with success/cancellation/failure/recovery states; no raw card data or frontend billing authority. Data/transport contracts must be approved before integration; unavailable backend implementation alone does not block independently testable frontend work.

### Design, States and Verification

Use source-derived dark green `#07100c`, panels `#0d1913`, text `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, radius `22px`, Inter/system typography, public container `1160px`, sidebar `244px`. Preserve prototype spacing/hierarchy, responsive stacking and dedicated navigation breakpoints. No rendered alignment has been verified.

Cover desktop/tablet/mobile, safe mobile Training, no unintended overflow, semantic labels, keyboard/focus, accessible icons, sufficient contrast, async announcements and reduced motion. Applicable states: initial/loading/empty/success/validation/recoverable error/unavailable/disconnected. Prototype metrics/prices remain illustrative.

Schedule Vitest route/access, component contracts and lifecycle tests; Playwright page/navigation/login-return checks, camera start/switch/permission/stop/exit, transport payload mocks, no transmission after stop, overlay/audio cleanup, checkout states, responsive screenshots and visual review. Include applicable ESLint/static checks and production build. Use mocks against approved contracts, report unresolved backend work separately, and do not claim simulated functionality complete. No implementation checks run during planning.

### Open Questions and Blockers

| ID | Missing decision / source | Impact and blocking | Required resolution |
| --- | --- | --- | --- |
| R1 | Session Review and Progress entries in `docs/frontend/pages-and-routes.md` explicitly unresolved | Blocks complete screen/route/navigation coverage | Define separate versus embedded surfaces, component contract, paths/names when needed, parameters and entry points |
| R2 | CameraPreviewModal in `docs/frontend/components.md` lacks production transport; root auth/audio/data/checkout need contracts | Blocks affected integrations and definitive contract tests | Supply or identify approved transport/auth/session/audio/data/payment contracts; do not confuse missing backend runtime with missing contract |
| R3 | Historical plan-card consolidation finding | Superseded by the later Pricing/Subscription scope | Use the current PaymentPlanCard and BillingDetailsCard contracts; retain the distinct Checkout PerformanceCard |

The old slider HTML, duplicate Checkout name, wrong Application layout reference, Subscription StatCard requirement, conflicting Button variants/ownership and missing Button/modal behavior mapping are not carried forward as current blockers. Features specifies StatCard usage as None and reuses only FeatureCard/Button; the previous wording warning is resolved.

### Build Order

1. Resolve required source decisions/contracts and independently validate the complete plan.
2. Establish required application structure, tooling, Pinia/router and design foundation/layouts.
3. Adapt shared components and their explicit UI behavior contracts.
4. Build module stores/services and feature components against approved contracts.
5. Compose pages/routes and session-aware navigation/access.
6. Integrate auth, camera/analysis/audio, data and secure checkout.
7. Validate responsive/accessibility/application states and resource lifecycle.
8. Run required tests, static checks, production build and source-alignment review; distinguish completed frontend work from pending backend work.

## 3. Validation Findings

The independent validator read the current specifications and raw references and returned `status: invalid`, `validated_plan: null`. The workflow stopped before correction because the route/surface and integration-contract errors require authoritative user or product decisions.

| ID | Affected section and source | Problem / blocking impact | Required resolution |
| --- | --- | --- | --- |
| R1 | Layouts/routes — `docs/frontend/pages-and-routes.md`, Session Review | Final surface, route/name, session-selection parameters and entry point are unresolved | Decide separate versus embedded presentation, component/page contract, route path/name if separate, session identifier/selection and navigation entry point |
| R2 | Layouts/routes — `docs/frontend/pages-and-routes.md`, Progress | Required surface, route/name, parameters and navigation destination are unresolved; Dashboard/prototype evidence is explicitly insufficient | Define the Progress page or embedded contract, path/name if separate, parameters and authenticated entry point |
| R3 | Training integration — `docs/frontend/components.md`, CameraPreviewModal; root Analysis Client and Acceptance Criterion 4 | The prototype JPEG/WebSocket flow is not an approved production contract; endpoint, authentication, schemas, confidence/error, cancellation and reconnection rules are missing | Designate an authoritative analysis transport contract covering all of those behaviors |
| R4 | Auth/session/data/audio/checkout — root Authentication, Audio Output, Coaching Feedback, Subscription and backend boundary | Google/Apple/2FA, session lifecycle, application data, audio commands and secure checkout/customer-portal contracts are unidentified | Supply authoritative backend/provider contracts and map request/response/error/cancellation states without raw card handling |
| R5 | Project Structure and Layouts — `docs/frontend/layouts.md`, Authentication Layout | `AuthenticationLayout.vue` is planned, but no page, route, modal host or other consumer is defined | Define how it participates in modal auth, including owner and composition, or authoritatively replace it without adding an unsupported auth route |
| R6 | Design, States and Verification — root Required Application States and Acceptance Criterion 6 | The global state list is not mapped to each data-bearing page/integration, its owner, recovery action or non-fabrication behavior | Add a state matrix or equivalent detail for Dashboard, History, Session Review, Progress, Subscription, Profile, Settings, auth and checkout |

| ID | Source | Non-blocking warning | Action |
| --- | --- | --- | --- |
| W1 | Root visual acceptance criteria and `.codex/rules/frontend-planning.md` | Source inspection does not establish rendered desktop/tablet/mobile or interaction alignment | Run the planned Playwright screenshots and semantic visual review during implementation |
| W2 | Open Questions and Blockers; `docs/frontend/pages-and-routes.md`, Features | Resolved: Features now specifies StatCard usage as None | Keep the current PaymentPlanCard/BillingDetailsCard/PerformanceCard contracts; no StatCard component is required |

The corrected slider reference, unique Checkout route name, Application Layout reference, shared Button contract and Button/modal behavior placement are supported by current sources. The old Subscription StatCard requirement is gone. No new self-validation verdict replaces the independent result, and no future test is reported as passed.

## 4. Stop Status

`STOP`: planning only. English output: `docs/debug_plan_outputs/new_frontend_plan_N.md`. Bulgarian output: `docs/debug_plan_outputs/new_frontend_plan_BG.md`, translated from the exact saved English report. No source/specification/configuration changes, implementation, builds, dependency installations or deployment were performed during this execution.
