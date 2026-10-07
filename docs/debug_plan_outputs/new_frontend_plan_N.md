# Frontend Planning Debug Report

## 1. Execution Record

- Command: `debug_frontend_plan`.
- Explicit specification: `docs/frontend/frontend.md`.
- Run date: `2026-10-07`; fresh execution replacing the fixed output pair.
- Execution outcome: `blocked`; independent validation status: `invalid`; `validated_plan: null`.
- Validator invocations: 1. Correction attempts: 0.
- The independent validator returned a complete structured result with 9 errors and 2 warnings. This run did not encounter the previous run's validator failure.
- Required missing sources and necessary specification decisions stop the correction loop under `.codex/workflows/frontend-planning.md`, section 3. The candidate below is the complete rejected draft, preserved unchanged; it is not approved for implementation. Correctable plan omissions also remain recorded.
- Pre-existing untracked directories: `.agents/`, `.codex/`, `docs/debug_plan_outputs/`. Only the two report files are written by this execution.

### Inspected Sources and Evidence

Planning instructions inspected: `AGENTS.md`, `.agents/skills/debug-frontend-plan/SKILL.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md` and `.codex/references/frontend-architecture.md`.

Product sources inspected: `docs/frontend/frontend.md`, `docs/frontend/layouts.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`. Architecture context inspected: the entry point, architecture rules, structure/components, lifecycle/ownership, review workflow and slider reference under `claude/skills/frontend-code-architect/`; applicable precedence/design guidance in `claude/rules/frontend/frontend-design-system.md`.

Source inspection covered `prototypes/design/index.html`, page/layout/component HTML headings and controls under `prototypes/design/`, shared `prototypes/design/style.css`, and the dedicated public/authenticated navigation HTML. Relevant implementation samples inspected included `prototypes/components/fields/TextField.vue`, `prototypes/composables/useField.js`, `prototypes/composables/useTextField.js`, `prototypes/components/forms/CollapseForm.vue`, `prototypes/components/navs/TopNav.vue`, `prototypes/components/training/TrainingCamera.vue`, `prototypes/design/components/buttons/Button.vue`, and the slider's `HomePageVideoSlider.vue` and `SliderController.js`. The independent validator additionally inspected relevant raw sources, including `prototypes/components/modal/CameraPreviewModal.vue`. The application root and missing slider HTML reference were checked on disk. This is source-level inspection, not rendered-browser verification.

Active project instructions retain TypeScript. The root specification and its authoritative documents govern product scope; dedicated navigation overrides older embedded navigation, and prototypes override generic design defaults. Catalog-relative page references resolve under `prototypes/design/pages/`. The missing slider reference is not silently replaced. Architecture decisions follow observed field/composable separation, generic slot-based forms, shared navigation, feature-local slider ownership and the backend-only analysis authority.

## 2. Frontend Implementation Plan — Rejected Partial Draft

### Frontend Type

```text
new
```

The inspected application root `frontend/` contains only placeholder files. This is a partial implementation plan; unresolved mandatory sources prevent approval.

### Project Structure

Preserve Vue 3, TypeScript, Vite, Vue Router and Pinia. All proposed application paths are under `frontend/src/`; none exists merely because it is planned. Shared resources live in `components/`, `composables/`, `services/`, `stores/`, `router/`, `styles/` and `assets/`. Initialize Pinia once. Put API calls in services, shared feature state/actions in stores, and local interactions in composables. Vue views contain templates, imports and minimal wiring; required behavior lives in separate `.ts` files. Static views need no empty logic file.

