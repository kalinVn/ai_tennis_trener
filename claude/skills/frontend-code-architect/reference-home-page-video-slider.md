# Home Page Video Slider Reference

## Scope

This is an architectural example for a complex feature with playback, analysis, animation, rendering, and independent UI. It is not a universal class hierarchy or a claim that the current implementation is fully refactored.

Inspect the [implementation](../../../prototypes/components/sliders/home-page-video-slider/) before applying the example. The [detailed review](../../../docs/code-improvements/home-page-video-slider.md) contains history and findings; they are intentionally not repeated here.

## Reference Hierarchy

```text
HomePageVideoSlider.vue
└── SliderController
    ├── PixiRenderer                    (resource ownership)
    ├── VideoTimelineController
    │   └── PlayerAnalysisTimeline
    │       └── AnimationTimeline
    │           └── PixiRenderer        (injected rendering dependency)
    ├── AudioTimeline
    └── AIMotionTrackingPanel
```

Both renderer entries refer to the same instance, not two renderers. Audio and the motion panel are independent peers in this reference design.

Current implementation differs: `VideoTimelineController` owns `AudioTimeline`, and `SliderController` still has a separate `SliderLifecycle` for the video error listener. The reference places supporting UI and global lifecycle policy at the top level; it does not imply those changes have been implemented.

## Responsibilities

| Component/class | Responsibility |
| --- | --- |
| `HomePageVideoSlider.vue` | Template, DOM refs, and mount/unmount integration with the controller. |
| `SliderController` | Composition, initialization, teardown, and global lifecycle/error policy. |
| `VideoTimelineController` | Video playback, main timeline, configured analysis points, and playback pause/resume coordination. |
| `PlayerAnalysisTimeline` | Analysis phase duration, starting the segment animation, and reporting phase completion. |
| `AnimationTimeline` | GSAP segment sequencing, durations, progression, line animation, and label fade. |
| `PixiRenderer` | Pixi resources, canvas sizing, source-to-canvas geometry, and drawing submitted segments/labels. |
| `AudioTimeline` | Independent coaching sentence timing, typing, and audio-indicator UI. |
| `AIMotionTrackingPanel` | Independent illustrative motion-status updates and their timer cleanup. |

## Interaction and Lessons

1. Video control reaches an analysis point, pauses playback, and starts the analysis phase.
2. Analysis starts its segment animation and owns the total hold duration.
3. Animation advances segment drawing state; the renderer maps that state to the canvas and draws it.
4. Analysis finishes, clears through one owner, and reports completion so video control can resume playback.
5. Coaching UI and the motion panel can continue independently through the analysis hold; global error/destruction remains a top-level concern.

- Renderer geometry is rendering work; segment timing is animation work. Moving geometry out merely to make the renderer smaller does not improve the boundary.
- Analysis duration and segment animation duration are different responsibilities. Do not duplicate their clocks or completion state.
- Avoid duplicated clear/destroy ownership across video, analysis, animation, and renderer layers.
- Independence of supporting UI does not mean independence from resource cleanup or global error policy.
- Keep authored demo annotations and statuses identified as examples, not live player observations.
