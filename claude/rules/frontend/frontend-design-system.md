# Frontend Design Rules

## Purpose

Define the shared visual, styling, interaction, responsive-design, accessibility, and UI consistency rules that must be followed when building or updating frontend applications.

These rules provide the common frontend design constraints used by frontend agents, commands, and skills.

They define how project requirements and visual prototypes must be translated into:

- reusable design tokens
- shared component styles
- consistent layouts
- predictable interaction states
- responsive behavior
- accessible UI patterns

The goal is consistency, readability, responsiveness, accessibility, maintainability, and reuse across frontend pages and components.

These rules are project-independent.

Project-specific visual direction must come from the current task, frontend specification, update specification, or referenced visual prototype.

These rules do not independently read specifications or prototypes and do not perform implementation work.

The executing frontend agent or skill is responsible for loading the required specifications and prototypes and applying these rules during implementation.

---

## Rule Application Priority

When a frontend agent or skill applies these rules, use the following priority when requirements conflict:

1. Explicit current task requirements
2. Provided task or update specification
3. Project frontend specification
4. Referenced visual prototype
5. Existing project design tokens
6. Existing shared frontend components and styles
7. These frontend design rules

Higher-priority project requirements may override lower-priority design defaults.

Do not invent a completely new visual language when an existing project design system already exists.

Do not silently ignore explicit project requirements.

When an override is necessary:

- change only the affected behavior
- preserve unrelated shared design rules
- reuse existing variants when possible
- update shared tokens or components when the change is intended to be global
- keep local requirements local when they are not global
- avoid duplicate styles

---

## Rule Levels

Rules in this document belong to three conceptual levels.

### Mandatory Rules

Mandatory rules define structural frontend quality requirements.

Examples:

- reuse shared components
- avoid duplicated CSS
- maintain responsive behavior
- provide visible focus states
- use accessible markup where practical
- preserve consistent component behavior

Mandatory rules should only be overridden when an explicit higher-priority requirement requires different behavior.

### Design Defaults

Design defaults define normal visual behavior when the project does not specify something more specific.

Examples:

- spacing scale
- radius scale
- button sizing
- content width
- transition timing
- typography hierarchy

Project specifications and prototypes may override these defaults.

### Project Overrides

Project-specific requirements may override design defaults.

Overrides must be as narrow as practical.

Do not discard unrelated design-system rules because one project requirement differs.

---

## Prototype Interpretation Rules

When the executing frontend agent or skill receives a referenced visual prototype, use the prototype as a visual reference while applying these rules.

Use the prototype to understand:

- visual hierarchy
- page composition
- layout
- color relationships
- typography
- button appearance
- card appearance
- form appearance
- navigation
- backgrounds
- spacing
- borders
- shadows
- responsive intent
- interaction states
- visual density

The prototype defines visual intent.

The prototype is not production code.

Do not blindly copy prototype markup.

Do not blindly copy prototype CSS.

Extract reusable visual patterns from the prototype and implement them through:

- design tokens
- shared components
- component variants
- reusable layout patterns

Production implementation must remain:

- maintainable
- reusable
- responsive
- accessible

---

# Core Design Principles

## Consistency

Equivalent UI elements must look and behave consistently.

The same conceptual element must not receive a completely different visual treatment on every page.

Examples:

- primary buttons share one visual language
- inputs share one visual language
- cards share one visual language
- navigation items share one visual language
- status indicators share one visual language

---

## Reuse

Before creating a new visual pattern:

1. Inspect existing design tokens.
2. Inspect existing shared components.
3. Inspect available component variants.
4. Reuse an existing pattern when possible.
5. Extend an existing pattern when appropriate.
6. Create a new pattern only when the requirement is genuinely different.

Do not duplicate an existing design pattern.

---

## Visual Hierarchy

The interface must clearly communicate:

- what is most important
- what is interactive
- what is secondary
- what belongs together
- what requires attention

Create hierarchy through:

- size
- spacing
- typography
- contrast
- position
- surface elevation

Do not rely on decorative effects alone.

---

## Restraint

Prefer a small, coherent visual vocabulary over many unrelated styles.

Avoid:

- excessive gradients
- excessive shadows
- unnecessary borders
- excessive animation
- too many accent colors
- arbitrary radius values
- arbitrary spacing values
- unrelated component variants

Every visual treatment should have a clear purpose.

---

# Design Tokens

## Token Rule

Shared visual values should be represented through reusable design tokens whenever practical.

Define tokens for:

- colors
- typography
- spacing
- radius
- borders
- shadows
- transitions
- layout widths
- breakpoints
- semantic states

Prefer CSS custom properties when using CSS.

Do not scatter repeated hardcoded values throughout the application when a shared token exists.

