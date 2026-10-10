# Frontend Project Structure

This file is the single source of truth for the physical structure of the frontend application.

The Vue application belongs under `frontend/` and uses TypeScript, Vite, Vue Router, and Pinia. Keep the source tree shallow and organized by responsibility:

```text
frontend/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── App.vue
    ├── main.ts
    ├── pages/
    ├── components/
    ├── layouts/
    ├── composables/
    ├── services/
    ├── stores/
    ├── router/
    ├── proxy/
    ├── utils/
    ├── constants/
    ├── config/
    ├── assets/
    ├── css/
    ├── plugins/
    ├── directives/
    └── tests/
```

## Placement Rules

- Put every route-level view in `src/pages/`.
- Put reusable shared and feature UI in `src/components/`, grouped by responsibility when useful.
- Put page shells in `src/layouts/`.
- Put reusable Vue behavior and lifecycle ownership in `src/composables/`.
- Put backend, WebSocket, browser-media, and provider communication in `src/services/`.
- Put Pinia state shared by pages or components in `src/stores/`.
- Put route definitions and navigation guards in `src/router/`.
- Put application-level API or WebSocket adapters in `src/proxy/` only when an adapter boundary is required.
- Put generic helpers, shared fixed values, and runtime configuration in `src/utils/`, `src/constants/`, and `src/config/`.
- Put static resources and shared styling in `src/assets/` and `src/css/`.
- Put application integrations, reusable directives, and tests in `src/plugins/`, `src/directives/`, and `src/tests/`.
- Keep build-tool configuration outside `src/`.

Do not add another feature-root layer. Preserve domain ownership through explicit file names and focused subdirectories inside the approved top-level folders. Do not create empty directories or placeholder logic files before they are required by implementation.

Pages compose layouts and components. Components expose narrow props, events, and slots without owning page business actions. Stores own shared application state and call services for external communication. Local UI state remains local when it does not need to be shared.
