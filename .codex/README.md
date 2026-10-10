# Frontend Planning Debug Setup

## Use

From this repository, invoke:

```text
$debug-frontend-plan specification_path=docs/frontend/frontend.md
```

The command is [debug_frontend_plan](commands/debug_frontend_plan.md). Its Codex skill adapter lives at `skills/debug-frontend-plan/SKILL.md`; `.agents/skills/debug-frontend-plan` links to that directory for repository discovery. If the skill does not appear in an existing session, start a new Codex session. An explicit path invocation also works: `Run .codex/commands/debug_frontend_plan.md with specification_path=<path>`.

Codex [loads repository skills from `.agents/skills` and supports symlinked skill folders](https://learn.chatgpt.com/docs/build-skills). A repository `.codex/commands/` directory does not itself register native slash commands. [Legacy custom prompts](https://learn.chatgpt.com/docs/custom-prompts) are user-scoped and deprecated; this setup does not install one or alter user-wide configuration.

The source directory here is `claude/`, not `.claude/`. The pre-existing `codex/workflows/` contains infrastructure workflows and remains unchanged. The command name uses the requested underscore; the discoverable skill uses Codex's hyphenated naming convention and displays `debug_frontend_plan` in the selector.

## Outputs and Boundary

Every run publishes these literal paths, replacing the previous pair:

- `docs/debug_plan_outputs/new_frontend_plan_N.md` — English plan and execution record; `N` is literal.
- `docs/debug_plan_outputs/new_frontend_plan_BG.md` — translation of that exact saved English artifact.

The source planner's normal canonical destination is `docs/frontend/plan/new-frontend-plan.md`. The debug command intentionally overrides it with the pair above and must not create or update the canonical plan file.

The output directory is created during setup, but no placeholder plans are generated. Setup is not a planning execution. A run needs an explicit specification; missing inputs or failed validation produce clearly marked blocked/invalid artifacts, not a fabricated successful plan. A failed write/translation is reported as an incomplete run.

```text
Task / Prototype via specification_path
→ normal frontend planner + architecture context
→ complete English implementation plan
→ independent validator (up to two corrections; three validations total)
→ save English plan
→ translate the same saved plan to Bulgarian
→ save Bulgarian plan and verify equivalence
→ STOP
```

The independent validator requires a separate agent. If that capability is unavailable, the command records a blocker instead of substituting self-review. No application directories, source code, configuration, builds, dependency installation, or implementation tests are created/executed by the command. Acceptance tests and Build Order are planned only. These are agent workflow instructions, not an operating-system filesystem sandbox.

## Inspected Source Files and Adaptation

All paths in this table are repository-relative. Originals remain unchanged.

| Inspected source | Codex treatment | Why |
| --- | --- | --- |
| `claude/CLAUDE.md` | Existing root `AGENTS.md` plus `.codex/rules/frontend-planning.md`; no whole-file copy | Preserve stack, product/domain boundaries, progressive context, and truthful validation without duplicating general project instructions. |
| `claude/PROJECT_STRUCTURE.md` | Checked as an intended inventory only | Its `.claude` layout is not the actual filesystem; avoid creating nonexistent roles from the map. |
| `claude/commands/build-frontend.md` | `.codex/commands/debug_frontend_plan.md` | Preserve explicit specification input and new-frontend routing; replace full build with a planning-only terminal boundary. |
| `claude/agents/new-frontend-orchestrator.md` | `.codex/workflows/frontend-planning.md` | Preserve Steps 1–3, independent validation, exact valid-plan return, and bounded corrections; exclude Steps 4–18 implementation. |
| `claude/skills/plan-new-frontend-design.md` | `.codex/skills/plan-new-frontend-design.md` | Retain source resolution, the complete Output Contract, dynamic project-structure references owned by `frontend.md`, structural prototype guidance, and the canonical plan destination. Defer detailed prototype UI analysis to downstream builders and adapt the debug command's output override to Codex boundaries. |
| `claude/skills/frontend-plan-validator.md` | `.codex/skills/frontend-plan-validator.md` | Preserve independent source checking, errors/warnings, unchanged validated plan, and read-only validator boundaries. Adapt reference paths. |
| `claude/skills/frontend-project-structure.md` | `docs/frontend/frontend.md` Project Structure navigation plus its referenced documents | Keep shared frontend structure authority in project documentation; Claude and Codex compatibility files resolve the references owned by `frontend.md` instead of freezing a separate list. |
| `claude/rules/frontend/frontend-design-system.md` | Read in place through `.codex/rules/frontend-planning.md` | Required authoritative visual rules; avoid copying the large maintained defaults/examples document. |
| `claude/skills/frontend-code-architect/frontend-code-architect.md` | Routed through `.codex/references/frontend-architecture.md` | Load the existing architecture entry point in planning context. |
| `claude/skills/frontend-code-architect/architecture-rules.md` | Read-only reference through the same adapter | Responsibilities, dependencies, contracts, reuse, and restraint. |
| `claude/skills/frontend-code-architect/lifecycle-and-ownership.md` | Conditional read-only reference through the same adapter | Resource/state/timeline ownership and asynchronous lifecycle decisions. |
| `claude/skills/frontend-code-architect/frontend-structure-and-components.md` | Read-only reference through the same adapter | Cards/Fields, composables, store separation, feature versus shared placement. |
| `claude/skills/frontend-code-architect/reference-home-page-video-slider.md` | Conditional read-only example through the same adapter | Concrete architecture reference without forcing every feature into that hierarchy. |
| `claude/skills/frontend-code-architect/review-workflow.md` | Plan-level checks through the same adapter | Review ownership, dependencies, placement, CSS contracts, dead state, and unnecessary abstractions without implementing changes. |
| `claude/commands/update-frontend.md` (empty), `claude/agents/update-frontend-orchestrator.md` (role/input and workflow boundary), `claude/skills/update-existing-frontend-design.md` (section/reference scan) | Not copied | Existing-frontend updates are a different workflow, not a substitute for new-frontend planning. |
| `claude/skills/frontend-component-builder.md`, `frontend-page-builder.md`, `frontend-routing.md`, `frontend-responsive-ui.md`, `frontend-code-quality.md` (all under `claude/skills/`) | Inspected downstream roles; not copied or invoked | These implement/review completed code after planning; their build actions and conflicting language defaults must not leak into the debug command. |

Supporting documentation inspected: `AGENTS.md`, `docs/frontend/frontend.md`, the structure documents and organization examples selected by its Project Structure section, `docs/frontend/examples/workflow-examples/build-frontend-workflow.md`, `docs/frontend/examples/workflow-examples/plan-new-frontend-design-example-result.md`, and the existing slider architecture review/reference context. The workflow example confirms the independent gate; the example result illustrates format only and is never used as a generated plan. Runtime records declared prototype mappings without detailed UI implementation analysis; structure examples explicitly selected by `frontend.md` may be inspected only for ownership and grouping. This setup does not copy or freeze shared documentation.

## Added Files and Their Roles

| File | Role |
| --- | --- |
| `.codex/commands/debug_frontend_plan.md` | Named command, input/output contract, allowed writes, terminal STOP. |
| `.codex/workflows/frontend-planning.md` | Real planning/validation orchestration, debug evidence envelope, translation and pair verification. |
| `.codex/skills/plan-new-frontend-design.md` | Adapted planner instructions; a workflow role reference, not a separately registered skill. |
| `.codex/skills/frontend-plan-validator.md` | Adapted independent validation role. |
| `docs/frontend/frontend.md` Project Structure section | Navigation point that owns the current authoritative structure references and prototype organization examples. |
| `.codex/rules/frontend-planning.md` | Project constraints, source precedence/resolution, read-only policy. |
| `.codex/references/frontend-architecture.md` | Progressive routing to existing architecture context. |
| `.codex/skills/debug-frontend-plan/SKILL.md` | Discoverable Codex entry point that executes the named command. |
| `.codex/skills/debug-frontend-plan/agents/openai.yaml` | Command display name and invocation example. |
| `.agents/skills/debug-frontend-plan` | Relative discovery symlink; the only setup entry outside `.codex`. |
| `docs/debug_plan_outputs/.gitkeep` | Track the requested empty output directory without fake plan files. |
| `.codex/README.md` | Invocation, source/adaptation audit, output semantics, and setup boundaries. |
