# Vue prototypes

The source components remain reference implementations; application code stays separate.
All prototype composables live in `composables/`. The older shared Button is reused
from `design/components/buttons`; its unchanged `ButtonController.js`
composable now also lives in `composables/`.

## Training camera

From the repository root:

```sh
npm --prefix prototypes install
npm --prefix prototypes run dev
```

Open `http://127.0.0.1:5173/prototypes/design/pages/training.html` (use the port
printed by Vite). The Authentication layout and camera component HTML specimens use the
same Vue launcher. Opening Training directly as a local HTML file shows a Start
Training link to `camera.html`, which opens its existing full-screen design modal.
Return to Training takes the user back to `training.html`. This static preview
does not connect camera devices. The layout and component specimens show a setup
note when opened without Vite.
Camera access requires localhost or HTTPS and browser permission for both devices.

Training has a single Start Training button directly below Camera Preview. The
`CameraPreviewModal` component owns that launcher and opens its full-screen preview
after camera and microphone permission is granted. The layout and camera specimens
reuse this same component. Dashboard keeps Session History and its Training navigation link;
it does not launch the camera flow.

The camera launcher requests camera and microphone together. Cancel discards a late
permission result. After access is granted, one `CameraPreviewModal` opens above the
current page. Microphone capture is enabled but not played back locally or
uploaded. Return to Training, Escape, device loss, and
unmount release every track.
Stopping analysis leaves the modal and media stream active.

To connect an available backend, set `VITE_TRAINING_WS_URL` before starting Vite.
There is no bundled backend or invented endpoint. The prototype service sends binary
JPEG frames and expects JSON `{ type, payload }` responses. Confirm and adapt this
contract with the real backend before integration. Authentication belongs to the
host/backend. Use `wss://` on HTTPS pages. Without an endpoint the analysis button is
disabled and camera preview still works.

The analysis loop defaults to 5 FPS and a 640px maximum width, preserves aspect
ratio, skips hidden-document capture, serializes encoding/sending, and drops frames
when WebSocket buffered data exceeds 2 MiB. Stops invalidate pending work so old
frames/results cannot enter a new run. Backend feedback is shown only when supplied;
no ball/pose coordinates or coaching advice are fabricated. The overlay slot and
`analysis-result` event let a parent consume real structured results.

```sh
npm --prefix prototypes test
npm --prefix prototypes run build
```

Build compiles the configured page, layout, and camera entries, not the entire application/catalog.
The HTML camera specimen is a design reference for this modal, also reachable
from the local-file Training preview. It does not use the browser Fullscreen API.

## Global cookie consent

Application pages load the public `CookiePrivacyPolicy` Vue feature from the
shared design shell. Until a
valid selection is stored under `tennis-ai-coach.cookie-consent.v1` in browser
`localStorage`, the banner is shown again after navigation. Accept All, Reject All,
and saved category preferences persist the choice. The feature-local composable
owns all consent state. Manage Preferences, Cookie Policy, and Privacy Policy
reuse shared `BaseModal` over the current page;
opening policy content does not count as consent. Footer Cookie Settings reopens
the saved preferences through `TextButton`. The policy copy requires legal review before launch, and
no analytics or marketing integrations are initialized by this implementation.

## Authentication pages

Open `design/pages/login.html` and `design/pages/register.html` through the Vite
server. These entries mount the dedicated `LoginPage`/`LoginForm` and
`RegisterPage`/`RegisterForm` prototypes. Public Login actions lead to Login;
Start Free, Register, and Create Account lead to Register. Authenticated plan selection in Subscription leads to Checkout.
The forms are visual prototypes only: they do not authenticate, create accounts,
start OAuth, or implement OTP/MFA.

Open `design/pages/features.html` to run the Vue `FeaturesPage` prototype. It
renders the three numbered product capabilities through the reusable
`FeatureCard` component and preserves the two page navigation actions.

## Checkout cards

Open `/prototypes/design/components/checkout/checkout.html` through the same Vite
server to render the Checkout layout. Its colocated `main.js` mounts the feature-level
`components/features/checkout/Checkout.vue`, which composes `ChoosePlanCard`,
`PaymentStatusCard`, and `OrderSummaryCard`. Its local `useCheckout` composable adapts
the Pinia `CheckoutStore`; the store calls a demo checkout service with the same
transient session boundary intended for the backend contract. The child cards reuse the page stylesheet and contain no payment logic. Checkout contains no raw
payment fields. Opening the HTML directly retains the static design. The build
also includes this Checkout entry.

Checkout retains its distinct ChoosePlanCard selected-plan summary. Subscription uses the existing [PaymentCardPlan](../docs/frontend/components.md#paymentcardplan), with presentation-only selected styling, plus [BillingDetailsCard](../docs/frontend/components.md#billingdetailscard).

## Subscription cards

Open `design/components/subscription/subscription.html` through the Vite server. Its entry script mounts `components/features/subscription/Subscription.vue`, which composes PaymentCardPlan and BillingDetailsCard and uses the local `useSubscription` composable. Static HTML remains as a local-file visual fallback. Change plan reveals Starter, Performance, and Pro. Choosing one keeps those options visible, updates the larger current-plan card with its name and price, keeps Change plan, and reveals Continue; Continue opens Checkout with the selected plan. Manage billing retains its informational message. No real billing integration is present.

Card design examples are `design/components/cards/payment-card-plan.html` (normal), `design/components/cards/payment-card-plan-selected.html` (selected state of the same component) and `design/components/cards/billing-details-card.html`. The build includes the Subscription entry.
