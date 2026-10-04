# Tennis AI Coach — Blurred HTML5 tennis video demo

Open `design/pages/index-video-test.html` through a local server from inside `design/`, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000/pages/index-video-test.html`.

The HTML includes a **real HTML5 `<video>`**, blurred video playing at 0.3× speed, and illustrative telemetry. Each loop plays the first 4.5 seconds of source footage over 15 seconds at 0.3× speed (shorter source clips loop at their natural end); the source file is unchanged. The fluid page wrapper grows to 1360px, with the desktop video enlarged by a further 12% (about 989px wide and 665px tall). It extends left beneath the text section with a broader fade; the text stays above the video. Telemetry dimensions and typography are reduced by 20%, with a 184px panel positioned outside the video’s right edge, overlapping it by 56px on wide screens, with its bottom edge 10px above the video’s bottom edge. The panel moves inward as the viewport narrows to stay on-screen. At 1100px and below, the hero stacks into one column; at 600px and below, the coaching cue and compact telemetry sit beneath the video so they remain readable without covering the footage. No external player or tracking library. Original `index.html` remains untouched.

Video is served remotely from Wikimedia Commons for this test (internet connection required). For offline use download the clip from https://commons.wikimedia.org/wiki/File:2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_04.webm and save it as `design/assets/tennis-rally.webm`.

Video attribution: NaBUru38, *2018 Davis Cup Americas Zone - Uruguay vs Mexico - 04.webm*, Creative Commons Attribution-ShareAlike 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). This demo applies blur and overlays. Retain attribution and comply with license if redistributing.

**Important:** The analytics are illustrative animation, NOT actual tracking of player joints. The animated skeleton, joint dots, bounding rectangle, and vector overlay have been removed. A real pose-estimation pipeline would be needed for accurate video tracking.

To use with your up-to-date Codex-modified pages, copy only `pages/index-video-test.html` and `video-demo.js` into your `docs/prototypes/design/` directory; these use your existing `styles.css` and `app.js`.
