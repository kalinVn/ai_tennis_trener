# Build Frontend Command

## Purpose

Build a new frontend from a provided frontend specification.

This command is only for creating a new frontend.

It does not update an existing frontend.

---

## Usage

    /build-frontend <specification-path>

Example:

    /build-frontend docs/frontend.md

---

## Input

### `specification-path`

Required.

Path to the frontend specification that defines the frontend to build.

---

## Workflow

Delegate the task to:

    new-frontend-orchestrator

Provide:
    specification_path: <specification-path>

The New Frontend Orchestrator owns the complete implementation workflow.

---

## Rules

- Do not determine whether this is a new frontend or an update.
- Do not inspect an existing frontend to choose a workflow.
- Do not implement frontend code inside this command.
- Do not select individual implementation skills inside this command.
- Do not duplicate Frontend Orchestrator logic.
- Do not use `update-existing-frontend-design`.

---

## Failure Handling

If `specification-path` is missing, stop and report that it is required.

If the specification cannot be resolved, stop and report the unresolved path.

---

## Final Rule

`build-frontend` always starts the New Frontend Workflow.

Pass the specification path to `new-frontend-orchestrator` and let the orchestrator coordinate implementation.
