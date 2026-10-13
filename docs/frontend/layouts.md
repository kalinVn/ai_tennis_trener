## Required Layouts

### Public Layout

The Public Layout is the reusable shell for public pages. It contains only product branding and public navigation, an empty responsive page-content area, and the footer. Page-specific sections, cards, promotional content, and authentication forms belong to pages or components rather than the layout.

Authoritative prototype: `prototypes/design/layouts/public.html`.

### Global Consent Placement

`CookiePrivacyPolicy` is a global feature component, not Home page content and not a replacement for the footer. The repository's prototypes are multi-page HTML rather than one Vue root above both layout families, so the shared `app.js` shell loads the feature-local [mount adapter](../../prototypes/components/features/CookiePrivacyPolicy/mountCookiePrivacyPolicy.js) on every application page. That adapter mounts one `CookiePrivacyPolicy` instance; individual pages do not own or duplicate its internal logic. A future routed application with a single root should mount the same public feature once above both layouts.

The banner stays full-width at the viewport bottom until Accept All, Reject All, or Save Preferences writes the versioned `localStorage` record. `CookiePrivacyPolicy` uses one shared `BaseModal` for preferences and both policy contents. Legal actions use `TextButton` in the public footer and, where that layout has no footer, in the authenticated sidebar legal area. Cookie Settings therefore remains available after consent and reopens saved values without showing the initial banner. Consent enforcement, tracking-provider initialization, legal approval, and backend storage remain outside the prototype scope.

### Authentication Layout

The Authentication Layout is the reusable shell for authenticated pages, including Training and Pricing. It contains the authenticated left-side navigation, the authenticated top/header area with identity and account actions, and an empty responsive page-content area. Dashboard, Training, History, Session Review, Pricing, Subscription, Profile, Settings, and Checkout render their page-specific UI inside that content area.

Authoritative prototype: `prototypes/design/layouts/authentication.html`.

For navigation items, appearance, and responsive states, `prototypes/design/components/navigation/authenticated-navigation.html` remains authoritative over the embedded navigation in this layout, as specified in [Navigation Requirements](frontend.md#navigation-requirements).

Training and every other authenticated page use this same shell; no page-specific layout is defined. Training-specific camera, coaching, status, controls, and session UI belong to the Training page and its components, not to a reusable layout.

Authentication forms may still be presented through the public login/registration interaction. Their session behavior must preserve a validated internal return target, close only after a confirmed result or explicit cancellation, and expose pending, validation, error, second-factor, and expired-session states as described in [integration contract examples](integration-contracts.md#authentication-and-application-session).

---
