# Frontend Camera

## Purpose

Manage browser camera access for realtime Tennis AI Coach sessions.

## Responsibilities

Provide reusable functionality for:

- requesting camera permission
- listing/selecting cameras where required
- starting camera capture
- exposing the MediaStream
- displaying live preview
- stopping camera capture
- releasing tracks/resources
- handling permission errors
- handling unavailable devices

Keep camera lifecycle separate from pages.

The Training page should consume the camera abstraction rather than implement raw camera logic itself.

## Rules

Do not perform AI inference.

Do not perform pose estimation.

Do not perform object detection.

Always release camera resources when the session ends or the relevant view is destroyed.

Expose clear states such as:

- idle
- requesting
- ready
- streaming
- error
- stopped