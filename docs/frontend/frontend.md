# Tennis AI Coach — Frontend Specification

## Purpose

Define what the Tennis AI Coach client application must contain and how users interact with it.

This document is the project-specific source of truth for frontend product scope. It describes required pages, layouts, routes, behavior, visual references, and acceptance criteria.

Application source belongs under `frontend/`.

Implementation workflow and skill selection are owned by the New Frontend Orchestrator and must not be duplicated here.

---

## Technology

Use:

- Vue 3
- JavaScript
- Vue Router
- Vite

Prefer minimal dependencies and a simple, shallow, readable architecture.

Do not use TypeScript or introduce another frontend framework unless the project specification is explicitly changed.

---

## Visual Prototype

Use the following prototype as the visual reference:

`docs/prototypes/design/index.html` (catalog), with the application pages in `docs/prototypes/design/pages/`.

The prototype defines the intended visual direction, hierarchy, layouts, navigation patterns, training-screen composition, authentication interaction, and pricing presentation.

Treat it as a design reference, not as production code. Do not copy its HTML or CSS blindly.

Translate its visual intent into reusable design tokens, shared components, pages, and responsive behavior while applying:

`claude/rules/frontend/frontend-design-system.md`

When this specification and the prototype differ, this specification has priority.

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

### Public Layout

Must include product branding, public navigation, authentication actions, a responsive content container, and footer links.

### Authentication Layout

Must include product branding, accessible forms, loading and error states, and a way to switch between login and registration.

The prototype uses a modal. Production may use a modal or dedicated routes, but the chosen behavior must remain consistent and accessible.

### Authenticated Application Layout

Must include responsive application navigation, an active navigation state, and links to Dashboard, Training, History, Progress, Subscription, Profile, and Settings.

### Training Layout

Must keep the camera or video area visually dominant while presenting coaching feedback, connection state, session state, and controls without overcrowding the screen.

---

## Required Pages and Routes

### Landing Page

Route: `/`

Access: public

Must include a hero, value proposition, feature overview, training preview, pricing preview, and login and registration entry points.

### Login Page

Route: `/login`

Access: public

Must include email, password, validation, submit, loading, and authentication-error states.

### Registration Page

Route: `/register`

Access: public

Must include name, email, password, validation, submit, loading, and registration-error states.

### Dashboard Page

Route: `/app`

Access: authenticated

Must show recent training, the next recommended action, current progress, and a clear action to start training.

### Training Page

Route: `/app/training`

Access: authenticated

This is the primary application screen. It must include:

- camera or video preview
- start and stop camera controls
- start and stop analysis controls
- camera permission state
- connection and analysis state
- one focused coaching cue at a time
- session duration or state
- analysis overlay region
- loading, unavailable, disconnected, and error states

### Session Review Page

Route: `/app/sessions/:sessionId`

Access: authenticated

Must include a session summary, detected technique issues, key metrics, recommendations, and analyzed moments when available. It must identify incomplete or low-confidence results.

### History Page

Route: `/app/history`

Access: authenticated

Must list previous sessions and provide loading, empty, and error states plus navigation to Session Review.

### Progress Page

Route: `/app/progress`

Access: authenticated

Must show useful training trends, improvement areas, and the next recommended focus without unsupported precision.

### Subscription Page

Route: `/app/subscription`

Access: authenticated

Must include available plans, current plan, comparison, subscription actions, and loading and error states. Protected billing decisions remain backend responsibilities.

### Profile Page

Route: `/app/profile`

Access: authenticated

Must allow the user to view and update supported personal and tennis-related profile information.

### Settings Page

Route: `/app/settings`

Access: authenticated

Must contain supported application, camera, coaching, privacy, and notification preferences.

---

## Navigation Requirements

- Public navigation links to relevant landing-page sections and authentication.
- Authenticated navigation exposes all required application pages.
- Protected routes redirect unauthenticated users to login.
- Authentication pages redirect authenticated users to Dashboard when appropriate.
- Unknown routes show a useful not-found state or redirect safely.
- Navigation remains usable with keyboard input and on mobile screens.

---

## Shared UI Requirements

Create and reuse shared patterns where required, including:

- buttons
- form fields and validation messages
- cards
- badges and status indicators
- modal or dialog
- navigation items
- page headers
- loading states
- empty states
- error and confirmation states

Do not create separate visual implementations of the same pattern on every page.

---

