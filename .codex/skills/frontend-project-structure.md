# Frontend Project Structure

> Codex adaptation of `claude/skills/frontend-project-structure.md`. Used as a planning role/reference, not an automatically discovered standalone skill. Read `.codex/rules/frontend-planning.md` before applying it.

## Purpose

Describe a simple and readable Vue 3 project structure using the language required by active project instructions. This reference is read-only during debug planning; do not create directories or source files.

## Rules

Use `frontend/` as the application root.

Prefer:

```text
src/
├── modules/
├── components/
├── pages/
├── services/
├── composables/
├── router/
├── stores/
├── assets/
└── styles/
```

Use `src/modules/` for functionally distinct feature areas when feature modules make ownership clearer.

A feature module may contain its own `pages/`, `components/`, `services/`, `composables/`, and local state only when they are specific to that module.

Use Pinia for shared feature state. Keep module-specific stores in the module's `stores/` directory and application-wide stores in `src/stores/`. Module pages and feature components access their store directly instead of passing shared state through chains of props. Keep API communication in services called by store actions. Initialize Pinia once in the application bootstrap. Do not persist passwords or other secrets. Simple local UI state may remain local, and generic shared UI components may still use props and events.

Keep `src/components/` only for shared UI components. Keep `router/`, `assets/`, and `styles/` as shared application resources outside feature modules.

Keep application-wide services, composables, pages, and state in their corresponding top-level folders. Do not move code into a feature module when it is broadly reusable.

Keep architecture shallow.

Pages compose components.

Components must have clear responsibilities.

Services contain external/browser communication logic.

Composables contain reusable Vue behavior.

Do not introduce unnecessary architectural layers.

Inspect existing code and plan reuse where appropriate. Directory creation belongs to a separately authorized implementation workflow.
