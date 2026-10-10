# debug_frontend_plan

Run the normal new-frontend planning process, save its English plan and a Bulgarian translation, then STOP. This command never authorizes implementation.

## Invocation

Use the repository skill:

```text
$debug-frontend-plan specification_path=docs/frontend/frontend.md
```

Or explicitly ask Codex:

```text
Run .codex/commands/debug_frontend_plan.md with specification_path=<path>.
```

`debug_frontend_plan` is the command name; `debug-frontend-plan` is its Codex skill adapter. A repository `.codex/commands/` Markdown file alone does not register a native slash command. The discovery link under `.agents/skills/` makes the adapter available without changing user-wide Codex configuration.

## Input and Execution

- Receive an explicit `specification_path`, resolving it from the repository root. A task/prototype must be supplied through, or associated with, that specification, as in the normal build command. The example path above is not a fallback when input is absent.
- Read the root `AGENTS.md`, [planning rules](../rules/frontend-planning.md), and [planning workflow](../workflows/frontend-planning.md). Execute that workflow completely, including its independent plan-validation gate and bounded corrections.
- Read required source and specification files without changing them. Resolve and verify referenced prototype paths. Detailed UI implementation analysis remains out of scope, but prototype directory/file organization explicitly referenced by `docs/frontend/frontend.md` for project-structure guidance may be inspected read-only. Do not call the original full build orchestrator: its post-validation steps implement the frontend.
- The only repository writes allowed during command execution are the two output files below and creation of their parent directory. Do not create application directories, scaffold code, install dependencies, run builders, change configuration, fix inspected code, commit, or deploy. Planning future implementation/tests is allowed; executing them is not.

## Output Contract

Use these literal paths relative to the repository root:

```text
docs/debug_plan_outputs/new_frontend_plan_N.md
docs/debug_plan_outputs/new_frontend_plan_BG.md
```

These paths intentionally override the normal planner destination `docs/frontend/plan/new-frontend-plan.md` for this debug-only command. Do not create or update the canonical plan file during a debug run.

`N` is literal, not a counter. Each execution replaces this pair with the current run's English report and translation; it does not create additional history files. Preserve unrelated files and do not run two executions against this fixed pair concurrently.

Both files contain the same complete plan and execution record. If planning is blocked, save the source-supported partial plan or an explicit blocked planning report in both languages; never fabricate a successful plan to satisfy file creation. Filesystem failures must be reported with the actual written/missing paths, not concealed as success.

## Terminal Boundary

After saving and checking both files, report their paths, validation status, correction attempts, warnings/blockers, and translation checks. State that implementation was not started, then end the turn. Do not invoke implementation steps, automatically continue, or request implementation approval as the next step of this command. Implementation requires a separate later user request.
