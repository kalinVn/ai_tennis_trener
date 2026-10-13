# Proposed additions to docs/frontend/frontend.md

These are suggested project-specific layout definitions, not automatically confirmed requirements.
Prototype paths below are relative to the repository root. The catalog is `prototypes/design/index.html`.

## Shared Layouts

| Layout | Purpose | Pages | Visual reference |
| --- | --- | --- | --- |
| Public Layout | Public navigation + empty page-content area + footer | Home `/`, Features `/features`, Login `/login`, Register `/register` | `prototypes/design/layouts/public.html` |
| Authentication Layout | Authenticated sidebar + app header + empty page-content area | Dashboard `/dashboard`, Training `/training`, History `/history`, Pricing `/pricing`, Subscription `/subscription`, Profile `/profile`, Settings `/settings` | `prototypes/design/layouts/authentication.html` |

The dashboard is a page within Authentication Layout, not necessarily a separate Dashboard Layout. Settings is also a page in the same shared layout unless a real design requires a different shell.

## Route mapping

| Production route | Prototype file | Layout |
| --- | --- | --- |
| `/` | `prototypes/design/pages/index.html` | Public |
| `/features` | `prototypes/design/pages/features.html` | Public |
| `/pricing` | `prototypes/design/pages/pricing.html` | Authentication |
| `/login` | `prototypes/design/pages/login.html` | Public |
| `/register` | `prototypes/design/pages/register.html` | Public |
| `/dashboard` | `prototypes/design/pages/dashboard.html` | Authentication |
| `/training` | `prototypes/design/pages/training.html` | Authentication |
| `/training` (in-page modal) | `prototypes/design/pages/camera.html` | Camera Preview Modal |
| `/history` | `prototypes/design/pages/history.html` | Authentication |
| `/subscription` | `prototypes/design/components/subscription/subscription.html` | Authentication |
| `/checkout` | `prototypes/design/components/checkout/checkout.html` | Authentication |
| `/profile` | `prototypes/design/pages/profile.html` | Authentication |
| `/settings` | `prototypes/design/pages/settings.html` | Authentication |

Login and Register are dedicated pages within Public Layout. The camera preview remains an in-page modal owned by Training; it is not a layout.

## Replacement for Plan New Frontend Design: Step 5

Read the `Shared Layouts` section in the project frontend specification resolved from `specification_path`.
Use only layouts defined there and inspect each referenced visual prototype.
Assign the specified shared layout to its corresponding pages.
Do not generate additional layouts from generic examples. If a required page lacks a layout assignment,
report the missing specification rather than inventing a new layout.

## Prototype-only caveats

HTML navigation links stand in for application routes. The production router should implement the route mapping above.
The Login/Register pages are visual prototypes and do not authenticate or create accounts.
No real camera analysis, account persistence, checkout or billing integration is implemented.
The visual design and sample data are illustrative; keep explicit functional requirements in `frontend.md`.
