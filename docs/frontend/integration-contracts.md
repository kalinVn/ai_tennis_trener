# Frontend Integration Contract Examples

These are proposed frontend-facing contract examples so pages and services can be planned and tested consistently. They are not evidence that backend endpoints or providers already exist. Backend owners must implement or explicitly adapt them before live integration. Keep authorization, session validity, analysis, persistence, coaching decisions, and payment verification on the server/provider.

## Shared response and error shape

Successful JSON responses use the resource-specific shape below. Failed requests use:

```json
{
  "error": {
    "code": "SESSION_EXPIRED",
    "success": false,
    "message": "Your session has expired.",
    "requestId": "opaque-server-generated-id",
    "retryable": false,
    "errors": {}
  }
}
```

`message` is safe to display; clients must branch on `code`, never parse message text. `errors` is optional. Do not expose stack traces, tokens, provider secrets, or internal diagnostics.

## Authentication and application session

Use same-origin HTTPS requests and an HttpOnly, Secure, SameSite session cookie. The browser does not persist access or refresh tokens in local storage. State-changing cookie-authenticated requests require the backend's CSRF protection. The backend remains authoritative for authentication and authorization.

Example endpoints:

- `POST /api/v1/auth/login` — `{ "email": "player@example.com", "password": "…" }`; responds with `{ "user": { "id": "…", "displayName": "…" }, "session": { "expiresAt": "…" } }`, or a multi-factor challenge `{ "challengeId": "…", "methods": ["totp"] }`.
- `POST /api/v1/auth/register` — validated registration fields; returns the authenticated user/session or a verification-required state.
- `POST /api/v1/auth/challenges/{challengeId}/verify` — verifies the selected second factor; challenge ids expire and are single-use.
- `GET /api/v1/auth/session` — returns `{ "authenticated": true, "user": { "id": "…", "displayName": "…" }, "session": { "expiresAt": "…" } }` or `{ "authenticated": false }`.
- `POST /api/v1/auth/logout` — invalidates the server session and clears its cookie.
- Google and Apple sign-in use backend-owned OAuth authorization/callback flows with state and nonce validation; the frontend handles redirect, pending, cancelled, and recoverable failure states. It never handles provider client secrets.

A protected request returning `401` clears local session state and returns to the Login page while preserving a validated internal `returnTo`. A `403` is an authorization failure and must not be treated as logged out. A session lookup network failure is `unavailable`, not signed out.

## Training session and analysis transport

Example REST operations:

- `POST /api/v1/training/sessions` creates a session and returns `{ "sessionId": "…", "status": "ready", "analysisWebSocketUrl": "wss://…" }`.
- `POST /api/v1/training/sessions/{sessionId}/complete` ends the session. The example request is `{ "feedbackEventIds": ["server-event-id-1", "server-event-id-2"], "lastContiguousFeedbackSequence": 2 }`; IDs must refer to server-issued feedback events received for this session. The server validates ownership, deduplicates IDs, verifies contiguous coverage through its final feedback sequence, and returns `{ "sessionId": "…", "status": "complete", "completedAt": "…", "finalFeedbackSequence": 2, "summary": { "successfulStrokes": 1, "detectedMistakes": 0, "recommendations": [] } }`. The operation is idempotent for the same session and feedback-event set.
- `POST /api/v1/training/sessions/{sessionId}/abandon` ends it as incomplete. This operation is also idempotent.

The authenticated WebSocket URL is short-lived and issued by the backend; the frontend does not construct it from an untrusted host. The example wire protocol sends JSON frame metadata immediately before the matching binary JPEG message:

```json
{ "type": "frame", "frameId": "…", "capturedAt": "…", "mimeType": "image/jpeg", "width": 640, "height": 360 }
```

Server-to-client text messages use a versioned envelope:

```json
{
  "version": 1,
  "type": "analysis_result",
  "sessionId": "…",
  "frameId": "…",
  "occurredAt": "…",
  "payload": {
    "confidence": 0.91,
    "playerPosition": null,
    "ballPosition": null,
    "stroke": null,
    "coachingCue": null
  }
}
```

`analysis_result` may contain only observations the server supports. Nullable or omitted fields mean unavailable; they are never synthesized by the client. For the proposed fixture contract, positions use normalized frame coordinates `{ "x": 0.5, "y": 0.5 }` with origin at the top-left and bounds `[0, 1]`; confidence is in `[0, 1]`, and timestamps are UTC ISO-8601 strings. The backend must confirm or adapt these semantics before overlays are enabled. The client discards results for stopped sessions and ignores results older than the latest accepted frame.

Additional server message types are `analysis_started`, `analysis_unavailable`, `player_feedback`, `coaching_audio`, `analysis_error`, and `session_status`. A `player_feedback` event uses server-issued identity and contains only supported feedback:

```json
{
  "version": 1,
  "type": "player_feedback",
  "sessionId": "…",
  "payload": {
    "eventId": "…",
    "sequence": 43,
    "strokeId": "…",
    "kind": "successful_stroke|detected_mistake|recommendation",
    "occurredAt": "…",
    "confidence": 0.91,
    "text": "…"
  }
}
```

