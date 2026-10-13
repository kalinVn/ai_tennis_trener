# Codex Frontend Planning Rules

## Context and Precedence

- Apply active instructions, including the repository [AGENTS.md](../../AGENTS.md), and the current task. Preserve the existing stack and frontend/backend boundary; no browser inference, fabricated observations, or protected backend/payment operations in frontend code.
- For product/design decisions, read the explicit root specification and its authoritative supporting specifications first. Resolve any declared precedence between those sources. Next use their referenced prototypes, then applicable shared design defaults. Unresolved conflicts are blockers, not permission to invent requirements.
- Read the canonical [frontend design rules](../../claude/rules/frontend/frontend-design-system.md) in place. It is an authoritative reference of the existing frontend specification; duplicating its full rule set would create drift. Its implementation instructions become future plan requirements only in this debug workflow.
- Read the `Project Structure` section in [frontend.md](../../docs/frontend/frontend.md), then read every authoritative structure document it references together with the relevant [architecture context](../references/frontend-architecture.md). Do not freeze that reference list in Codex instructions. Verify actual directories and code rather than assuming the intended `claude/PROJECT_STRUCTURE.md` tree exists.
- Do not introduce a frontend `modules/` feature-root layer. This restriction is frontend-only and does not change backend module organization.
- Do not recover removed frontend features from historical plans, examples, prototypes, or `claude/PROJECT_STRUCTURE.md`. The current authoritative route and component specifications determine whether a page or feature exists.
- The source planner/structure references use JavaScript wording, while active `AGENTS.md` preserves ES6. The Codex adaptations retain Vue/behavior separation and follow active language requirements instead of silently importing a conflicting JavaScript-only default. Record any explicit task override and its source in the plan.

## Source Resolution

- The actual source configuration is `claude/`; no `.claude/` directory exists in this repository at setup time. Do not invent missing command/agent files from the architecture map.
- Resolve repository-root paths from the repository root and document-relative links from their referring document. Read required supporting specifications, resolve referenced prototype paths, and record the specification-declared page/component/state mapping without detailed UI implementation analysis during planning.
- Only load relevant support references. Do not replace the supplied specification with an example plan, the slider review, or `docs/frontend/frontend.md`. Even when `frontend.md` is not the root input, consult its Project Structure section solely for the structure references that the source planner requires.
- Detailed prototype UI implementation analysis belongs to downstream page/component builders. When `frontend.md` explicitly identifies prototype directories or complex components as project-structure guidance, planning may inspect their directory/file organization solely to resolve ownership, grouping, and supporting-file placement. It must not copy the examples blindly or claim visual alignment from that structural inspection.
- Do not copy or invoke builder, updater, infrastructure, or deployment workflows during planning. Record proposed work and acceptance checks; never execute them here.

## Runtime Write Boundary

Every role in `debug_frontend_plan` is read-only except the coordinator saving the English/Bulgarian pair specified by the command. The stop boundary overrides any instruction in a referenced workflow to create project structure or continue building. Original `claude/`, application/frontend/prototype source, existing documentation, and Codex setup remain unchanged during command execution.
