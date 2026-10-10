# Frontend Planning Debug Report

## 1. Execution Record

- Command: `debug_frontend_plan`.
- Specification: `docs/frontend/frontend.md`.
- Run date: `2026-10-08`.
- Outcome: `blocked`; independent validation status: `invalid`; `validated_plan: null`.
- Validator invocations: 1. Plan correction attempts: 0.
- The validator found 2 errors and 2 warnings. The missing authoritative feedback ordering/replay decision stops the correction loop immediately under `.codex/workflows/frontend-planning.md`; the card-contract omission is also retained in this rejected draft rather than corrected after the stop condition.
- This run began after the documentation updates in the working tree. Only this report pair is written by the planning run; the earlier documentation edits are pre-existing at run entry.
- Implementation, application source changes, dependency installation, build, and deployment are outside this run and have not been performed.

### Sources and Precedence

Read `AGENTS.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md`, and `.codex/references/frontend-architecture.md` with the relevant architecture references under `claude/skills/frontend-code-architect/`.

Read the authoritative product sources `docs/frontend/frontend.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`, `docs/frontend/layouts.md`, and `docs/frontend/integration-contracts.md`. Visual and behavior references include the prototype catalog and cited page/component/layout/navigation prototypes under `prototypes/design/`, plus relevant Vue and composable examples under `prototypes/components/` and `prototypes/composables/`. The actual `frontend/` directory was checked and contains placeholder content rather than an established application implementation.

Root requirements and their explicitly authoritative supporting documents take precedence over prototypes; dedicated navigation prototypes take precedence over embedded navigation examples. Prototype source indicates visual intent and sample behavior, not a production backend contract. Proposed integration examples are a planning target for frontend fixtures, not evidence of implemented endpoints or backend approval. No rendered-browser alignment or implementation checks were performed.

## 2. Frontend Implementation Plan

### Frontend Type

`new` — create the Vue application under `frontend/`; preserve the existing placeholder until implementation is separately authorized. This plan does not create files.

### Project Structure

Use `docs/frontend/frontend-project-structure.md` as the single source of truth for physical frontend structure. This report does not redefine it.

### Layouts, Routes, Access, and Navigation

Implement `PublicLayout`, `ApplicationLayout`, and `TrainingLayout` from `docs/frontend/layouts.md`. Authentication remains a dialog hosted by the Public Layout; do not create an unused standalone Authentication Layout or login/register route. Application layout owns the authenticated header/sidebar. Use the dedicated authenticated navigation prototype for appearance and responsive behavior.

| Path | Name | Page | Layout | Access and parameters |
| --- | --- | --- | --- | --- |
| `/` | `home` | Home | Public Layout | Public |
| `/features` | `feature` | Features | Public Layout | Public |
| `/training` | `training` | Training | Training Layout | Authenticated |
| `/pricing` | `pricing` | Pricing | Public Layout | Public |
| `/dashboard` | `dashboard` | Dashboard | Authenticated Application Layout | Authenticated |
| `/history` | `history` | History | Authenticated Application Layout | Authenticated |
| `/sessions/:sessionId` | `session-review` | Session Review | Authenticated Application Layout | Authenticated; required opaque `sessionId`; server authorizes access |
| `/progress` | `progress` | Progress | Authenticated Application Layout | Authenticated; no path parameter |
| `/subscription` | `subscription` | Subscription | Authenticated Application Layout | Authenticated |
| `/profile` | `profile` | Profile | Authenticated Application Layout | Authenticated |
| `/settings` | `settings` | Settings | Authenticated Application Layout | Authenticated |
| `/checkout` | `checkout` | Checkout | Authenticated Application Layout | Authenticated |
| `/not-found` | `not-found` | Not Found | Public Layout | Public; unknown paths resolve here |

Authenticated navigation items are Dashboard, Training, History, Progress, Subscription, Profile, Settings, and Checkout. History and Dashboard session rows link to Session Review with the server-supplied session ID; Session Review is nested under History and is not a top-level navigation item. The authenticated sidebar includes Progress after History. Public navigation exposes Home, Training, Pricing, and the login dialog. Preserve a validated internal return destination through authentication. Router guards improve navigation only; backend authorization protects all data and actions. Session lookup failure is unavailable, not signed out; `401` and `403` remain distinct.

### Shared Components and Page Composition

