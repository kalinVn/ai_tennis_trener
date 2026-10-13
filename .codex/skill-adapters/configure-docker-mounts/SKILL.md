---
name: configure-docker-mounts
description: Configure and verify this project's development Docker bind mounts and named-volume boundaries.
---

# Configure Docker Mounts

Use repository-root `codex/workflows/setup-infrastructure.md` and `docs/infrastucture/docker/docker.md` as authority. The shorter source at `../../../claude/skills/configure-docker-mounts.md` is compatibility context only when its paths agree with those sources.

Change development mounts only, preserve source, never mount unrelated host paths, and keep PostgreSQL on its required persistent named volume. Validate host/container paths and actual visibility, then report created/preserved mounts and volumes.

