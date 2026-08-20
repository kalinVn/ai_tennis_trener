# /setup-infrastructure

## Purpose

Setup, rebuild, validate, and maintain the local Docker infrastructure for Tennis AI Coach.

This command manages Docker infrastructure only.

It must NOT create application source code such as Vue, FastAPI, frontend, admin, or backend application scaffolding.

Application source code is created by separate application build workflows.

## Required Context

Before execution:

1. Read `CLAUDE.md`.
2. Read `docs/infrastucture/docker/docker.md`.
3. Use `devops-agent`.
4. Use `testing-infrastructure-agent`.
5. Use `code-review-infrastructure-agent`.
6. Use `verification-infrastructure-agent`.
7. Inspect the repository.
8. Inspect the existing Docker environment.
9. Preserve persistent data.

Do not load unrelated application documentation.

## Responsibilities

Implement the Docker infrastructure defined in:

`docs/infrastucture/docker/docker.md`

This command may create or update:

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

Also maintain when required:

```text
.dockerignore
.env.example
.gitignore
```

Dockerfiles may be prepared before the corresponding application source exists.

Missing application source code must not be treated as an infrastructure failure.

Do not generate application source code.

## Infrastructure Services

Create the infrastructure services defined by the Docker specification.

Infrastructure dependencies may include:

* PostgreSQL
* Redis
* Docker networks
* persistent volumes

Application service definitions such as:

* client
* admin
* api
* realtime
* vision

may also be prepared in Docker configuration even when their application source has not yet been generated.

If an application service cannot start because its source code does not exist yet:

* report it as `PENDING APPLICATION BUILD`
* do not treat the Docker infrastructure setup itself as failed

## Clean Rebuild

For a complete infrastructure rebuild:

1. Inspect existing project Docker resources.
2. Stop project containers when required.
3. Remove disposable project containers.
4. Remove disposable project images when rebuilding.
5. Remove disposable project networks when required.
6. Preserve persistent volumes.
7. Preserve PostgreSQL data.
8. Remove outdated generated Docker configuration when safe.
9. Regenerate Docker configuration from the current Docker specification.
10. Validate the resulting infrastructure.

Never delete:

* PostgreSQL persistent data
* persistent volumes without explicit permission
* `.env`
* application source code
* unrelated Docker resources

Never use broad system-wide Docker cleanup commands.

## Execution

Follow this order:

```text
Inspect
→ Plan
→ Clean Disposable Project Infrastructure
→ Regenerate Docker Configuration
→ Validate Configuration
→ Build Available Images
→ Create Available Containers
→ Start Available Services
→ Health Check
→ Infrastructure Testing
→ Infrastructure Code Review
→ Infrastructure Verification
→ Report
```

If an application image cannot be built because application source is not yet available, mark that service as:

`PENDING APPLICATION BUILD`

and continue validating the remaining infrastructure.

## Application Boundary

This workflow must never create:

* Vue applications
* frontend application code
* admin application code
* FastAPI application code
* business logic
* application routes
* application components

Those belong to application build workflows.

The responsibility of this command is to prepare the environment where those applications will run later.

## Docker Access

Use Linux containers.

Use Docker networking and service names.

Configure where applicable:

* networks
* volumes
* environment variables
* service dependencies
* health checks
* development port mappings

Do not invent application ports if they are not yet defined.

## Persistence

PostgreSQL data must survive normal infrastructure rebuilds.

Redis may remain disposable unless persistence is explicitly required.

Persistent volumes must never be removed automatically.

## Safety

Never:

* delete persistent data
* delete unrelated Docker resources
* overwrite `.env`
* commit secrets
* generate application source code
* hide infrastructure errors
* report an application as running when its source is missing

The command must be safe to execute repeatedly.

## Validation

Verify where applicable:

* Docker configuration is valid
* expected Docker files exist
* PostgreSQL configuration is valid
* Redis configuration is valid
* networks are valid
* persistent volumes are protected
* available images build
* available containers start
* available health checks pass

Missing application source must be reported separately from Docker infrastructure errors.

## Post-Implementation Validation

Run in this order:

1. `testing-infrastructure-agent`
2. `code-review-infrastructure-agent`
3. `verification-infrastructure-agent`

### Testing Infrastructure Agent

Test only the infrastructure that can currently run.

### Code Review Infrastructure Agent

Review Docker infrastructure only.

Do not review or generate missing application code.

### Verification Infrastructure Agent

Report the actual infrastructure state.

For each service report one of:

* `RUNNING`
* `STOPPED`
* `FAILED`
* `PENDING APPLICATION BUILD`

Never invent runtime state.

## Output

Report:

* Docker files created
* Docker files regenerated
* Docker files modified
* containers removed
* images removed
* networks created
* volumes preserved
* infrastructure services running
* application services pending build
* health status
* testing result
* infrastructure code review result
* infrastructure verification result
* exposed ports when available
* unresolved Docker errors
* required manual actions

## Scope

This command manages Docker infrastructure only.

It does not:

* build the application
* create Vue projects
* create FastAPI projects
* deploy Kubernetes
* deploy AWS infrastructure
* deploy production services

## Final Rule

`docs/infrastucture/docker/docker.md` defines the Docker infrastructure specification.

`/setup-infrastructure` creates and validates that infrastructure.

Missing application source code is not an infrastructure failure.

Application code will be created later by dedicated application build workflows.
