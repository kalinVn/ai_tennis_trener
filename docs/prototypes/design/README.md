# Tennis AI Coach · HTML prototype library

Open `index.html` for the catalog. Original application pages are in `pages/`,
layout demonstrations in `layouts/`, and component demonstrations in `components/`.
Existing HTML pages load the root `styles.css` and `app.js`; links between original
application pages keep their existing filenames. Demo authentication resolves its
dashboard destination from the shared script, so it also works from library pages.

The current source contains 10 pages: Home, Features, Pricing, Dashboard, Training,
History, Subscription, Profile, Settings and full-screen Camera. The legacy
`tennis-ai-coach.html` was absent before this reorganization and was not restored.
No image assets are required, so there is no unused `assets/` directory.

The four layout demos reuse the existing public shell, authentication modal,
application shell and Training screen. The 15 component demos extract existing
markup. Missing variants are identified directly in their HTML pages; there are
no new component-specific Markdown files or invented component designs.

Profile and Settings styles now live in `styles.css` so their fields, panels and
collapsible sections can be shared without duplicating style blocks. Their page
scripts still own the original demo interactions. Library-only specimens reuse
those interactions without calling services or collecting payment details.

`FRONTEND_MD_ADDITIONS.md` remains a proposed specification addition, not an
application architecture change. These prototypes are not a production router,
authentication service, payment flow or connected camera.

Form layout is shared in `styles.css`: `.field` stacks labels, controls and optional
help; `.form-grid` shares label/control/help tracks with CSS subgrid so wrapped
labels and different helper lengths do not shift adjacent controls. Use `.wide`
for full-width fields or action groups. At 720px and below, fields stack in one
column. Single-line controls use a 51px height; checkboxes, radio buttons, range
inputs, file inputs, textareas and small buttons retain their specialized styling.
Select chevrons are 20px with an 18px right inset and 50px text padding; forced
colors mode uses the native arrow. Keep new form rules here rather than adding
page-specific label margins or field heights.

Responsive behavior:
- Phone navigation uses the existing sidebar as an accessible drawer at widths
  up to 720px, or up to 950px when landscape height is at most 500px. The header
  keeps Tennis AI Coach branding and Log out visible. The shared `app.js` adds
  the controls only to original and library `.app-shell` pages; without JavaScript their
  existing navigation remains available. Keep the CSS and JavaScript queries
  synchronized when changing these breakpoints.
- The drawer closes with X, the backdrop, a navigation link or Escape. Background
  scrolling and focus are blocked while open; focus returns to the menu button.
  Resizing to a tablet/desktop layout releases the drawer and its scroll lock.
- Landscape phones at least 740px wide pair independent cards and collapsible
  sections. Forms inside those cards stay single-column. Tablets keep their
  existing layouts. History has one table and one review panel, so its table
  stays full-width with local horizontal scrolling instead of inventing cards.
- Mobile Training puts its 16:9 camera placeholder first, with existing controls
  and supporting panels below. The dedicated full-screen camera keeps its own
  layout. Collapsible icons grow within a 44px area through 1100px viewport width.
- Desktop styles, the shared form alignment and select arrows are retained.

Responsive QA covers all 30 HTML pages (10 originals, 4 layouts, 15 components
and the catalog) at 414×896, 896×414, 768×1024, 1024×768,
and 1440×900. Check drawer dismissal and focus cycling, rotation while open,
scroll restoration, expanded form sections, both authentication modes, camera
ordering, and page overflow. Compare desktop screenshots with all sections
expanded and registration dialogs open as well as the default page states.

Verification completed in Chromium on 2026-09-27: all 30 pages opened at all five
sizes (150 page/viewport checks), 380 local references resolved, and the drawer,
authentication, collapsibles, controls and select arrows passed their checks.
All eight extracted/original authentication forms reached `pages/dashboard.html`.
Password feedback, volume output, camera toggles and Profile upload/save/reset
were exercised. The isolated camera specimen also retains mobile 16:9 ordering.

