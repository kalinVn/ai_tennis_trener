# Frontend Code Quality

## Purpose

Keep frontend code extremely readable and maintainable.

## Rules

Use Vue 3 with JavaScript.

Do not introduce TypeScript unless explicitly requested.

Prefer:

- small functions
- clear names
- explicit control flow
- small focused components
- simple imports
- shallow composition

Avoid:

- unnecessary nested functions
- deeply nested components
- clever abstractions
- premature generic utilities
- duplicate logic
- giant Vue files
- unnecessary dependencies
- unnecessary global state

One component should have one primary responsibility.

If a page contains several meaningful independent sections, extract those sections into components.

Do not create components for trivial markup solely to increase file count.

Always optimize for a human developer being able to understand the code quickly.