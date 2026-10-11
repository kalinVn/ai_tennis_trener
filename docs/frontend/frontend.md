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

May view the landing page, product features, pricing, login, and registration.

### Authenticated User

May access Dashboard, Training, Session Review, History, Progress, Subscription, Profile, and Settings.

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

Its [Session Review](pages-and-routes.md#session-review) and [Progress](pages-and-routes.md#progress) entries define their routes, access, parameters, navigation, and states. Proposed API examples are in [frontend integration contracts](integration-contracts.md); backend owners must confirm them before live integration.

---

## Navigation Requirements

- Public navigation links to relevant landing-page sections and authentication.
- Authenticated navigation exposes all required application pages.
- Public horizontal navigation is visible when the user is not authenticated and includes Home, Training, Pricing, and Login; Start Free actions navigate to Register where present.
- Authenticated vertical navigation is visible when the user is authenticated and includes Dashboard, Training, History, Subscription, Profile, Settings, and Checkout.
- Session Review and Progress access is authenticated. History and Dashboard session rows open Session Review; the authenticated sidebar includes Progress after History.
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

Each shared visual pattern uses one reusable implementation across pages. Generic modal infrastructure and lightweight text actions are shared across features rather than reimplemented by individual pages. [components.md](components.md) is the authoritative source for shared component contracts, states, behavior, accessibility, styling, and prototype references. Pricing and Subscription use the shared PaymentCardPlan implementation; BillingDetailsCard presents the separate billing panel. Checkout retains its distinct PerformanceCard summary.

---

## Feature Components

Feature components are project- or feature-specific UI components, distinct from generic shared UI elements.

- `HomePageInfoSection` — existing Home headline, description, CTA links and feature cards.
- `HomePageVideoSlider` — interactive Home video and illustrative AI tennis-analysis preview.
- `LoginForm` — dedicated Login form UI and prototype-only authentication feedback.
- `RegisterForm` — dedicated registration form UI and prototype-only validation feedback.
- `CookiePrivacyPolicy` — the only public cookie/privacy feature component mounted by the application shell across public and authenticated pages. It composes `PrivacyChoicesBanner`, `CookiePreferencesContent`, `CookiePolicyContent`, and `PrivacyPolicyContent`, uses the shared `BaseModal` and `TextButton`, and delegates state/persistence to its local `useCookieConsent` composable. Consent is independent from authentication and survives navigation, refresh, login, and logout.
- `FeatureCard` — presents a numbered product feature with a title and description.
- `PerformanceCard` — existing Checkout order summary with description, price, billing note and back link, distinct from the selectable Pricing/Subscription plan card.
- `PaymentInformationCard` — reusable Checkout card presenting disabled sample payment fields from page-supplied display props; never collects raw card data.
- `OrderSummaryCard` — reusable Checkout card presenting order amounts, notes, and actions from page-supplied props; emits the checkout action for the page to handle.
- `CameraPreviewModal` — displays the live training camera stream, microphone and analysis controls, and backend feedback.
- `TrainingCamera` — requests camera and microphone access, handles permission errors, and opens the camera preview modal.

---

## Composables

Reusable frontend logic should be extracted into Vue composables and placed in the `composables/` directory.

---
## Services

Backend communication, API access, and external integration logic should be placed in the `services/` directory.

---

## Feature Requirements

### Camera

- Allow switching between available cameras when supported by the device. - Keep the selected camera active until the user changes it. 
- Handle camera permission denied, unavailable camera, and initialization errors.

### Frame Preparation

The frontend may perform lightweight frame capture, resizing, throttling, or formatting for transport. It must not perform computer-vision inference.

### Analysis Client

The frontend sends supported input to the backend and receives structured analysis state and results through the backend transport contract. The proposed versioned WebSocket envelope, frame metadata, result handling, stop, error, and reconnect behavior is specified in [integration contract examples](integration-contracts.md#training-session-and-analysis-transport). No browser inference or fabricated results are allowed.

### Audio Output

The proposed `coaching_audio` event shape, instruction priority, optional authenticated audio resource, and playback failure boundary are specified in [integration contract examples](integration-contracts.md#training-session-and-analysis-transport).

- Receive audio playback commands through the `Analysis Client`.
- Play coaching audio when requested by the backend.
- Start, stop, pause, resume, or interrupt audio playback when required.
- Prevent multiple coaching audio messages from overlapping.
- PQueue audio coaching instructions to play sequentially, without interrupting earlier messages.
- Handle audio playback failures and unavailable audio resources.
- Keep audio playback logic separate from backend communication and analysis logic.
- Release audio playback resources when they are no longer needed.


### Coaching Feedback

- Receive coaching feedback data through the `Analysis Client`.
- Process feedback for the current training session.
- Display short coaching messages or status information immediately when critical, or queue them to align with the training flow when non-urgent.
Receive stroke-specific feedback from the backend for individual strokes.
- Receive successful-stroke information from the backend when available.
- Receive detected-mistake information from the backend when available.
- Receive coaching recommendations from the backend during the active training session.
- May receive the completed training summary and collected session feedback from the backend when the training session is completed.

### Authentication

The proposed cookie-backed session, login/registration, multi-factor challenge, OAuth redirect, logout, expiry, and error shapes are specified in [integration contract examples](integration-contracts.md) and must follow the requirements defined under `Feature Requirements → Authentication`. These examples keep credentials and authorization authority on the backend.

- Provide login and logout functionality.

- Display the authentication UI when the user needs to sign in.

- Validate required form fields before sending authentication requests.

- Send authentication requests to the backend.

- Store and use the authenticated session state returned by the backend.

- Keep the user authenticated while the session remains valid.

- Update the application navigation immediately after login or logout.

- Prevent unauthenticated users from accessing protected pages.

- Redirect unauthenticated users to the login flow when they request a protected page.

- Preserve the originally requested page and return the user to it after successful login.

- Redirect already authenticated users away from authentication pages when appropriate.

- Display clear errors for invalid credentials, failed authentication requests, and expired sessions.

- Clear the local authentication state when the user logs out or the session expires.

- Keep frontend authentication logic limited to forms, session state, routing, and user-facing states.

- Keep authentication authority, credential verification, token validation, permissions, and security rules on the backend.

### Subscription

The frontend owns plan presentation, subscription interaction, and starting and completing a secure checkout flow through provider-hosted checkout or the payment provider's protected payment fields. It sends checkout requests to the backend and presents user-facing success, cancellation, payment-failure, and recoverable-error states. Proposed billing endpoint and verification shapes are in [integration contract examples](integration-contracts.md#checkout-and-billing).

The frontend must never store or process raw card data. The backend and payment provider remain responsible for creating and confirming transactions and handling sensitive payment data.

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

Do not present fabricated analysis, session, progress, or subscription data as real.

---

## Project Structure

Use [Frontend Project Structure](frontend-project-structure.md) as the authoritative source for physical frontend directories and global placement rules. This section is the navigation point for structural references; it does not redefine that structure.

Inspect the existing prototypes only as organization and ownership guidance:

- [Prototype components](../../prototypes/components/) show the current shared and feature component families.
- [Visual page prototypes](../../prototypes/design/pages/) show page-level composition, while [Vue page examples](../../prototypes/pages/) and the existing [Home](../../prototypes/home/), [Pricing](../../prototypes/pricing/), [Subscription](../../prototypes/subscription/), [Checkout](../../prototypes/checkout/), and [Training](../../prototypes/training/) entry directories show current page wiring examples.
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
- Verify that the UI does not display fabricated analysis, session, progress, or subscription data when real data is unavailable.
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
- Verify that the UI does not display fabricated analysis, session, progress, or subscription data when real data is unavailable.
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
