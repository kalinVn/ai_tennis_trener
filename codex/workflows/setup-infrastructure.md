# Setup Infrastructure Workflow

Use to set up, rebuild, validate, or maintain local Docker infrastructure. This workflow manages infrastructure only: never create Vue, frontend, admin, FastAPI, backend, business-logic, route, or component source. Application code belongs to separate application-build workflows.

Read `AGENTS.md`, `codex/workflows/manage-devops.md`, and `docs/infrastucture/docker/docker.md`, then inspect the repository and current Docker state. Use `codex/workflows/testing-infrastructure.md`, `codex/workflows/code-review-infrastructure.md`, and `codex/workflows/verification-infrastructure.md` in that order after implementation. Load no unrelated application documentation and preserve persistent data.

Implement the Docker infrastructure defined by the guide. Maintain applicable `Dockerfile.client`, `Dockerfile.admin`, `Dockerfile.api`, `Dockerfile.realtime`, `Dockerfile.vision`, development and production Compose files under `infrastructure/docker/`, and `.dockerignore`, `.env.example`, or `.gitignore` when required. Dockerfiles and application-service definitions may be prepared before their source exists, but do not invent application ports or generate application source.

Infrastructure dependencies include PostgreSQL, Redis, Docker networks, and persistent volumes. Application definitions may include client, admin, API, realtime, and Vision. If source is missing and an application image or container cannot be built or started, report that service as `PENDING APPLICATION BUILD`; this is not an infrastructure failure. Continue building, starting, testing, and validating infrastructure that is currently available.

For a complete rebuild, identify only this project's Docker resources; stop and remove disposable project containers; remove disposable project images and networks when required; preserve PostgreSQL data, persistent volumes, `.env`, source code, unrelated resources, and ambiguously owned resources; safely replace outdated generated Docker configuration; then regenerate and validate configuration from the current specification. Never use broad system-wide cleanup commands.

Follow this sequence:

```text
Inspect → Plan → Clean Disposable Project Infrastructure → Regenerate Docker Configuration → Validate Configuration → Build Available Images → Create Available Containers → Start Available Services → Health Check → Test Infrastructure → Review Infrastructure → Verify Infrastructure → Report
```

Use Linux containers, Docker service-name networking, environment configuration, dependencies, health checks, volumes, and development port mappings where applicable. PostgreSQL data must survive normal rebuilds; Redis may remain disposable unless persistence is explicitly required. Never automatically delete a persistent volume.

Verify applicable Docker configuration and expected files, PostgreSQL and Redis configuration, networks, persistent-volume protection, available image builds, available container startup, and available health checks. Fix safe in-scope infrastructure failures and report errors honestly. Do not treat missing application source as a Docker error or claim a missing application is running.

Post-implementation validation order:

1. `codex/workflows/testing-infrastructure.md` tests only infrastructure that can currently run.
2. `codex/workflows/code-review-infrastructure.md` reviews Docker infrastructure only and does not review or generate missing application code.
3. `codex/workflows/verification-infrastructure.md` reports actual service state as `RUNNING`, `STOPPED`, `FAILED`, or `PENDING APPLICATION BUILD`.

Never overwrite `.env`, commit or embed secrets, delete unrelated Docker resources or application source, hide infrastructure errors, deploy Kubernetes/AWS/production services, or create/connect a GitHub repository without an explicit request. Make operations repeatable.

Report Docker files created, regenerated, and modified; removed containers and images; created networks; preserved volumes; running infrastructure services; application services pending build; health, testing, review, and verification results; actual exposed ports when available; unresolved Docker errors; and required manual actions.