---

## Default Token Example

The following values are design defaults.

They are not project-specific requirements.

```css
:root {
  /* Backgrounds */
  --color-bg: #07100c;
  --color-surface: #0d1913;
  --color-surface-secondary: #13231b;
  --color-surface-elevated: #17271f;

  /* Text */
  --color-text: #f4f7f5;
  --color-text-muted: #a8b5ae;
  --color-text-subtle: #7f9187;

  /* Brand */
  --color-primary: #b7ff4a;
  --color-primary-hover: #c8ff72;
  --color-primary-active: #a7eb3d;
  --color-secondary: #65e8ff;

  /* Semantic */
  --color-success: #67e8a5;
  --color-warning: #ffc857;
  --color-danger: #ff6b7a;
  --color-info: #65e8ff;

  /* Borders */
  --border-color: rgba(255, 255, 255, 0.10);
  --border-color-strong: rgba(255, 255, 255, 0.20);

  /* Radius */
  --radius-xs: 8px;
  --radius-sm: 12px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 30px;
  --radius-pill: 999px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Shadows */
  --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.18);
  --shadow-md: 0 18px 50px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 24px 80px rgba(0, 0, 0, 0.35);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-default: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* Layout */
  --content-max-width: 1180px;
}
```

When a prototype or project specification defines another visual direction, derive the project tokens from that source instead.

---

# Colors

## Color System

Prefer a restrained palette consisting of:

- primary background
- elevated surfaces
- primary text
- muted text
- primary accent
- optional secondary accent
- semantic state colors

Primary actions should use the primary project accent.

Secondary colors should support hierarchy rather than compete with primary actions.

Do not introduce unrelated colors without a design reason.

---

## Semantic Colors

Use semantic colors consistently.

Typical meanings:

- success → green
- warning → yellow or orange
- danger/error → red
- information → blue or cyan

Project branding may change the exact values.

Do not communicate important status through color alone.

Combine color with text, iconography, shape, or labels when appropriate.

---

## Contrast

Important text and controls must remain readable against their background.

Avoid extremely low-contrast text for:

- primary content
- labels
- navigation
- buttons
- validation
- important status information

Muted text may use lower contrast but must remain readable.

---

# Backgrounds and Surfaces

Use backgrounds deliberately.

Preferred treatments may include:

- solid backgrounds
- layered surfaces
- restrained gradients
- subtle radial highlights
- lightweight visual texture

Avoid:

- noisy backgrounds
- excessive glassmorphism
- strong gradients everywhere
- distracting animated backgrounds
- effects that reduce readability

Background decoration must support the content rather than compete with it.

---

# Typography

## Typography Hierarchy

Use a small and predictable typography hierarchy.

Define reusable styles for:

- display
- page title
- section title
- component title
- body
- body small
- label
- caption
- metadata

Avoid arbitrary typography values inside individual pages.

Example:

```css
.display {
  font-size: clamp(2.8rem, 6vw, 5rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  font-weight: 800;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.1;
  font-weight: 750;
}

.component-title {
  font-size: 1.15rem;
  line-height: 1.3;
  font-weight: 700;
}

.body {
  font-size: 1rem;
  line-height: 1.7;
}

.body-small {
  font-size: 0.875rem;
  line-height: 1.55;
}

.label {
  font-size: 0.8rem;
  line-height: 1.4;
  font-weight: 700;
}

.caption {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--color-text-muted);
}
```

Typography should communicate hierarchy without requiring excessive decorative styling.

---

# Spacing

Use a shared spacing scale.

Recommended default scale:

- 4px
- 8px
- 12px
- 16px
- 20px
- 24px
- 32px
- 40px
- 48px
- 64px

Prefer spacing tokens.

Avoid arbitrary values such as:

- 17px
- 29px
- 43px

unless the design specifically requires them.

Consistent spacing is more important than blindly reproducing every pixel from a prototype.

---

# Radius

Use a small shared radius scale.

Typical usage:

- badges → small radius
- inputs → medium radius
- buttons → medium radius
- cards → large radius
- hero panels → extra-large radius
- pills → full radius

Do not create unrelated radius values for individual pages without reason.

---

# Borders

Use subtle borders to separate surfaces when necessary.

Default example:

```css
border: 1px solid var(--border-color);
```

Stronger borders may communicate:

- selected state
- active state
- validation
- focus
- important emphasis

Avoid heavy borders around every element.

---

# Shadows and Elevation

Use shadows to communicate elevation.

Typical hierarchy:

- small shadow → card
- medium shadow → elevated panel
- large shadow → dialog or modal

Avoid large shadows on every component.

Do not use shadows purely as decoration.

---

# Layout

## Shared Container

