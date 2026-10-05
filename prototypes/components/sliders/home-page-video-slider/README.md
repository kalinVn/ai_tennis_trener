# Home Page Video Slider

`HomePageVideoSlider.vue` owns all DOM refs and passes their elements explicitly to `slider.js`. All runtime modules remain local to this directory:

- `slider.js`: connects modules, waits for Pixi initialization, and owns teardown.
- `sliderConfig.js`: authored freeze annotations, coaching messages, timing, and overlay constants.
- `pixiRenderer.js`: Pixi Application, Graphics/Text overlays, responsive cover mapping, and renderer cleanup.
- `videoController.js`: playback, seeking, freeze holds, and the shared hold clock.
- `coachingDisplay.js`: typed coaching cues, tracking phase, and illustrative microphone activity.
- `sliderLifecycle.js`: media/browser listeners, visibility observers, animation frames, and their cleanup.
- `slider.css`: preserved presentation and active-state CSS animations.

Playback remains 0.3×, with holds at 2.9s for 5.5s and 3.7s for 3.5s, sequential 350ms line starts and 300ms line drawing. No service/composable or actual microphone recording is involved. Values are authored demo annotations, not computer-vision measurements.

Home uses this component under Vite; static HTML previews retain their Canvas fallback. All use the single local WebM in this directory’s `assets/`. Destroy is idempotent, including while async Pixi initialization is pending; observers, event listeners, RAF, hold timer, media playback and renderer resources are released.

Video: NaBUru38, *2018 Davis Cup Americas Zone - Uruguay vs Mexico - 04.webm*, [Wikimedia source](https://commons.wikimedia.org/wiki/File:2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_04.webm), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Displayed blurred with illustrative overlays.
