# Setup Infrastructure Workflow

Use to set up, rebuild, validate, or maintain the complete local Docker development environment. This workflow orchestrates local Docker work only; it does not authorize Kubernetes, AWS, or production-cloud changes.

Read `AGENTS.md`, `codex/workflows/manage-devops.md`, and the Docker guide, then inspect implemented services and existing Docker files. The current guide is `docs/infrastucture/docker/docker.md`; prefer `docs/infrastructure/docker.md` if the repository later adopts the intended path. Read `codex/workflows/setup-production.md` only when CI/CD configuration is affected. Use `codex/workflows/testing-infrastructure.md`, `codex/workflows/code-review-infrastructure.md`, and `codex/workflows/verification-infrastructure.md` for post-implementation validation. Load no unrelated documentation.

Determine which application services currently exist. The local environment must include every implemented required service, including applicable `client`, `admin`, `api`, `postgres`, and `redis` services, plus `realtime`, `vision`, or `worker` when implemented. PostgreSQL and Redis alone are not a complete environment when application services exist.

Maintain only what implemented services require under `infrastructure/docker/`, including applicable service Dockerfiles and separate development and production Compose files. Also maintain `.dockerignore`, `.env.example`, and `.gitignore` when needed. Preserve valid existing infrastructure and do not create unused services.

Use Linux containers, private service-name networking, persistent PostgreSQL storage, environment-based configuration, development hot reload, dependencies, and health checks. Keep services independently deployable and Vision/GPU configuration isolated.

For a complete rebuild, first identify only this project's Docker resources. Stop and remove disposable project containers, remove project images that must be rebuilt, and recreate disposable project networks as required by the current specification. Never use system-wide pruning. Preserve PostgreSQL volumes, persistent application data, `.env`, source code, and all unrelated or ambiguously owned containers, images, networks, and volumes. Regenerate missing, outdated, or incomplete Dockerfiles and Compose configuration, then build, create, and start every required implemented service.

Follow this sequence:

```text
Inspect → Plan → Identify Project Resources → Clean Disposable Project Resources → Create/Update Configuration → Validate → Build Images → Create Containers → Start Services → Migrate → Health Check → Test Infrastructure → Review Infrastructure → Verify Infrastructure → Report
```

Use incremental updates when appropriate and a complete rebuild when the environment must be recreated from the current specification. The host browser must reach application containers through published localhost ports derived from active Compose configuration. Never invent ports or URLs.

Verify required configuration and Dockerfiles, Compose syntax, builds, container creation/startup/health, PostgreSQL and Redis connectivity, API health, implemented client/admin reachability and API connectivity, persistence, and secret hygiene. Never report setup as successful while a required application container is missing or unhealthy. Fix safe in-scope failures and report failures honestly.

After implementation, apply the validation workflows in this order:

1. `codex/workflows/testing-infrastructure.md` validates the affected environment and records test evidence.
2. `codex/workflows/code-review-infrastructure.md` reviews only the infrastructure changes and uses the test evidence when available.
3. `codex/workflows/verification-infrastructure.md` verifies the final state and supplies exact browser URLs and manual commands derived from active configuration.

Never delete persistent volumes or PostgreSQL data during a normal rebuild, overwrite `.env`, delete unrelated Docker resources or user source files, embed credentials, expose PostgreSQL or Redis publicly in production, require GPUs for the whole application, hide failures, or create/connect a GitHub repository without an explicit request. When resource ownership or persistence is uncertain, preserve it. Make operations repeatable.

Report created, regenerated, and modified files; removed containers and images; recreated networks; preserved persistent volumes; built images; created and running containers; health and validation results; testing, review, and verification results; exact exposed ports and browser/API URLs; actual status, logs, start, stop, and rebuild commands; unresolved errors; and manual actions.
