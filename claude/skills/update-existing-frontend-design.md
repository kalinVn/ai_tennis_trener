# Update Existing Frontend Design

## Purpose

Analyze a requested change to an existing frontend and produce a structured update plan for the Frontend Orchestrator.

This skill is used when frontend code already exists.

Its responsibility is to determine:

- what already exists
- what must change
- what must remain unchanged
- what can be reused
- which pages are affected
- which components are affected
- which skills must perform the update

This skill does not directly rebuild the entire frontend.

---

## Required Rules

Read and apply:

`../rules/frontend-design.md`

Preserve the existing frontend design system unless the current task explicitly changes it.

---

## Inputs

This skill may receive:

- update task
- update specification
- project frontend specification
- feature specification
- referenced prototype
- existing frontend source
- existing routes
- existing components
- existing design tokens

---

## Source Priority

When requirements conflict:

1. Explicit current update requirement
2. Update specification
3. Project frontend specification
4. Feature specification
5. Referenced prototype
6. Existing project design system
7. Shared frontend design rules

Preserve existing behavior unless a higher-priority requirement changes it.

---

# Execution Workflow

## 1. Read the Update Requirement

Determine exactly what must change.

Identify:

- requested new behavior
- requested visual changes
- affected page
- affected component
- new page requirements
- new component requirements
- route changes
- feature changes
- responsive changes

Also identify explicitly what should remain unchanged.

---

## 2. Read Relevant Specifications

Read only the relevant project and feature specifications.

Use them to understand:

- intended application architecture
- current page responsibilities
- current feature behavior
- design expectations
- prototype references

---

## 3. Resolve Update Prototype

If the update references a prototype:

1. resolve the path
2. verify that it exists
3. inspect only the relevant visual requirements

Do not assume the entire frontend must adopt a prototype created for one isolated feature.

---

## 4. Inspect Existing Frontend

Inspect the current implementation.

Identify:

- existing pages
- existing routes
- existing layouts
- existing shared components
- existing feature components
- design tokens
- shared styles
- component variants
- navigation
- affected dependencies

This step is mandatory for updates.

---

## 5. Determine Existing Reusable Components

Before proposing anything new, identify existing components that can satisfy the request.

For each relevant existing component determine whether it can be:

- reused directly
- extended
- given a new variant

Only request a new component when necessary.

---

## 6. Determine Affected Pages

Identify pages that must change.

For every affected page provide:

- page name
- current responsibility
- requested change
- components affected
- components added
- components removed
- route impact
- relevant skill

Do not include unrelated pages.

---

## 7. Determine New Pages

If the update requires new pages, identify them separately.

For each new page provide:

- name
- route
- purpose
- layout
- required shared components
- feature components
- dependencies
- required skills

---

## 8. Determine Component Changes

Classify component changes into:

### Reuse

Existing component can be used unchanged.

### Extend

Existing component requires an additional capability.

### Variant

Existing component needs a new visual or behavioral variant.

### New Component

No suitable reusable component exists.

Prefer the first three before creating a new component.

---

## 9. Determine Design-System Impact

Determine whether the requested design change is:

- local
- component-level
- page-level
- global

If local:

do not change global tokens.

If global:

identify the shared token or component that should change.

Report the expected impact.

---

## 10. Determine Routing Changes

Identify:

- new routes
- modified routes
- removed routes
- navigation changes
- protected route changes
- route parameters

Do not modify unrelated routing.

---

## 11. Determine Specialized Skills

Determine which skills must perform the update.

Possible examples:

- `frontend-page-builder`
- `frontend-component-builder`
- `frontend-routing`
- `frontend-camera`
- `frontend-frame-processing`
- `frontend-analysis-client`
- `frontend-training-overlay`
- `frontend-auth-ui`
- `frontend-subscription-ui`
- `frontend-responsive-ui`
- `frontend-code-quality`

Only return skills actually required.

---

## 12. Determine Regression Risk

Identify existing functionality that could be affected by the update.

Examples:

- navigation
- component reuse
- authentication UI
- shared design tokens
- shared layouts
- mobile behavior
- related pages

Return these as required regression checks.

---

# Output Contract

Return a structured update plan to the Frontend Orchestrator.

## Frontend Type

```text
existing
```

## Requested Change

Summarize the exact requested change.

## Existing Relevant Structure

Return:

```text
affected_pages
affected_routes
existing_components
existing_layouts
existing_design_tokens
```

## Pages to Update

For each page:

```text
name
requested_change
components_to_reuse
components_to_update
components_to_add
route_impact
required_skills
```

## Pages to Create

For each new page:

```text
name
route
purpose
layout
required_components
required_skills
dependencies
```

## Components to Reuse

For each:

```text
name
used_by
```

## Components to Extend

For each:

```text
name
required_change
affected_consumers
```

## Components to Create

For each:

```text
name
responsibility
used_by
dependencies
required_skill
```

## Design Changes

Classify each change as:

```text
local
component
page
global
```

Describe the required implementation scope.

## Routing Changes

Return only required routing changes.

## Required Skills

Return only the skills required for this update.

## Regression Checks

Return the existing behaviors that must remain valid after the update.

## Update Order

Return the safest dependency order.

Example:

```text
1. inspect affected shared components
2. update/add shared components
3. update affected pages
4. create new pages
5. update routing
6. integrate specialized features
7. responsive validation
8. regression checks
9. tests
10. verification
```

---

## Preservation Rule

The plan must preserve unrelated:

- pages
- routes
- components
- styles
- layouts
- application behavior

Do not propose broad frontend replacement for a scoped update.

---

## Important Boundary

This skill analyzes and plans an existing frontend update.

It does not directly perform the full implementation.

The Frontend Orchestrator uses the returned plan to delegate work to specialized skills.

---

## Validation

Before returning the plan verify:

- existing frontend was inspected
- requested scope is clear
- affected pages are identified
- unrelated pages are excluded
- reusable components are identified
- new components are justified
- route changes are explicit
- design-system impact is classified
- required skills are identified
- regression risks are identified
- update order respects dependencies

---

## Final Rule

Inspect the existing frontend.

Determine the smallest correct change.

Return a structured update plan.

Let the Frontend Orchestrator coordinate implementation.