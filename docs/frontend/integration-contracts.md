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

Authentication values have separate purposes and are not interchangeable:

- `recaptchaToken` is a short-lived anti-abuse proof obtained from the reCAPTCHA provider for the email/password Login or Register submission. The backend verifies it once and does not use it as an application session token.
- OAuth `code` and `state` belong only to the Google, Facebook, or Apple redirect/callback flow. The provider sends them to the backend callback; they are not Login form fields.
- `challengeId` identifies a short-lived Login MFA challenge after the password and reCAPTCHA step succeeds. It contains no OTP and grants no session by itself.
- `accessToken` authorizes application API calls and remains in frontend memory.
- The refresh token is an application-session credential stored only in a Secure, HttpOnly, SameSite cookie.

Example endpoints:

### Google, Facebook, and Apple OAuth

- `POST /api/v1/auth/oauth/{provider}/start`, where `provider` is `google`, `facebook`, or `apple`.

  Login request:

  ```json
  {
    "intent": "login",
    "returnTo": "/dashboard"
  }
  ```

  Register request also confirms the legal choice made on the Register page:

  ```json
  {
    "intent": "register",
    "returnTo": "/dashboard",
    "legalConsent": {
      "termsOfService": true,
      "privacyPolicy": true
    }
  }
  ```

  The backend validates `provider`, permits only an internal allowlisted `returnTo`, creates short-lived OAuth state and PKCE values plus an OIDC nonce where supported, stores them in a Secure, HttpOnly, SameSite cookie, and returns a provider authorization URL. The frontend then navigates the browser to that URL. It never sends the password form or a provider client secret to Google, Facebook, or Apple.

  ```json
  {
    "authorizationUrl": "https://provider.example/authorize?…"
  }
  ```

- `GET /api/v1/auth/oauth/{provider}/callback` receives the provider's authorization code and state. The backend validates state, exchanges the code directly with the selected provider, validates the provider response and verified-email signal, and reads the permitted identity claims such as provider subject, name, and email. Provider access and ID tokens stay on the backend and are never placed in application URLs or browser storage.

  For `login`, the backend signs in the already-linked identity. For `register`, it creates or safely links the account only after the required legal consent; ambiguous email matches require an explicit account-linking flow rather than automatic linking. On success it issues the normal Secure refresh cookie and redirects to the validated internal callback page. The frontend obtains its short-lived application access token through the normal refresh endpoint. Cancelled, denied, invalid-state, provider-error, and account-link-required outcomes use explicit safe status codes without placing tokens or raw provider errors in the redirect URL.


- `POST /api/v1/auth/login`
  — request body:

  ```json
  {

    "email": "player@example.com",
    "password": "…",
    "recaptchaToken": "…"
  }
  ```

  After successful authentication, the backend issues a short-lived JWT access token and returns:

  — response body:

  ```json
  {
    "accessToken": "…",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "…",
      "displayName": "…"
    }
  }
  ```

  A long-lived refresh token is issued separately as an `HttpOnly`, `Secure`, `SameSite` cookie and is never exposed to frontend JavaScript.

  The frontend keeps the access token in application memory and sends it with protected API requests using `Authorization: Bearer <accessToken>`.

  If multi-factor authentication is required, the endpoint returns a challenge instead of tokens, for example:

  ```json
  {
    "challengeId": "…",
    "methods": [
      "totp",
      "email",
      "sms"
    ]
  }
  ```

  Invalid credentials return `401 Unauthorized`.

  When Login returns an MFA challenge, `POST /api/v1/auth/challenges/{challengeId}/verify` completes that Login challenge.

  — request body:

  ```json
  {
    "method": "totp",
    "code": "123456"
  }
  ```

  The `challengeId` is sent in the URL, while `method` must be one of the methods returned by Login. A successful verification returns `200 OK`, issues the refresh token as a Secure, HttpOnly, SameSite cookie, and returns:

  — response body:

  ```json
  {
    "accessToken": "…",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "…",
      "displayName": "…"
    }
  }
  ```

  The backend verifies ownership, expiry, attempt limits, and single use before issuing tokens. Invalid codes return `401 Unauthorized`; malformed requests and methods that were not offered for that challenge return `400 Bad Request`; expired, exhausted, or already-used challenges return `410 Gone`. This endpoint is part of Login MFA and is unrelated to reCAPTCHA and OAuth callbacks.

