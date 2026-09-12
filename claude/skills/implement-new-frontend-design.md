# Implement New Frontend Design

## Purpose

Analyze the requirements for a new frontend (`docs/frontend/frontend.md`) and produce a structured frontend design plan for the Frontend Orchestrator.

This skill is used when the frontend does not yet have an established implementation.

This skill does not build final pages.

This skill does not build final reusable components.

Its responsibility is to determine what must be built and provide the Frontend Orchestrator with the information required to coordinate the remaining frontend skills.

---

## Required Rules

Read and apply:

`../rules/frontend/frontend-design-system.md`

Use the shared frontend design rules when interpreting project requirements and visual prototypes.

Do not duplicate those rules inside this skill.

---

## Input

Read `docs/frontend/frontend.md`. It is the sole source of frontend requirements, including technology, routes, authentication, and application features.

---

## Referenced Visual Prototype

A visual prototype is a referenced resource, not an input. Resolve and analyze it only when `docs/frontend/frontend.md` references it.

---

## Source Priority

When requirements conflict, use:

1. Project frontend specification (`docs/frontend/frontend.md`)
2. Visual prototype referenced by the project frontend specification (`docs/prototypes/tennis-ai-coach.html`)
3. Shared frontend design rules (`../rules/frontend/frontend-design-system.md`)

Higher-priority requirements override lower-priority defaults.

---

# Execution Workflow

## 1. Read the Frontend Specification

Read `docs/frontend/frontend.md` before analyzing the frontend.

Use it to understand the complete frontend scope.

Identify:

- application purpose
- required pages
- required routes
- shared layouts
- navigation structure
- authentication UI
- billing UI
- forms
- feature-specific UI
- realtime requirements
- media requirements
- responsive requirements
- referenced prototypes

Do not implement pages during this step.

---

## 2. Resolve the Visual Prototype

If a prototype is referenced:

1. resolve the prototype path
2. verify that it exists
3. inspect it before producing the design plan

If an explicitly required prototype is missing, stop and report the missing path.

Do not silently substitute another prototype.

---

## 3. Analyze the Prototype

When a prototype exists, analyze:

- visual hierarchy
- page composition
- color relationships
- typography
- spacing
- shared surfaces
- buttons
- forms
- cards
- navigation
- dialogs
- layout patterns
- responsive intent
- reusable visual patterns

Do not copy prototype implementation code.

Use the prototype to determine the intended design system.

---

## 4. Determine Design Tokens

Determine which global design tokens the frontend requires.

Examples:

- colors
- typography
- spacing
- radius
- borders
- shadows
- transitions
- layout widths
- breakpoints
- semantic state colors

Do not implement every page here.

The output should describe the tokens required by the frontend.

---

## 5. Determine Shared Layouts

Identify reusable layouts required by multiple pages.

Examples:

- public layout
- authenticated application layout
- dashboard layout
- settings layout
- authentication layout
- full-screen feature layout

For each layout identify:

- purpose
- pages using it
- shared navigation
- shared content structure

---

## 6. Determine Required Pages

Create a complete list of required pages from the specification.

For each page determine:

- page name
- purpose
- route
- layout
- authentication requirement
- required sections
- required shared components
- required feature components
- dependencies

Do not build the page here.

Return the page definition to the orchestrator.

---

## 7. Determine Shared Components

Read the `Shared UI Requirements` section in `docs/frontend/frontend.md` and identify the reusable components defined there.

Do not infer extra shared components from examples. A shared component must be required by the frontend specification and used by more than one page or layout.

For every shared component determine:

- component name
- responsibility
- pages using it
- required variants
- major states

Do not create the component here.

Return the component requirement to the orchestrator.

---

## 8. Determine Feature Components

Read the `Feature Components` section in `docs/frontend/frontend.md` and identify only the project-specific components defined there.

Do not infer extra feature components from examples. In particular, do not add a payment modal unless the frontend specification explicitly requires one.

For each feature component identify:

- responsibility
- page using it
- dependencies
- data requirements

Keep feature components separate from generic shared UI components.

---

## 9. Determine Routing Requirements

Identify required routes.

For each route provide:

- route path
- page
- public/protected status
- route parameters when applicable
- layout
- navigation visibility

Do not implement routing here.

Return routing requirements to the orchestrator.

---

# Output Contract

Return a structured frontend plan to the Frontend Orchestrator.

The output must contain:

## Frontend Type

```text
new
```

## Design Foundation

Include:

- visual direction
- required design tokens
- typography direction
- layout principles
- responsive principles

## Required Layouts

For each layout:

```text
name
purpose
used_by_pages
```

## Required Pages

For each page:

```text
name
route
purpose
layout
access
sections
shared_components
feature_components
dependencies
```

## Required Shared Components

For each component:

```text
name
responsibility
variants
states
used_by_pages
```

## Required Feature Components

For each component:

```text
name
responsibility
used_by_page
dependencies
```

## Required Routes

For each route:

```text
path
page
access
layout
parameters
```

## Build Order

Return the recommended dependency order.

Example:

```text
1. project structure
2. design foundation
3. shared components
4. feature components
5. pages
6. routing
7. specialized feature integration
8. responsive validation
9. testing
10. verification
```

---

## Important Boundary

This skill produces the frontend design and implementation plan. The Frontend Orchestrator selects implementation skills from the planned work; this skill does not select or return skills.

It does not:

- build final pages
- build final reusable components
- configure final routing
- implement backend APIs
- perform Vision inference
- implement payment server logic

Those responsibilities belong to specialized skills coordinated by the Frontend Orchestrator.

---

## Validation

Before returning the plan verify:

- every required page is represented
- required routes are represented
- shared components are identified
- duplicate components are avoided
- feature-specific components are separated
- prototype requirements are represented
- design rules are respected
- dependencies are clear
- implementation order is valid

---

## Final Rule

Analyze first.

Produce a complete structured frontend plan.

Return that plan to the Frontend Orchestrator.

Let the orchestrator delegate implementation to specialized frontend skills.
