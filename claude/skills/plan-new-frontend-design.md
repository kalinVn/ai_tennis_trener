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

## Input

Receive `specification_path` from the Frontend Orchestrator. Resolve relative paths from the project root and read that file as the source of frontend requirements, including technology, routes, authentication, and application features.

If the path is missing or the file cannot be read, report the problem to the orchestrator and stop planning. Do not substitute another specification.

For this project, use the provided specification_path as the root frontend specification, and follow its authoritative references.

### Load Referenced Planning Sources

After reading the frontend specification, identify the authoritative supporting specifications and visual sources it declares. Load only the referenced sources needed for the design plan:

Read the Visual Prototype section in the main frontend specification, open each referenced prototype, and extract the relevant requirements.

Apply this selected-source scope throughout prototype resolution and analysis. Follow relevant references in supporting specifications only when needed to resolve a planning decision. Verify required sources exist; report missing sources or unresolved conflicts as blockers rather than inventing requirements.

Use these sources to derive frontend architecture, module and page structure, layout structure, shared and feature component boundaries, dependencies, and implementation order within the existing Output Contract. Derive final folders from the specification's structure constraints. Translate prototype intent into reusable design tokens, components, pages, and responsive behavior rather than copying prototype implementation code.

Reference source specifications in the plan instead of copying their contents unnecessarily. Include the concrete decisions and requirements needed by the Output Contract and downstream builders; do not reproduce entire supporting specifications, prototypes, or design-system documents.

---


## Source Priority

When requirements conflict, use:

1. Project frontend specification resolved from `specification_path` and the authoritative supporting specifications it declares. The root specification defines source responsibilities and precedence; report unresolved conflicts between authoritative requirements.
2. Visual prototypes referenced by those specifications (referenced resources, not separate inputs). Apply declared visual precedence: dedicated navigation prototypes override older embedded navigation examples.
3. Shared frontend design rules (`../rules/frontend/frontend-design-system.md`).

Higher-priority requirements override lower-priority defaults.

---

# Execution Workflow

## 1. Read the Frontend Specification

Read and identify all sections in the root frontend specification  from specification plan and use all relevant requirements when building the frontend design plan.


Do not implement pages during this step.

---

## 2. Resolve the Visual Prototypes

If a prototype is referenced:

1. resolve the prototypes path
2. verify that it exists
3. inspect it before producing the design plan

If an explicitly required prototype is missing, stop and report the missing path.

Do not silently substitute another prototype.

---

## 3. Analyze the Prototype

When a prototype exists, inspect it before producing the frontend design plan. Analyze only what is actually present in the provided prototype. Use concrete examples from that prototype and if something is missing or unclear, document that without guessing. Then look at visual structure, meaning hierarchy, major sections, composition, and layout patterns, and describe how each page or screen is arranged. Next, review all UI components and surfaces that are actually present, such as buttons, forms, cards, navigation, dialogs, shared containers, and any other visible elements, and for each of them, where applicable, note relative size, alignment, spacing, padding, typography, colors, borders, corner radii, shadows, grouping, and any shown states. Only in the prototype. Don't invent missing states or variants. After that, if your prototype includes example component implementations or sample code, analyze those too. How components are structured, composed, nested, what variants or states are demonstrated, and how that maps to the visuals. Use it as guidance. Don't treat it as final production architecture, unless the specification requires it. Also, recognize genuinely recurring visual patterns and note possible reuse without locking in architecture.Inspect any composables, hooks, or shared frontend logic used by the prototype components when they help explain component behavior, state, or reuse, without treating them as mandatory production architecture

Do not copy prototype implementation code.

Use the prototype to determine the intended design system.

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

After producing the frontend design plan, return it to the orchestrator for validation. If validation errors are provided, use them as correction context and return a complete corrected plan.

---

## Final Rule

Analyze first.

Produce a complete structured frontend plan.

Return that plan to the Frontend Orchestrator.

Let the orchestrator delegate implementation to specialized frontend skills.
