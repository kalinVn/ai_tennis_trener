# Frontend Frame Processing

## Purpose

Prepare camera frames for transmission to the backend/Vision service.

## Responsibilities

Support:

- controlled frame capture
- resizing
- optional compression
- encoding
- configurable frame rate
- configurable dimensions
- configurable quality

Prefer reducing frames before network transmission.

Do not perform AI inference.

Do not convert to grayscale by default.

Do not hardcode final production values without measurement.

The initial implementation should make frame rate, dimensions, and quality easy to tune.

Prevent uncontrolled frame queues.

If processing or network transmission falls behind, prefer dropping stale frames rather than building an ever-growing backlog.