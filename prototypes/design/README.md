# Tennis AI Coach · HTML prototype library

Open `index.html` for the catalog. Original application pages are in `pages/`,
layout demonstrations in `layouts/`, and component demonstrations in `components/`.
Existing HTML pages load the root `style.css` and `app.js`; links between original
application pages keep their existing filenames. Demo authentication resolves its
dashboard destination from the shared script, so it also works from library pages.

The current source contains 10 pages: Home, Features, Pricing, Dashboard, Training,
History, Subscription, Profile, Settings and Camera modal design. The legacy
`tennis-ai-coach.html` was absent before this reorganization and was not restored.
No image assets are required, so there is no unused `assets/` directory.

The two layout demos define the reusable Public and Authentication shells.
The 15 component demos extract existing
markup. Missing variants are identified directly in their HTML pages; there are
no new component-specific Markdown files or invented component designs.

Profile and Settings styles now live in `style.css` so their fields, panels and
collapsible sections can be shared without duplicating style blocks. Their page
scripts still own the original demo interactions. Library-only specimens reuse
those interactions without calling services or collecting payment details.

`FRONTEND_MD_ADDITIONS.md` remains a proposed specification addition, not an
application architecture change. These prototypes are not a production router,
authentication service, payment flow or connected camera.

Form layout is shared in `style.css`: `.field` stacks labels, controls and optional
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
  and supporting panels below. The camera opens within Training as a viewport-sized modal. Collapsible icons grow within a 44px area through 1100px viewport width.
- Desktop styles, the shared form alignment and select arrows are retained.

Responsive QA should include the dedicated Login and Register pages alongside the existing HTML pages
and the catalog) at 414×896, 896×414, 768×1024, 1024×768,
and 1440×900. Check drawer dismissal and focus cycling, rotation while open,
scroll restoration, expanded form sections, both authentication pages, camera
ordering, and page overflow. Compare desktop screenshots with all sections
expanded and both authentication pages as well as the default page states.

Historical verification completed in Chromium on 2026-09-27, before the layout consolidation: all 30 pages opened at all five
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

Pricing is available at `pages/pricing.html`, using the public layout and existing
plan cards/demo dialog. The shared script links application sidebars to this
Pricing page using ordinary anchor navigation.

Checkout is available at `pages/checkout.html` (the documented `/checkout` route)
and last in the application sidebar. It uses the Authentication Layout,
Performance plan (€19/month), order summary, disabled sample payment fields, a
demo-only completion message, and links back to Pricing. No payment
provider, network submission, card storage or subscription creation is involved.

`pages/not-found.html` is a 404 prototype using the existing Public Layout,
including public navigation, footer and links to the dedicated authentication pages. Its primary
action returns to Home. Unknown-route handling remains separate from this visual
prototype.


## Navigation visual source of truth

- [Public navigation](components/navigation/public-navigation.html): Home, Training,
  Pricing and a Login page link; horizontal desktop header and collapsible
  menu at 720px and below.
- [Authenticated navigation](components/navigation/authenticated-navigation.html):
  Dashboard, Training, History, Subscription, Profile, Settings and Checkout;
  244px vertical sidebar on desktop/tablet and the existing accessible drawer on
  phones (720px, or landscape up to 950px wide / 500px high).

Both specimens contain only navigation UI and load shared `style.css` with
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


Training camera now runs through the Vue prototype entry in `prototypes/training/`.
From the repository root, run `npm --prefix prototypes install` and
`npm --prefix prototypes run dev`, then open the server's
`/prototypes/design/pages/training.html` URL. `pages/camera.html` is a modal
visual specimen, not a navigation destination from Training. Start Camera requests
both camera and microphone; Return to Training releases both devices.

## Library structure

The library now lives in `prototypes/design/`. Its root contains `app.js`, `index.html`, `style.css`, and `README.md`. Pages and layouts remain in `pages/` and `layouts/`. Basic components, including `buttons/`, remain directly under `components/`. AI Coach Panel, Cards, Forms, Notifications, and the combined Subscription/Payments specimen are in `components/feature-components/`. Existing design specimens were merged without overwriting files.

Historical relocation verification: 47 HTML pages loaded through Vite without HTTP or JavaScript errors, and all 441 local HTML references resolved. Catalog navigation, coach volume and collapsibles passed browser checks. Run the current build and tests again after structural changes rather than relying on that historical result.

Home (`pages/index.html`) now uses the left hero content and video slider from `components/home_page_slider/home_page_slider.html`. It loads the isolated `home-hero.css`, existing `video-demo.js`, and `hero-alignment.js` from that component, and the bundled WebM from `prototypes/components/sliders/home-page-video-slider/assets/`. Navigation, authentication, footer, and content below the hero retain the existing Home implementation. Video attribution: NaBUru38 / Wikimedia Commons, CC BY-SA 4.0; see the slider README for the source link and license.

Home’s left content is rendered by `prototypes/components/sections/HomePageInfoSection.vue` via `prototypes/home/main.js` under Vite. Its static preview is `prototypes/design/components/sections/home-page-info-section.html`. Direct file previews retain the same static content. The Home entry is included in the Vite build; video timing is unchanged.

Home now mounts `HomePageVideoSlider.vue` through `prototypes/home/main.js`. Its local `slider.js` helper owns the Pixi overlay and lifecycle resources, and its `assets/` directory owns the shared video. Static file previews use the original Canvas script as a fallback.
