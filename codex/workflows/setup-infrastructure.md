# Setup Infrastructure Workflow

Use for initial Docker infrastructure setup or intentional Docker/Compose maintenance.

Read `AGENTS.md`, `codex/workflows/manage-devops.md`, and the Docker guide, then inspect implemented services and existing Docker files. The current guide is `docs/infrastucture/docker/docker.md`; prefer `docs/infrastructure/docker.md` if the repository later adopts the intended path. Read `codex/workflows/setup-production.md` only when CI/CD concerns are involved. Load no unrelated documentation.

Maintain only what implemented services require under `infrastructure/docker/`, including applicable service Dockerfiles and separate development and production Compose files. Also maintain `.dockerignore`, `.env.example`, and `.gitignore` when needed. Preserve valid existing infrastructure; do not scaffold nonexistent services unless the task requires them.

Use Linux containers, private service-name networking, persistent PostgreSQL storage, environment-based configuration, development hot reload, dependencies, and health checks. Keep services independently deployable and Vision/GPU configuration isolated.

Follow this sequence:

```text
Inspect → Plan → Create/Update → Validate → Build → Start → Health Check → Report
```

Build only affected images where practical. Start services only when appropriate. Run required migrations. Verify applicable Docker/Compose syntax, builds, PostgreSQL/Redis connectivity, API health, client-to-API access, persistence, and secret hygiene. Fix safe in-scope failures and report failures honestly.

Never delete volumes without explicit permission, embed credentials, expose PostgreSQL or Redis publicly in production, require GPUs for the whole application, overwrite working configuration unnecessarily, or create/connect a GitHub repository without an explicit request. Make operations repeatable.

Report created and modified files, images built, services running, validations, unresolved errors, and manual actions.
