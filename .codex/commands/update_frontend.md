# update_frontend

Apply a scoped change to an existing frontend.

## Input

Receive an explicit update prompt and/or `update_specification_path`. Accept `frontend_specification_path` when project context is needed.

## Execution

Read `AGENTS.md`, then execute `.codex/workflows/update-frontend.md`. Inspect the relevant existing frontend, produce the smallest source-backed update plan, select only required skills, implement the change, and run proportional regression checks.

Do not run the new-frontend build workflow or rebuild unrelated functionality.