- `POST /api/v1/auth/refresh`
  — request:

  ```http
  POST /api/v1/auth/refresh HTTP/1.1
  Cookie: refresh_token=<HttpOnly browser cookie>
  X-CSRF-Token: <CSRF proof>
  Content-Length: 0
  ```

  The request has no JSON body. The browser sends the current refresh token only through its Secure, HttpOnly, SameSite cookie. The frontend also supplies the backend's required CSRF proof for this state-changing cookie-authenticated request; it never reads, copies, or serializes the refresh token.

  Successful refresh returns `200 OK`:

  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json
  Set-Cookie: refresh_token=<rotated token>; HttpOnly; Secure; SameSite=<policy>
  ```

  ```json
  {
    "accessToken": "…",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
  ```

  The backend rotates the refresh token on every successful use, invalidates the previous value, and sends the replacement in a new Secure, HttpOnly, SameSite cookie. The frontend keeps the returned access token only in application memory. Missing, invalid, expired, revoked, or reused refresh tokens return `401 Unauthorized` without an access token.

- `POST /api/v1/auth/logout`
  — request:

  ```http
  POST /api/v1/auth/logout HTTP/1.1
  Cookie: refresh_token=<HttpOnly browser cookie>
  X-CSRF-Token: <CSRF proof>
  Content-Length: 0
  ```

  The request has no JSON body. The browser sends the refresh-token cookie automatically, together with the required CSRF proof. The frontend clears its in-memory access token regardless of the server result.

  Successful logout returns:

  ```http
  HTTP/1.1 204 No Content
  Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; Secure; SameSite=<policy>
  ```

  A `204 No Content` response intentionally has no JSON body. The backend revokes the current refresh token or token family and expires the refresh-token cookie. The operation is idempotent: repeating it leaves the session signed out and returns no token or user data.

- `POST /api/v1/auth/register`
  — request body:

  ```json
  {
    "firstName": "Alex",
    "lastName": "Morgan",
    "email": "player@example.com",
    "phone": "+359881234567",
    "password": "…",
    "legalConsent": {
      "termsOfService": true,
      "privacyPolicy": true
    },
    "recaptchaToken": "…"
  }
  ```

  `confirmPassword` is validated by the frontend but is not transmitted. The backend validates and normalizes every supplied field, verifies that both legal-consent values are `true`, records the applicable legal-document versions and server acceptance time, verifies the reCAPTCHA token, hashes the password, and creates the account in one transaction.

  Successful creation returns `201 Created`:

  ```json
  {
    "success": true,
    "status": "verification_required",
    "user": {
      "id": "…",
      "firstName": "Alex",
      "lastName": "Morgan",
      "email": "player@example.com",
      "phone": "+359881234567"
    },
    "verification": {
      "type": "email",
      "required": true
    }
  }
  ```

  No password, password hash, reCAPTCHA token, provider secret, or internal verification token is returned. Duplicate email or phone values use the shared error envelope with a stable conflict code. Validation failures use field errors without echoing password values. After the email-verification flow is completed, authentication issues tokens through the same session mechanism as Login.

For Login and Register, `recaptchaToken` is a short-lived provider token, not the prototype checkbox value. The backend verifies it with the provider, including the expected action and hostname, before checking credentials or creating an account. Missing, expired, replayed, or invalid tokens are rejected; provider secrets never enter frontend code.

- Protected API endpoints require the access token in the HTTP header `Authorization: Bearer <accessToken>`. The backend validates the JWT signature, expiration time, issuer/audience where applicable, and required authorization claims before processing the request.

- Google, Facebook, and Apple sign-in use the backend-owned OAuth start/callback flows above. After successful provider authentication, the backend issues the same application session used by password authentication. The frontend handles redirect, pending, cancelled, denied, account-link-required, and recoverable failure states and never handles provider client secrets or provider tokens.

A protected request returning `401 Unauthorized` means that the access token is missing, invalid, or expired. When appropriate, the frontend first attempts `POST /api/v1/auth/refresh`. If refresh succeeds, it retries the original request once with the new access token. If refresh fails, the frontend clears its local authentication state and returns to the Login page while preserving a validated internal `returnTo`.

A `403 Forbidden` response means that the user is authenticated but does not have permission to perform the requested operation and must not be treated as logged out.

A network failure while calling `/auth/refresh` is treated as authentication status `unavailable`, not immediately as signed out.
A protected request returning `401` clears local session state and returns to the Login page while preserving a validated internal `returnTo`. A `403` is an authorization failure and must not be treated as logged out. A session lookup network failure is `unavailable`, not signed out.

## Training session and analysis transport

### Training session endpoints

- `POST /api/v1/training/sessions`

  Creates a new training session for the currently authenticated user. The frontend calls this endpoint when the user starts a new training session, before opening the analysis WebSocket and before sending camera frames. The authenticated user comes from the current access token, so the frontend does not send a `userId`.

  — request:

  ```http
  POST /api/v1/training/sessions HTTP/1.1
  Authorization: Bearer <accessToken>
  Content-Length: 0
  ```

  The request has no JSON body.

  — response body:

  ```json
  {
    "sessionId": "session_123",
    "status": "ready",
    "analysisWebSocketUrl": "wss://example.com/…"
  }
  ```

  `sessionId` uniquely identifies this training session. `status: "ready"` means that the session was created successfully and is ready for live analysis. `analysisWebSocketUrl` is a short-lived authenticated WebSocket URL generated by the backend.

  After receiving the response, the frontend opens the returned WebSocket URL and only then begins sending camera frames. It must not construct its own analysis WebSocket URL. Reconnecting an already active session keeps the same `sessionId` and must not silently create another session.

- `POST /api/v1/training/sessions/{sessionId}/complete`

  Completes an existing training session after the user finishes normally. The URL identifies the session that must be finalized.

  — request:

  ```http
  POST /api/v1/training/sessions/{sessionId}/complete HTTP/1.1
  Authorization: Bearer <accessToken>
  Content-Type: application/json
  ```

  — request body:

  ```json
  {
    "feedbackEventIds": [
      "server-event-id-1",
      "server-event-id-2"
    ],
    "lastContiguousFeedbackSequence": 2
  }
  ```

  `feedbackEventIds` contains the stable server-issued IDs of the feedback events received for this training session. `lastContiguousFeedbackSequence` is the highest sequence for which the frontend has every feedback event from sequence `1` through that value without gaps.

  The backend verifies that the session belongs to the authenticated user, verifies that the supplied events belong to that session, safely handles duplicate IDs, and confirms that the frontend has received the complete contiguous feedback stream. If required feedback is missing, the backend does not silently complete the session; it returns the documented `FEEDBACK_CATCH_UP_REQUIRED` error so the frontend can recover the missing feedback and retry.

  — response body:

  ```json
  {
    "sessionId": "session_123",
    "status": "complete",
    "completedAt": "2026-10-12T09:00:00Z",
    "finalFeedbackSequence": 2,
    "summary": {
      "successfulStrokes": 1,
      "detectedMistakes": 0,
      "recommendations": []
    }
  }
  ```

  After successful completion, the backend finalizes and persists the canonical session result for History and Session Review. The operation is idempotent for the same training session and the same valid feedback-event set.

- `POST /api/v1/training/sessions/{sessionId}/abandon`

  Ends an active training session as incomplete when the user cancels, exits early, or otherwise stops before the normal finalization flow. The URL identifies the session that must be abandoned.

  — request:

  ```http
  POST /api/v1/training/sessions/{sessionId}/abandon HTTP/1.1
  Authorization: Bearer <accessToken>
  Content-Length: 0
  ```

  The request has no JSON body.

  — response body:

  ```json
  {
    "sessionId": "session_123",
    "status": "incomplete",
    "endedAt": "2026-10-12T09:00:00Z"
  }
  ```

  The backend marks the session as incomplete instead of complete. It may still appear in History with `status: "incomplete"`, but the UI must not present it as successfully completed. The operation is idempotent: repeating it for an already abandoned session leaves it incomplete and does not create another session.

### Live analysis WebSocket

The authenticated WebSocket URL is short-lived and issued by the backend; the frontend does not construct it from an untrusted host. The example wire protocol sends JSON frame metadata immediately before the matching binary JPEG message:

```json
{
  "type": "frame",
  "frameId": "…",
  "capturedAt": "…",
  "mimeType": "image/jpeg",
  "width": 640,
  "height": 360
}
```

The JSON above is the first WebSocket message for one frame. It does not contain the image data. Immediately after it, the frontend sends a second WebSocket message containing the raw JPEG bytes:

```text
WebSocket message 1 (text):   JSON frame metadata
WebSocket message 2 (binary): <raw JPEG bytes for that frame>
```

Conceptually, the send sequence is:

```js
socket.send(JSON.stringify(frameMetadata))
socket.send(jpegBlob)
```

`jpegBlob` is the image itself, produced from the camera frame by `canvas.toBlob(..., "image/jpeg", ...)`. It is sent as binary data and is not Base64-encoded or placed in a JSON field. WebSocket preserves message order, so the backend associates the binary message with the metadata message immediately before it. The client must not interleave another frame's metadata between this pair.

The backend consumes and aggregates successive frame pairs for the active session. Frames are analysis input, not individual feedback events. The backend determines when a stroke has finished, evaluates the completed stroke from the aggregated evidence, and only then sends a versioned `player_feedback` event. The frontend does not infer stroke boundaries, combine per-frame results into feedback, or create coaching text locally.

Server-to-client text messages use a versioned envelope. A completed-stroke feedback event uses server-issued identities and contains only supported feedback:

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
    "text": "Prepare earlier before contact.",
    "audioUrl": "https://api.example.com/temporary-audio/…"
  }
}
```

`strokeId` identifies the completed stroke to which this feedback belongs. `confidence` is in `[0, 1]`, and `text` is backend-generated, safe user-facing feedback for that completed stroke. `audioUrl` is optional. When audio is useful, the backend generates it temporarily from `text` through Text-to-Speech and returns an authenticated, short-lived URL. The backend does not keep the generated audio as a permanent training asset or part of the canonical feedback record. The frontend only plays the returned audio; it does not generate, upload, persist, or treat audio playback as analysis/session truth. An unavailable or failed audio playback leaves the text feedback and session state unchanged.

`sequence` is a positive, monotonically increasing integer scoped only to one training session's **feedback event stream**. It starts at `1`, is never reused, and remains identical when an event is replayed. It is not a frame sequence, frame count, stroke number, or count of completed strokes. Multiple frames may contribute to one completed stroke and one feedback event, and a completed stroke does not imply any particular `sequence` value beyond its feedback ordering.

`eventId`, `sequence`, `strokeId`, `kind`, `occurredAt`, `confidence`, and `text` form the stable feedback content used for replay and reconciliation. `eventId` is stable across replay. The optional expiring `audioUrl` is transient delivery metadata: it is excluded from stable-content equality and canonical summaries, and replay may omit it or provide a newly issued temporary URL. The frontend stores events by `eventId`, ignores an exact duplicate with the same stable sequence and content, treats a conflicting duplicate as a protocol error, and tracks supported successful strokes, mistakes, and recommendations without inventing any.

`frameId` remains only in the client-to-server frame metadata so the transport can identify the metadata/JPEG pair. It is not included in aggregated `player_feedback`, replayed feedback, or the persisted canonical session summary.

Other server message types remain `analysis_started`, `analysis_unavailable`, `analysis_error`, and `session_status`.

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

The client then loads `GET /api/v1/training/sessions/{sessionId}/review`, whose persisted events include their original `eventId` and `sequence`, and rebuilds the same contiguous set. Persisted review events do not depend on a temporary `audioUrl`; replay or review may omit audio or provide a newly issued temporary URL without changing feedback identity or ordering. If neither replay nor a complete canonical review is available, feedback remains explicitly incomplete and the client does not claim successful completion.

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

- `POST /api/v1/subscriptions/checkout `— фронтендът праща избрания planId, бекендът създава Stripe Checkout Session и връща checkoutUrl.

- `GET /api/v1/subscriptions/status` — success страницата пита бекенда какъв е реалният статус: примерно pending, active, paid, failed.

- `POST /api/v1/stripe/webhook` — това е backend-only endpoint, който Stripe вика директно. Фронтендът не го вика.

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