`confidence` is in `[0, 1]`; `text` may be absent. `sequence` is a positive, monotonically increasing integer scoped to one training session's feedback stream. It starts at `1`, is never reused, and remains identical when an event is replayed. `eventId` is also stable across replay. The frontend stores events by `eventId`, ignores an exact duplicate with the same sequence and content, treats a conflicting duplicate as a protocol error, and tracks supported successful strokes, mistakes, and recommendations without inventing any.

### Feedback ordering, replay, and catch-up

The following fixture contract is authoritative for frontend planning and tests until backend/product owners either adopt it or replace it with a versioned equivalent:

1. The client tracks `lastContiguousFeedbackSequence`, not merely the largest sequence observed. Sequence `n` advances that cursor only after every event from `1` through `n` is present. A later event is held in a bounded buffer while a gap exists and is not included in completion.
2. After reconnecting with a new backend-issued WebSocket URL for the same active `sessionId`, the client sends:

```json
{ "version": 1, "type": "resume_session", "sessionId": "…", "afterFeedbackSequence": 42 }
```

3. The server snapshots the replay high-water mark and responds with `replay_started`, replays the missing `player_feedback` events in strict sequence order, and finishes with `replay_complete`:

```json
{ "version": 1, "type": "replay_started", "sessionId": "…", "afterFeedbackSequence": 42, "throughFeedbackSequence": 57 }
{ "version": 1, "type": "player_feedback", "sessionId": "…", "payload": { "eventId": "…", "sequence": 43, "strokeId": "…", "kind": "recommendation", "occurredAt": "…", "confidence": 0.91, "text": "…" } }
{ "version": 1, "type": "replay_complete", "sessionId": "…", "throughFeedbackSequence": 57 }
```

The server does not interleave newer live feedback before `replay_complete`; subsequent live events continue at `58` or higher. A replay with no missing events still sends both boundary messages with equal `afterFeedbackSequence` and `throughFeedbackSequence`. Receiving a sequence greater than `lastContiguousFeedbackSequence + 1` triggers the same `resume_session` request from the current contiguous cursor. The client uses bounded exponential backoff for transport retries and a bounded out-of-order buffer; exceeding either bound presents an explicit incomplete/disconnected state rather than dropping the gap.

The server may also send `{ "version": 1, "type": "feedback_checkpoint", "sessionId": "…", "latestFeedbackSequence": 57 }`. The checkpoint contains no feedback data; it lets the client determine whether its contiguous cursor is current. `replay_complete.throughFeedbackSequence` is the required checkpoint after every reconnect.

If replay is no longer available, the server returns:

```json
{ "version": 1, "type": "replay_unavailable", "sessionId": "…", "reason": "retention_expired|session_closed", "reviewAvailable": true }
```

The client then loads `GET /api/v1/training/sessions/{sessionId}/review`, whose persisted events include their original `eventId` and `sequence`, and rebuilds the same contiguous set. If neither replay nor a complete canonical review is available, feedback remains explicitly incomplete and the client does not claim successful completion.

On completion the client sends the contiguous event IDs and cursor in the request above. If the server has persisted a later sequence or detects any missing identity, it rejects the request with HTTP `409` and the shared error code `FEEDBACK_CATCH_UP_REQUIRED`:

```json
{
  "error": {
    "code": "FEEDBACK_CATCH_UP_REQUIRED",
    "message": "Feedback catch-up is required before completion.",
    "retryable": true,
    "details": {
      "resumeAfterFeedbackSequence": 42,
      "expectedThroughFeedbackSequence": 57
    }
  }
}
```

The client performs replay or canonical-review reconciliation and retries the idempotent completion request. The server never silently accepts an incomplete event set. `GET /api/v1/training/sessions/{sessionId}/review` returns the persisted events, their stable identities and sequences, and the canonical summary. If the backend instead owns completion without a client event handoff, it must explicitly adopt that alternative and return the same canonical review data.

`coaching_audio` may contain a safe display `text` and an authenticated, expiring audio resource URL; audio may be absent. It includes `instructionId` and a priority so the client can stop/replace playback deterministically. Playback failure is local UI state and does not change analysis/session truth.

The client sends `{ "version": 1, "type": "stop_analysis", "sessionId": "…" }` before closing the socket. Stop aborts capture immediately and prevents any later frame sends. Socket close, tab suspension, permission loss, and recoverable errors transition to explicit unavailable/disconnected states. Reconnect is allowed only while the session is active, uses backend-issued credentials, keeps the same `sessionId`, and follows the feedback resume protocol above; it must not silently create a second session. The inspected prototype's binary JPEG/WebSocket events remain visual/behavioral reference, not an approved production schema.

## Session History, Session Review, and Progress data

