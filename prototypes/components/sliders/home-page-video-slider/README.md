# Home Page Video Slider

`HomePageVideoSlider.vue` is the Vue structure/lifecycle entry. `slider.js` owns its per-instance Pixi Application, Graphics/Text overlay, 0.3× playback, 2.9s/5.5s and 3.7s/3.5s holds, sequential 350ms line starts, coaching cues, microphone active state, responsive cover mapping, and cleanup. `slider.css` defines the preserved UI and active-state CSS animations. No service/composable or actual microphone recording is involved. Values are authored demo annotations, not computer-vision measurements.

Home uses this component under Vite; static HTML previews retain their Canvas fallback. All use the single local WebM in this directory’s `assets/`. Destroy is idempotent, including while async Pixi initialization is pending; observers, event listeners, RAF, hold timer, media playback and renderer resources are released.

Video: NaBUru38, *2018 Davis Cup Americas Zone - Uruguay vs Mexico - 04.webm*, [Wikimedia source](https://commons.wikimedia.org/wiki/File:2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_04.webm), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Displayed blurred with illustrative overlays.
