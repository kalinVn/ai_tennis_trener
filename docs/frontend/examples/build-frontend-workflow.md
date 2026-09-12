# Build Frontend Workflow

## Purpose

Explain in human-readable form what the `/build-frontend` command does, which files it reads, how the New Frontend Orchestrator coordinates the work, what the design skill returns, and how the frontend is verified.

This document is explanatory. Executable workflow rules remain in the command, orchestrator, and skills under `claude/`.

## Start the Workflow

The `/build-frontend` command invokes the New Frontend Orchestrator and provides the path to the frontend specification.

## New Frontend Orchestrator

1. The orchestrator invokes the `implement-new-frontend-design` skill and provides the path to the frontend specification.
2. The design skill reads and analyzes the frontend specification, its referenced prototype, and the applicable design rules.
3. The design skill returns a structured frontend implementation plan to the orchestrator.

### Receive the Frontend Plan

The New Frontend Orchestrator receives the complete structured plan returned by `implement-new-frontend-design`. This plan becomes the implementation map for the remaining workflow.

Example result: [Implement New Frontend Design — Example Result](./implement-new-frontend-design-example-result.md).

### Validate the Frontend Plan

Before implementation begins, the orchestrator verifies that the returned plan is complete, consistent, and executable. It checks that required layouts, pages, routes, shared components, feature components, dependencies, and build order are present and connected correctly.

If the plan contains a missing requirement, contradiction, invalid dependency, or duplicate responsibility, the orchestrator does not start the builder skills and does not repair the plan by guessing. It returns the specific validation problem to `implement-new-frontend-design`, receives a corrected plan, and validates it again.

This correction cycle continues until the plan is valid. Only the validated plan may be used as the basis for project structure and implementation.

### Select and Execute Implementation Skills

The design skill returns the planned work, dependencies, and Build Order. The orchestrator selects the necessary implementation skills from its available skills, including Component Builder and Page Builder when applicable, and passes each its relevant requirements.

Plan validation returns incomplete or contradictory requirements to the design skill for correction. Skill availability and execution coverage are checked by the orchestrator; missing skills are execution blockers, not a request for a Required Skills section in the design plan.