| Module under `modules/` | Pages and responsibilities | Proposed behavior and state placement |
| --- | --- | --- |
| `public` | `pages/HomePage.vue`, `pages/FeaturesPage.vue`, `pages/PricingPage.vue`, `pages/NotFoundPage.vue`; landing and public presentation | `composables/usePricingPage.ts` handles plan selection; Home feature behavior remains local to its components |
| `auth` | `components/AuthModal.vue`; login/registration surface evidenced by prototypes, remaining provider surfaces unresolved | `composables/useAuthForm.ts`, `services/authService.ts`; shared session owner `stores/AuthStore.ts` outside modules |
| `dashboard` | `pages/DashboardPage.vue`; overview, next action, recent activity and Session History | `composables/useDashboardPage.ts`, `stores/DashboardStore.ts`, `services/dashboardService.ts` inside module |
| `training` | `pages/TrainingPage.vue`, `components/TrainingCamera.vue`, `components/CameraPreviewModal.vue`; one training flow | `composables/useTrainingPage.ts`, `useCameraSession.ts`, `useVideoAnalysis.ts`, `useAudioOutput.ts`; `services/trainingTransport.ts`; `stores/TrainingSessionStore.ts` inside module |
| `sessions` | `pages/HistoryPage.vue`; Session Review screen contract unresolved | `composables/useHistoryPage.ts`, `stores/TrainingHistoryStore.ts`, `services/sessionService.ts` inside module |
| `progress` | Required trends, improvement areas and next focus; screen/route contract unresolved | Feature state and service remain module-owned; concrete files depend on missing screen/data contract |
| `subscription` | `pages/SubscriptionPage.vue`, `pages/CheckoutPage.vue`; current plan, billing and secure checkout | `composables/useSubscriptionPage.ts`, `useCheckoutPage.ts`; `stores/SubscriptionStore.ts`, `CheckoutStore.ts`; `services/subscriptionService.ts` inside module |
| `account` | `pages/ProfilePage.vue`, `pages/SettingsPage.vue`; profile and preferences | `composables/useProfilePage.ts`, `useSettingsPage.ts`; `stores/UserStore.ts`, `services/accountService.ts` inside module |

Relative sibling filenames in table cells share the explicitly named directory. These are proposed ownership decisions, not invented backend interfaces. Page and feature consumers read stores directly; generic reusable components receive props/events. Never store passwords or secrets.

### Layouts, Routes and Access

Place `PublicLayout.vue`, `AuthenticationLayout.vue`, `ApplicationLayout.vue` and `TrainingLayout.vue` in `layouts/`. Public/authentication layouts own branding, public navigation, responsive content and footer. Application/training layouts own sidebar and main content; application header belongs to the layout. Shared session-aware layout wiring belongs in `composables/useLayoutNavigation.ts`; navigation components own their local menu/drawer behavior.

| Route | Page | Layout | Access and source name |
| --- | --- | --- | --- |
| `/` | `HomePage.vue` | `PublicLayout` | Public; `home` |
| `/features` | `FeaturesPage.vue` | `PublicLayout` | Public; `feature` |
| `/pricing` | `PricingPage.vue` | `PublicLayout` | Public; `pricing` |
| `/training` | `TrainingPage.vue` | `TrainingLayout` | Authenticated; `training`; guest entry invokes login |
| `/dashboard` | `DashboardPage.vue` | `ApplicationLayout` | Protected; `dashboard` |
| `/history` | `HistoryPage.vue` | `ApplicationLayout` | Protected; source name unspecified |
| `/subscription` | `SubscriptionPage.vue` | `ApplicationLayout` | Protected; source name unspecified |
| `/profile` | `ProfilePage.vue` | `ApplicationLayout` | Protected; `profile` |
| `/settings` | `SettingsPage.vue` | `ApplicationLayout` | Protected; `settings` |
| `/checkout` | `CheckoutPage.vue` | `ApplicationLayout` | Protected; source incorrectly duplicates `settings` |
| `/not-found` | `NotFoundPage.vue` | `PublicLayout` | Public; `not-found` |

Use `router/index.ts` for registration and `router/guards.ts` for access/return behavior. Unknown URLs resolve to Not Found. Do not invent Session Review, Progress or authentication routes. Public navigation contains Home, Training, Pricing and Login Modal; authenticated navigation contains Dashboard, Training, History, Subscription, Profile, Settings and Checkout. Resolve missing screen/navigation destinations before final routing.

