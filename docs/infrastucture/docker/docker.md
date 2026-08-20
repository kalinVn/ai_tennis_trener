# Docker Infrastructure

## Purpose

Define the Docker architecture for Tennis AI Coach.

Docker provides the reproducible local development environment for application and infrastructure services.

Use Linux containers.

Operational setup, rebuild, validation, and verification belong in:

`.claude/commands/setup-infrastructure.md`

## Service Architecture

Each major application component must remain independently containerized.

Required services when implemented:

- `client` — Vue 3 user application
- `admin` — Vue 3 admin application
- `api` — FastAPI backend
- `postgres` — PostgreSQL database
- `redis` — cache and realtime state

Additional services when implemented:

- `realtime` — realtime/WebSocket service
- `vision` — computer vision service
- `worker` — background processing

Do not create one all-in-one application container.

PostgreSQL and Redis alone do not constitute a complete development environment.

If `client`, `admin`, or `api` exist in the repository, they must have corresponding Docker services and containers.

## Container Architecture

Expected base topology:

```text
Browser
   │
   ├──→ client
   │      │
   │      └──→ api
   │
   └──→ admin
          │
          └──→ api

api
 ├──→ postgres
 └──→ redis
```
