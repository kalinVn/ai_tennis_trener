## Required Layouts

### Public Layout

The Public Layout is the reusable shell for public pages. It contains only product branding and public navigation, an empty responsive page-content area, and the footer. Page-specific sections, cards, promotional content, and authentication forms belong to pages or components rather than the layout.

Authoritative prototype: `prototypes/design/layouts/public.html`.

### Authentication Layout

The Authentication Layout is the reusable shell for authenticated pages, including Training. It contains the authenticated left-side navigation, the authenticated top/header area with identity and account actions, and an empty responsive page-content area. Dashboard, Training, History, Session Review, Progress, Subscription, Profile, Settings, and Checkout render their page-specific UI inside that content area.

Authoritative prototype: `prototypes/design/layouts/authentication.html`.

For navigation items, appearance, and responsive states, `prototypes/design/components/navigation/authenticated-navigation.html` remains authoritative over the embedded navigation in this layout, as specified in [Navigation Requirements](frontend.md#navigation-requirements).

Training and every other authenticated page use this same shell; no page-specific layout is defined. Training-specific camera, coaching, status, controls, and session UI belong to the Training page and its components, not to a reusable layout.

Authentication forms may still be presented through the public login/registration interaction. Their session behavior must preserve a validated internal return target, close only after a confirmed result or explicit cancellation, and expose pending, validation, error, second-factor, and expired-session states as described in [integration contract examples](integration-contracts.md#authentication-and-application-session).

---
