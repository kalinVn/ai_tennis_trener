# Docker Infrastructure

## Purpose

Define the Docker architecture and requirements for the Tennis AI Coach local development environment.

This document is the source of truth for Docker infrastructure.

Operational setup and rebuild logic belongs in:

`.claude/commands/setup-infrastructure.md`

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
