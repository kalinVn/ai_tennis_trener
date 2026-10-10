# Plan New Frontend Design

> Codex adaptation of `claude/skills/plan-new-frontend-design.md`. Used as a planning role/reference, not an automatically discovered standalone skill. Read `.codex/rules/frontend-planning.md` before applying it.

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

For visual requirements, do not inspect or analyze detailed prototype UI implementation at this planning stage. The narrow structural-inspection exception defined in the Project Structure section applies only to organization and ownership examples. Otherwise, identify and record:

- the prototype path;
- which page, layout, component, or state it belongs to;
- whether it is a page-level, component-level, or state-specific prototype;
- any relationship between referenced prototypes that is explicitly declared by the specification.

Use the Visual Prototype section in the main frontend specification as the authoritative mapping source.

Do not extract detailed UI requirements, styling, markup, behavior, or implementation details from prototype files during planning. Detailed prototype analysis belongs to the downstream skill responsible for implementing the corresponding page or component.

Apply this selected-source scope throughout prototype resolution and planning. Follow references in supporting specifications only when they are needed to resolve a planning decision.

Verify that all required supporting specifications and referenced prototype paths exist. Report missing sources, ambiguous mappings, or unresolved specification conflicts as blockers rather than inventing requirements.

Use the main frontend specification and authoritative supporting specifications to derive frontend architecture, page and layout structure, shared and feature component boundaries, dependencies, ownership boundaries, implementation order, and plan-specific placement under the canonical frontend structure.

Include visual prototype references in the plan so downstream builders know which prototype to inspect when implementing each page or component. Do not translate prototype implementation details into the design plan.

Reference source specifications and prototype paths instead of copying their contents unnecessarily. Include only the concrete planning decisions and requirements needed by the Output Contract and downstream builders.

---


## Source Priority

When requirements conflict, use:

1. Project frontend specification resolved from `specification_path` and the authoritative supporting specifications it declares. The root specification defines source responsibilities and precedence; report unresolved conflicts between authoritative requirements.
2. Visual prototypes referenced by those specifications. Prototype priority determines which reference is authoritative; it does not require implementation inspection or analysis during planning. Apply declared visual precedence: dedicated navigation prototypes override older embedded navigation examples.
3. Shared frontend design rules (`../../claude/rules/frontend/frontend-design-system.md`).

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
3. record which page, layout, component, or state it belongs to without detailed UI implementation analysis; inspect organization only when the Project Structure section explicitly selects it as structural guidance

If an explicitly required prototype is missing, stop and report the missing path.

Do not silently substitute another prototype.

---



# Output Contract

Return a structured frontend plan to the Frontend Orchestrator.

The output must contain:

## Frontend Type

```text
new
```

## Project Structure

Read the `Project Structure` section in `docs/frontend/frontend.md`. Collect every frontend project-structure document referenced there and use those referenced files as the authority for frontend placement and organization. Do not hardcode the authoritative structure-document list in this planning role; `frontend.md` owns that navigation and may change it.

Use the resolved references to determine placement for pages, reusable components, simple and complex component support files, composables, Pinia stores, services, routing, layouts, styles, assets, utilities, configuration, and other shared frontend resources. Do not introduce a frontend `modules/` feature-root layer. This frontend rule does not alter backend module organization.

When the Project Structure section points to prototype directories or examples, inspect only their organization and ownership patterns. Complex examples may show a Vue component with supporting JavaScript files or classes, controller/lifecycle logic, rendering or animation logic, configuration, component-specific styles, tests, or documentation. Use those examples only when the planned component has comparable complexity; a simple component may remain a single `.vue` file. Do not treat prototype-local assets or global styles as authority over the referenced production structure, and do not use structural inspection to infer detailed UI requirements.

Record only plan-specific ownership, supporting files, and concrete placement needed to make implementation unambiguous. Do not reproduce the referenced directory trees or general rules, copy example structures blindly, invent architectural layers, or create placeholder files. If a requirement conflicts with an authoritative structure reference, report it as a blocker instead of defining an alternative.

Return the resolved project-structure requirements as part of the plan. The orchestrator passes the validated plan and resolved references to downstream implementation work; this planning role creates neither directories nor implementation files.



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

## Plan Output

For the normal new-frontend planning workflow, write the completed frontend plan to `docs/frontend/plan/new-frontend-plan.md`, creating `docs/frontend/plan/` when needed. Use that as the canonical output unless the invoking workflow explicitly defines another path.

When this role is invoked by `debug_frontend_plan`, its command contract intentionally overrides the normal destination: the coordinator writes the validated English report and Bulgarian translation only to the two debug output paths declared by that command. The planner role must not create the canonical plan file during a debug run.

---

## Final Rule

Analyze first.

Produce a complete structured frontend plan.

Return that plan to the Frontend Orchestrator.

Return to the planning coordinator. In `debug_frontend_plan`, implementation is outside scope even when the plan is valid.
