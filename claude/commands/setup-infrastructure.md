# /setup-infrastructure

## Purpose

Setup, rebuild, validate, and maintain the complete local Docker development environment for Tennis AI Coach.

This command orchestrates local Docker infrastructure work.

Infrastructure architecture and detailed container requirements belong in:

`docs/infrastructure/docker.md`

## Required Context

Before execution:

1. Read `CLAUDE.md`.
2. Read `docs/infrastructure/docker.md`.
3. Use `devops-agent`.
4. Use `testing-infrastructure-agent`.
5. Use `code-review-infrastructure-agent`.
6. Use `verification-infrastructure-agent`.
7. Use `ci-cd-agent` only when CI/CD configuration is affected.
8. Inspect the repository.
9. Inspect existing Docker infrastructure.
10. Determine which application services are currently implemented.
11. Preserve persistent data and valid existing configuration.

Do not load unrelated project documentation.

## Responsibilities

Implement the Docker architecture defined in:

`docs/infrastructure/docker.md`

Create, regenerate, or update required Docker infrastructure when necessary.

Expected infrastructure location:

```text
infrastructure/docker/
```

Also maintain project-level Docker support files when required.

Do not create infrastructure for application services that do not exist.

## Clean Rebuild

A complete `/setup-infrastructure` execution must rebuild the disposable local Docker environment for this project.

Before rebuilding:

1. Inspect all existing Docker resources belonging to this project.
2. Stop all project containers.
3. Remove all disposable project containers.
4. Remove project images that must be rebuilt.
5. Remove disposable project networks that must be recreated.
6. Preserve all persistent volumes and persistent application data.
7. Inspect the current Docker specification in `docs/infrastructure/docker.md`.
8. Regenerate missing, outdated, or incomplete Dockerfiles and Compose configuration.
9. Build all required images for currently implemented services.
10. Create all required containers defined by the current Docker specification.
11. Start all required containers.
12. Verify that every required implemented service is running.

The rebuild must include application containers, not only infrastructure dependencies.

PostgreSQL and Redis alone do not constitute a complete local environment when application services are implemented.

Never remove:

* PostgreSQL persistent volumes
* persistent application data
* `.env`
* application source code
* unrelated Docker containers
* unrelated Docker images
* unrelated Docker networks
* unrelated Docker volumes

Never use broad cleanup commands such as system-wide Docker pruning for this workflow.

If ownership or persistence of a Docker resource is uncertain, preserve it.

## Execution

Follow this order:

```text
Inspect
→ Plan
→ Identify Existing Project Resources
→ Clean Previous Disposable Infrastructure
→ Create / Update Docker Configuration
→ Validate Configuration
→ Build Images
→ Create Containers
→ Start Services
→ Run Required Migrations
→ Health Check
→ Infrastructure Testing
→ Infrastructure Code Review
→ Infrastructure Verification
→ Infrastructure Report
```

Do not consider PostgreSQL and Redis alone to be a complete environment when application services are implemented.

Use incremental updates when appropriate.

Use a complete rebuild when the infrastructure needs to be recreated from the current specification.

## Application Access

The developer's browser runs on the host machine, not inside Docker.

Application services must publish the ports required for local development.

The browser accesses application containers through:

```text
localhost:<published-port>
```

Actual ports must come from Docker Compose configuration.

Never invent port numbers.

Final verification must report the exact browser URLs from the active configuration.

## Database

PostgreSQL is persistent application storage.

Redis is temporary/cache/realtime storage.

Run database migrations when required by the current application state.

Never destroy PostgreSQL data during a normal infrastructure rebuild.

## Safety

Never:

* delete persistent volumes without explicit permission
* delete PostgreSQL data during a normal rebuild
* delete unrelated Docker resources
* delete user-created source files
* overwrite `.env`
* commit secrets
* place credentials inside Dockerfiles
* expose PostgreSQL or Redis publicly in production
* require GPU for the entire application
* hide infrastructure failures

The workflow must be safe to run repeatedly.

## Git

Preserve existing Git configuration.

Ensure secrets, temporary files, generated local data, and appropriate Docker artifacts are ignored.

Do not create or connect a GitHub repository unless explicitly requested.

## Validation

Before completion verify:

* required Docker configuration exists
* Compose configuration is valid
* required Dockerfiles exist
* required images build
* required containers exist
* required containers are running
* required health checks pass
* PostgreSQL is reachable
* Redis is reachable
* API is reachable and healthy
* client is reachable when implemented
* admin is reachable when implemented
* client can communicate with API when implemented
* admin can communicate with API when implemented
* persistent data is protected
* secrets are not committed

Do not report success if an implemented required application service is missing or unhealthy.

Fix safe in-scope failures when possible.

Never hide failed builds, tests, or health checks.

## Post-Implementation Validation

Execute these agents in this exact order:

1. `testing-infrastructure-agent`
2. `code-review-infrastructure-agent`
3. `verification-infrastructure-agent`

### Testing Infrastructure Agent

Test the resulting Docker environment.

Validate where applicable:

* image builds
* container creation
* container startup
* container health
* PostgreSQL
* Redis
* API
* client
* admin
* service connectivity

### Code Review Infrastructure Agent

Review only Docker infrastructure created or modified by this workflow.

Check:

* Dockerfiles
* Compose configuration
* image choices
* networking
* exposed ports
* secrets
* volumes
* persistence
* health checks
* development/production separation
* maintainability

Do not review unrelated application code.

### Verification Infrastructure Agent

Perform final verification and provide manual developer instructions.

Use actual Docker configuration and runtime state.

Report:

* containers created
* containers running
* image names
* container status
* exposed ports
* browser URLs
* API URL
* API documentation URL when available
* health endpoints
* status commands
* log commands
* start command
* stop command
* rebuild command

Never invent:

* ports
* URLs
* container names
* image names
* health status

## Output

Report:

* files created
* files regenerated
* files modified
* containers removed
* images removed
* networks recreated
* persistent volumes preserved
* images built
* containers created
* running services
* health status
* testing result
* infrastructure code review result
* infrastructure verification result
* exposed ports
* browser URLs
* API URL
* API documentation URL when available
* status command
* logs command
* start command
* stop command
* rebuild command
* unresolved errors
* required manual actions

## Scope

This command manages local Docker development infrastructure.

It must not:

* deploy Kubernetes
* deploy to AWS
* modify production cloud infrastructure

Production deployment belongs to the production infrastructure workflow.

## Final Rule

`docs/infrastructure/docker.md` defines what the Docker environment must contain.

This command defines how that environment is created, rebuilt, validated, and verified.

A successful execution must leave a complete and reproducible local Docker development environment for all currently implemented required services.
