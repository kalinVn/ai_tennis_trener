# build_frontend

Build a new frontend from an explicit specification path.

## Input

```text
specification_path=<repository-relative path>
```

The input is required. Resolve it from the repository root and stop if it is missing or unreadable.

## Execution

Read `AGENTS.md`, then execute `.codex/workflows/new-frontend.md`. The workflow owns planning, independent validation, bounded corrections, skill selection, implementation order, testing, review, and final verification.

This command does not choose between new and existing frontend work, implement code directly, or invoke the scoped-update workflow.

