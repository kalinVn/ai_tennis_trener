# Frontend Page Builder

## Purpose

Create and update Vue pages consistently.

## Rules

Before creating a page:

1. Inspect existing routes.
2. Inspect existing pages.
3. Inspect reusable components.
4. Avoid duplicates.
5. Determine whether a new page is actually required.

Pages should primarily compose components and coordinate page-level state.

Do not place unrelated business logic directly inside page components.

When creating a page, update routing when required.

Keep pages readable and reasonably small.