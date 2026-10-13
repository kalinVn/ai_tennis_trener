# Tennis AI Coach — Frontend Specification

## Purpose

Define what the Tennis AI Coach client application must contain and how users interact with it.

This document is the project-specific source of truth for frontend product scope. It describes required pages, layouts, routes, behavior, visual references, and acceptance criteria.

Application source belongs under `frontend/`.

---


### Optional / Future

- Three.js / WebGL — 3D court, 3D skeleton and spatial visualizations
---

## Visual Prototype

The visual prototype catalog is:

`prototypes/design/index.html`

Page-level prototypes are stored under:

`prototypes/design/pages`

Component-level prototypes are stored under:

`prototypes/design/components`

These prototypes define the intended visual direction, hierarchy, layouts, navigation patterns, training-screen composition, authentication interaction, and pricing presentation.

The prototypes are design references, not production code.

The authoritative shared design-system rules for reusable design tokens, shared components, pages, and responsive behavior are:

`claude/rules/frontend/frontend-design-system.md`

This specification and its authoritative supporting specifications take precedence over prototypes. Prototypes take precedence over shared design-system defaults.

---

## User Types

### Guest

May view the landing page, product features, login, and registration. Pricing requires an authenticated application session.

### Authenticated User

May access Dashboard, Training, Session Review, History, Pricing, Subscription, Profile, and Settings.

### Subscriber

May access features enabled by the active plan. The frontend displays plan state but does not make protected billing decisions locally.

---

## Required Layouts

Defines the required frontend layouts and their existing structure.

The authoritative layout specification is [docs/frontend/layouts.md](layouts.md).

---

## Required Pages and Routes

Defines the required frontend pages, routes, and page-specific requirements.

The authoritative pages and routes specification is [docs/frontend/pages-and-routes.md](pages-and-routes.md). Example frontend/backend request and event shapes are in [docs/frontend/integration-contracts.md](integration-contracts.md); these proposals require backend confirmation before live integration.