### Components and Composition

- Shared `components/buttons/Button.vue` preserves primary/secondary, small/medium/large, default/hover/active/disabled/loading, button/submit and parent-owned actions. Resolve the separately documented ghost usage before finalizing variants.
- Shared `components/fields/` contains `TextField.vue`, `NumberField.vue`, `SelectField.vue`, `DateField.vue`; `composables/useField.ts` and corresponding field composables own common/specialized value behavior. Preserve parent-owned model, IDs, native attributes, numeric empty value, multiple selection and date strings without timezone conversion.
- Shared `components/forms/CollapseForm.vue` owns native expanded/collapsed state only; title/description and default/footer slots carry page-owned content. No schema or store inside the container and no empty behavior file.
- Shared `components/navs/TopNav.vue` and `SidebarNav.vue` use `composables/useTopNav.ts` and `useSidebarNav.ts`. Parent supplies destinations/current state; menus own Escape, focus, scroll lock and listener cleanup. Dedicated navigation prototypes govern presentation; reconcile older extra registration action.
- Shared `components/tables/BaseTable.vue` receives title, columns, rows, row key and cell slots; no service/store or unnecessary composable. Shared `components/cards/FeatureCard.vue` receives number/title/description. `PaymentPlanCard.vue` in that same family serves Pricing and Subscription using display props and parent-handled action; no payment logic.
- Home places `HomePageInfoSection.vue` with `composables/useHomePageInfoSection.ts` in the public module and `HomePageVideoSlider.vue` with its feature-local controller/rendering/timeline collaborators under `public/components/home-page-video-slider/`. Preserve refs, async lifecycle, ownership and explicit cleanup; translate required behavior to TypeScript. Slider visual mapping remains blocked by its missing referenced HTML. Home composition/CTA conflicts require resolution before finalizing the section.
- Checkout owns `subscription/components/PerformanceCard.vue`, `PaymentInformationCard.vue`, `OrderSummaryCard.vue`. Preserve display-only props, unique IDs, disabled sample payment fields and parent-handled completion; no extra behavior files for passive cards. Confirm SelectedPlanCard wording versus PerformanceCard.
- Training composes existing camera entry and Coaching Cue, Connection and Session panels directly. Reuse one TrainingCamera/CameraPreviewModal flow; do not invent collapsible forms or a second camera flow. Pricing keeps all content outside PaymentPlanCard as page DOM; Features reuses only feature cards/buttons; Dashboard and History keep static sections in page DOM, with BaseTable for History. Subscription requires an unresolved StatCard contract.
- Profile uses four CollapseForm sections from its prototype; Settings uses its actual prototype sections. Page composables own field configuration, validation, save/reset and store actions; slot content remains in page templates. Do not create section components or invent fields.

### Integration and Lifecycle

Auth supports email/password, Google, Apple and 2FA per active instructions. Plan required-field validation, backend requests, session restoration while valid, immediate navigation updates, protected-route login/return, signed-in auth redirection, logout/expiry cleanup and clear errors. Backend owns credential checks, session validity and permissions; provider/session protocols remain unresolved.

Camera owns device selection, permissions, tracks and cancellation during initialization. Preserve the selected device until changed and handle denied/unavailable/lost devices. Analysis owns paced capture/resize/formatting and cancellation; transport owns connection and bounded sending. Stopping analysis leaves preview available; closing, Escape, device loss and unmount release analysis and media resources. Prototype JPEG/WebSocket messaging is evidence only, not an approved production protocol.

Training session state accumulates backend stroke feedback, successes, mistakes, recommendations and summary. Audio logic is separate from transport: play/stop/pause/resume/interrupt, no overlap, latest relevant cue, errors and resource cleanup. A coordinator owns global policy; each child cleans its resources once. No browser inference, per-frame LLM, fabricated metrics or low-confidence advice.

