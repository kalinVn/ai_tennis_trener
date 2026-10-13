---
name: frontend-plan-validator
description: Independently validate a proposed new-frontend plan against its original specification and authoritative references.
---

# Frontend Plan Validator

Use the read-only validator contract at repository-root `.codex/skills/frontend-plan-validator.md`. Require both `specification_path` and the complete `frontend_plan`.

Read raw sources independently. Return the structured result without correcting the plan or editing files. A valid result must contain the exact unchanged submitted plan.

