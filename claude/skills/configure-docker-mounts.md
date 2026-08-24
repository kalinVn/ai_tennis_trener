# Configure Docker Mounts

## Purpose

Configure development bind mounts between local project directories and Docker application services.

## Required Mapping

Use:

- `frontend/` → `client:/usr/share/nginx/html/frontend`
- `admin/` → `admin:/usr/share/nginx/html/frontend`
- `backend/` → `api:/usr/share/nginx/html/backend`

Use another container path only when required by the corresponding Dockerfile.

## Data Services

Do not use application-source bind mounts for:

- PostgreSQL
- Redis

PostgreSQL must use a persistent named Docker volume.

Redis may use a named volume when persistence is required.

## Rules

- Configure bind mounts only in development infrastructure.
- Do not use development source mounts in production.
- Preserve existing valid Compose configuration.
- Never mount unrelated host directories.
- Never delete source files while configuring mounts.

## Validation

Verify that:

- host directories exist
- Compose paths are valid
- containers receive the expected mounts
- source changes can be reflected through the mount

## Output

Report:

- mounts created
- mounts preserved
- named volumes used
- validation result