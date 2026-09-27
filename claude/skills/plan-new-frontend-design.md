# Plan New Frontend Design

## Purpose

Analyze the requirements in the provided frontend specification and produce a structured frontend design plan for the Frontend Orchestrator.

---

## Skill Rules

- Use this skill only when the frontend does not yet have an established implementation.
- Determine what must be built and provide the Frontend Orchestrator with the information required to coordinate the remaining frontend skills.
- Do not build final pages or reusable components.
- Do not select or execute implementation skills. The Frontend Orchestrator owns implementation coordination.

---

## Required Rules

Read and apply:

`../rules/frontend/frontend-design-system.md`

Use the shared frontend design rules when interpreting project requirements and visual prototypes.

Do not duplicate those rules inside this skill.

---

## Input

Receive `specification_path` from the Frontend Orchestrator. Resolve relative paths from the project root and read that file as the source of frontend requirements, including technology, routes, authentication, and application features.

If the path is missing or the file cannot be read, report the problem to the orchestrator and stop planning. Do not substitute another specification.

---


## Source Priority

When requirements conflict, use:

1. Project frontend specification resolved from `specification_path`.
2. Visual prototype referenced by that specification (a referenced resource, not a separate input; resolve it through the specification).
3. Shared frontend design rules (`../rules/frontend/frontend-design-system.md`).

Higher-priority requirements override lower-priority defaults.

---

# Execution Workflow

## 1. Read the Frontend Specification

Read the specification resolved from `specification_path` before analyzing the frontend. Use this same specification throughout the remaining steps.

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
Analyze only what is actually present in the provided prototype. Use concrete examples exclusively from that prototype. If something is missing or unclear, document that without making assumptions.

- Visual Hierarchy
  Identify which elements attract attention first, which are secondary, and which provide supporting information. Examine how relative size, contrast, typography, color, and visual emphasis establish this hierarchy. Explain the observed hierarchy using concrete examples from the provided prototype.

- Page Composition
  Analyze how sections, containers, and UI elements are arranged within each page or screen. Examine their relative positions, proportions, alignment, grouping, and spacing, including gaps between adjacent sections and containers. Describe the composition of each distinct page or screen using concrete examples from the provided prototype.

- Shared Surfaces
  Identify recurring visual surface styles throughout the prototype. Compare their backgrounds, transparency, borders, corner radii, shadows, and relative dimensions. Examine relationships between larger surfaces and any nested surfaces. Record both their shared visual characteristics and meaningful differences.

- Buttons
  Analyze every button style and variant present in the prototype. Examine relative sizes, colors, typography, padding, borders, corner radii, alignment, and spacing. Identify visual states such as default, hover, pressed, disabled, and selected wherever these are represented. Compare buttons across different sections and containers, providing concrete examples from the analyzed prototype.

- Forms
  Analyze the forms and input elements present in the prototype. Examine how fields, labels, placeholders, buttons, and supporting text are arranged, including alignment, dimensions, internal padding, grouping, and spacing. Identify their visual styling and any represented states, such as focused, filled, disabled, or validation states. Describe each observed form using concrete examples without inventing missing fields, interactions, or validation behavior.

- Cards
  Analyze the card styles and variants present in the prototype, including cards nested inside larger containers. Examine backgrounds, borders, corner radii, shadows, relative dimensions, internal padding, and spacing between cards. Describe how headings, icons, text, images, and actions are arranged within each card, where present. Compare recurring cards and identify visually distinct variants using concrete examples from the analyzed prototype.

- Navigation
  Analyze the visual structure of all navigation elements present in the prototype, including navigation inside individual sections, containers, panels, and dialogs. Examine how links, menu items, tabs, and other navigation elements are arranged, grouped, aligned, and spaced. Identify gaps, internal padding, relative dimensions, and visual differences between active and inactive items. Focus on the observed visual arrangement rather than navigation functionality.

- Dialogs
  Analyze all dialogs, modals, and overlay panels present in the prototype. Examine their position, relative dimensions, background overlays, borders, corner radii, shadows, layering, and internal spacing. Describe how headings, close controls, tabs, forms, content, and actions are arranged wherever present. Identify any represented visual variations or states, using concrete examples from the analyzed prototype.

- Layout Patterns
  Identify the layout patterns actually used throughout the prototype. Examine how they organize content, including the number and arrangement of columns, relative proportions, alignment, grouping, and spacing. Compare recurring arrangements across different pages and sections, recording their shared characteristics and important variations. Use concrete examples from the analyzed prototype without assuming any particular layout structure.

