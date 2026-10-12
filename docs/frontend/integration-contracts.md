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
- `accessToken` authorizes application API calls through the `Authorization: Bearer <accessToken>` header.
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

  The backend validates `provider`, permits only an internal allowlisted `returnTo`, creates short-lived OAuth state and PKCE values plus an OIDC nonce where supported, stores them in a Secure, HttpOnly, SameSite cookie, and returns a provider authorization URL. The password form and provider client secrets are never transmitted to Google, Facebook, or Apple by frontend code.

  ```json
  {
    "authorizationUrl": "https://provider.example/authorize?…"
  }
  ```

- `GET /api/v1/auth/oauth/{provider}/callback` receives the provider's authorization code and state. The backend validates state, exchanges the code directly with the selected provider, validates the provider response and verified-email signal, and reads the permitted identity claims such as provider subject, name, and email. Provider access and ID tokens stay on the backend and are never placed in application URLs or browser storage.

  For `login`, the backend signs in the already-linked identity. For `register`, it creates or safely links the account only after the required legal consent; ambiguous email matches require an explicit account-linking flow rather than automatic linking. On success it issues the normal Secure refresh cookie and redirects to the validated internal callback page. Cancelled, denied, invalid-state, provider-error, and account-link-required outcomes use explicit safe status codes without placing tokens or raw provider errors in the redirect URL.


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

  `POST /api/v1/auth/challenges/{challengeId}/verify` completes the identified Login MFA challenge.

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

  The backend rotates the refresh token on every successful use, invalidates the previous value, and sends the replacement in a new Secure, HttpOnly, SameSite cookie. Missing, invalid, expired, revoked, or reused refresh tokens return `401 Unauthorized` without an access token.

- `POST /api/v1/auth/logout`
  — request:

  ```http
  POST /api/v1/auth/logout HTTP/1.1
  Cookie: refresh_token=<HttpOnly browser cookie>
  X-CSRF-Token: <CSRF proof>
  Content-Length: 0
  ```

  The request has no JSON body. The browser sends the refresh-token cookie automatically, together with the required CSRF proof.

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

- Google, Facebook, and Apple sign-in use the backend-owned OAuth start/callback contracts above and issue the same application session used by password authentication. Provider client secrets and provider tokens are never exposed to frontend code.

`401 Unauthorized` means that the access token is missing, invalid, or expired. `403 Forbidden` means that the authenticated principal lacks permission. These meanings are part of the HTTP contract; frontend recovery and navigation behavior are defined in `frontend.md`.

## Training session and analysis transport

### Training session endpoints

- `POST /api/v1/training/sessions`

  Creates a new training session for the authenticated user. The authenticated principal comes from the access token; the request contains no `userId`.

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

  `analysisWebSocketUrl` is backend-issued and must not be replaced with a client-constructed or untrusted host. Reconnection for the same active session retains the same `sessionId`.

- `POST /api/v1/training/sessions/{sessionId}/complete`

  Completes an existing training session after the user finishes normally. The URL identifies the session that must be finalized.

  — request:

  ```http
  POST /api/v1/training/sessions/{sessionId}/complete HTTP/1.1
  Authorization: Bearer <accessToken>
  Content-Length: 0
  ```

  The request has no JSON body. The backend verifies that the session belongs to the authenticated user and finalizes the feedback and summary already associated with that session.

  — response body:

  ```json
  {
    "sessionId": "session_123",
    "status": "complete",
    "completedAt": "2026-10-12T09:00:00Z",
    "summary": {
      "successfulStrokes": 1,
      "detectedMistakes": 0,
      "recommendations": []
    }
  }
  ```

  A successful response means the canonical session result has been finalized and persisted for History and Session Review. The operation is idempotent for the same training session.

- `POST /api/v1/training/sessions/{sessionId}/abandon`

  Ends the identified active training session with `status: "incomplete"` instead of completing it.

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

  The incomplete result may be returned by History but is never equivalent to a completed session. The operation is idempotent: repeating it for an already abandoned session leaves it incomplete and does not create another session.

### Live analysis WebSocket

The authenticated WebSocket URL is short-lived and issued by the backend; the frontend does not construct it from an untrusted host. The example wire protocol sends JSON frame metadata immediately before the matching binary JPEG message:

#### Client-to-server frame message

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

Field contract:

