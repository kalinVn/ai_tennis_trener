## Required Layouts

### Public Layout

Must include product branding, public navigation, a responsive content container, and footer links.
Example prototype `prototypes/design/layouts/public.html`

### Authentication UI Host

Authentication is presented in the existing accessible login/registration dialog hosted by the Public Layout, not on a separate route. `prototypes/design/layouts/authentication.html` is an interaction reference for that dialog and its public shell, not a consumer requiring a separate `AuthenticationLayout.vue`. Preserve the original protected destination as a validated internal return target, close the dialog only after a confirmed result or explicit cancellation, and expose pending, validation, error, second-factor, and expired-session states as described in [integration contract examples](integration-contracts.md#authentication-and-application-session).

### Authenticated Application Layout

Application Layout: includes a vertical left sidebar with navigation links to the app's pages and a responsive main content area on the right where the selected page is displayed.
Authoritative layout prototype: `prototypes/design/layouts/application.html`, which contains the sidebar, application header, and main content container.

For navigation items, appearance, and responsive states, `prototypes/design/components/navigation/authenticated-navigation.html` remains authoritative over the embedded navigation in this layout, as specified in [Navigation Requirements](frontend.md#navigation-requirements).

### Training Layout

Application Layout: includes a vertical left sidebar with navigation links to the app's pages and a responsive main content area on the right where the selected page is displayed.
Example prptprototypeotype `prototypes/design/layouts/training.html`
---

