# Docker Infrastructure

## Purpose

Docker is the standard development and deployment environment for Tennis AI Coach.

Use Linux containers and keep services independently deployable.

Detailed setup operations belong in `.claude/commands/setup-infrastructure.md`.

## Services

Required services:

* `client` — Vue 3 user application
* `admin` — Vue 3 admin application
* `api` — FastAPI backend
* `postgres` — PostgreSQL database
* `redis` — cache and realtime state

Add when implemented:

* `realtime` — realtime/WebSocket service
* `vision` — computer vision service
* `worker` — background processing

Do not create one all-in-one application container.

## Images

Use lightweight official Linux images.

Prefer:

* Node image for Vue build
* Python slim image for FastAPI
* official PostgreSQL image
* official Redis image

Use multi-stage production builds where useful.

Do not use full Ubuntu images unless required by system dependencies.

## Structure

```text id="bx2j1k"
infrastructure/docker/
├── Dockerfile.client
├── Dockerfile.admin
├── Dockerfile.api
├── Dockerfile.realtime
├── Dockerfile.vision
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

Also maintain:

```text id="bby0iw"
.dockerignore
.env.example
```

## Development

`docker-compose.dev.yml` must support:

* source mounts
* hot reload
* debugging
* readable logs
* persistent PostgreSQL data

Git is the source of truth for source code.

Containers are disposable execution environments.

## Production

`docker-compose.prod.yml` must:

* use production builds
* avoid source mounts
* expose only required ports
* use environment configuration
* keep services independently scalable

Never mix development assumptions into production configuration.

## Data

PostgreSQL is persistent storage.

Redis is temporary/cache/realtime storage.

Use Docker volumes for persistent local data.

Do not store important data only inside container filesystems.

## Networking

Services communicate through private Docker networks and service names.

Never hardcode container IP addresses.

PostgreSQL and Redis must not be publicly exposed in production.

## Vision / GPU

Vision must remain separate from the API.

Default development must support CPU.

GPU support is optional and isolated to Vision infrastructure.

Do not require GPU support for the rest of the platform.

## Environment

Secrets must come from environment variables.

Use:

```text id="7rvqfd"
.env
.env.example
```

Never commit `.env`.

Never store secrets in Dockerfiles or Compose files.

## Build Flow

```text id="7plqto"
GitHub
→ Source
→ Docker Build
→ Image
→ Container
```

Docker does not replace Git.

Docker infrastructure itself must be version controlled.

## Setup Command

Infrastructure setup is orchestrated by:

`/setup-infrastructure`

The command must read this document before making Docker changes.

It must inspect existing infrastructure before modifying it and must never destroy persistent data without explicit permission.


## Coordination

Coordination: Docker infrastructure is coordinated by the DevOps Agent. 

Docker infrastructure is coordinated by the `devops-agent`.

Setup and maintenance operations are handled by `/setup-infrastructure`.

CI/CD and Kubernetes concerns must be delegated to their specialized agents.


## Rules

* Use Linux containers.
* Keep dev and production separate.
* Prefer small images.
* Use `.dockerignore`.
* Keep secrets outside images.
* Use persistent PostgreSQL volumes.
* Keep Redis and PostgreSQL private in production.
* Keep GPU infrastructure isolated.
* Do not overwrite working infrastructure unnecessarily.

## Goal

Docker must provide a reproducible local environment that can later be used by CI/CD and cloud deployment without redesigning the application architecture.