- `type` is required and equals `frame`.
- `frameId` is a required opaque identifier for this transmitted frame.
- `capturedAt` is the required UTC ISO-8601 capture timestamp.
- `mimeType` is required and equals `image/jpeg` for this protocol version.
- `width` and `height` are required positive integer pixel dimensions of the encoded image.

The metadata is the first WebSocket message for one frame and contains no image bytes. The immediately following message contains the matching raw JPEG bytes:

```text
WebSocket message 1 (text):   JSON frame metadata
WebSocket message 2 (binary): <raw JPEG bytes for that frame>
```

The JPEG is binary, not Base64 or a JSON field. Metadata and binary payload form an ordered pair; another frame's metadata must not be interleaved between them.

Frames are analysis inputs and do not individually imply a feedback event. Stroke-level feedback may be returned through the message below; backend aggregation and stroke-completion detection are not part of this wire contract.

#### Server-to-client `player_feedback` message

Server-to-client text messages use a versioned envelope. A completed-stroke feedback event uses server-issued identities and contains only supported feedback:

```json
{
  "version": 1,
  "type": "player_feedback",
  "sessionId": "session_123",
  "payload": {
    "strokeId": "stroke_42",
    "strokeNumber": 12,
    "kind": "detected_mistake",
    "occurredAt": "2026-10-12T09:00:00Z",
    "confidence": 0.91,
    "text": "Contact the ball earlier.",
    "audioUrl": "https://api.example.com/temporary-audio/event_45"
  }
}
```

Field contract:

- `version` is required and equals `1`, the current WebSocket schema version.
- `type` is required and equals `player_feedback`.
- `sessionId` is required and identifies the active training session.

- `payload.strokeId` is a required opaque, server-generated identifier for one detected tennis stroke. Feedback events for the same stroke use the same `strokeId`; different strokes use different identifiers.
- `payload.strokeNumber` is a required positive ordinal assigned by the backend to the detected stroke within the training session. It starts at `1` and increases for each newly detected stroke; it is not a frame number or frame count.
- `payload.kind` is required and is one of `successful_stroke`, `detected_mistake`, or `recommendation`.
- `payload.occurredAt` is a required UTC ISO-8601 timestamp associated with the feedback/stroke event.
- `payload.confidence` is a required number from `0` to `1` expressing the backend's confidence in this stroke-level result.
- `payload.text` is optional human-readable coaching feedback. When present, it is the canonical persisted coaching content.
- `payload.audioUrl` is optional. When present, it is an authenticated, temporary, expiring URL for backend-generated Text-to-Speech audio corresponding to `text`. Permanent generated-audio persistence is not guaranteed; audio may be regenerated later from persisted text.

`strokeId`, `strokeNumber`, `kind`, `occurredAt`, `confidence`, and `text` form the stable feedback content for the completed stroke. The optional `audioUrl` is transient delivery metadata, is excluded from canonical summaries, and may be omitted or newly issued when the feedback is retrieved later.

`frameId` remains only in the client-to-server frame metadata so the transport can identify the metadata/JPEG pair. It is not included in aggregated `player_feedback` or the persisted canonical session summary.

Other valid server message discriminators are `analysis_started`, `analysis_unavailable`, `analysis_error`, and `session_status`; their payload schemas require backend confirmation before use.

#### Client-to-server `stop_analysis` message

Analysis stop uses this message:

```json
{ "version": 1, "type": "stop_analysis", "sessionId": "…" }
```

`version` is the schema version, `type` is the `stop_analysis` discriminator, and `sessionId` identifies the active session. After accepting it, the server must not treat later frame messages as part of active analysis. The binary JPEG/WebSocket schemas remain proposed contracts requiring backend adoption or versioned replacement.

## Session History, Session Review, and Progress data

### Session History

