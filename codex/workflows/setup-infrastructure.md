# Setup Infrastructure Workflow

## Purpose

Use this workflow to create, rebuild, validate, or maintain the local Docker infrastructure for Tennis AI Coach.

This workflow manages infrastructure only. Docker architecture and service requirements come from `docs/infrastucture/docker/docker.md`; application source belongs to separate application-build workflows.

## Required Context

Before execution:

1. Read `AGENTS.md`.
2. Read `codex/workflows/manage-devops.md`.
3. Read `docs/infrastucture/docker/docker.md`.
4. Inspect the repository and current Docker state.
5. Preserve persistent data.

Do not load unrelated application documentation.

After implementation, use these Codex workflows in order:

1. `codex/workflows/testing-infrastructure.md`
2. `codex/workflows/code-review-infrastructure.md`
3. `codex/workflows/verification-infrastructure.md`

## Responsibilities

Implement the Docker specification in `docs/infrastucture/docker/docker.md` and manage Docker infrastructure under `infrastructure/docker/`.

This may include:

- Dockerfiles
- Docker Compose files
- infrastructure-only placeholder services
- networks
- volumes
- environment templates
- health checks
- development ports

Do not generate real application source code. Do not invent service requirements, ports, names, or topology that are not supported by the Docker specification or inspected repository state.

## Placeholder Services

If real source code for `client`, `admin`, or `api` does not exist, create minimal infrastructure-only placeholders under:

```text
infrastructure/docker/placeholders/
├── client/
├── admin/
└── api/
```

Each placeholder must:

- build successfully
- start successfully
- expose a simple HTTP response
- remain separate from real application source

The API placeholder must provide `/health`.

When real application source exists, use it instead of the corresponding placeholder. Placeholder creation is infrastructure preparation and must not scaffold Vue, FastAPI, backend, business-logic, route, or component source in application directories.

## Complete Rebuild

For a complete rebuild:

1. Inspect and identify only this project's Docker resources.
2. Stop project containers.
3. Remove disposable project containers.
4. Remove disposable project images that must be rebuilt.
5. Recreate disposable project networks when required.
6. Preserve persistent volumes and PostgreSQL data.
7. Remove outdated generated Docker configuration when safe.
8. Regenerate Docker configuration from the current specification.
9. Validate the generated configuration.
10. Build required images.
11. Create and start required containers.

Never use broad system-wide cleanup commands or affect unrelated Docker resources. Preserve any resource whose ownership or persistence is uncertain.

## Execution Sequence

Follow this order:

```text
Inspect
→ Plan
→ Clean Disposable Project Infrastructure
→ Generate / Update Docker Configuration
→ Validate Configuration
→ Build Required Images
→ Create and Start Required Containers
→ Health Check
→ Infrastructure Testing
→ Infrastructure Code Review
→ Infrastructure Verification
→ Report
```

Use Linux containers, Docker service-name networking, environment configuration, dependencies, health checks, volumes, and development port mappings where applicable. PostgreSQL data must survive normal rebuilds. Redis may remain disposable unless the Docker specification explicitly requires persistence. Make all operations safe to repeat.

## Safety

Never:

- delete persistent PostgreSQL data
- delete a persistent volume without explicit permission
- delete unrelated or ambiguously owned Docker resources
- overwrite `.env`
- commit or embed secrets
- delete or modify application source
- generate real application source code
- hide failed builds, tests, or health checks
- report false runtime state
- deploy Kubernetes, AWS infrastructure, or production services
- create or connect a GitHub repository without an explicit request

## Validation

Before reporting success, verify every currently required service defined in `docs/infrastucture/docker/docker.md`.

Verify where applicable:

- Docker configuration and expected infrastructure files
- image builds
- container creation and startup
- health checks
- networking
- PostgreSQL
- Redis
- real application containers or infrastructure-only placeholders
- persistent data protection

Fix safe, in-scope infrastructure failures. Do not report success when a required service is missing or unhealthy, and never claim a missing or failed application service is running.

## Post-Implementation Validation

Run in this order:

1. Use `codex/workflows/testing-infrastructure.md` to test the resulting Docker environment, including required placeholders where real application source is unavailable.
2. Use `codex/workflows/code-review-infrastructure.md` to review only infrastructure created or modified by this workflow.
3. Use `codex/workflows/verification-infrastructure.md` to verify actual runtime state and provide exact manual developer instructions.

Never invent ports, URLs, container names, image names, or health status.

## Report

Report briefly:

- files created, regenerated, or modified
- disposable project containers and images removed
- images built
- containers created and running
- networks created
- persistent volumes preserved
- per-service and overall health status
- infrastructure testing result
- infrastructure code review result
- infrastructure verification result
- actual exposed ports
- actual browser URLs
- actual API URL
- actual health URL
- status command
- logs command
- start command
- stop command
- rebuild command
- unresolved errors
- required manual actions

## Scope

This workflow manages local Docker infrastructure only. It must not:

- create real Vue applications
- create real FastAPI applications
- deploy Kubernetes
- deploy AWS infrastructure
- deploy production services

## Final Rule

`docs/infrastucture/docker/docker.md` defines what the Docker environment must contain.

This workflow defines how that environment is created, rebuilt, validated, tested, reviewed, and verified.

When real `client`, `admin`, or `api` source is unavailable, use infrastructure-only placeholders rather than blocking Docker setup.
