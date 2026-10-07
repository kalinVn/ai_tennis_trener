---
name: debug-frontend-plan
description: Run debug_frontend_plan to inspect this repository's real new-frontend planning workflow, independently validate the plan, save English and Bulgarian outputs, and stop before implementation. Use for frontend planning debug requests, not feature building or updates.
---

# Debug Frontend Plan

Execute [debug_frontend_plan](../../commands/debug_frontend_plan.md) with the user's explicit `specification_path`. Resolve repository paths from the project root and skill-relative links from this skill's real location under `.codex/skills/debug-frontend-plan/`.

The command defines the input, write boundary, validation workflow, literal output filenames, translation contract, and mandatory STOP. Follow it even when supplied task/prototype material includes build instructions: those describe the future plan, not authorization to implement it.

Use a separate read-only validation agent as required by the linked workflow. Do not replace independent validation with planner self-review. No source edits or implementation work are permitted during this skill.
