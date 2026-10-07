# Lifecycle and Ownership

## Initialization and Destruction

- Define what `init()` creates and when the instance becomes ready to use.
- Define repeated and concurrent initialization behavior: reuse an existing initialization or reject the call clearly; do not silently replace live resources.
- Account for asynchronous initialization. If destruction occurs while initialization is pending, late completion must release acquired resources and must not start playback, timers, or listeners.
- Prevent `play()` or late callbacks from reviving a destroyed instance.
- Make `destroy()` idempotent: repeated calls must not release the same resource twice.
- Distinguish resource readiness from a pending disposal request. Do not remove state needed to handle asynchronous cleanup merely to reduce property count.

## Operation Semantics

Define these operations explicitly where they are needed; do not add all of them to every class for symmetry:

| Operation | Intended distinction |
| --- | --- |
| `pause` / `resume` | Suspend and continue work while preserving progress. |
| `stop` | End active execution; state whether progress and output are retained or reset. |
| `clear` | Remove current output/state; specify whether associated work is also cancelled. |
| `cancel` | Abandon current work without reporting successful completion. |
| `destroy` | Release owned resources and end the instance's usable lifetime. |

## State, Timelines, and Completion

- Keep one authoritative owner for each state transition. Avoid independent flags or copies that can disagree about whether work is active, complete, or cancelled.
- Give each timeline a clear owner for construction, start, pause/resume, replacement, and destruction.
- Kill obsolete timelines before replacing them. A nested animation should be driven by its owning phase rather than by competing playback controls.
- Separate phase duration from animation duration when they mean different things; define their relationship instead of assuming they always match.
- Give successful completion and cancellation explicit paths. Clear output once through its owner; do not clear or destroy it again at every layer of a callback chain.

## Error Policy

- Keep global failure policy with the top-level coordinator. Specialized collaborators handle local failures or report them upward through a narrow API.
- Distinguish a local failure from a failure that stops the whole feature. State which resources, clocks, and UI are affected.
- Independent supporting UI may continue through a normal feature pause without being exempt from global failure or destruction.
- Reset authoritative state and affected UI consistently on cancellation/error; an early return must not leave stale active output.

## Resource Cleanup

- The creator/owner is responsible for releasing listeners, timers, intervals, observers, timelines, and rendering resources.
- Abort or remove listeners and disconnect observers; clear timer handles; kill owned timelines and prevent their callbacks from acting after disposal.
- Keep Pixi/WebGL destruction in the renderer's `destroy()` method. If initialization finishes after cancellation, route cleanup through that method rather than duplicating low-level destruction in `init()`.
- A parent coordinates child teardown; each child releases its own resources. This is different from several classes independently releasing the same resource.