Checkout requests backend-created provider-hosted checkout or protected provider fields; cover success, cancellation, failure and retry. Never collect/store raw card data or make billing authority local. Data services and contract tests await approved schemas; backend implementation absence alone does not block isolated frontend tests.

### Design, States and Verification

Derive tokens from inspected prototypes: dark green `#07100c`, panels `#0d1913`, text `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, panel radius `22px`, Inter/system typography, public container `1160px` and desktop sidebar `244px`. Preserve visual hierarchy, spacing, responsive grids and dedicated navigation precedence. These source observations are not rendered visual verification.

Plan desktop/tablet/mobile, safe mobile training, no unintended overflow, semantic labels, keyboard/focus, accessible icon names, sufficient contrast, async announcements and reduced motion. Include applicable initial/loading/empty/success/validation/recoverable-error/unavailable/disconnected states. Prototype data stays explicitly illustrative.

Schedule Vitest route/access, component contracts and lifecycle tests; Playwright routes, navigation, login returns, camera permission/switch/start/stop/exit, outgoing payload and result mocks, audio cleanup, checkout states, responsive and visual checks. Include lint/static checks and production build. No tests, builds or browser verification have run during planning.

### Open Questions and Blockers

| ID | Question and source | Affected items / impact | Blocking | Required resolution |
| --- | --- | --- | --- | --- |
| B1 | HomePageVideoSlider link in `docs/frontend/components.md` targets missing `prototypes/components/sliders/home-page-video-slider/index.html` | Required slider visual evidence unavailable | Yes | Supply or explicitly correct the required reference |
| B2 | Settings and Checkout in `docs/frontend/pages-and-routes.md` both name route `settings` | Unique routing impossible as specified | Yes | Confirm corrected Checkout name |
| B3 | User Types and Frontend Modules in `docs/frontend/frontend.md` require Session Review and Progress absent from route specification | Complete screens/navigation/access cannot be finalized | Yes | Define screen, path, parameters, layout and destinations; clarify remaining auth surfaces |
| B4 | Application layout in `docs/frontend/layouts.md` points to authentication prototype | Layout description/reference disagree | Yes for final visual mapping | Confirm correct visual source while retaining dedicated navigation precedence |
| B5 | Subscription in `docs/frontend/pages-and-routes.md` requires undefined StatCard | Reuse/props/placement incomplete | Yes | Define intended component and contract |
| B6 | CameraPreviewModal in `docs/frontend/components.md` explicitly lacks real backend transport contract; other required services have no approved contract in supplied frontend sources | Production analysis/audio/auth/data/checkout integration cannot be specified safely | Yes for integration | Supply approved endpoint/auth/message/data/error/provider contracts without requiring backend implementation here |
| B7 | Home description/component list versus HomePageInfoSection details; Button variants versus CollapseForm ghost usage; TopNav actions versus dedicated navigation; Checkout SelectedPlanCard versus PerformanceCard | Component composition and contract inconsistencies | Yes where precedence does not resolve | Apply declared navigation precedence; clarify unresolved authoritative component conflicts |

### Build Order

Conditional future work only:

1. Resolve mandatory source and contract gaps and independently validate a complete plan.
2. Establish application structure/tooling, Pinia/router, design tokens and layouts.
3. Adapt shared primitives and their required behavior contracts.
4. Build module state/services and feature components against approved contracts.
5. Compose pages and routes with session-aware navigation and access.
6. Integrate auth, camera/analysis/audio, data and secure checkout.
7. Verify responsive, accessibility and all applicable application states.
8. Run required tests, static checks, production build and source-alignment review; report remaining backend work separately.

## 3. Validation Findings

Independent result: `status: invalid`, `validated_plan: null`. Each error blocks approval; the source-dependent errors require input beyond planner corrections.

| ID | Affected section / requirement and source | Observed problem | Required action |
| --- | --- | --- | --- |
| E1 | B1 / required visual sources; `docs/frontend/components.md`, HomePageVideoSlider; planner, Resolve the Visual Prototypes | Required slider HTML does not exist; recording the blocker does not complete visual-source validation | Supply the file or explicitly correct the reference, then inspect the approved source |
| E2 | B2 / consistent routes; `docs/frontend/pages-and-routes.md`, Settings and Checkout | Both route names are `settings` | Confirm corrected Checkout name and apply it consistently to routing, navigation and tests |
| E3 | B3 / required screens and destinations; `docs/frontend/frontend.md`, User Types, Navigation Requirements, Frontend Modules; route specification | Session Review and Progress lack defined screen/route entries | Clarify separate pages versus embedded surfaces, then specify paths or entry points, parameters, layout, access and destinations |
| E4 | B4 / consistent layout mapping; `docs/frontend/layouts.md`, Authenticated Application Layout; `prototypes/design/layouts/authentication.html` | Sidebar layout requirement conflicts with the linked authentication example | Confirm intended reference; `prototypes/design/layouts/application.html` is a possible correction, not an approved substitute |
| E5 | B5 / reusable component contracts; route specification, Subscription; component specification; `prototypes/design/pages/subscription.html` | StatCard is undefined, including its relationship to current subscription and billing cards | Clarify the name, consumers, responsibilities and component contract |
| E6 | B6 / approved integration contracts; root Analysis Client, Audio Output and Authentication; component CameraPreviewModal; `AGENTS.md`, Product architecture | Production transport is explicitly undefined; authentication/provider/session protocols remain unresolved | Identify approved analysis/audio/authentication contracts, transport authentication, messages, errors and session/provider behavior; distinguish contract gaps from unavailable backend implementation |
| E7 | B7 / consistent authoritative component requirements; route Home and Checkout; component Button, CollapseForm and HomePageInfoSection | Direct Home-left composition versus required section, shared versus inline Home buttons, ghost versus listed Button variants, SelectedPlanCard versus PerformanceCard | Resolve each authoritative conflict and record one concrete composition/variant decision |
| E8 | Project Structure and Components / per-component external behavior; planner Output Contract; `prototypes/design/components/buttons/Button.vue`; `prototypes/components/modal/CameraPreviewModal.vue` | Button lacks its external behavior file; CameraPreviewModal lacks explicit ownership/file mapping for lifecycle, media attachment, mute, feedback derivation and closure | Map Button loading/disabled/click behavior and modal behavior to external TypeScript owners without duplicating media-resource ownership |
| E9 | Integration and Lifecycle / modal controls and results; root Feature Components, Frontend Modules, Frontend / Backend Boundary; component CameraPreviewModal and its Vue prototype | Microphone capture/local mute, muted preview and backend-result overlay contract are not explicit in the candidate | Carry these controls and ownership into the plan; define result delivery to overlays without inventing microphone upload or browser inference |

| ID | Affected section / source | Non-blocking warning | Recommended action |
| --- | --- | --- | --- |
| W1 | B7 navigation; root Navigation Requirements; `prototypes/design/components/navigation/public-navigation.html` | Dedicated navigation precedence already resolves the older registration-action difference, although the candidate groups it with conflicts | Separate this resolved visual decision from unresolved authoritative conflicts; no user clarification is needed for this difference |
| W2 | Design, States and Verification; planning rules, Source Resolution; root Verification and Testing | Review covered source markup, CSS and relevant logic, not rendered browser output; the candidate correctly states this limitation | Retain the qualification and perform responsive/visual comparison during separately authorized implementation verification |

No implementation tests, dependency installations, builds or browser checks were executed. Future tests listed in the plan are not passing results. Because required source/decision blockers remain, no correction or second validation was attempted.

## 4. Stop Status

`STOP`: planning only; no implementation started. Save the English report at `docs/debug_plan_outputs/new_frontend_plan_N.md` and translate that exact saved report into `docs/debug_plan_outputs/new_frontend_plan_BG.md`. Preserve structure, steps, technical identifiers, paths, decisions and all findings. The only permitted changes in this execution are this report pair.
