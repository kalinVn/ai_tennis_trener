export const playbackRate = 0.3;
// Seconds of playback at the configured slow-motion speed.
export const loopDuration = 15;
export const lineStepMs = 350;
export const lineDrawMs = 300;
export const typingStepMs = 55;
export const coachingGapMs = 1500;
export const freezeTolerance = 0.001;
export const overlayConfig = {
  sourceWidth: 1280,
  sourceHeight: 720,
  labelCount: 8,
  compactWidth: 600,
  fontFamily: "monospace",
  fontSize: 10,
  labelColor: "#caffad",
  lineColor: "#39ff14",
  minLineWidth: 2,
  lineWidth: 3,
  labelAlpha: 0.85,
  lowerBodyCount: 4,
  compactLowerOffsets: [0, 17, 8, 25],
  lowerOffset: 3,
  compactUpperOffset: 18,
  upperOffset: -10,
  leftOffset: -10,
  rightOffset: 12,
  lowerRotationLimit: 0.12,
  upperRotationLimit: 0.25,
  minFontSize: 9,
  maxFontSize: 11,
};
// Manual source-pixel annotations from the user's 1280x720 reference images.
export const homepageTimelineItems = [
  {
    time: 2.9,
    duration: 5500,
    feedback: ["Good arm position", "Bend your knees", "Toss the ball higher"],
    labels: [
      "Angle: 42°",
      "Vector: [0.74, -0.31]",
      "Knee Flexion: 28°",
      "Hip Height: 82 cm",
      "L-Foot: [0.42, 0.81]",
      "R-Foot: [-0.35, 0.76]",
    ],
    segments: [
      [
        [512, 378],
        [526, 367],
      ],
      [
        [573, 356],
        [587, 355],
      ],
      [
        [543, 415],
        [543, 430],
      ],
      [
        [566, 409],
        [566, 433],
      ],
      [
        [548, 455],
        [553, 477],
      ],
      [
        [570, 457],
        [575, 475],
      ],
    ],
  },
  {
    time: 3.7,
    duration: 3500,
    feedback: ["Keep the racket position stable", "Follow through"],
    labels: [
      "Rotation: 27°",
      "ΔX: 18 px",
      null,
      null,
      "Knee Flexion: 38°",
      "Hip Height: 76 cm",
      "L-Foot: [0.18, 0.94]",
      "R-Foot: [-0.12, 0.91]",
    ],
    segments: [
      [
        [539, 338],
        [542, 347],
      ],
      [
        [552, 358],
        [562, 358],
      ],
      [
        [613, 354],
        [632, 373],
      ],
      [
        [563, 369],
        [563, 397],
      ],
      [
        [563, 413],
        [562, 435],
      ],
      [
        [592, 419],
        [588, 445],
      ],
      [
        [561, 457],
        [566, 482],
      ],
      [
        [587, 458],
        [589, 482],
      ],
    ],
  },
];
