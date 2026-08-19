# /setup-infrastructure

## Purpose

Setup, validate, and maintain the Docker infrastructure for Tennis AI Coach.

Use this command for initial infrastructure setup or intentional Docker infrastructure changes.

## Required Context

Before execution:

1. Read `CLAUDE.md`.
2. Read `docs/infrastructure/docker.md`.
3. Use `devops-agent`.
4. Use`testing-agent`
5. Use `code-review-agent`
6. Use `verification-agent`
7. Use `ci-cd-agent` where required.
8. Inspect the repository and existing Docker configuration.
9. Preserve valid existing infrastructure.

Do not load unrelated project documentation.

## Responsibilities

Create or update only what is required:

```text
infrastructure/docker/
├── Dockerfile.client
├── Dockerfile.admin
├── Dockerfile.api
├── Dockerfile.realtime
├── Dockerfile.vision
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

Also manage when needed:

```text
.dockerignore
.env.example
.gitignore
```

Do not create infrastructure for services that do not exist yet unless required by the current architecture.

## Setup

Use Linux containers.

Prepare the development stack for implemented services such as:

* client
* admin
* api
* postgres
* redis
* realtime
* vision

Configure:

* Docker networking
* persistent PostgreSQL storage
* environment variables
* development hot reload
* service dependencies
* basic health checks

Keep GPU configuration isolated to Vision services.

## Execution

Follow this order:

```text
Inspect
→ Plan
→ Create/Update
→ Validate
→ Build
→ Start
→ Health Check
→ Report
```

Build only affected images when possible.

Start services only when appropriate for the requested operation.

Run database migrations when required.

## Safety

Never:

* delete persistent volumes without explicit permission
* overwrite working configuration unnecessarily
* commit secrets
* put credentials inside Dockerfiles
* expose PostgreSQL or Redis publicly in production
* require GPU for the entire application

The command must be safe to run repeatedly.

## Git

Preserve existing Git configuration.

Ensure secrets, volumes, temporary files, and generated local data are ignored.

Do not create or connect a GitHub repository unless explicitly requested.

## Validation

Before completion verify where applicable:

* Docker configuration is valid
* required images build
* PostgreSQL is reachable
* Redis is reachable
* API is healthy
* client/admin can reach API
* persistent data is protected
* secrets are not committed

Fix safe in-scope failures when possible.

Do not hide failed builds or health checks.


## Post-Implementation Validation

After Docker infrastructure changes are complete, run validation in this order:

1. `testing-agent`
2. `code-review-agent`
3. `verification-agent`

### Testing Agent

Validate the Docker environment.

Check relevant:

- Docker builds
- containers
- health checks
- PostgreSQL
- Redis
- API connectivity

### Code Review Agent

Review only the infrastructure changes made by this command.

Check:

- Docker configuration
- security
- secrets
- networking
- volumes
- maintainability

Do not review unrelated application code.

### Verification Agent

Perform final verification and provide manual developer instructions.

Report:

- running containers
- container status
- exposed ports
- browser URLs
- health endpoints
- commands for status
- commands for logs
- commands for start/stop

Never invent ports or URLs.
Read them from the actual Docker configuration.

## Output

Report briefly:

* created files
* modified files
* built images
* running services
* validation results
* unresolved errors
* required manual actions

* testing result
* code review result
* verification result
*  browser URLs
* manual verification commands

## Final Rule

Read the Docker architecture from `docs/infrastructure/docker.md`.

Do not duplicate that documentation here.

This command should orchestrate infrastructure setup, not redesign the infrastructure.
