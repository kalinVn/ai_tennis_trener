# Verification Infrastructure Workflow

Use after infrastructure testing and code review to inspect the final state and give the developer exact manual verification instructions.

Read `AGENTS.md`, the applicable setup workflow, the active Docker/Compose configuration, and the completed test and review results. Verify expected services, created and running containers, image and container names, exposed ports, and applicable health endpoints. When Docker is involved, use the actual project configuration and runtime state.

Derive every browser URL and port from active configuration. Never invent a URL or port, claim a container is running without checking, or claim an endpoint works without verification. When appropriate, smoke-test the path from browser to frontend to API to database, preferring a real API health endpoint over placeholder artifacts.

Provide short commands using the actual Compose file and project configuration for start, status, logs, stop, and rebuild. Do not modify unrelated application code or destroy persistent data.

Finish with a concise `Verification Report` containing created and running containers, image and container names, status, relevant ports, health status, exact browser/API/API-documentation URLs when available, manual commands, failures, and the next action. Never invent names, status, ports, URLs, or health results.
