# /setup-infrastructure

## Purpose

Create, rebuild, validate, and verify the local Docker infrastructure for Tennis AI Coach.

Docker architecture is defined in:

`docs/infrastucture/docker/docker.md`

This command manages infrastructure only.

## Required Context

Before execution:

1. Read `CLAUDE.md`.
2. Read `docs/infrastucture/docker/docker.md`.
3. Use `devops-agent`.
4. Use `ensure-project-directories` skill.
5. Use `infrastructure-git-safety` skill.
6. Use `configure-docker-mounts` skill.
7. Use `testing-infrastructure-agent`.
8. Use `code-review-infrastructure-agent`.
9. Use `verification-infrastructure-agent`.
10. Inspect the repository and current Docker state.

Do not load unrelated application documentation.

## Responsibilities

Implement the Docker specification.

Manage infrastructure under:

`infrastructure/docker/`

Do not generate real Vue or FastAPI application source.

If real `client`, `admin`, or `api` source is unavailable, use infrastructure-only placeholders defined by the Docker specification.

## Project Directories

Ensure these host directories exist:

```text
frontend/
admin/
backend/
```

Create missing directories only.

Do not scaffold real application source.

Use them as:

```text
frontend/ → client
admin/    → admin
backend/  → api
```

## Nginx Configuration

Configure the `client` and `admin` containers to use Nginx according to the Docker specification.

For development, configure the required bind mounts so that:

```text
frontend/ → client:/usr/share/nginx/html/frontend
admin/    → admin:/usr/share/nginx/html/admin
backend/  → api:/app
```

Ensure the required container-side directories exist.

Generate or update the relevant Nginx configuration when required.

The Nginx configuration, Dockerfile, and Docker Compose configuration must use consistent paths.

Do not configure Nginx manually outside the infrastructure workflow.

## Rebuild

When rebuilding:

* stop disposable project containers
* remove disposable project containers and rebuildable images
* recreate project networks when required
* preserve persistent volumes and PostgreSQL data
* preserve `.env` and application source
* preserve `frontend/`, `admin/`, and `backend/`
* regenerate outdated Docker configuration
* regenerate Nginx configuration when required
* rebuild and start required services

Never affect unrelated Docker projects.

## Execution

Follow this order:

```text
Inspect
→ Plan
→ Ensure Directories
→ Apply Git Safety
→ Clean Disposable Infrastructure
→ Generate / Update Docker
→ Configure Mounts
→ Configure Nginx
→ Validate
→ Build
→ Start
→ Health Check
→ Infrastructure Testing
→ Infrastructure Code Review
→ Infrastructure Verification
→ Report
```

## Git Safety Execution

Use `infrastructure-git-safety` to apply the shared requirements in `docs/infrastucture/docker/docker.md` before any disposable infrastructure cleanup.

The skill must merge missing root `.gitignore` protections without replacing valid user rules.

Ensure public examples such as `.env.example` remain trackable.

Audit sensitive paths by filename and Git status only.

Report tracked sensitive files without reading or exposing their contents.

Git-safety failure is an infrastructure validation failure.

Do not continue to destructive rebuild steps until unsafe ignore behavior is corrected.

## Validation

Verify where applicable:

* required project directories exist
* Docker configuration is valid
* required bind mounts are configured
* Nginx configuration uses the expected paths
* Nginx can access mounted frontend/admin files
* images build
* containers start
* networks are valid
* persistent volumes are protected
* PostgreSQL is reachable
* Redis is reachable
* application placeholders or real services respond
* health checks pass

Do not report success when required infrastructure is missing or unhealthy.

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

Verify actual runtime state and provide manual developer instructions.

Never invent:

* ports
* URLs
* container names
* image names
* mount paths
* health status

## Output

Report briefly:

* directories created or preserved
* Docker files created or modified
* Nginx configuration created or modified
* bind mounts configured
* images built
* containers created and running
* networks created
* persistent volumes preserved
* `.gitignore` rules added or preserved
* sensitive paths detected
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
* generate application business logic
* deploy Kubernetes
* deploy AWS infrastructure
* deploy production services

## Final Rule

`docs/infrastucture/docker/docker.md` defines **what** the Docker environment must contain.

Skills implement reusable infrastructure operations.

`/setup-infrastructure` orchestrates directory preparation, Git safety, Docker configuration, mounts, Nginx configuration, validation, testing, review, and verification.