Across 75 original-page before/after screenshots (default, expanded sections and
registration states), 73 were pixel-identical; two differed by five pixels at one
RGB level only. No layout or styling differences were found. Source comparison
also confirmed that all 10 original HTML pages changed only shared asset paths
and the extraction of their page-scoped CSS. Tests used simulated browser
viewports, not physical devices or other browser engines.

Profile contains four independent forms inside Personal Information, Tennis
Profile, Physical Information and Account Overview. Training Goals fields belong
to Tennis Profile. Each panel validates and saves only its own values in memory;
Reset Changes restores that panel's last saved values (initial values before its
first save). Reloading clears demo saves. Account Overview retains read-only
details with the same panel actions. Avatar selection and reset are scoped to
Personal Information; no profile data or images are uploaded.

Profile form isolation verified in Chromium on 2026-09-28: four forms and action
pairs, independent save/reset baselines, panel-scoped validation, avatar restore,
and collapse/expand with no horizontal overflow at 1440×900, 414×896 and 896×414.
All existing field and option definitions were preserved.

Settings uses eight independent panel forms, each with Save Settings and Reset
Fields actions using Profile's shared button classes and action spacing. Both
pages use `setupPanelForm` in `app.js` for panel-local validation, in-memory saves
and resets to the last saved values (initial values before saving). Settings
resets also synchronize the audio volume label within its panel. The password
form retains Change password, Clear fields and Show passwords: Save Settings
runs its existing demo check without saving credentials, and Reset Fields clears
passwords and restores hidden-password mode. Privacy action feedback stays in
its own panel. No settings are sent to a server or persisted across reloads.

Settings panel forms verified in Chromium on 2026-09-28: eight forms/action
pairs, independent initial and saved resets, validation isolation, password
controls, audio output and privacy feedback. Collapsibles and horizontal overflow
checks passed at 1440×900, 414×896 and 896×414. Profile regression checks also
passed after sharing the form handler; all Settings field definitions remain
unchanged.

Application Pricing is available at `pages/application-pricing.html`, using the
existing application shell and Pricing plan cards/demo dialog. The shared script
adds Pricing last in application sidebars using ordinary anchor navigation and
`aria-current` on that page. Public `pages/pricing.html` remains unchanged.

Checkout is available at `pages/checkout.html` (the documented `/checkout` route)
and last in the application sidebar. It uses the existing application layout,
Performance plan (€19/month), order summary, disabled sample payment fields, a
demo-only completion message, and links back to Application Pricing. No payment
provider, network submission, card storage or subscription creation is involved.

`pages/not-found.html` is a 404 prototype using the existing Public Layout,
including public navigation, footer and demo authentication dialogs. Its primary
action returns to Home. Unknown-route handling remains separate from this visual
prototype.


## Navigation visual source of truth

- [Public navigation](components/navigation/public-navigation.html): Home, Training,
  Pricing and a Login Modal trigger; horizontal desktop header and collapsible
  menu at 720px and below.
- [Authenticated navigation](components/navigation/authenticated-navigation.html):
  Dashboard, Training, History, Subscription, Profile, Settings and Checkout;
  244px vertical sidebar on desktop/tablet and the existing accessible drawer on
  phones (720px, or landscape up to 950px wide / 500px high).

Both specimens contain only navigation UI and load shared `styles.css` with
isolated `navigation.css` / `navigation.js` additions. Default, hover, active and
keyboard focus styles remain on the actual links; there are no state cards or
page-content examples. Text-only application links match the existing pages.
The authenticated specimen retains the mobile menu opener, brand, drawer close
control and backdrop; the surrounding application header and account demo are
removed. Public Log in is a visual trigger only; the modal is outside this
navigation-only specimen. Links target static prototypes; there is no router,
authentication or backend behavior.

These two specimens supersede the older combined `components/navigation.html`
and page/layout navigation examples for future frontend navigation styling and
layout. Existing page demos remain unchanged. Use the catalog to open either
specimen, resize for mobile states, and inspect pointer hover and keyboard focus.