- Responsive Intent
  Analyze how the provided prototype adapts to different screen sizes. Identify any represented responsive breakpoints and examine how layouts, containers, navigation, typography, spacing, and individual elements change. Describe which elements resize, change proportions, move, rearrange, stack, or become hidden. Provide concrete examples exclusively from the analyzed prototype. If responsive behavior is missing or cannot be determined, document that limitation rather than inventing responsive rules.

- Reusable Visual Patterns
  Identify visual arrangements and styling combinations that recur across the prototype. Compare their shared characteristics, variations, and the contexts in which they appear. Distinguish genuinely recurring visual patterns from isolated designs. Record potential opportunities for reuse using concrete examples from the analyzed prototype, without defining component boundaries or deciding the final implementation architecture.


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


Document the global design tokens required by the frontend, based on the provided prototype.

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
Determine the required pages from the project specification, not from the prototype. Use the prototype only as a visual reference.

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

Read the `Shared UI Requirements` section in the provided frontend specification and identify the reusable components defined there.

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

Read the `Feature Components` section in the provided frontend specification and identify only the project-specific components defined there.

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

## Project Structure

Derive the structure requirements from the provided frontend specification and its project constraints. Include:

- application root directory
- required feature modules and their responsibilities
- placement of module-specific pages and components
- placement of shared components, routing, styles, assets, and other required shared resources

Within each feature module, separate Vue views from JavaScript logic. Keep templates in `.vue` page and component files, and place state, event handlers, validation, and other behavior in separate `.js` modules or composables imported by those views. Keep the Vue script block limited to imports and minimal wiring required to connect the template to the external logic. Keep API access in separate service modules rather than embedding it in view files.

For each planned page or component, describe the placement of its Vue view and any required JavaScript logic files within the owning module. Shared logic belongs in shared resources only when reused. Do not create placeholder logic files for views that need no JavaScript behavior.

Plan Pinia stores for shared feature state: module-specific stores belong in that module's `stores/` directory; application-wide stores belong in `src/stores/`. Describe the state ownership and actions needed by pages and feature components, which access their store directly instead of forwarding shared state through props. Keep API calls in services and initialize Pinia once at application startup. Do not persist passwords or secrets. Do not force purely local UI state or generic component props into stores.

Describe only the structure required by the planned frontend. Mark unspecified structural decisions explicitly for resolution rather than inventing additional modules or folders.

Return these requirements as part of the plan. The orchestrator passes them to Frontend Project Structure to inspect the existing project and create missing directories; this planning skill does not create them.

## Design Foundation

Include:

- visual direction
- required design tokens
- typography direction
- layout principles
- responsive principles

Include the applicable shared design requirements and project overrides needed for implementation, including component styling, interaction states, accessibility, responsive behavior, and acceptance criteria. Make these requirements explicit in the design foundation or the relevant component and page entries so the orchestrator can pass them to builders without requiring another reading of the shared design rules. Reference shared requirements once rather than repeating them for every component.

## Required Layouts

For each layout:

```text
name
purpose
used_by_pages
shared_navigation
shared_content_structure
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
data_requirements
```

Describe the data needed by each feature component and reference its documented source or contract when available. Mark unknown fields or contracts as unresolved; do not invent API endpoints or payloads.

## Required Routes

For each route:

```text
path
page
access
layout
parameters
navigation_visibility
```

Describe where each route appears in navigation and under which conditions it is visible. Navigation visibility does not replace the route's access requirements.

## Open Questions and Blockers

Return an empty list when there are no unresolved issues. Otherwise, for each issue include:

```text
question_or_missing_information
affected_plan_items
implementation_impact
blocking
required_resolution
```

Identify missing information and conflicting requirements explicitly. Explain which work cannot proceed and what clarification or source is needed. Do not present assumptions as confirmed requirements or a blocked plan as ready for implementation. Return these issues to the orchestrator for resolution before affected work begins.

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

These are internal planning checks, not independent approval. The orchestrator invokes `frontend-plan-validator` with the original specification and returned plan before implementation. When the orchestrator supplies validation errors and a rejected plan as correction context, address the cited requirements and return a complete corrected plan; report unresolved blockers instead of inventing missing information.

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
- feature-component data requirements are included, with unknown contracts explicitly reported
- route navigation visibility is included and distinguished from access requirements
- unresolved questions and blockers identify affected work and the required resolution

---

## Final Rule

Analyze first.

Produce a complete structured frontend plan.

Return that plan to the Frontend Orchestrator.

Let the orchestrator delegate implementation to specialized frontend skills.