- `GET /api/v1/training/sessions?cursor={opaqueCursor}&limit={1..50}`

  Returns the authenticated user's training sessions. `cursor` is an optional opaque pagination cursor. `limit` is optional and must be an integer from `1` to `50`.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "items": [
      {
        "id": "session_123",
        "startedAt": "2026-10-12T08:30:00Z",
        "durationSeconds": 1800,
        "status": "complete",
        "summary": null
      }
    ],
    "nextCursor": null
  }
  ```

  `status` is either `complete` or `incomplete`. `nextCursor` is `null` when there is no next page.

  — relevant errors/status codes:

  Authorization failures and invalid query parameters use the shared error envelope with the applicable HTTP status code.

### Session Review

- `GET /api/v1/training/sessions/{sessionId}/review`

  Returns the authorized review for the training session identified by `sessionId`, including persisted server-issued feedback, the canonical successful-stroke/mistake/recommendation summary, supported measurements, and optional key moments.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "sessionId": "session_123",
    "status": "complete",
    "summary": {
      "successfulStrokes": 1,
      "detectedMistakes": 1,
      "recommendations": [
        "Contact the ball earlier."
      ]
    },
    "feedbackEvents": [
      {
        "strokeId": "stroke_42",
        "strokeNumber": 12,
        "kind": "detected_mistake",
        "occurredAt": "2026-10-12T09:00:00Z",
        "confidence": 0.91,
        "text": "Contact the ball earlier.",
        "audioUrl": null
      }
    ],
    "measurements": [],
    "keyMoments": []
  }
  ```

  Each supported measurement includes its value, unit, time range, and server-defined provenance/confidence. Missing evidence is `null` with an availability reason. `keyMoments` is optional. A persisted review does not depend on a temporary `audioUrl`; it may be `null` or omitted.

  — relevant errors/status codes:

  Authorization failures, an unknown or inaccessible `sessionId`, and unavailable review data use the shared error envelope with the applicable HTTP status code.

### Progress Data

- `GET /api/v1/progress`

  Returns progress data for the backend-selected default range. Optional `from` and `to` query parameters, when supported, are ISO dates and must be supplied together.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "range": {
      "from": "2026-09-12",
      "to": "2026-10-12"
    },
    "measurements": [],
    "focus": null,
    "availability": "insufficient_data"
  }
  ```

  Supported measurements include stable identifiers, display labels, units, time buckets, and server-computed values. `focus` is backend-provided or `null`.

  — relevant errors/status codes:

  Authorization failures and invalid or incomplete date ranges use the shared error envelope with the applicable HTTP status code.

## Checkout and billing

The frontend sends plan identifiers, never amounts or card credentials, to the backend:

- `POST /api/v1/billing/checkout-sessions`

  Creates a provider-hosted checkout session for the selected plan. `returnPath` must be a validated internal application path.

  — request body:

  ```json
  {
    "planId": "performance",
    "returnPath": "/subscription"
  }
  ```

  — response body:

  ```json
  {
    "checkoutUrl": "https://provider.example/…",
    "checkoutSessionId": "checkout_123"
  }
  ```

  — relevant errors/status codes:

  Invalid plans, invalid return paths, authorization failures, and provider failures use the shared error envelope with the applicable HTTP status code.

- `GET /api/v1/billing/checkout-sessions/{checkoutSessionId}`

  Returns the backend-verified state of the checkout session identified by `checkoutSessionId`. Query parameters or browser redirects alone never prove payment success.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "status": "pending",
    "displayText": "Payment confirmation is pending."
  }
  ```

  `status` is one of `pending`, `succeeded`, `cancelled`, `failed`, or `expired`. `displayText` is safe to display to the user.

  — relevant errors/status codes:

  Authorization failures, an unknown or inaccessible `checkoutSessionId`, and provider availability failures use the shared error envelope with the applicable HTTP status code.

- `POST /api/v1/subscriptions/checkout`

  Creates a provider-hosted checkout session for the selected `planId`.

  — request body:

  ```json
  {
    "planId": "performance"
  }
  ```

  — response body:

  ```json
  {
    "checkoutUrl": "https://provider.example/…"
  }
  ```

  — relevant errors/status codes:

  Invalid plans, authorization failures, and provider failures use the shared error envelope with the applicable HTTP status code.

