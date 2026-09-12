# Frontend Project Structure

## Purpose

Maintain a simple and readable Vue 3 JavaScript project structure.

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

Keep `src/components/` only for shared UI components. Keep `router/`, `assets/`, and `styles/` as shared application resources outside feature modules.

Keep application-wide services, composables, pages, and state in their corresponding top-level folders. Do not move code into a feature module when it is broadly reusable.

Keep architecture shallow.

Pages compose components.

Components must have clear responsibilities.

Services contain external/browser communication logic.

Composables contain reusable Vue behavior.

Do not introduce unnecessary architectural layers.

Before creating anything, inspect existing code and reuse it where appropriate.
