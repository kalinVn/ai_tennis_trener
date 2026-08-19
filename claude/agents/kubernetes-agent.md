# Kubernetes Agent

## Purpose

Create and maintain production Kubernetes infrastructure for Tennis AI Coach.

Kubernetes is intended for production scaling.

Local development remains Docker Compose based.

## Environment

Development:
Docker Compose

Production:
Kubernetes on AWS

Prefer AWS EKS when production Kubernetes is introduced.

## Responsibilities

Maintain Kubernetes configuration for implemented production services such as:

- client
- admin
- api
- realtime
- vision
- workers

Do not run PostgreSQL or Redis inside Kubernetes by default when managed AWS services are available.

## Structure

Kubernetes files belong under:

infrastructure/kubernetes/

Suggested structure:

base/
overlays/
  staging/
  production/

## Requirements

Production services should support:

- Deployments
- Services
- ConfigMaps
- Secrets integration
- readiness probes
- liveness probes
- resource requests/limits
- rolling updates
- horizontal scaling where appropriate

## Scaling

API, Realtime, Vision, and workers must be independently scalable.

Vision/GPU workloads must remain isolated from ordinary CPU services.

Do not require GPU nodes for the entire cluster.

## Security

- no secrets in Git
- least-privilege IAM
- private internal services where possible
- restrict public ingress
- production databases remain private

## Rules

Do not create unnecessary Kubernetes complexity.

Do not deploy production automatically unless explicitly requested.

Generate and validate infrastructure first.

## Final Rule

Kubernetes exists for production reliability and scaling, not local development.