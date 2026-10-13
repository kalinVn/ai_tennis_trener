# Tennis AI Coach — Codex Compatibility Layer

This directory adapts the maintained `claude/` configuration to Codex without copying stale assumptions or changing the Claude compatibility sources.

Root `AGENTS.md` remains the active instruction source. Current product, route, component, integration, and physical frontend structure contracts remain under `docs/frontend/`.

## Discovery

Discoverable repository skills are linked from `.agents/skills/`:

- `debug-frontend-plan` points to `.codex/skills/debug-frontend-plan/`.
- Claude-compatible skill adapters point to `.codex/skill-adapters/<skill-name>/`.

Each adapter has a valid `SKILL.md`, preserves the source skill's responsibility, and applies current project overrides such as TypeScript, the shallow `frontend/src/` structure, current routes/contracts, and the prohibition on a frontend `modules/` feature-root layer.

Codex does not natively discover `.codex/commands/` or `.codex/agents/` as slash commands/agent registries. Those files are explicit repository contracts:

- `.codex/commands/` validates inputs and routes work.
- `.codex/workflows/` owns frontend orchestration.
- `.codex/agents/` records role mappings for Codex collaboration.
- maintained infrastructure execution remains in `codex/workflows/`, as referenced by `AGENTS.md`.

See [the full source map](references/claude-to-codex-map.md).

## Frontend Commands

### Planning-only debug

```text
$debug-frontend-plan specification_path=docs/frontend/frontend.md
```

The detailed command is [debug_frontend_plan](commands/debug_frontend_plan.md). It runs the real planner, uses an independent validator with bounded corrections, writes the English/Bulgarian pair below, and stops before implementation:

- `docs/debug_plan_outputs/new_frontend_plan_N.md`
- `docs/debug_plan_outputs/new_frontend_plan_BG.md`

### New frontend build

Use [build_frontend](commands/build_frontend.md) with an explicit `specification_path`. It routes to [the new-frontend workflow](workflows/new-frontend.md). Unlike the debug command, implementation is allowed only because the user explicitly requested a build.

### Existing frontend update

Use [update_frontend](commands/update_frontend.md) with an explicit update prompt or specification. It routes to [the scoped-update workflow](workflows/update-frontend.md) and preserves unrelated implementation.

## Infrastructure Commands

- [setup_infrastructure](commands/setup_infrastructure.md) routes to `codex/workflows/setup-infrastructure.md`.
- [setup_production](commands/setup_production.md) routes to `codex/workflows/setup-production.md`.

The Codex workflows are intentionally not overwritten by shorter/older Claude command text. They retain stronger project-resource ownership, persistence, Git-safety, validation, and truthful reporting constraints.

## Source Precedence

For frontend work:

1. active user request
2. supplied task/update specification
3. `docs/frontend/frontend.md` and its declared authoritative supporting specifications
4. referenced prototypes
5. existing project tokens/components
6. shared design defaults in `claude/rules/frontend/frontend-design-system.md`

For execution and safety, active system/developer instructions and root `AGENTS.md` take precedence.

## Intentional Adaptations

- `claude/CLAUDE.md` is represented by `AGENTS.md` and `.codex/configuration/project.md`, not duplicated.
- `claude/PROJECT_STRUCTURE.md` is an inventory map only; repository files are verified.
- The large design-system file is read in place through `.codex/rules/frontend-design-system.md`.
- Current structure comes from `docs/frontend/frontend-project-structure.md`, not older module-based examples.
- The empty Claude update command is replaced by an executable Codex routing contract derived from its update orchestrator.
- A nonexistent Claude `ci-cd-agent` is not fabricated; verified DevOps/production workflows cover that responsibility.
- Detailed planner/validator role files remain under `.codex/skills/*.md` for the debug workflow; discoverable adapters route to them.

## Debug Output Boundary

`debug_frontend_plan` may write only its two literal output files. It never creates the canonical plan, application source, configuration, dependencies, builds, commits, or deployments.

Independent validation requires a separate read-only agent. Missing evidence or a necessary user decision produces a blocked report instead of a fabricated valid plan.