- `GET /api/v1/subscriptions/status`

  Returns the authenticated user's authoritative subscription status.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "status": "pending"
  }
  ```

  Supported status values include `pending`, `active`, `paid`, and `failed`.

  — relevant errors/status codes:

  Authorization and subscription-status lookup failures use the shared error envelope with the applicable HTTP status code.

- `POST /api/v1/stripe/webhook`

  This is a backend-only endpoint called directly by Stripe. The frontend never calls it.

  — request body:

  The body is the provider-defined event payload accompanied by Stripe's signature metadata. Its schema is intentionally not duplicated in this frontend-facing contract.

  — response body:

  No response body is consumed by the frontend. Provider acknowledgement and error responses are part of the backend/Stripe integration contract.

  — relevant errors/status codes:

  The backend verifies the provider signature and processes accepted events idempotently. Invalid signatures and duplicate or failed event processing are handled entirely by the backend.

The provider hosts payment fields and receives card data. Raw card data must not be transmitted to or stored by the frontend application. Provider callbacks/webhooks are backend-verified and idempotent; browser redirects and query parameters are not payment confirmation.

## Contract adoption

Backend and product owners must confirm endpoint names, required fields, units, bounds, retention, authentication, rate limits, idempotency, feedback-event provenance, session completion, and error mappings before connecting live services. Until then, frontend contract tests may use fixtures matching these proposed examples.

## Dashboard, profile, and settings data

All endpoints in this section require the authenticated application session and use the shared error envelope. Profile and preferences update endpoints return field validation separately from transport errors.

### Dashboard Data

- `GET /api/v1/dashboard`

  Returns server-authorized overview data for the authenticated user's Dashboard. Each returned item retains its source identifier and timestamp. Empty collections are valid, and the client does not derive a recommendation from raw metrics.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "recentSessions": [],
    "progressSummary": null,
    "nextFocus": null
  }
  ```

  `progressSummary` and `nextFocus` are backend-provided or `null` when the corresponding supported data is unavailable.

  — relevant errors/status codes:

  Authorization and Dashboard-data availability failures use the shared error envelope with the applicable HTTP status code.

### Profile Data

- `GET /api/v1/users/me`

  Returns the authenticated user's editable profile fields and read-only account fields separately.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "editable": {
      "firstName": "Alex",
      "lastName": "Morgan",
      "displayName": "Alex",
      "phone": "+359881234567"
    },
    "readOnly": {
      "id": "user_123",
      "email": "player@example.com",
      "emailVerified": true
    }
  }
  ```

  The backend declares which profile fields are writable. Read-only account fields must not be copied into update requests.

  — relevant errors/status codes:

  Authorization and profile-data availability failures use the shared error envelope with the applicable HTTP status code.

- `PATCH /api/v1/users/me`

  Updates only the supplied backend-declared writable profile fields. Omitted writable fields remain unchanged.

  — request body:

  ```json
  {
    "firstName": "Alex",
    "lastName": "Morgan",
    "displayName": "Alex",
    "phone": "+359881234567"
  }
  ```

  — response body:

  ```json
  {
    "editable": {
      "firstName": "Alex",
      "lastName": "Morgan",
      "displayName": "Alex",
      "phone": "+359881234567"
    },
    "readOnly": {
      "id": "user_123",
      "email": "player@example.com",
      "emailVerified": true
    }
  }
  ```

  The response contains the normalized saved representation. Unsupported or read-only fields are not accepted as writable profile data.

  — relevant errors/status codes:

  Authorization failures and field-validation failures use the shared error envelope with the applicable HTTP status code. Field-validation details are returned separately from transport errors.

### Settings Data

- `GET /api/v1/users/me/preferences`

  Returns the authenticated user's persisted application preferences.

  — request body:

  The request has no JSON body.

  — response body:

  ```json
  {
    "applicationLanguage": "en",
    "timezone": "Europe/Sofia",
    "measurementUnits": "metric"
  }
  ```

  Only backend-declared preferences are returned as persisted settings. Browser capability and device availability remain client-observed state.

  — relevant errors/status codes:

  Authorization and preferences-data availability failures use the shared error envelope with the applicable HTTP status code.

- `PATCH /api/v1/users/me/preferences`

  Updates only the supplied backend-declared preference fields. Omitted preferences remain unchanged.

  — request body:

  ```json
  {
    "applicationLanguage": "en",
    "timezone": "Europe/Sofia",
    "measurementUnits": "metric"
  }
  ```

  Unsupported browser capabilities are reported by the client as unavailable and are not sent as if enabled.

  — response body:

  ```json
  {
    "applicationLanguage": "en",
    "timezone": "Europe/Sofia",
    "measurementUnits": "metric"
  }
  ```

  The response contains the normalized saved preference values.

  — relevant errors/status codes:

  Authorization failures and field-validation failures use the shared error envelope with the applicable HTTP status code. Field-validation details are returned separately from transport errors.
