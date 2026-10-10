# Codex Frontend Planning Rules

## Context and Precedence

- Apply active instructions, including the repository [AGENTS.md](../../AGENTS.md), and the current task. Preserve the existing stack and frontend/backend boundary; no browser inference, fabricated observations, or protected backend/payment operations in frontend code.
- For product/design decisions, read the explicit root specification and its authoritative supporting specifications first. Resolve any declared precedence between those sources. Next use their referenced prototypes, then applicable shared design defaults. Unresolved conflicts are blockers, not permission to invent requirements.
- Read the canonical [frontend design rules](../../claude/rules/frontend/frontend-design-system.md) in place. It is an authoritative reference of the existing frontend specification; duplicating its full rule set would create drift. Its implementation instructions become future plan requirements only in this debug workflow.
- Read the canonical [frontend project structure](../../docs/frontend/frontend-project-structure.md) and [architecture context](../references/frontend-architecture.md). Verify actual directories and code rather than assuming the intended `claude/PROJECT_STRUCTURE.md` tree exists.
- The source planner/structure references use JavaScript wording, while active `AGENTS.md` preserves ES6. The Codex adaptations retain Vue/behavior separation and follow active language requirements instead of silently importing a conflicting JavaScript-only default. Record any explicit task override and its source in the plan.

## Source Resolution

- The actual source configuration is `claude/`; no `.claude/` directory exists in this repository at setup time. Do not invent missing command/agent files from the architecture map.
- Resolve repository-root paths from the repository root and document-relative links from their referring document. Read required referenced layouts, routes, components, prototype catalogs, and dedicated navigation prototypes when the supplied specification declares them.
- Only load relevant support references. Do not replace the supplied specification with an example plan, the slider review, or `docs/frontend/frontend.md` unless that is the explicit input.
- Prototype markup/CSS and sample logic explain visual intent and behavior; they are not automatically production architecture. Report unavailable visual inspection rather than claiming visual alignment.
- Do not copy or invoke builder, updater, infrastructure, or deployment workflows during planning. Record proposed work and acceptance checks; never execute them here.

## Runtime Write Boundary

Every role in `debug_frontend_plan` is read-only except the coordinator saving the English/Bulgarian pair specified by the command. The stop boundary overrides any instruction in a referenced workflow to create project structure or continue building. Original `claude/`, application/frontend/prototype source, existing documentation, and Codex setup remain unchanged during command execution.
