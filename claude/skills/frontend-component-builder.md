# Frontend Component Builder

## Purpose

Implement Vue components assigned by the Frontend Orchestrator from the validated frontend plan.

The orchestrator selects this skill based on the work in the plan. This skill implements assigned component requirements and reports the result to the orchestrator.

## Input

Receive the relevant part of the validated plan from the orchestrator:

- component names, responsibilities, and consumers
- variants, interaction states, and data requirements
- design foundation, tokens, and relevant prototype references
- dependencies and approved project structure

For shared UI, use the assigned entries from Required Shared Components. The orchestrator may also assign feature UI composition when it can be built from supplied data and existing shared components.

## Design Requirements

Apply the design requirements included in the validated plan. Plan New Frontend Design reads the shared design rules and carries the applicable requirements into the plan; the orchestrator supplies them with the component assignment.

Follow the active project instructions, approved frontend technology, and existing component conventions. Use the validated plan as the implementation requirements. Consult its referenced specification or prototype when component details require clarification.

## 1. Inspect the Assignment and Existing Code

Inspect the assigned requirements, existing components, tokens, styles, dependencies, and consumers before editing.

Reuse an existing component where it satisfies the requirement. Extend its variants when appropriate and preserve existing consumers. Create a new component only when the assigned responsibility is not already covered.

If a required design decision, data contract, or dependency is missing or contradictory, report the specific gap to the orchestrator. The orchestrator coordinates plan correction or dependency implementation.

## 2. Define the Component Interface

For each assigned component, define the smallest clear interface for its requirements:

- props and defaults for supplied data, variants, and states
- emitted events for user actions
- slots for caller-owned content when needed
- internal presentation state and cleanup behavior

Keep application decisions with the caller. For example, a shared button emits an action; the page or feature controller decides whether that action starts a camera or opens a dialog.

Keep parent-owned data immutable. Use the project's Vue conventions for form bindings and events. Implement only variants and states required by the assignment.

## 3. Implement the Components

Use Vue single-file components and the approved frontend language.

Place shared UI under `frontend/src/components/`. Place assigned feature UI in its module's components directory according to the approved project structure.

Reuse design tokens, shared styles, and existing primitives. Translate the prototype's visual intent through the plan and design rules.

Build each reusable pattern once. Keep component styling scoped where appropriate and avoid page-specific copies of shared styles. Small internal helpers may support the implementation; report new architectural requirements to the orchestrator.

Feature UI receives supported data and emits actions to its owner. Browser services, backend clients, and specialized logic remain with their assigned owners.

## 4. Implement Interaction and Accessibility

Apply the requirements relevant to each component:

- semantic controls, accessible names, keyboard operation, and visible focus
- associated field labels, help text, and validation messages
- disabled and pending behavior that prevents unintended duplicate actions
- loading, empty, error, and other assigned states
- dialog focus management, keyboard dismissal, and focus restoration when applicable
- responsive sizing, readable content, and reduced-motion support

Clean up any component-owned listeners, timers, and other resources on disposal.

## 5. Verify the Result

Check implemented components against their assigned requirements and existing consumers.

Run the available relevant build, lint, and component checks. Add or update meaningful tests for changed behavior such as events, form bindings, disabled actions, or dialog focus handling using the existing test setup.

When a runnable preview is available, check required variants and states, keyboard interaction, and narrow and wide layouts. Report unavailable checks explicitly; do not claim unperformed checks passed.

## Output

Return a concise result to the orchestrator containing:

- components created, updated, or reused and their file paths
- public props, events, slots, variants, and states needed by consumers
- dependencies used and integration notes
- checks performed and their actual outcomes
- unresolved requirements or blockers

The result enables subsequent feature and page work. Mark assigned work complete only when its requirements are implemented and the applicable verification is complete.

## Scope

Component Builder owns the assigned component code and component-level verification. The orchestrator owns skill selection, execution order, and integration coordination. Design planning owns the component requirements; Page Builder owns complete page assembly.

Do not implement backend APIs, inference, coaching decisions, authentication authority, or payment processing inside UI components.