- `GET /api/v1/training/sessions?cursor={opaqueCursor}&limit={1..50}` returns `{ "items": [{ "id": "…", "startedAt": "…", "durationSeconds": 0, "status": "complete|incomplete", "summary": null }], "nextCursor": null }`.
- `GET /api/v1/training/sessions/{sessionId}/review` returns the authorized session summary, persisted server-issued feedback events, their canonical successful-stroke/mistake/recommendation summary, supported metrics, and optional key moments. Each measurement includes a value, unit, time range, and provenance/confidence as defined by the server. Missing evidence is `null` with an availability reason; the UI does not infer a result.
- `GET /api/v1/progress` returns the backend-selected default range. An optional `from` and `to` pair of ISO dates may be supplied only if a later product requirement adds a range control. It returns `{ "range": { "from": "…", "to": "…" }, "measurements": [], "focus": null, "availability": "insufficient_data" }`. Supported measurements include stable identifiers, display labels, units, time buckets, and server-computed values. `focus` is backend-provided or null; frontend code does not generate coaching advice.

History, Review, and Progress distinguish loading, empty, success, partial/insufficient-data, recoverable-error, and unavailable states. A successful empty result is not an error. Stale cached values, if later supported, must be labeled and must not replace a more recent server result.

## Checkout and billing

The frontend sends plan identifiers, never amounts or card credentials, to the backend:

- `POST /api/v1/billing/checkout-sessions` with `{ "planId": "performance", "returnPath": "/subscription" }` returns `{ "checkoutUrl": "https://provider.example/…", "checkoutSessionId": "…" }`.
- `GET /api/v1/billing/checkout-sessions/{checkoutSessionId}` returns a server-verified state: `pending`, `succeeded`, `cancelled`, `failed`, or `expired`, with safe display text. Query parameters or browser redirects alone never prove payment success.
- `GET /api/v1/billing/subscription` returns current plan/status/renewal display data or an explicit unavailable state.
- `POST /api/v1/billing/customer-portal-sessions` returns a short-lived provider-hosted `portalUrl`.

The provider hosts payment fields and receives card data. The backend verifies provider callbacks/webhooks idempotently and remains the source of truth. The frontend handles redirect pending, return verification, cancellation, payment failure, expiration, network recovery, and unavailable billing without storing or transmitting raw card data.

## Contract adoption

Backend and product owners must confirm endpoint names, required fields, units, bounds, retention, authentication, rate limits, idempotency, feedback-event provenance and completion handoff, and error mappings before connecting live services. Until then, frontend tests may use fixtures matching these examples, and the UI must label prototype/sample content honestly.

## Dashboard, profile, and settings data

- `GET /api/v1/dashboard` returns server-authorized overview data: `{ "recentSessions": [], "progressSummary": null, "nextFocus": null }`. Each item retains its source id and timestamp. Empty collections are valid; the client does not derive a recommendation from raw metrics.
- `GET /api/v1/users/me` returns editable profile fields and read-only account fields separately. `PATCH /api/v1/users/me` accepts only the backend-declared writable fields and returns the normalized saved representation plus field validation errors when applicable.
- `GET /api/v1/users/me/preferences` returns the user's persisted settings. `PATCH /api/v1/users/me/preferences` accepts only declared preference fields and returns the saved values. Unsupported browser capabilities are reported by the client as unavailable and are not sent as if enabled.

All three use the shared error envelope and authenticated session. Update actions are disabled while pending, preserve the last confirmed server values on recoverable failure, and report field validation separately from transport failure.

## Page state and recovery matrix

| Surface | Empty / insufficient data | Recoverable failure | Unavailable / disconnected | Recovery |
| --- | --- | --- | --- | --- |
| Dashboard | No sessions or supported focus; show an honest empty state | Keep no unsaved data; show retry | Keep the page shell and explain data cannot be loaded | Retry dashboard request; links to Training and History remain available |
| History | Empty session list | Preserve current page/cursor and offer retry | Explain history is unavailable | Retry current list request; do not invent rows |
| Session Review | Unknown, unauthorized, or no review result uses the documented safe not-found/insufficient state | Show retry while preserving the session route | Explain the review service is unavailable | Retry review request; return to History is always available |
| Progress | `insufficient_data` or no measurements | Preserve selected range and offer retry | Explain progress data is unavailable | Retry the same range; no client-generated focus |
| Training | No analysis data is a waiting state, not a zero-valued result | Stop sending when transport fails; show reconnect/stop controls | Distinguish camera permission/device failure from analysis disconnect | User-initiated retry/reconnect; never restart capture or create a session silently |
| Subscription / Checkout | No active subscription is distinct from unknown subscription | Preserve selected plan and show retry | Explain billing/provider availability | Re-fetch server state; verify checkout outcome through the backend |
| Profile / Settings | Empty optional values remain empty | Preserve last confirmed values and field input; show validation/errors | Keep local page usable while noting settings are unavailable | Retry load/save; never claim unsaved changes succeeded |
| Authentication | No challenge means standard flow; challenge state is explicit | Preserve non-secret form values and field errors | Keep auth status unknown until session lookup succeeds | Retry session lookup or request; clear passwords after terminal auth failure |

A server `401` triggers the authentication flow; `403` remains an authorization error. Network failure never implies logout or successful completion. Clear sensitive transient values on logout, challenge expiry, or terminal authentication failure.
