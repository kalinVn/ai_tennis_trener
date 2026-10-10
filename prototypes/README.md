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

Training has a single Start Training button directly below Camera Preview. It uses
`TrainingCamera` to open the existing full-screen `CameraPreviewModal` after camera
and microphone permission is granted. The layout and camera specimens reuse this
same launcher. Dashboard keeps Session History and its Training navigation link;
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

## Checkout cards

Open `/prototypes/design/pages/checkout.html` through the same Vite server to
render `PerformanceCard`, `PaymentInformationCard`, and `OrderSummaryCard` in the
existing Checkout layout. `checkout/main.js` owns the sample props and demo action
feedback; the cards reuse the page stylesheet and contain no payment logic.
Payment inputs remain disabled. Opening the HTML directly retains the original
static design. The build also includes this Checkout entry; there are no separate
card page prototypes.

Checkout retains its distinct PerformanceCard order summary. Pricing and Subscription share the existing [PaymentCardPlan](../docs/frontend/components.md#paymentcardplan), with presentation-only selected styling. Subscription also uses [BillingDetailsCard](../docs/frontend/components.md#billingdetailscard).

## Pricing and Subscription cards

Open `design/pages/pricing.html` or `design/pages/subscription.html` through the Vite server. Their page entry scripts mount the shared PaymentCardPlan; Subscription also mounts BillingDetailsCard. Static HTML remains as a local-file visual fallback. Pricing actions open the existing registration dialog; Change plan and Manage billing preserve informational messages. No real billing integration is present. Compare public pricing remains a page-level link.

Card design examples are `design/components/cards/payment-card-plan.html` (normal), `design/components/cards/payment-card-plan-selected.html` (selected state of the same component) and `design/components/cards/billing-details-card.html`. The build includes the Pricing and Subscription entries.
