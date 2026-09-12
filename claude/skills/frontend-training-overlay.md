# Frontend Training Overlay

## Purpose

Render realtime analysis information over the live camera preview.

## Future supported data may include:

- body keypoints
- skeleton lines
- elbow positions
- wrist positions
- shoulder positions
- racket position
- ball position
- movement markers
- correction arrows
- warning markers
- coaching annotations

## Rules

Overlay rendering must remain separate from:

- camera capture
- frame preparation
- backend communication
- AI inference

The overlay consumes structured coordinates/results and renders them against the displayed video dimensions.

Account for video scaling and aspect ratio when mapping backend coordinates to screen coordinates.