# Docker Infrastructure

## Purpose

Define the Docker architecture and requirements for the Tennis AI Coach local development environment.

This document is the source of truth for Docker infrastructure.

Operational setup and rebuild logic belongs in:

`claude/commands/setup-infrastructure.md`

The equivalent Codex execution workflow is:

`codex/workflows/setup-infrastructure.md`

## Services

The local environment must provide these services:

- `client` — Vue 3 user application
- `admin` — Vue 3 admin application
- `api` — FastAPI backend
- `postgres` — PostgreSQL database
- `redis` — cache and realtime state

Add only when implemented:

- `realtime`
- `vision`
- `worker`

Each major application component must run as an independent service.

Do not create one all-in-one application container.

PostgreSQL and Redis alone do not constitute a complete local development environment.

## Container Architecture

Expected base topology:

```text
Browser
   │
   ├──→ client
   │       │
   │       └──→ api
   │
   └──→ admin
           │
           └──→ api

api
 ├──→ postgres
 └──→ redis
```

## Infrastructure Git Safety

Local infrastructure setup must create or safely update the root `.gitignore`. Preserve valid existing and user-defined rules, add missing protections idempotently, and never replace the file wholesale when merging rules is sufficient.

The root `.gitignore` must protect local environment files, secrets, credentials, private and SSH keys, private-key containers, credential directories, dependency directories, Node build and cache artifacts, Python virtual environments and caches, test and coverage artifacts, logs, temporary files, local runtime data, appropriate IDE-local files, and OS-generated files.

Patterns must be narrow enough not to hide application source, project documentation, Dockerfiles, Docker Compose files, required infrastructure configuration, or public example configuration. In particular, `.env` and `.env.*` must be ignored while `.env.example` remains eligible for Git tracking.

During setup, inspect filenames and Git tracking status for potentially sensitive files. Report their paths without reading, printing, staging, deleting, or otherwise exposing their contents. Ignore rules do not protect a file that is already tracked, so flag tracked sensitive files for explicit remediation.
