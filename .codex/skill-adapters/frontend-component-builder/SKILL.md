---
name: frontend-component-builder
description: Implement assigned Vue components from a validated frontend plan or scoped update while preserving narrow component ownership.
---

# Frontend Component Builder

Read `../../../claude/skills/frontend-component-builder.md` completely, then apply active project overrides from repository-root `AGENTS.md`, `docs/frontend/frontend-project-structure.md`, and `docs/frontend/components.md`.

Use Vue 3 and TypeScript. Place components under the approved responsibility-based `frontend/src/components/` tree, not a feature-root `modules/` layer. Define minimal props/events/slots, keep business actions with owners, reuse tokens/primitives, implement required accessibility/responsive states, and clean up component-owned resources.

Inspect existing consumers before editing and run relevant component/build/static checks. Report exact files, interfaces, checks, and blockers.

