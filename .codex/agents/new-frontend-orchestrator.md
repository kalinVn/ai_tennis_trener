# New Frontend Orchestrator Role

Codex does not load a Claude agent registry. When a new-frontend build is explicitly requested, the primary agent coordinates `.codex/workflows/new-frontend.md` and may delegate independent validation or isolated implementation tasks through Codex collaboration tools.

The coordinator owns input validation, bounded plan correction, dependency order, integration, verification, and truthful reporting. Delegated agents receive narrow scopes and may not bypass the validated plan or expand authorization.

