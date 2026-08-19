# /setup-production

## Purpose

Prepare and maintain production infrastructure for Tennis AI Coach.

This command prepares production scripts and configuration.

It must not perform a live production deployment unless explicitly requested.

## Context

Before work:

1. Read `CLAUDE.md`.
2. Use `devops-agent`.
3. Use `ci-cd-agent` where required.
4. Use `kubernetes-agent` where required.
5. Inspect existing infrastructure.

## Responsibilities

Create or update where required:

.github/workflows/

infrastructure/kubernetes/

production Docker configuration

deployment scripts

environment templates

## Production Flow

Prepare the architecture for:

GitHub
→ CI
→ Production Docker Images
→ Container Registry
→ Kubernetes
→ AWS

## Kubernetes

Prepare manifests/configuration for implemented production services.

Include where appropriate:

- deployments
- services
- ingress
- health probes
- resource limits
- autoscaling
- environment configuration

Do not create unused services.

## CI/CD

Prepare GitHub Actions workflows for:

Pull Request
→ CI

Merge / Release
→ Build Images
→ Registry
→ Production Deployment

Production deployment must remain protected.

## Validation

Validate:

- workflow syntax
- Docker production builds
- Kubernetes configuration
- required environment variables
- secret handling
- service health configuration

## Safety

Never:

- commit secrets
- destroy production resources
- deploy without explicit authorization
- expose databases publicly
- bypass failed CI
- replace working infrastructure unnecessarily

## Output

Report:

- created files
- modified files
- production infrastructure status
- missing credentials/configuration
- unresolved issues
- next deployment step

## Final Rule

Prepare a scalable production system without prematurely introducing unnecessary infrastructure.