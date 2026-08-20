# /setup-infrastructure

## Purpose

Create, rebuild, validate, and verify the local Docker infrastructure for Tennis AI Coach.

This command manages infrastructure only.

Docker architecture and service requirements are defined in:

`docs/infrastucture/docker/docker.md`

Application source code is handled by separate build workflows.

## Required Context

Before execution:

1. Read `CLAUDE.md`.
2. Read `docs/infrastucture/docker/docker.md`.
3. Use `devops-agent`.
4. Use `testing-infrastructure-agent`.
5. Use `code-review-infrastructure-agent`.
6. Use `verification-infrastructure-agent`.
7. Inspect the repository and current Docker state.
8. Preserve persistent data.

Do not load unrelated application documentation.

## Responsibilities

Implement the Docker specification from:

`docs/infrastucture/docker/docker.md`

Manage Docker infrastructure under:

`infrastructure/docker/`

This may include:

* Dockerfiles
* Docker Compose files
* placeholder services
* networks
* volumes
* environment templates
* health checks
* development ports

Do not generate real application source code.

## Placeholder Services

If real source code for `client`, `admin`, or `api` does not exist, create minimal infrastructure-only placeholders.

Placeholders must live under:

```text
infrastructure/docker/placeholders/
├── client/
├── admin/
└── api/
```

They must:

* build successfully
* start successfully
* expose a simple HTTP response
* remain separate from real application source

The API placeholder must provide:

`/health`

When real application source exists, use the real application instead of the placeholder.

## Rebuild

For a complete rebuild:

1. Inspect project Docker resources.
2. Stop project containers.
3. Remove disposable project containers.
4. Remove disposable images that must be rebuilt.
5. Recreate disposable project networks when required.
6. Preserve persistent volumes and PostgreSQL data.
7. Remove outdated generated Docker configuration when safe.
8. Regenerate the Docker configuration from the current specification.
9. Build required images.
10. Create and start required containers.

Never affect unrelated Docker resources.

If persistence or ownership is uncertain, preserve the resource.

## Execution

Follow this order:

```text
Inspect
→ Plan
→ Clean
→ Generate / Update
→ Validate
→ Build
→ Start
→ Health Check
→ Infrastructure Testing
→ Infrastructure Code Review
→ Infrastructure Verification
→ Report
```

## Safety

Never:

* delete persistent PostgreSQL data
* delete persistent volumes without explicit permission
* delete unrelated Docker resources
* overwrite `.env`
* commit secrets
* generate real application source code
* hide failed builds or health checks
* report false runtime state

The workflow must be safe to run repeatedly.

## Validation

Before reporting success, verify all currently required services defined in the Docker specification.

Verify where applicable:

* Docker configuration
* image builds
* container creation
* container startup
* health checks
* networking
* PostgreSQL
* Redis
* application placeholders or real application containers
* persistent data protection

Do not report success when a required service is missing or unhealthy.

## Post-Implementation Validation

Run in this order:

1. `testing-infrastructure-agent`
2. `code-review-infrastructure-agent`
3. `verification-infrastructure-agent`

### Testing Infrastructure Agent

Test the resulting Docker environment.

### Code Review Infrastructure Agent

Review only infrastructure created or modified by this workflow.

### Verification Infrastructure Agent

Verify the actual runtime state and provide manual developer instructions.

Never invent:

* ports
* URLs
* container names
* image names
* health status

## Output

Report briefly:

* files created or modified
* images built
* containers created and running
* networks created
* persistent volumes preserved
* health status
* testing result
* infrastructure code review result
* infrastructure verification result
* exposed ports
* browser URLs
* API URL
* health URL
* status command
* logs command
* start command
* stop command
* rebuild command
* unresolved errors
* required manual actions

## Scope

This command manages local Docker infrastructure only.

It must not:

* create real Vue applications
* create real FastAPI applications
* deploy Kubernetes
* deploy AWS infrastructure
* deploy production services

## Final Rule

`docs/infrastucture/docker/docker.md` defines **what** the Docker environment must contain.

`/setup-infrastructure` defines **how** that environment is created, rebuilt, validated, tested, reviewed, and verified.

When real application source is unavailable, use infrastructure-only placeholders rather than blocking the Docker setup.
