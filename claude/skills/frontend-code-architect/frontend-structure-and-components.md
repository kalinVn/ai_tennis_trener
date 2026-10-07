# Frontend Structure and Components

## Inspect Before Designing

- Inspect the actual implementation and at least 2–3 similar components, prototypes, or systems where possible.
- Identify patterns already used successfully; prefer consistency unless there is a concrete reason to change them.
- Verify files exist. Do not treat an architecture map or an example tree as proof of implementation.
- For timeline/controller work, inspect the slider collaborators. For fields and cards, inspect existing members of those families and their related composables.

## Small Component Families

- Group related Vue components by domain or responsibility: Cards together, Fields together.
- Preserve the Data Fields / Number Fields / Select Fields / Text Fields family pattern; use actual repository names rather than inventing components to fill an example.
- For Cards, compare Featured/Feature Card and Order Summary Card patterns. Current prototypes use `FeatureCard.vue` and `OrderSummaryCard.vue`.
- Current Fields include `DateField.vue`, `NumberField.vue`, `SelectField.vue`, and `TextField.vue`; the “Data Fields” wording does not imply that `DataField.vue` exists.

Existing prototype grouping illustrates the pattern:

```text
prototypes/components/
  cards/
    FeatureCard.vue
    OrderSummaryCard.vue
  fields/
    DateField.vue
    NumberField.vue
    SelectField.vue
    TextField.vue
```

## Larger Feature Systems

- A small component family does not need the structure of a complex feature system.
- Give a complex feature its own directory when related components, controllers, helpers, configuration, and assets form one cohesive system.
- Keep feature-specific assets, configuration, helpers, and composables inside that feature boundary.
- Promote code into shared directories only when truly shared; similar filenames alone do not establish reuse.
- The [slider reference](reference-home-page-video-slider.md) illustrates a larger local system without prescribing that structure for Cards or Fields.

## Vue, Composables, and Store Separation

- Vue components own their view/template concerns and compose the behavior they need.
- Group related reusable Vue behavior in composables; keep feature-only composables local and shared composables in the established shared location.
- Keep the application store separate from component families and composables. Do not turn a composable or controller into a second owner of the same shared state.
- Follow the project's established `stores/` naming: application-wide stores live separately from feature-local stores; simple local UI state can remain local.
- Use the approved [frontend requirements](../../../docs/frontend/frontend.md) and [frontend project structure](../frontend-project-structure.md) for actual application placement. This file does not move the prototype tree into the application or redefine its structure.