Its [Session Review](pages-and-routes.md#session-review) entry defines that route's access, parameters, navigation, and states. Proposed API examples are in [frontend integration contracts](integration-contracts.md); backend owners must confirm them before live integration.

---

## Navigation Requirements

- Public navigation links to relevant landing-page sections and authentication.
- Authenticated navigation exposes all required application pages.
- Public horizontal navigation is visible when the user is not authenticated and includes Home, Training, and Login; Start Free actions navigate to Register where present. It does not expose Pricing as a public destination.
- Authenticated vertical navigation is visible when the user is authenticated and includes Dashboard, Training, History, Pricing, Subscription, Profile, Settings, and Checkout.
- Session Review access is authenticated. History and Dashboard session rows open Session Review.
- Navigation remains usable with keyboard input and on mobile screens.

The visual sources of truth for shared navigation layouts and states are:

- Public: [public-navigation.html](../../prototypes/design/components/navigation/public-navigation.html)
- Authenticated: [authenticated-navigation.html](../../prototypes/design/components/navigation/authenticated-navigation.html)

These dedicated prototypes take precedence over navigation examples in older page and layout prototypes.
---

## Shared UI Requirements

Shared UI components are generic, reusable UI elements used across pages and features.

The required shared components are:

- Button
- DateField
- NumberField
- SelectField
- TextField
- CollapseForm
- SidebarNav
- TopNav
- BaseTable
- PaymentCardPlan
- BillingDetailsCard
- BaseModal
- TextButton
- RecaptchaField
- SocialAuthButton
- SocialAuthButtons

Each shared visual pattern uses one reusable implementation across pages. Generic modal infrastructure and lightweight text actions are shared across features rather than reimplemented by individual pages. [components.md](components.md) is the authoritative source for shared component contracts, states, behavior, accessibility, styling, and prototype references. Pricing and Subscription use the shared PaymentCardPlan implementation; BillingDetailsCard presents the separate billing panel. Checkout retains its distinct PerformanceCard summary.

---

## Feature Components

Feature components are project- or feature-specific UI components, distinct from generic shared UI elements.

- `HomePageInfoSection` — existing Home headline, description, CTA links and feature cards.
- `HomePageVideoSlider` — interactive Home video and illustrative AI tennis-analysis preview.
- `LoginForm` — dedicated Login form UI using the shared RecaptchaField and SocialAuthButtons, with prototype-only authentication feedback.
- `RegisterForm` — dedicated registration form UI using the shared RecaptchaField and SocialAuthButtons, with prototype-only validation feedback.
- `CookiePrivacyPolicy` — the only public cookie/privacy feature component mounted by the application shell across public and authenticated pages. It composes `PrivacyChoicesBanner`, `CookiePreferencesContent`, `CookiePolicyContent`, and `PrivacyPolicyContent`, uses the shared `BaseModal` and `TextButton`, and delegates state/persistence to its local `useCookieConsent` composable. Consent is independent from authentication and survives navigation, refresh, login, and logout.
- `FeatureCard` — the single Features-page feature component for a numbered product feature with a title and description; it is not shared UI.
- `PerformanceCard` — existing Checkout order summary with description, price, billing note and back link, distinct from the selectable Pricing/Subscription plan card.
- `PaymentInformationCard` — reusable Checkout card presenting disabled sample payment fields from page-supplied display props; never collects raw card data.
- `OrderSummaryCard` — reusable Checkout card presenting order amounts, notes, and actions from page-supplied props; emits the checkout action for the page to handle.
- `PaymentStatusCard` — shared Subscription/Checkout return-state presentation for pending, success, failed, and cancelled visual states; it performs no payment or subscription logic.
- `CameraPreviewModal` — displays the live training camera stream, microphone and analysis controls, and backend feedback.
- `TrainingCamera` — requests camera and microphone access, handles permission errors, and opens the camera preview modal.

---

## Composables

Reusable frontend logic should be extracted into Vue composables and placed in the `composables/` directory.

---
## Services

Backend communication, API access, and external integration logic should be placed in the `services/` directory.

---

## Authenticated Application Data and Global Store

`UserStore` is the single global source of truth for persisted user-specific application data after authentication. `AuthStore` may own access-token and authentication workflow state, but it must not keep a second authoritative copy of the user profile or application data.

The authenticated initialization flow is:

1. Login, MFA verification, or OAuth establishes the authenticated application session and provides the short-lived access token.
2. The frontend immediately calls `GET /api/v1/user/data` once with that authenticated session.
3. `UserStore` atomically stores the complete response: account and personal information, subscription, Dashboard aggregates, the initial History collection, and persisted Settings groups.
4. Dashboard, Profile, Settings, Subscription, History, the authenticated layout, and other authenticated consumers read their initial server data from `UserStore`. Route entry must not trigger redundant initial-load GET requests for data already present in that snapshot.
5. Dedicated endpoints remain available only where the operation is independently necessary: History pagination or explicit refresh, Session Review detail, checkout verification, customer-portal creation, and other action-specific operations.
6. Each successful Profile or Settings update returns the normalized persisted section. `UserStore` replaces that corresponding section immediately; the page does not keep a separate authoritative server copy.
7. Logout, terminal authentication failure, or accepted account deletion clears the complete `UserStore` snapshot as well as authentication state.

Pages may own validation state, pending state, error messages, and unsaved form drafts. Those local drafts are not server truth. Components receive store-backed values through their owning page or feature and do not independently fetch or cache the same initial data.

Dashboard reuses `sessionHistory` rather than maintaining duplicate recent-session records.

Camera and microphone availability, permissions, discovered device identifiers, current physical-device selection, audio-output routing, and other runtime browser capabilities remain local device state.

The unified user-data response and every section-specific update contract are defined in [Authenticated application data and persisted user updates](integration-contracts.md#authenticated-application-data-and-persisted-user-updates).

---

## Feature Requirements

### Camera

- Allow switching between available cameras when supported by the device. - Keep the selected camera active until the user changes it. 
- Handle camera permission denied, unavailable camera, and initialization errors.

### Frame Preparation

The frontend may perform lightweight frame capture, resizing, throttling, or formatting for transport. It must not perform computer-vision inference.

### Training / Live Analysis Workflow

The frontend orchestrates live training in this order without performing computer-vision inference, stroke recognition, coaching decisions, or Text-to-Speech itself:

1. The user starts training and the frontend creates an authenticated session. See [Training session endpoints — `POST /api/v1/training/sessions`](integration-contracts.md#training-session-endpoints).
2. The response supplies the authoritative `sessionId` and short-lived `analysisWebSocketUrl`; the frontend opens that backend-issued URL and never constructs an analysis host itself.
3. Camera capture and frame sampling begin only when the training session and socket state permit them.
4. For each selected frame, the frontend sends the JSON metadata message and then its matching binary JPEG without interleaving another frame pair. See [Live analysis WebSocket — Client-to-server frame message](integration-contracts.md#client-to-server-frame-message).
5. The backend receives frames over time, performs temporal analysis, and decides internally when enough evidence exists to identify and evaluate a completed stroke. The frontend does not impose a fixed frame count or infer stroke boundaries.
6. The backend assigns the stroke's `strokeId` and `strokeNumber` and may return one or more `player_feedback` events. See [Live analysis WebSocket — Server-to-client `player_feedback` message](integration-contracts.md#server-to-client-player_feedback-message).
7. The frontend validates the event's active `sessionId`, displays supported coaching text, and never fabricates missing observations or advice.
8. When audio is enabled and `audioUrl` is present, the frontend plays that temporary backend-generated resource. It does not generate provider-side TTS, upload coaching audio, or treat temporary audio as persistent session history. Text remains the canonical feedback.
9. If the socket disconnects, the frontend stops sending frames and presents an explicit disconnected state. A user-visible retry follows the active-session connection rules and does not silently create a new session.
10. Normal stop ends capture immediately, prevents later frame sends, sends the documented `stop_analysis` message, and completes the session. Early exit abandons the session as incomplete. Socket close, permission loss, or transport failure becomes an explicit unavailable/disconnected state rather than silently starting a new session. See [Training session endpoints](integration-contracts.md#training-session-endpoints) and [Live analysis WebSocket](integration-contracts.md#live-analysis-websocket).

### Audio Output

- Play optional `audioUrl` resources delivered with current-session `player_feedback` when audio is enabled.
- Queue playback so coaching clips do not overlap, and allow current playback to stop when training ends or newer product rules require replacement.
- Treat unavailable, expired, or failed audio playback as local UI state; it does not change textual feedback or analysis/session truth.
- Release playback resources when they are no longer needed.

### Coaching Feedback

- Process only feedback for the active training session and preserve its backend-issued stroke identity and number.
- Display backend-supplied successful-stroke, detected-mistake, and recommendation text without generating coaching advice in the browser.
- Present incomplete, low-confidence, and disconnected states honestly.
- Use the backend's canonical completed-session summary for History and Session Review.

### Authentication

The authentication requirements are defined below .

The technical request/response definitions are in [Frontend Integration Contract Examples — Authentication and application session](integration-contracts.md#authentication-and-application-session), including the OAuth start/callback endpoints, `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/challenges/{challengeId}/verify`, `POST /api/v1/auth/refresh`, and `POST /api/v1/auth/logout`. This section owns the frontend sequence and UI behavior; it does not repeat those schemas.

Credentials, session validation, and authorization authority remain the responsibility of the backend.

- Provide token-based authentication with login, logout, access-token refresh, and multi-factor verification flows.

- For OAuth, request the backend-owned provider authorization URL, navigate to it, and handle the validated callback outcome after the backend completes provider exchange. Never expose provider tokens or secrets in frontend state or URLs.

- When Login returns an MFA challenge, show only the methods offered for that `challengeId`, submit the selected verification method/code, and create authenticated frontend state only after successful verification.

- After authentication succeeds, load the unified authenticated application data before treating protected page data as ready. A successful authentication response alone does not populate Dashboard, Profile, Settings, Subscription, or History.

- Display the sign-in UI whenever authentication is required.

- Send authentication requrequestsests to the backend.

- Store the short-lived JWT access token in application memory and use it for authenticated API requests.

- Store the refresh token as a HttpOnly, Secure, SameSite cookie managed by the browser and inaccessible to frontend JavaScript.

- Keep the user authenticated while a valid access token is available.

- When the access token expires, attempt to obtain a new access token through the backend refresh endpoint.


- Display clear user-facing errors for invalid credentials, failed authentication requests, failed multi-factor verification, and authentication states that require the user to sign in again.

- If an authenticated API request returns 401 Unauthorized, attempt token refresh when appropriate.

- If the refresh succeeds, retry the original request once with the new access token.

- If the refresh token is invalid, expired, revoked, or reused, clear the local authentication state and redirect the user to the login flow.

- Treat 403 Forbidden as an authorization failure for an authenticated user and do not treat it as logout or authentication expiration.

- Clear the access token and local authentication state when the user logs out or when authentication can no longer be renewed.

- Treat temporary network failures during authentication or token refresh as an unavailable state rather than immediately treating the user as signed out.

- Keep frontend authentication logic limited to authentication forms, access-token state, routing, multi-factor and verification UI flows, and user-facing authentication states.

- Keep credential verification, JWT issuance and validation, refresh-token rotation and revocation, multi-factor verification, authorization permissions, and security rules on the backend.


### Subscription

The frontend owns the user-facing subscription and checkout flow. Exact request, response, verified status, and payment-data boundaries are defined in [Frontend Integration Contract Examples — Checkout and billing](integration-contracts.md#checkout-and-billing); they are not duplicated here.

The Subscription page reads its initial plan and billing presentation from `UserStore.subscription`. It does not issue a separate initial status request. Dedicated billing endpoints remain responsible for checkout creation, customer-portal creation, and backend-verified checkout-return refreshes.

- When the user starts a subscription checkout, the frontend sends a request to the backend. The backend creates a Stripe Checkout Session and returns the Stripe-hosted checkout URL. The frontend then redirects the user to the Stripe Checkout page.

- The payment is completed on Stripe's hosted page, not inside the application.

- After the payment flow finishes, Stripe redirects the user back to the application's configured success or cancellation page.

- The redirect to the success page must not be treated as final proof that the payment has been confirmed. Stripe also sends a webhook event directly to the backend. The backend verifies the webhook, processes the payment result, and updates the authoritative subscription state in the database.

- When the user returns to the success page, the frontend requests the current subscription status from the backend.

- Because the Stripe webhook and browser redirect can happen at nearly the same time, the backend may temporarily return a `pending` status. The frontend should display a pending state and retry the subscription-status request until the backend reports a final state such as `active`, `paid`, or `failed`.

- The frontend is responsible for displaying user-facing states such as checkout in progress, payment confirmation pending, successful activation, cancellation, payment failure, and recoverable network errors.

- The frontend must never store or process raw card data. Stripe and the backend remain responsible for payment processing, webhook verification, transaction confirmation, and maintaining the authoritative subscription state.
---

## Frontend / Backend Boundary

Frontend owns browser UI, user interaction, camera access, lightweight frame preparation, backend transport, rendering structured results, overlays, checkout interaction through protected provider integrations, and client-side states.

Backend owns computer-vision inference, pose, ball, and racket detection, stroke analysis, AI interpretation, coaching logic, authentication authority, databases, creation and confirmation of payment transactions, payment webhooks, and server-side business rules. Sensitive payment data remains the responsibility of the payment provider and backend integration and must not pass through frontend application code.

Do not move backend responsibilities into the browser unless the architecture is explicitly changed.

---

## Responsive Requirements

Support desktop, tablet, and mobile layouts with adaptive navigation, readable typography, usable controls, sensible stacking, usable media proportions, and no unintended horizontal overflow.

The Training page may prioritize larger screens but must provide a safe and understandable mobile state.

---

## Accessibility Requirements

- Use semantic HTML.
- Associate labels with controls.
- Support keyboard navigation.
- Provide visible focus states.
- Maintain adequate color contrast.
- Do not communicate state through color alone.
- Name icon-only controls accessibly.
- Announce important asynchronous errors and state changes.
- Respect reduced-motion preferences where applicable.

---

## Required Application States

Applicable pages and features must define initial, loading, empty, success, validation, recoverable error, unavailable, and disconnected states. The page-by-page matrix and recovery behavior are defined in [pages-and-routes.md](pages-and-routes.md#application-state-matrix); example data and transport distinctions are in [integration-contracts.md](integration-contracts.md). In particular, distinguish empty from unavailable, signed-out from session-check failure, and partial analysis from a complete result.

Frontend recovery behavior follows these orchestration rules:

| Surface | Empty / insufficient data | Recoverable failure | Unavailable / disconnected | Frontend recovery |
| --- | --- | --- | --- | --- |
| Dashboard | Show an honest empty state when no sessions or supported focus exist | Offer retry without inventing data | Preserve the shell and explain that data cannot be loaded | Retry unified user-data initialization; keep Training and History navigation available when the stored snapshot is usable |
| History | Treat an empty initial session list as successful | Preserve the current cursor and offer retry | Explain that history is unavailable | Read the initial collection from `UserStore`; use the dedicated list endpoint only for pagination or explicit refresh and write its result back to the store |
| Session Review | Use safe not-found/unauthorized/insufficient states | Preserve the session route and offer retry | Explain that review is unavailable | Retry or return to History |
| Training | Treat no analysis data as waiting, not a zero-valued result | Stop frame sending after transport failure and expose reconnect/stop | Distinguish camera/device failure from analysis disconnect | Retry only through a user-visible action and retain the active `sessionId` |
| Subscription / Checkout | Distinguish no active subscription from unknown status | Preserve the selected plan and offer retry | Explain billing/provider unavailability | Use the initial `UserStore` section; re-fetch backend status for checkout verification and write it back to the store, never infer payment success from a redirect |
| Profile / Settings | Keep optional empty values empty | Preserve last confirmed store values and unsaved form input | Keep the local page usable while identifying unavailable persistence | Retry the section save; replace only the corresponding `UserStore` section with the normalized success response and never claim an unsuccessful save |
| Authentication | Distinguish standard sign-in from an explicit challenge | Preserve non-secret fields and field errors | Keep authentication unknown when lookup/refresh is unavailable | Retry lookup/request; clear secrets after terminal failure |

A `401 Unauthorized` starts the documented refresh/sign-in recovery flow when appropriate; a `403 Forbidden` remains an authorization failure and does not log the user out. Network failure alone never proves logout, successful completion, or successful payment. Sensitive transient values are cleared on logout, challenge expiry, or terminal authentication failure.

Do not present fabricated analysis, session, or subscription data as real.

---

## Project Structure

Use [Frontend Project Structure](frontend-project-structure.md) as the authoritative source for physical frontend directories and global placement rules. This section is the navigation point for structural references; it does not redefine that structure.

Inspect the existing prototypes only as organization and ownership guidance:

- [Prototype components](../../prototypes/components/) show the current shared and feature component families.

- [Visual page prototypes](../../prototypes/design/pages/) show page-level composition, while [Vue page examples](../../prototypes/pages/) and the existing [Home](../../prototypes/home/), [Pricing](../../prototypes/pricing/).

[Subscription](../../prototypes/subscription/), [Checkout](../../prototypes/checkout/), and [Training](../../prototypes/training/) entry directories show current page wiring examples.

- [Prototype composables](../../prototypes/composables/), [stores](../../prototypes/stores/), and [services](../../prototypes/services/) show existing behavior, state, and communication boundaries where examples are present.

- The [Home Page Video Slider](../../prototypes/components/sliders/home-page-video-slider/) is the reference for a complex component that owns substantial internal logic and several supporting files. Its current organization includes a Vue component, multiple supporting JavaScript classes/files, controller and lifecycle logic, rendering and animation logic, configuration, component-specific styles, a local [README](../../prototypes/components/sliders/home-page-video-slider/README.md), and related [tests](../../prototypes/tests/home-page-video-slider.test.js).

Use these references to understand practical grouping and ownership, not as files to copy blindly. A simple component may remain one `.vue` file when that is sufficient; only components with genuine internal complexity should group multiple supporting files with a clear owner. Component-specific logic and styles may stay grouped with that owner when allowed by the authoritative structure.

Prototype `assets/` directories do not determine production asset placement. Shared application assets belong in the approved global `src/assets/` location. Shared or global Sass/CSS likewise follows the authoritative global structure and must not become feature-owned merely because a prototype keeps styling nearby.

Do not introduce a frontend `modules/` feature-root layer.

---

## Verification and Testing

### Acceptance Criterion 1 — All Required Pages and Routes Exist

This validation corresponds to the first item in the `Acceptance Criteria` section:

- `all required pages and routes exist`

Validation must include:

- Verify that all pages and routes defined in `pages-and-routes.md` are implemented.
- Verify that every required route is registered in Vue Router.
- Use Vitest to validate the registered router configuration.
- Use Playwright end-to-end tests to verify that each required route loads the expected page.
- Verify that public routes are accessible without authentication.
- Verify that protected routes require authentication and follow the expected redirect behavior.
- Verify that no required route results in a missing page or unexpected routing error.

### Acceptance Criterion 2 — Public and Protected Navigation Behave Correctly

This validation corresponds to the second item in the `Acceptance Criteria` section:

- `public and protected navigation behave correctly`

Validation must include:

- Use Playwright end-to-end tests to verify public and authenticated navigation behavior in the running application.
- Verify that unauthenticated users see the required public navigation.
- Verify that unauthenticated users do not see authenticated-only navigation.
- Verify that public navigation contains the required items defined in the `Navigation Requirements` section and the authoritative navigation prototypes.
- Verify that public navigation items lead to the expected page, section, or authentication flow.
- Verify that unauthenticated users attempting to access protected routes are redirected to the expected login flow.
- Verify that authenticated users see the required authenticated navigation.
- Verify that authenticated navigation contains the required items defined in the `Navigation Requirements` section and the authoritative navigation prototypes.
- Verify that authenticated navigation items lead to the expected protected pages.
- Verify that navigation updates correctly after login and logout.
- Verify that navigation remains usable with keyboard input.
- Verify that navigation remains usable on supported mobile layouts.


### Acceptance Criterion 3 — Visual Direction Is Consistent with the Prototype

This validation corresponds to the third item in the `Acceptance Criteria` section:

- `visual direction is consistent with the prototype`

Validation must include:

- Use Playwright visual tests to capture screenshots of the main frontend pages and important application states.
- Compare the implemented frontend against the authoritative visual prototypes and shared design-system rules.
- Verify that the main page layouts follow the intended visual structure and hierarchy.
- Verify that navigation composition and placement are consistent with the relevant navigation prototypes.
- Verify that the Training screen composition follows the intended prototype structure.
- Verify that authentication interaction and pricing presentation remain visually consistent with their prototypes.
- Verify that shared spacing, typography, controls, and reusable visual patterns remain consistent with the frontend design system.
- Treat the prototypes as visual references rather than pixel-perfect production specifications.
- Use the verification agent to review significant visual differences and report any inconsistencies that require correction.

### Acceptance Criterion 4 — Training Exposes All Required Camera and Analysis States

This validation corresponds to the fourth item in the `Acceptance Criteria` section:

- `Training exposes all required camera and analysis states`

Validation must include:

- Use Playwright end-to-end tests to verify the Training interface and its main controls.
- Verify that the camera can be started and that the camera preview becomes available.
- Verify that the required Training controls such as Start, Stop, and Exit perform the expected frontend actions.
- Verify that starting analysis causes the frontend to prepare and send the expected data to the configured backend endpoint or transport contract.
- Mock or intercept the backend endpoint when the real backend is not available.
- Verify that the outgoing request or transport message contains the expected payload and data format.
- Verify that stopping analysis stops further data transmission.
- Verify that exiting the Training flow releases the required frontend camera and media resources.
- Verify applicable camera error states, including denied permission, unavailable camera, and initialization failure.
- Do not require a working backend response when the backend implementation is not yet available.



### Acceptance Criterion 5 — Desktop, Tablet, and Mobile Behavior Is Validated

This validation corresponds to the fifth item in the `Acceptance Criteria` section:

- `desktop, tablet, and mobile behavior is validated`

Validation must include:

- Use Playwright end-to-end tests to validate the frontend at representative desktop, tablet, and mobile viewport sizes.
- Verify that page layouts adapt correctly across supported viewport sizes.
- Verify that navigation adapts correctly for desktop, tablet, and mobile layouts.
- Verify that text remains readable and controls remain usable across supported viewport sizes.
- Verify that page sections stack and reposition correctly when the available screen width changes.
- Verify that media, camera previews, and other visual elements maintain usable proportions.
- Verify that no unintended horizontal overflow appears on supported viewport sizes.
- Verify that the Training page provides a safe and understandable mobile state.
- Compare responsive behavior against the authoritative frontend design-system rules and relevant visual prototypes.
- Use Playwright screenshots where useful to detect responsive layout regressions.
- Do not invent component dimensions or responsive thresholds in tests when they are not defined by the design system or supporting specifications.

### Acceptance Criterion 6 — Loading, Empty, Error, and Disconnected States Exist Where Applicable

This validation corresponds to the sixth item in the `Acceptance Criteria` section:

- `loading, empty, error, and disconnected states exist where applicable`

Validation must include:

- Use Playwright end-to-end tests to trigger loading, empty, error, and disconnected states on applicable pages and features.
- Verify that loading states are displayed while required data or operations are in progress.
- Verify that empty states are displayed when no data is available.
- Verify that error states are displayed when a request or operation fails.
- Verify that disconnected states are displayed when the frontend loses the required connection or transport.
- Mock or intercept backend responses where necessary to reproduce each state without requiring a working backend.
- Verify that each state provides clear and understandable information to the user.
- Verify that the UI does not display fabricated analysis, session, or subscription data when real data is unavailable.
- Verify that the user can recover from recoverable error states where the interface provides a retry or recovery action.


### Acceptance Criterion 6 — Loading, Empty, Error, and Disconnected States Exist Where Applicable

This validation corresponds to the sixth item in the `Acceptance Criteria` section:

- `loading, empty, error, and disconnected states exist where applicable`

Validation must include:

- Use Playwright end-to-end tests to trigger loading, empty, error, and disconnected states on applicable pages and features.
- Verify that loading states are displayed while required data or operations are in progress.
- Verify that empty states are displayed when no data is available.
- Verify that error states are displayed when a request or operation fails.
- Verify that disconnected states are displayed when the frontend loses the required connection or transport.
- Mock or intercept backend responses where necessary to reproduce each state without requiring a working backend.
- Verify that each state provides clear and understandable information to the user.
- Verify that the UI does not display fabricated analysis, session, or subscription data when real data is unavailable.
- Verify that the user can recover from recoverable error states where the interface provides a retry or recovery action.

### Acceptance Criterion 8 — Applicable Tests, Linting, and Static Checks Pass

This validation corresponds to the next item in the `Acceptance Criteria` section:

- `applicable tests, linting, and static checks pass`

Validation must include:

- Run all applicable frontend automated tests.
- Run Vitest unit and component tests.
- Run Playwright end-to-end and browser tests.
- Run ESLint static code analysis.
- Verify that all applicable test commands complete successfully.
- Verify that no ESLint errors remain.
- Verify that failed tests or failed static checks cause this acceptance criterion to fail.
- Do not require checks that are not used by the frontend project.


### Acceptance Criterion 9 — Unresolved Backend Dependencies Are Reported and Not Represented as Completed Functionality

This validation corresponds to the next item in the `Acceptance Criteria` section:

- `unresolved backend dependencies are reported and not represented as completed functionality`

Validation must include:

- Identify frontend functionality that depends on backend endpoints, services, analysis logic, authentication authority, payment processing, or other backend capabilities that are not yet implemented or available.
- Report each unresolved backend dependency clearly.
- Do not mark a feature as fully completed when required backend functionality is still unavailable.
- Allow the frontend portion of a feature to be marked as complete when its own implementation is finished and verified independently.
- Use mocks or intercepted requests where appropriate to validate the frontend portion without requiring the real backend.
- Distinguish clearly between completed frontend functionality and unresolved backend functionality.
- Do not present mocked, placeholder, or simulated backend behavior as completed production functionality.
- Treat unreported unresolved backend dependencies as a failed acceptance criterion.


---

## Acceptance Criteria

The frontend is complete only when:

- all required pages and routes exist
- public and protected navigation behave correctly
- visual direction is consistent with the prototype
- Training exposes all required camera and analysis states
- desktop, tablet, and mobile behavior is validated
- loading, empty, error, and disconnected states exist where applicable
- the production build succeeds
- applicable tests, linting, and static checks pass
- unresolved backend dependencies are reported and not represented as completed functionality
