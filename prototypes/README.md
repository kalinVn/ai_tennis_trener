# Vue prototypes

The source components remain reference implementations; application code stays separate.
All prototype composables live in `composables/`. The older shared Button is reused
from `../docs/prototypes/design/components/buttons/`; its unchanged `ButtonController.js`
composable now also lives in `composables/`.

## Training camera

From the repository root:

```sh
npm --prefix prototypes install
npm --prefix prototypes run dev
```

Open `http://127.0.0.1:5173/docs/prototypes/design/pages/training.html` (use the port
printed by Vite). The Training layout and camera component HTML specimens use the
same Vue launcher. Opening those files directly without Vite shows a setup note.
Camera access requires localhost or HTTPS and browser permission for both devices.

Start Camera requests camera and microphone together. Cancel discards a late
permission result. After access is granted, one `CameraPreviewModal` opens above the
existing Training UI. Microphone capture is enabled but not played back locally or
uploaded. Return to Training, Escape, device loss, and unmount release every track.
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

Build compiles the three Training entry pages, not the entire application/catalog.
The HTML camera specimen is a design reference for this modal, not a separate
camera route or fullscreen API flow.
