# Tennis AI Coach · Multi-page HTML prototypes

Open `index.html` in a web browser. The navigation links connect separate HTML pages.
The multi-page prototypes use `styles.css` and `app.js` in the same directory.
`tennis-ai-coach.html` is the original standalone prototype with its own styles and scripts.

Public pages: index.html, features.html, pricing.html
Login/Register: modal on public pages (demo-only).
Private pages: dashboard.html, training.html, history.html, subscription.html, profile.html, settings.html
Full-screen layout: camera.html

`FRONTEND_MD_ADDITIONS.md` contains a proposed Shared Layouts section, a route mapping and the revised Step 5 instruction.
These are prototypes rather than a production router, functional login, payment flow or connected camera.

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
  the controls only to the six `.app-shell` pages; without JavaScript their
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
  The standalone `tennis-ai-coach.html` keeps its separate theme and receives
  only local responsive wrapping and card-grid rules.

Responsive QA uses all 11 HTML pages at 414×896, 896×414, 768×1024, 1024×768,
and 1440×900. Check drawer dismissal and focus cycling, rotation while open,
scroll restoration, expanded form sections, both authentication modes, camera
ordering, and page overflow. Compare desktop screenshots with all sections
expanded and registration dialogs open as well as the default page states.