Pages should normally use a shared content container.

Example:

```css
.container {
  width: min(var(--content-max-width), 92%);
  margin-inline: auto;
}
```

Maintain consistent:

- maximum content width
- horizontal padding
- section spacing
- component gaps
- alignment

Avoid unrelated page widths.

---

## Layout Systems

Use:

- flexbox for one-dimensional alignment
- grid for structured two-dimensional layouts

Prefer simple layout structures.

Avoid deeply nested layout wrappers without a clear reason.

---

# Components

## Component Ownership

Shared components own their shared visual behavior.

Pages compose shared components.

Pages should not repeatedly redefine shared component styling.

If the same visual behavior appears in multiple places, move it into:

- a shared component
- a component variant
- a shared design token
- a reusable layout primitive

---

## Buttons

All buttons must use the shared button system unless explicitly overridden.

Supported conceptual variants should include:

- primary
- secondary
- subtle
- ghost
- destructive

Supported sizes should normally include:

- small
- default
- large

Buttons should share:

- height
- padding
- typography
- radius
- icon spacing
- hover behavior
- active behavior
- focus behavior
- disabled behavior

Primary actions must be visually identifiable.

Do not make every action primary.

Example:

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  min-height: 44px;
  padding-inline: var(--space-4);

  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);

  font: inherit;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform var(--transition-default),
    background-color var(--transition-default),
    border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.button:hover {
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}

.button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-bg);
  border-color: transparent;
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

.button-secondary {
  background-color: var(--color-surface-secondary);
  color: var(--color-text);
}

