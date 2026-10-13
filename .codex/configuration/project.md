# Project Configuration Adapter

Root `AGENTS.md` is the active Codex instruction source. `claude/CLAUDE.md` remains Claude compatibility configuration and may be consulted for historical/project context, but it does not override active instructions.

Use:

- Vue 3, TypeScript, Vite, Pinia, and Vue Router for the frontend.
- Python, FastAPI, Pydantic, PostgreSQL/SQLAlchemy/Alembic, Redis, object storage, WebSockets, Stripe, Docker/Compose, Kubernetes on AWS, and GitHub Actions as defined by `AGENTS.md`.
- `docs/frontend/frontend.md` and its declared supporting documents for current frontend product, route, component, integration, and structure contracts.
- `codex/workflows/` for maintained infrastructure execution.
- `.codex/workflows/` for Codex frontend orchestration and planning-debug execution.

Never infer file existence from `claude/PROJECT_STRUCTURE.md`; verify the repository.

