# Frontend Code Architect

## Purpose

Determine where frontend code belongs and how Vue components, controllers, timelines, renderers, composables, and stores should interact. Review existing architecture before proposing changes, and prefer established project patterns unless there is a concrete reason to change them.

## Core Principles

- Give each class a clear responsibility; split by responsibility, not line count.
- Assign one owner to each behavior, resource, and authoritative state.
- Let controllers coordinate specialized collaborators through narrow contracts and clear dependency direction.
- Keep related code within its feature boundary; promote code to shared only when actually reused.
- Prefer small, coherent APIs over fragile call sequences and duplicate ownership.
- Preserve intended behavior and choose the smallest useful change. Remove dead code and unnecessary abstractions instead of adding layers by default.

## Supporting Files

Start with the [review workflow](review-workflow.md), then load the references relevant to the task:

- [Architecture rules](architecture-rules.md): responsibilities, dependencies, contracts, and abstraction boundaries.
- [Lifecycle and ownership](lifecycle-and-ownership.md): state, initialization, failure, completion, and resource cleanup.
- [Frontend structure and components](frontend-structure-and-components.md): Cards, Fields, composables, stores, and feature directories.
- [Home Page Video Slider reference](reference-home-page-video-slider.md): a concrete example, not a required hierarchy for every feature.
