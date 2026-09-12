# Tennis AI Coach

## Working agreement

Inspect existing code before changing it, load only task-relevant context, preserve working behavior, and do not rewrite unrelated code. Treat `claude/PROJECT_STRUCTURE.md` as an intended architecture map rather than proof that listed files exist; verify the repository first.

Use progressive context loading:

```text
AGENTS.md → task → relevant `codex/workflows/` file → relevant documentation → relevant code
```

## Product architecture

The realtime pipeline is:

```text
Camera → Vision Engine → Structured State → Coach Engine → Instruction → Audio
```

Keep perception (what is happening) separate from coaching (what the player should do). Do not put an LLM in the per-frame path. Prefer lightweight ML for pose, ball, racket, and court perception, and deterministic logic for tracking, geometry, trajectory, state, and coaching decisions. Never fabricate low-confidence observations or advice.

Preserve the stack unless a change is explicitly justified: Vue 3, TypeScript, Vite, Pinia, Vue Router; Python, FastAPI, Pydantic; PostgreSQL, SQLAlchemy, Alembic; Redis; S3-compatible storage; WebSockets; Stripe; Docker/Compose; Kubernetes on AWS; GitHub Actions. Authentication supports email/password, Google, Apple, and 2FA.

## System rules

- PostgreSQL is the persistent source of truth; use Redis only for cache and temporary/realtime state and object storage for large binaries.
- Enforce authorization server-side, never store plaintext passwords, and keep secrets out of source control.
- Verify Stripe webhooks and make them idempotent.
- Treat latency as a first-class requirement and preserve contracts between domains.
- Keep Vision/GPU workloads isolated from ordinary CPU services.
- Use Docker Compose for local development and Kubernetes only for production scaling.
- Never deploy production, destroy persistent data, or delete volumes without explicit authorization.
- A requested complete local infrastructure rebuild may replace only disposable resources belonging to this project; preserve persistent data and any resource whose ownership or persistence is uncertain.
- Infrastructure workflows may prepare Dockerfiles and service definitions before application source exists, but must never scaffold application code. Report unavailable application services as `PENDING APPLICATION BUILD` and continue validating runnable infrastructure.

Before implementation, determine affected domains and inspect their code and documentation. Afterward, validate contracts, run relevant tests, check security and applicable realtime performance, and update affected documentation. Never disable tests to obtain a passing build; fix root causes.

Prioritize correctness, security, latency, reliability, maintainability, scalability, then cost. Prefer simple, measurable, tested solutions.

## Project workflows

- For cross-cutting delivery, AWS, CI/CD, Docker, or Kubernetes coordination, read `codex/workflows/manage-devops.md`.
- For Docker setup or maintenance, read `codex/workflows/setup-infrastructure.md`.
- For affected infrastructure tests, read `codex/workflows/testing-infrastructure.md`.
- For infrastructure-only review after testing, read `codex/workflows/code-review-infrastructure.md`.
- For final runtime and manual verification, read `codex/workflows/verification-infrastructure.md`.
- For production infrastructure and CI/CD preparation, read `codex/workflows/setup-production.md`.
- For Kubernetes-specific work, read `codex/workflows/manage-kubernetes.md`.

Source Claude configuration remains under `claude/` for compatibility and must not be modified as part of Codex work, except for these narrowly scoped synchronizations:

- Codex may update `claude/skills/frontend-project-structure.md` when synchronizing it with the approved frontend structure in `docs/frontend/frontend.md`.
- Codex may update only the Inputs and Source Priority in `claude/skills/implement-new-frontend-design.md` when synchronizing them with `docs/frontend/frontend.md`.
- Codex may update only Step 1 in `claude/skills/implement-new-frontend-design.md` to specify that this project's frontend requirements come from `docs/frontend/frontend.md`, with Application Purpose sourced from `Purpose` and Required Pages sourced from `Required Pages and Routes`.
- Codex may update only Step 8 in `claude/skills/implement-new-frontend-design.md` when synchronizing its feature-component selection rules with the `Feature Components` section in `docs/frontend/frontend.md`.
- Codex may update only Step 7 in `claude/skills/implement-new-frontend-design.md` when synchronizing its shared-component selection rules with the `Shared UI Requirements` section in `docs/frontend/frontend.md`.
- Codex may update `claude/agents/new-frontend-orchestrator.md` when synchronizing its execution order with the approved workflow in `docs/frontend/examples/build-frontend-workflow.md`.

No other files or changes under `claude/` are permitted through these exceptions.
