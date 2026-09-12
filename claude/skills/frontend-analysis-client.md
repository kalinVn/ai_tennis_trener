# Frontend Analysis Client

## Purpose

Provide the frontend communication boundary with the realtime/Vision backend.

## Responsibilities

Handle:

- connection
- disconnection
- frame transmission
- structured result reception
- connection state
- errors
- reconnect behavior where appropriate

Keep transport implementation isolated from UI components.

The transport may later use WebSocket, WebRTC, HTTP, or another protocol.

Do not couple Training page components directly to a specific transport implementation.

The backend response should be treated as structured analysis data rather than UI markup.