## Feature Requirements

### Camera

The frontend owns browser permission, camera lifecycle, preview, and user-facing camera states.

### Frame Preparation

The frontend may perform lightweight frame capture, resizing, throttling, or formatting for transport. It must not perform computer-vision inference.

### Analysis Client

The frontend sends supported input to the backend and receives structured analysis state and results through the backend transport contract.

### Training Overlay

The frontend renders supported visual markers without obscuring the primary view and handles missing, partial, delayed, and low-confidence results.

### Coaching Feedback

The frontend presents structured coaching output clearly. It does not generate AI coaching logic locally.

### Authentication

The frontend owns forms, validation, session-aware navigation, and user-facing states. Authentication authority remains on the backend.

### Subscription

The frontend owns plan presentation, subscription interaction, and starting and completing a secure checkout flow through provider-hosted checkout or the payment provider's protected payment fields. It sends checkout requests to the backend and presents user-facing success, cancellation, payment-failure, and recoverable-error states.

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

Applicable pages and features must define initial, loading, empty, success, validation, recoverable error, unavailable, and disconnected states.

Do not present fabricated analysis, session, progress, or subscription data as real.

---

## Feature Components

Feature components are project-specific. Create only the components listed here or explicitly required by another project specification; do not infer extra feature components from examples in implementation skills.

- `CameraPreview` — shows the live camera or selected video, permission state, and availability errors for Training; needs camera or video state and browser-permission state.
- `SessionControls` — starts and stops camera, analysis, and the training session; needs camera, analysis, and session state.
- `TrainingOverlay` — renders supported analysis markers without blocking the primary video; needs structured overlay data and confidence state.
- `CoachingFeedback` — presents one focused coaching cue and analysis status; needs structured coaching output, confidence, and connection state.
- `SessionSummary` — presents duration, detected issues, key metrics, recommendations, and incomplete or low-confidence results on Session Review; needs the completed session result.
- `SessionHistoryList` — lists prior sessions and links to their reviews; needs session summaries plus loading, empty, and error state.
- `ProgressInsights` — presents training trends, improvement areas, and the next recommended focus; needs supported progress data and its available range.
- `SubscriptionPlanCard` — presents available plans and the current plan; needs plan definitions and current subscription state.
- `CheckoutFlow` — starts protected provider checkout and renders success, cancellation, payment-failure, and recoverable-error states; needs backend checkout state and provider redirect or protected-field state. It never receives or stores raw card data.
- `ProfileEditor` — displays and updates supported personal and tennis-related profile information; needs profile data, validation state, and save result.
- `SettingsEditor` — displays and updates supported application, camera, coaching, privacy, and notification preferences; needs settings data, validation state, and save result.

---

## Frontend Modules

Organize product-specific frontend code under `frontend/src/modules/` using the following modules:

- `public` — landing page, public navigation, and pricing preview
- `auth` — login, registration, validation, and session-aware navigation
- `dashboard` — authenticated overview and the next recommended action
- `training` — camera or video, start and stop analysis, analysis overlay, and the focused coaching cue
- `sessions` — session review and training history
- `progress` — trends, improvement areas, and the next recommended focus
- `subscription` — plans, current plan, starting and completing secure checkout, payment success, cancellation, and failure UI, and the backend and payment-provider boundary; it never stores or processes raw card data
- `account` — profile and settings, including camera, coaching, and privacy preferences

Shared UI components, the application router, assets, and global styles remain outside feature modules.

Module-local pages, components, services, composables, and state may live inside a module only when they are specific to that module. Keep broadly reusable code in the corresponding shared top-level frontend folders.

---

## Project Structure Constraints

Keep the Vue application structure shallow and appropriate under `frontend/`.

Derive the final folders from this specification and the approved frontend design plan. Support shared components, pages, routing, services, composables, state, assets, and shared styles without unnecessary abstraction layers.

---

## Acceptance Criteria

The frontend is complete only when:

- all required pages and routes exist
- public and protected navigation behave correctly
- visual direction is consistent with the prototype
- shared design patterns are reused
- Training exposes all required camera and analysis states
- frontend and backend responsibilities remain separated
- desktop, tablet, and mobile behavior is validated
- accessibility requirements are applied
- loading, empty, error, and disconnected states exist where applicable
- the production build succeeds
- applicable tests, linting, and static checks pass
- unresolved backend dependencies are reported and not represented as completed functionality