.button-destructive {
  background-color: var(--color-danger);
  color: #fff;
  border-color: transparent;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

Use component variants instead of creating page-specific button classes.

---

## Forms

Inputs, selects, textareas, checkboxes, radio buttons, and related controls must use a shared form language.

Maintain consistent:

- typography
- control height
- padding
- borders
- radius
- labels
- helper text
- validation
- focus states
- disabled states

Example:

```css
.input {
  width: 100%;
  min-height: 46px;

  padding-inline: var(--space-4);

  background-color: var(--color-surface);
  color: var(--color-text);

  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);

  outline: none;

  transition:
    border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(183, 255, 74, 0.10);
}

.input[aria-invalid="true"] {
  border-color: var(--color-danger);
}
```

Do not use placeholder text as the only field label.

Do not mix unrelated control heights within the same interface.

---

## Cards

Cards should use a shared base style.

Maintain consistent:

- surface
- border
- radius
- internal spacing
- heading hierarchy
- elevation

Example:

```css
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
```

Use variants for genuinely different semantic states.

Possible variants:

- default
- selectable
- highlighted
- warning
- metric

Do not invent a completely new card style for every page.

---

## Navigation

Navigation must follow one shared visual language.

Possible desktop patterns:

- top navigation
- sidebar navigation

Possible mobile patterns:

- compact menu
- drawer
- bottom navigation

Maintain consistent:

- typography
- spacing
- icon sizing
- hover state
- active state
- focus state

Active navigation state must be clearly identifiable.

Do not combine unrelated navigation patterns without a product reason.

---

## Badges and Status Indicators

Use shared status patterns.

Typical states include:

- success
- warning
- error
- information
- active
- inactive
- connected
- disconnected
- loading
- paused

Status color must not be the only indicator.

Include text or iconography when necessary.

---

## Modals and Dialogs

Dialogs should share:

- overlay behavior
- width constraints
- padding
- radius
- heading hierarchy
- close control
- action placement

Dialog actions must use the shared button system.

Dialogs must remain usable on small screens.

---

# UI States

## Loading States

Loading states must look intentional.

Use an appropriate pattern such as:

- spinner
- skeleton
- progress indicator
- explicit loading status

Avoid unexplained blank areas.

---

## Empty States

Empty states should explain:

1. what is missing
2. why the page is empty when useful
3. what the user can do next

Provide a useful next action when one exists.

---

## Error States

Errors should use shared:

- semantic color
- iconography
- message hierarchy
- recovery actions

Messages should be understandable to the user.

Do not expose:

- stack traces
- internal implementation details
- secrets
- sensitive debugging information

---

## Disabled States

Disabled controls must remain recognizable while clearly communicating that interaction is unavailable.

Do not hide important unavailable actions when showing a disabled state provides useful context.

---

# Responsive Design

The same design language must adapt across screen sizes.

Do not create unrelated desktop and mobile visual systems.

At smaller widths:

- reduce columns
- stack content when necessary
- preserve readable spacing
- maintain accessible controls
- prevent horizontal overflow
- preserve media aspect ratios
- maintain practical tap targets

---

## Breakpoints

Prefer a small predictable breakpoint set.

Example:

```css
@media (max-width: 1200px) {
  /* large tablet / small desktop */
}

@media (max-width: 900px) {
  /* tablet */
}

@media (max-width: 600px) {
  /* mobile */
}
```

Do not create many micro-breakpoints unless the design genuinely requires them.

---

# Accessibility

Accessibility is a mandatory frontend design concern.

Interactive components should provide:

- visible keyboard focus
- sufficient contrast
- semantic HTML where practical
- accessible labels
- understandable states
- practical interaction target sizes

A practical minimum interaction target should generally be around 44px.

Do not communicate critical information through color alone.

Use appropriate semantic HTML elements before recreating semantic behavior with generic containers.

---

# Motion

Use motion deliberately and sparingly.

Suitable uses include:

- button feedback
- dropdown opening
- modal appearance
- status transitions
- subtle page transitions
- lightweight card feedback

Motion should generally be short.

Avoid animation that:

- delays primary workflows
- distracts from important content
- harms readability
- creates unnecessary performance cost

Respect reduced-motion preferences when meaningful animation exists.

Example:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# CSS Architecture

## Organization

Prefer:

- global design tokens
- shared base styles
- shared component styles
- component-scoped styles where appropriate
- reusable layout primitives
- understandable utilities

Avoid:

- giant unrelated global stylesheets
- duplicate page styles
- excessive inline styling
- deeply nested selectors
- specificity battles
- unnecessary `!important`

Use `!important` only when genuinely necessary.

---

## Naming

Use semantic names based on purpose.

Prefer:

```text
.button-primary
.page-header
.status-badge
.profile-card
.navigation-item
.content-panel
```

Avoid:

```text
.box1
.green-button
.left-thing
.new-style-2
```

Names should describe responsibility rather than current appearance or physical position.

---

## Page-Level CSS

Pages may own page-specific layout composition.

Pages should not redefine shared primitives such as:

- buttons
- inputs
- cards
- navigation
- typography primitives
- status indicators

When a page requires a genuinely different presentation, prefer a component variant.

---

# Shared Component Rule

Prefer reusable component APIs such as:

```text
Button variant="primary"
Card variant="highlighted"
Badge status="success"
```

over page-specific styling such as:

```text
special-green-button
dashboard-special-card
profile-success-label
```

The exact component API depends on the frontend framework.

The principle is reuse through explicit variants.

---

# Project-Specific UI

These shared rules intentionally do not define domain-specific UI behavior.

Examples of project-specific UI include:

- camera training experiences
- financial dashboards
- medical workflows
- tennis analysis overlays
- ecommerce product galleries
- map interfaces

Rules for project-specific experiences belong in:

- the project frontend specification
- feature specifications
- referenced prototypes
- feature-specific reusable rules when appropriate

Do not add project-specific behavior to these shared frontend rules merely because one current project requires it.

---

# Validation Rules

Before frontend design implementation is considered complete, verify the following.

## Tokens

- shared tokens are used where appropriate
- repeated values are not unnecessarily hardcoded
- project overrides are intentional

## Typography

- hierarchy is consistent
- arbitrary font sizes are avoided
- text remains readable

## Colors

- palette is coherent
- semantic colors are consistent
- important content has sufficient contrast

## Components

- buttons use shared styles
- forms use shared styles
- cards use shared styles
- navigation follows shared patterns
- UI states use shared patterns

## Layout

- spacing is consistent
- content alignment is consistent
- layout primitives are reused
- unnecessary nesting is avoided

## Responsive Behavior

- mobile layout works
- tablet layout works when applicable
- horizontal overflow is absent
- interaction targets remain usable

## Accessibility

- focus states exist
- controls have understandable labels
- important information is not communicated only by color
- semantic HTML is used where practical

## Architecture

- duplicate CSS is avoided
- page-specific overrides are minimal
- shared behavior lives in shared components
- naming is semantic

## Prototype Alignment

When a prototype exists:

- visual hierarchy matches its intent
- component appearance remains aligned
- spacing rhythm remains aligned
- project-specific overrides are respected

Do not require pixel-perfect duplication when doing so would damage maintainability, responsiveness, or accessibility unless pixel-perfect implementation is explicitly required.

---

# Final Rule

Use the following responsibility model:

**Prototype → visual direction**

**Project specification → project-specific requirements**

**Frontend design rules → shared constraints and defaults**

**Design tokens → reusable visual values**

**Shared components → implementation of reusable patterns**

**Pages → composition of shared components**

The executing agent or skill reads the required project resources.

These rules define how the resulting frontend design must be implemented.

Do not recreate the same visual pattern independently on every page.

When requirements differ, override the smallest possible part of the system rather than abandoning the system.