- `Button` is presentation, UI state, and `click` event emission. Preserve documented variants `primary`, `secondary`, `ghost`; sizes `small`, `medium`; types `button`, `submit`, `reset`; Boolean `disabled` and `loading`. Loading/disabled prevent activation. No callback prop, business logic, or `to`/RouterLink behavior. The parent owns actions and navigation.
- Shared field family: `TextField`, `NumberField`, `SelectField`, `DateField`, based on the existing field and composable conventions. Preserve parent-owned model values, native attributes, accessible labels, numeric empty value `null`, multiple selection, and timezone-free `YYYY-MM-DD` date strings.
- `CollapseForm` is a generic title/description and default/footer-slot container with native expanded/collapsed UI state; no form-schema renderer. Profile and Settings own section configuration, values, validation, and actions.
- `TopNav` and `SidebarNav` preserve parent-owned links/current route and accessible keyboard, focus, responsive drawer, Escape, and cleanup behavior from existing examples.
- `BaseTable` renders supplied title, columns, rows, row key, and cell slots. `FeatureCard` renders the numbered feature content. Neither accesses stores or services.
- One `PaymentCardPlan` serves Pricing and Subscription. Its `selected` prop changes presentation only; `statusLabel` independently represents the current subscription. Parent supplies `planName`, formatted `price`, optional `billingPeriod`, `description`/`features`, labels and handles emitted actions. `BillingDetailsCard` remains a separate billing panel with only the existing renewal and payment-method display fields. Checkout retains its distinct `PerformanceCard`, `PaymentInformationCard`, and `OrderSummaryCard` contracts; disabled payment fields accept only sample/masked display text and never collect card data.
- Home reuses the verified `HomePageInfoSection` and Vue slider entry. Keep slider controller, renderer, timeline, configuration, styles, and media in its owning feature. Controller coordinates; renderer owns graphics resources; each timeline owns its timing; each resource owner performs cleanup once. Source review does not establish production lifecycle readiness.
- Features reuses `FeatureCard` and `Button`; other page content remains page-level DOM. Dashboard, History, Subscription, Profile, Settings, and Checkout follow their page prototypes and the specific composition rules in `pages-and-routes.md` and `components.md`.

### Integration Contracts and Ownership

Use `docs/frontend/integration-contracts.md` as the proposed fixture/API example for authentication/session, training session lifecycle and versioned WebSocket analysis events, history/review/progress, dashboard/profile/settings, provider-hosted checkout, and shared errors. These shapes are proposals, not approved live backend interfaces. Frontend views and tests can be planned against fixtures; live service integration requires backend confirmation/adaptation.

- Authentication service handles cookie-backed login/registration/session/logout, provider redirects, second-factor challenges, expiry and safe internal return navigation. Backend owns authentication authority, authorization, OAuth secret handling, and session validity.
- Training camera logic owns acquired media tracks and the selected device. `useCameraSession.ts` enumerates available `videoinput` devices after permission, retains the selected device for the active training flow, and exposes a switch action. Switching acquires the replacement stream first, atomically makes it authoritative for preview/capture, then releases the previous stream through this sole track owner; failure keeps the usable current stream or reports unavailable when none remains. Device-change handling detects removal of the selected camera and offers an explicit fallback/retry without silently changing an active stream. Capture/resize/cancellation belongs to the analysis composable; bounded WebSocket sending/reception belongs to the training transport service. The camera modal owns dialog lifecycle, media attachment, local mute, and presentation of feedback in its existing overlay slot, while requesting track release from the camera owner. `TrainingSessionStore.ts` stores server-issued `player_feedback` events by `eventId`, ignores duplicates, associates them with the current session and tracks only the supported successful-stroke, mistake and recommendation classifications. Completion sends the collected feedback event IDs; the backend validates ownership and returns the canonical summary, which replaces any provisional client aggregation. The current prototype calls track stopping from both `CameraPreviewModal.cleanup()` and `useCameraSession.stopCamera()`; implementation must remove duplicate stopping and retain only the camera session owner as the track-release authority. Stopping analysis stops capture/sending but preserves preview; leaving or closing stops analysis and releases tracks. No browser inference, LLM in the per-frame path, microphone upload, or fabricated/low-confidence advice.
- Audio playback is a separate training owner in `useAudioOutput.ts`. It exposes start, stop, pause, resume, and interrupt operations plus authoritative idle/loading/playing/paused/error state. It consumes backend `coaching_audio` commands, prevents overlap, replaces or interrupts playback deterministically for the latest relevant higher-priority instruction, reports unavailable resources/playback failure without changing analysis truth, and revokes/releases owned media resources independently from transport.
- Session review and progress display only server-supported values with their units, time ranges, availability and confidence/provenance. Do not calculate coaching conclusions in the browser.
- Subscription starts provider-hosted checkout from a plan identifier. The backend/provider handles sensitive payment data and transactions; backend webhooks are verified/idempotent. Checkout success is shown only after backend verification, never from a redirect query alone. The frontend never stores/processes raw card values.

### Design, Application States, Accessibility, and Verification Plan

