# Proposed additions to docs/frontend/frontend.md

These are suggested project-specific layout definitions, not automatically confirmed requirements.
Paths are relative to `docs/frontend/` when stored in `docs/frontend/prototypes/`.

## Shared Layouts

| Layout | Purpose | Pages | Visual reference |
| --- | --- | --- | --- |
| Public Layout | Public navigation + page content + footer | Home `/`, Features `/features`, Pricing `/pricing` | `prototypes/index.html`, `prototypes/features.html`, `prototypes/pricing.html` |
| Authentication UI | Shared modal for Login/Register (not a separate page layout in this prototype) | Available from public pages | `prototypes/index.html` |
| Authenticated Application Layout | Shared sidebar and app header | Dashboard `/dashboard`, Training `/training`, History `/history`, Subscription `/subscription`, Profile `/profile`, Settings `/settings` | `prototypes/dashboard.html`, `prototypes/training.html`, `prototypes/history.html`, `prototypes/subscription.html`, `prototypes/profile.html`, `prototypes/settings.html` |
| Full-screen Feature Layout | Camera-first screen with minimal controls | `/training/camera` | `prototypes/camera.html` |

The dashboard is a page within Authenticated Application Layout, not necessarily a separate Dashboard Layout. Settings is also a page in the same shared layout unless a real design requires a different shell.

## Route mapping

| Production route | Prototype file | Layout |
| --- | --- | --- |
| `/` | `prototypes/index.html` | Public |
| `/features` | `prototypes/features.html` | Public |
| `/pricing` | `prototypes/pricing.html` | Public |
| `/dashboard` | `prototypes/dashboard.html` | Authenticated Application |
| `/training` | `prototypes/training.html` | Authenticated Application |
| `/training/camera` | `prototypes/camera.html` | Full-screen Feature |
| `/history` | `prototypes/history.html` | Authenticated Application |
| `/subscription` | `prototypes/subscription.html` | Authenticated Application |
| `/profile` | `prototypes/profile.html` | Authenticated Application |
| `/settings` | `prototypes/settings.html` | Authenticated Application |

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
