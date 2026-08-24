# Ensure Project Directories

## Purpose

Ensure the local source directories required by the Docker development environment exist.

## Directories

Ensure:

- `frontend/`
- `admin/`
- `backend/`

Create a missing directory only when necessary.

## Rules

- Never delete an existing source directory.
- Never overwrite existing application files.
- Never scaffold Vue or FastAPI applications.
- Creating the directory is infrastructure preparation only.
- Preserve existing permissions where practical.

## Output

Report:

- directories found
- directories created
- errors