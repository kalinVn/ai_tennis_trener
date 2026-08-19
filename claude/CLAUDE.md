# CLAUDE.md

# Tennis AI Coach

## Purpose

Tennis AI Coach is a commercial subscription-based platform that observes a tennis player through a camera and provides low-latency coaching through headphones.

Claude must:
1. Read this file before significant work.
2. Inspect existing code before modifying it.
3. Load only documentation relevant to the current task.
4. Use specialized agents when appropriate.
5. Preserve existing architecture unless change is justified.

Detailed knowledge belongs in `docs/`, `.claude/agents/`, `.claude/rules/`, and `.claude/skills/`.

---

## Architecture

Core realtime pipeline:

```text
Camera
→ Vision Engine
→ Structured State
→ Coach Engine
→ Instruction
→ Audio
```

Vision answers: **What is happening?**

Coach Engine answers: **What should the player do?**

Keep perception and coaching logic separate.

Major domains:

- Client
- Admin
- API / Auth / Payments
- Realtime
- Vision
- Coach Engine
- Training
- Analysis
- Audio

---

## Technology

Frontend:
- Vue 3 + TypeScript
- Vite
- Pinia
- Vue Router

Backend:
- Python
- FastAPI
- Pydantic

Data:
- PostgreSQL
- SQLAlchemy + Alembic
- Redis
- S3-compatible object storage

Platform:
- WebSockets
- Stripe
- Docker + Docker Compose
- kubernetes
- aws
- github action

Authentication:
- Email/password
- Google
- Apple
- 2FA



Do not replace core technologies without justification.

---

## Docker


Docker configuration belongs in:

`infrastructure/docker/`

Detailed instructions:

`docs/infrastructure/docker.md`

---

## Realtime & AI

Latency is a first-class requirement.

Use lightweight ML models primarily for perception:

- pose
- ball
- racket
- court

Prefer deterministic algorithms where practical for:

- tracking
- geometry
- trajectory
- rally state
- stroke state
- coaching decisions

Do not put an LLM in the per-frame realtime path.

Never fabricate vision data or coaching decisions when confidence is insufficient.

---

## Security & Data

Never commit secrets or expose credentials.

Never store plaintext passwords.

Authorization must be enforced server-side.

Stripe webhooks must be verified and idempotent.

PostgreSQL is the persistent source of truth.

Redis is for cache and temporary/realtime state.

Large videos and binary files belong in object storage.

---

## Agents

Agents live in `.claude/agents/`.

Use the appropriate specialized agent for each task.

Core agents cover:

- architecture
- frontend
- backend
- auth
- database
- payments
- admin
- vision
- realtime
- tennis coaching
- training
- analysis
- audio
- security
- testing
- performance
- devops
- kubernetes
- ci/cd
- code review
- testing
- verification


Agents must respect domain boundaries and shared contracts.

---

## Commands

Commands live in `.claude/commands/`.

Primary commands:

- `/build-up`
- `/update-app`
- `/analyze-project`
- `/code-review`
- `/refactor`
- `/fix-errors`
- `/run-tests`
/

`/build-up` orchestrates major implementation work.

`/update-app` applies changes to the existing application.
- `/setup-infrastructure` 
- `/setup-production` 
---

## Context

Load context progressively:

```text
CLAUDE.md
→ Task
→ Relevant Agent
→ Relevant Rules / Skills
→ Relevant Docs
→ Relevant Code
```

Never load the entire documentation tree unnecessarily.

---

## Development Rules

Before implementation:

- understand the task
- inspect existing code
- identify affected domains
- load relevant context

After implementation:

- validate contracts
- run relevant tests
- check security
- check realtime performance when applicable
- update affected documentation

Never rewrite unrelated working code.

Never disable tests just to make a build pass.

Fix root causes.

---

## Priorities

Prioritize:

**Correctness → Security → Latency → Reliability → Maintainability → Scalability → Cost**

Prefer:

**simple → measurable → tested → improved**

Build a production system, not a demo.