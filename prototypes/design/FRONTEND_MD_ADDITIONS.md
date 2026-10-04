# Proposed additions to docs/frontend/frontend.md

These are suggested project-specific layout definitions, not automatically confirmed requirements.
Prototype paths below are relative to the repository root. The catalog is `prototypes/design/index.html`.

## Shared Layouts

| Layout | Purpose | Pages | Visual reference |
| --- | --- | --- | --- |
| Public Layout | Public navigation + page content + footer | Home `/`, Features `/features`, Pricing `/pricing` | `prototypes/design/pages/index.html`, `prototypes/design/pages/features.html`, `prototypes/design/pages/pricing.html` |
| Authentication UI | Shared modal for Login/Register (not a separate page layout in this prototype) | Available from public pages | `prototypes/design/pages/index.html` |
| Authenticated Application Layout | Shared sidebar and app header | Dashboard `/dashboard`, Training `/training`, History `/history`, Subscription `/subscription`, Profile `/profile`, Settings `/settings` | `prototypes/design/pages/dashboard.html`, `prototypes/design/pages/training.html`, `prototypes/design/pages/history.html`, `prototypes/design/pages/subscription.html`, `prototypes/design/pages/profile.html`, `prototypes/design/pages/settings.html` |
| Camera Preview Modal | Camera-first screen with minimal controls | `/training` (in-page modal) | `prototypes/design/pages/camera.html` |

The dashboard is a page within Authenticated Application Layout, not necessarily a separate Dashboard Layout. Settings is also a page in the same shared layout unless a real design requires a different shell.

## Route mapping

| Production route | Prototype file | Layout |
| --- | --- | --- |
| `/` | `prototypes/design/pages/index.html` | Public |
| `/features` | `prototypes/design/pages/features.html` | Public |
| `/pricing` | `prototypes/design/pages/pricing.html` | Public |
| `/dashboard` | `prototypes/design/pages/dashboard.html` | Authenticated Application |
| `/training` | `prototypes/design/pages/training.html` | Authenticated Application |
| `/training` (in-page modal) | `prototypes/design/pages/camera.html` | Camera Preview Modal |
| `/history` | `prototypes/design/pages/history.html` | Authenticated Application |
| `/subscription` | `prototypes/design/pages/subscription.html` | Authenticated Application |
| `/profile` | `prototypes/design/pages/profile.html` | Authenticated Application |
| `/settings` | `prototypes/design/pages/settings.html` | Authenticated Application |

Login/Register remain modal dialogs on public pages, per the prototype request.

## Replacement for Plan New Frontend Design: Step 5

Read the `Shared Layouts` section in the project frontend specification resolved from `specification_path`.
Use only layouts defined there and inspect each referenced visual prototype.
Assign the specified shared layout to its corresponding pages.
Do not generate additional layouts from generic examples. If a required page lacks a layout assignment,
report the missing specification rather than inventing a new layout.

## Prototype-only caveats

HTML navigation links stand in for application routes. The production router should implement the route mapping above.
The Login/Register modal navigates to the demo dashboard and does not authenticate.
No real camera analysis, account persistence, checkout or billing integration is implemented.
The visual design and sample data are illustrative; keep explicit functional requirements in `frontend.md`.
