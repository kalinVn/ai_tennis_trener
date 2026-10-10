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

After reading the frontend specification, identify the authoritative supporting specifications and visual sources it declares.

Load the supporting specifications needed to make frontend planning decisions.

For visual prototypes, do not inspect or analyze the prototype implementation at this planning stage. Instead, identify and record:

- the prototype path;
- which page, layout, or component it belongs to;
- whether it is a page-level, component-level, or state-specific prototype;
- any relationship between referenced prototypes that is explicitly declared by the specification.

Use the Visual Prototype section in the main frontend specification as the authoritative mapping source.

Do not extract detailed UI requirements, styling, markup, behavior, or implementation details from prototype files during planning. Detailed prototype analysis belongs to the downstream skill responsible for implementing the corresponding page or component.

Apply this selected-source scope throughout prototype resolution and planning.

Follow references in supporting specifications only when they are needed to resolve a planning decision.

Verify that all required supporting specifications and referenced prototype paths exist. Report missing sources, ambiguous mappings, or unresolved specification conflicts as blockers rather than inventing requirements.

Use the main frontend specification and authoritative supporting specifications to derive:

- frontend architecture;
- module and page structure;
- layout structure;
- shared and feature component boundaries;
- dependencies;
- ownership boundaries;
- implementation order;
- final folder structure.

For visual prototypes, include their references in the plan so downstream builders know exactly which prototype to inspect when implementing each page or component.

Do not translate prototype implementation details into the design plan at this stage.

Reference source specifications and prototype paths in the plan instead of copying their contents unnecessarily.

Include only the concrete planning decisions and requirements needed by the Output Contract and downstream builders. Do not reproduce entire supporting specifications, prototypes, or design-system documents.

---


## Source Priority

When requirements conflict, use:

1. Project frontend specification resolved from `specification_path` and the authoritative supporting specifications it declares. The root specification defines source responsibilities and precedence; report unresolved conflicts between authoritative requirements.
2. Visual prototypes referenced by those specifications (referenced resources, not separate inputs). 
isual prototype priority determines which prototype reference is authoritative; it does not require detailed prototype inspection or analysis during the planning stage.Apply declared visual precedence: dedicated navigation prototypes override older embedded navigation examples.
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
3. Resolve the prototype path, verify that the referenced source exists, and record which page, layout, component, or state it belongs to. Do not inspect or analyze the prototype implementation during the planning stage.

If an explicitly required prototype is missing, stop and report the missing path.

Do not silently substitute another prototype.

--


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
