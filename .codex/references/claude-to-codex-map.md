# Claude-to-Codex Adaptation Map

## Configuration

- `claude/CLAUDE.md` → active project instructions in root `AGENTS.md`; Codex-specific source routing remains in `.codex/rules/` and this map.
- `claude/PROJECT_STRUCTURE.md` → inventory only, never proof that a listed file exists. Actual files are verified before use, and historical entries such as the removed frontend Progress view must not be restored when absent from current frontend specifications.

## Commands and Orchestration

- `claude/commands/build-frontend.md` → `.codex/commands/build_frontend.md` → `.codex/workflows/new-frontend.md`.
- Empty `claude/commands/update-frontend.md` plus `claude/agents/update-frontend-orchestrator.md` → `.codex/commands/update_frontend.md` → `.codex/workflows/update-frontend.md`.
- Infrastructure commands/agents → `.codex/commands/setup_infrastructure.md`, `.codex/commands/setup_production.md`, `.codex/agents/`, and the maintained `codex/workflows/` implementations.
- `claude/agents/new-frontend-orchestrator.md` → full-build workflow; its Steps 1–3 also back the planning-only `.codex/workflows/frontend-planning.md`.

## Skills

Discoverable Codex adapters live under `.codex/skill-adapters/<skill-name>/SKILL.md` and are linked from `.agents/skills/<skill-name>`. They preserve current project instructions and route to authoritative specifications instead of copying stale examples.

The planning-only debug workflow keeps its detailed planner and validator role contracts at `.codex/skills/plan-new-frontend-design.md` and `.codex/skills/frontend-plan-validator.md`. Their discoverable adapters route to those contracts.

## Rules and References

- Claude's frontend design-system source is read in place through `.codex/rules/frontend-design-system.md`.
- Frontend architecture sources are routed through `.codex/references/frontend-architecture.md`.
- Frontend physical placement is routed through `.codex/references/frontend-project-structure.md`.

## Intentional Non-Copies

- No literal copy of `claude/CLAUDE.md`, `claude/PROJECT_STRUCTURE.md`, or the large design-system file: doing so would create competing maintained configuration.
- No native Claude agent registry emulation: Codex role files and collaboration tools provide the equivalent behavior.
- No direct reuse of stale example route lists, JavaScript-only defaults, or frontend `modules/` placement from older Claude skills; active `AGENTS.md` and `docs/frontend/` override them.
- No invented CI/CD agent: `claude/agents/devops-agent.md` references one that does not exist on disk. Production coordination stays in the verified Codex workflows.

