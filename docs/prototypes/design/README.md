# Tennis AI Coach · HTML prototype library

Open `index.html` for the catalog. Original application pages are in `pages/`,
layout demonstrations in `layouts/`, and component demonstrations in `components/`.
Every HTML page loads the root `styles.css` and `app.js`; links between original
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
