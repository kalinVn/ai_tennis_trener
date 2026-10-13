---
name: ensure-project-directories
description: Ensure only the application directories required by local infrastructure exist, without scaffolding application code.
---

# Ensure Project Directories

Read repository-root `codex/workflows/setup-infrastructure.md` and the directory requirements in the Docker specification. Create only missing, explicitly required project directories; preserve existing contents and permissions where practical.

Never delete, overwrite, or scaffold Vue/FastAPI application source. Report directories found, created, and any errors.

