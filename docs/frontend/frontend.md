# Tennis AI Coach — Frontend Specification

## Purpose

Define what the Tennis AI Coach client application must contain and how users interact with it.

This document is the project-specific source of truth for frontend product scope. It describes required pages, layouts, routes, behavior, visual references, and acceptance criteria.

Application source belongs under `frontend/`.

Implementation workflow and skill selection are owned by the New Frontend Orchestrator and must not be duplicated here.

---

## Technologies

- Vue 3
- TypeScript
- Vue Router
- Vite
- `vite.config.ts` — development server and build configuration
- Pinia — state management
- HTML5
- CSS3 / SCSS
- HTML5 Canvas API — video overlays, pose landmarks, trajectories and visual feedback
- MediaDevices API — camera access
- ESLint — static code analysis and code-quality rules
- Prettier — code formatting
- Vitest — unit and component tests
- Playwright — end-to-end and browser testing

### Optional / Future

- Three.js / WebGL — 3D court, 3D skeleton and spatial visualizations
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

Must include product branding, public navigation, a responsive content container, and footer links.
Example prototype `docs/prototypes/design/layouts/public.html`

### Authentication Layout

Must include product branding, public navigation, a responsive content container, and footer links.

Example prototype `docs/prototypes/design/layouts/authentication.html`

### Authenticated Application Layout

Application Layout: includes a vertical left sidebar with navigation links to the app's pages and a responsive main content area on the right where the selected page is displayed.
Example prptprototypeotype `docs/prototypes/design/layouts/authentication.html`

### Training Layout

Application Layout: includes a vertical left sidebar with navigation links to the app's pages and a responsive main content area on the right where the selected page is displayed.
Example prptprototypeotype `docs/prototypes/design/layouts/training.html`
---

## Required Pages and Routes


### Home Page
- purpose: `Main public entry page of the application`
- route: `/`
- layout: `Public Layout`
- Example Prototype: `design/pages/index.html`
- name: `home`
- required sections: `Left Section: application branding and introductory information, main headline, short introductory description, two primary action buttons, small statistic or information cards. Right Section: Animated Demo Banner, animated visual preview of the Tennis AI Coach training and AI analysis experience.`
- required shared components: `Button`, `StatCard`
- required feature components: `DemoBanner`
- dependencies: None

### Features
- purpose: `Public page that presents the core capabilities of the product and helps users understand what it can do.`
- route: `/features`
- layout: `Public Layout`
- Example Prototype: `design/pages/features.html`
- name: `feature`
- required sections: `Main Section: headline, short description, three StatCard items, two primary buttons.`
- required shared components: `Button`, `StatCard`
- required feature components: None
- dependencies: None

### Training
- purpose: `Primary page for real-time training where the user records strokes, sees instant analysis, and receives guidance.`
- route: `/training`
- layout: `Training Layout`
- Example Prototype: `design/pages/training.html`
- name: `training`
- required sections: `Main Section: headline, short description, three StatCard items, two primary buttons.`
- required shared components: `Button`, `StatCard`
- required feature components: None
- dependencies: None

### Pricing
- purpose: `Pricing page, presents the available subscription plans and helps users choose the right plan`
- route: `/pricing`
- Layout: `Public Layout`
- Example Prototype: `design/pages/pricing.html`
- name: `pricing`
- required sections: `The main section of the pricing page includes the page heading, a short introductory text, and three plan cards: Starter, Performance, and Pro.`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None

### Dashboard
- purpose: `Provides the user with an overview of their training activity, recent sessions, progress, and quick access to the main application features.`
- route: `/dashboard`
- layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/dashboard.html`
- name: `dashboard`
- required sections: `Overview Cards Section - contains three summary cards in a single row. Main Dashboard Section - contains one large primary card with the main dashboard information. Information Section - contains additional supporting information. Sidebar and top header are provided by the Authenticated Application Layout and are not part of the page sections..`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None


### History
- purpose: `allows the user to review previous training sessions, results, performance metrics, and past coaching feedback`
- Route: `/history`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/history.html`
- required sections: `Required Sections: History Section – contains the page heading and a short introductory description, and uses a grid layout with two components: TrainingSession and SessionInsights.`
- required shared components: `StatCard`, `BaseTable`
- required feature components: None
- dependencies: `TrainingHistoryStore`

### Subscription
- purpose: `allows the user to view their current subscription plan, manage billing details, and change or upgrade their subscription.`
- Route: `/subscription`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/subscription.html`
- required sections: `Required section is the Subscription section, which includes a page heading, a short description, and two main cards: the Current Subscription Card and the Billing or Plan Management Card.`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None

### Profile
- purpose: `Allow authenticated users to view and manage their profile and account information.`
- Route: `/profile`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/profile.html`
- name: `profile`
- required sections: `The page contains a profile form with four collapsible forms`
- required shared components: `CollapsibleForm`
- required feature components: None
- dependencies: `UserStore`

### Settings

- Route: `/settings`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/settings.html`
- name: `settings`
- required sections: `The page contains a profile form with seven collapsible panels..`
- required shared components: `CollapsibleForm`
- required feature components: None
- dependencies: `UserStore`

### Camera

- Route: `/camera`
- Layout: `Training Layout`
- Example Prototype: `design/pages/camera.html`

### Checkout

- Route: `/checkout`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/checkout.html`

### Payment Success

- Route: `/payment/success`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/payment-success.html`

### Payment Cancelled

- Route: `/payment/cancelled`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/payment-cancelled.html`

### Payment Failed

- Route: `/payment/failed`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/payment-failed.html`

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
