# Tennis AI Coach — Blurred HTML5 tennis video demo

Open `design/pages/index-video-test.html` through a local server from inside `design/`, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000/pages/index-video-test.html`.

The HTML includes a **real HTML5 `<video>`**, a translucent overlay `<canvas>`, blurred video, and illustrative telemetry. No external player or tracking library. Original `index.html` remains untouched.

Video is served remotely from Wikimedia Commons for this test (internet connection required). For offline use download the clip from https://commons.wikimedia.org/wiki/File:2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_04.webm and save it as `design/assets/tennis-rally.webm`.

Video attribution: NaBUru38, *2018 Davis Cup Americas Zone - Uruguay vs Mexico - 04.webm*, Creative Commons Attribution-ShareAlike 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). This demo applies blur and overlays. Retain attribution and comply with license if redistributing.

**Important:** The green skeleton and analytics are an illustrative animation, NOT actual tracking of player joints. A real pose-estimation pipeline would be needed for accurate video tracking.

To use with your up-to-date Codex-modified pages, copy only `pages/index-video-test.html` and `video-demo.js` into your `docs/prototypes/design/` directory; these use your existing `styles.css` and `app.js`.