Apply visual tokens and page structure from the referenced prototypes and shared design rules: dark green `#07100c`, panel `#0d1913`, text `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, radius `22px`, Inter/system typography, public container `1160px`, sidebar `244px`. These values are source-derived examples; preserve each page prototype hierarchy and responsive behavior. No rendered alignment has been verified.

Implement the state/recovery matrix in `pages-and-routes.md`: loading, empty/insufficient data, success, validation, recoverable error, unavailable, disconnected, pending and verified completion as applicable. Keep camera, transport, session, analysis, auth and billing statuses distinct. Do not render fabricated metrics, sessions, analysis, or payment state.

Support desktop/tablet/mobile, usable narrow-screen navigation and training layout, no unintended horizontal overflow, semantic controls, associated labels, keyboard access, visible focus, adequate contrast, accessible icon names, asynchronous announcements, and reduced motion.

Future verification sequence: unit tests for routes/access guards, field/Button and component contracts, session state, analysis cancellation and cleanup; service tests against the example fixtures; integration tests for authentication return/error states, camera permission, device enumeration, successful atomic switching, selected-device retention, removed-device failure/fallback, sole-owner stream cleanup and stop/unmount; tests for audio start/stop/pause/resume/interrupt, overlap prevention, priority replacement, failure state and resource release; per-stroke feedback accumulation and completed-session summary, transport disconnect/reconnect and no frame sends after stop, overlay cleanup, server-verified checkout return; responsive Playwright navigation and screenshots; lint/static checks and production build. These checks were not run during planning. Do not represent fixture-backed functionality as live backend integration.

### Open Questions and Blockers

| Question or missing information | Affected plan items | Implementation impact | Blocking | Required resolution |
| --- | --- | --- | --- | --- |
| Backend/product owners have not confirmed the proposed endpoint names, schemas, transport semantics, authentication details, units, limits, and provider mappings in `docs/frontend/integration-contracts.md`. | Live auth, training analysis/audio, session data, progress, account data, billing integration. | Frontend can implement UI and fixtures against the examples, but live service integration must wait for backend agreement. | No for frontend structure/UI/fixture-backed work; yes for connecting live services. | Backend owners confirm or adapt each example contract before its live integration; record the agreed contract at the integration boundary. |

### Build Order

1. Inspect and preserve the existing frontend placeholder; establish the shallow Vue/TypeScript/Vite structure and initialize router/Pinia once.
2. Define design tokens, accessibility foundation, shared components, Public/Application/Training layouts, and auth dialog host.
3. Implement public pages and authentication/session state against the example contracts and honest pending/error states.
4. Implement Dashboard, History, Session Review, and Progress pages/routes with server-owned data and state handling.
5. Implement Training camera lifecycle, bounded analysis transport, feedback overlay, audio playback and cleanup boundaries.
6. Implement Profile and Settings against their account service contracts.
7. Implement Subscription and provider-hosted Checkout with backend-verified return states.
8. Validate responsive/accessibility and resource lifecycle behavior; run tests, lint/static checks, production build and source-alignment review.
9. Report every unavailable backend integration separately; do not deploy or claim simulated functionality as complete.

## 3. Validation Findings

Independent validation result: `status: invalid`, `validated_plan: null` after 1 invocation and 0 correction attempts.

| Section and source | Blocking problem | Required resolution |
| --- | --- | --- |
| Training feedback — `docs/frontend/frontend.md`, Coaching Feedback and Analysis Client; `docs/frontend/integration-contracts.md`, training transport/reconnect | `player_feedback` now defines identity, deduplication and canonical completion, but no ordering guarantee or replay/resume/catch-up rule after reconnect. The client cannot know whether events were missed or whether submitted `feedbackEventIds` are complete. | Define an authoritative monotonic sequence and resume cursor/replay behavior, or an explicit snapshot/review reconciliation contract, including completion behavior while delivery gaps remain. Then update ownership and deterministic reconnect/completion tests. |
| Shared cards — `docs/frontend/components.md`, PaymentCardPlan and BillingDetailsCard | The plan names the shared cards but omits part of their newly authoritative props/events, so downstream builders would need to reopen sources or guess. | Record `PaymentCardPlan` props `planName`, `price`, `billingPeriod`, `description`, `features`, `statusLabel`, `selected`, `selectedLabel`, `actionLabel` and payload-free `action`; record `BillingDetailsCard` props `title`, `renewalText`, `paymentMethodText`, `actionLabel` and payload-free `action`, with page-owned behavior. |

| ID | Source | Non-blocking warning | Required follow-up |
| --- | --- | --- | --- |
| W1 | `docs/frontend/integration-contracts.md` — Contract adoption; `docs/frontend/frontend.md` — Acceptance Criterion 9 | Endpoint names, schemas, limits, authentication details, transport semantics, units and provider mappings remain unconfirmed. Fixture-backed frontend work may proceed; live service connection remains blocked. | Obtain backend/product confirmation or adaptation before enabling or claiming live integration. |
| W2 | `docs/frontend/frontend.md` — Acceptance Criterion 3; `.codex/skills/frontend-plan-validator.md` — Design and prototypes | Source markup/styles were inspectable, but no rendered-browser comparison exists at planning time. | Perform the planned Playwright screenshots and visual review after implementation; do not claim rendered alignment before that check. |

No implementation tests, build, dependency installation, browser rendering, or live integration checks ran during this planning command.

## 4. Stop Status

`STOP`: planning only. English output: `docs/debug_plan_outputs/new_frontend_plan_N.md`. Bulgarian output: `docs/debug_plan_outputs/new_frontend_plan_BG.md`, translated from this saved English report. No implementation, source scaffolding, dependency installation, build, or deployment is part of this run.
