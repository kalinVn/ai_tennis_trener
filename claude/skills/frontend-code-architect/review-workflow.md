# Frontend Architecture Review Workflow

Follow this sequence and load the supporting file needed for each concern. Base conclusions on inspected code, not an idealized hierarchy.

1. **Inspect similar existing code.** Compare 2–3 relevant components or systems where available and identify established patterns.
2. **Define the feature boundary.** Identify what belongs locally and what is actually shared.
3. **Define responsibilities.** State each class/component's role briefly; flag mixed responsibilities and unnecessary wrappers using [architecture rules](architecture-rules.md).
4. **Define state and resource owners.** Identify the authoritative owner of each state transition, behavior, timeline, listener, timer, and renderer.
5. **Check dependency direction.** Look for cycles, reverse knowledge of controller internals, broad data contracts, and fragile multi-step APIs.
6. **Check lifecycle and failure handling.** Apply [lifecycle and ownership](lifecycle-and-ownership.md), including repeated/async init, destroy during init, play after destroy, pause/cancel distinctions, errors, and idempotent cleanup.
7. **Check duplicate ownership.** Trace successful completion and cancellation; look for competing clocks, state copies, repeated clearing, or multiple cleanup owners.
8. **Check Vue/composable/store placement.** Apply [frontend structure](frontend-structure-and-components.md); distinguish component families from larger feature systems and local state from shared store state.
9. **Check CSS/template contracts where relevant.** Verify selectors, refs, canvas placement, dimensions, and geometry assumptions agree with the template.
10. **Check dead state and dependencies.** Find properties, imports, parameters, and helpers without real consumers; distinguish necessary lifecycle/tween state from leftovers.
11. **Check overengineering.** Consider merging or removing abstractions before recommending another class or layer.
12. **Preserve intended behavior.** Separate required fixes from optional design changes; identify timing, visual, playback, and interaction contracts that must remain stable.
13. **Define validation.** Choose tests and manual checks for the affected contracts, including lifecycle and visual/media behavior when applicable. Report what was actually verified and what remains uncertain.
14. **Propose the smallest architecture change.** Explain what changes, why, affected files, and risks. Respect review-only scope; implement only when the task authorizes it.
