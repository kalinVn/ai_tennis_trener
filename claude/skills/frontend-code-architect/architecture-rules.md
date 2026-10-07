# Architecture Rules

## Responsibilities

- Give each class one clear responsibility. A class may contain several methods that serve that responsibility.
- Split by responsibility, not by line count. Extract code when it establishes a useful boundary, not merely to shorten a method.
- Controllers coordinate; specialized classes implement rendering, animation, playback, or other focused behavior.
- Avoid god classes that mix unrelated coordination, timing, geometry, rendering, and UI concerns.
- Assign one owner per behavior and one owner per resource. Collaborators may request work through the owner's API; they should not independently manage the same work.

## Dependencies and Contracts

- Make dependency direction clear: coordination calls specialized collaborators, which should not need their caller's internal state.
- Avoid circular dependencies and reverse knowledge of higher-level controllers. Report completion or failure through a narrow contract.
- Pass only the data a collaborator needs instead of an entire controller, elements bag, or feature state object.
- Prefer an atomic operation when a fragile multi-step protocol exposes internal ordering. For example, a complete frame submission can be clearer than public prepare/draw/render calls.
- Remove dead state and dependencies. Keep derived or cached state only when it has a concrete consumer and ownership is clear.

## Boundaries and Abstractions

- Keep feature-specific code local; promote it to shared only when it is actually reused.
- Avoid duplicate ownership disguised as separate classes or wrappers.
- Do not introduce an abstraction for a hypothetical future use. A class, composable, or helper should make an existing responsibility clearer.
- Merge or remove abstractions that only forward calls without providing a useful boundary.
- Do not force every feature into the same controller/timeline/renderer hierarchy.

Use [lifecycle and ownership](lifecycle-and-ownership.md) for resource/state contracts and [frontend structure](frontend-structure-and-components.md) for placement.
