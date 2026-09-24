# Plan New Frontend Design — Example Result

This file shows an illustrative structured plan returned by the `plan-new-frontend-design` skill to the New Frontend Orchestrator.

```text
frontend_type: new

design_foundation:
  visual_direction: dark tennis-court interface
  design_tokens: colors, typography, spacing, borders, radii, and shadows
  responsive_principles: mobile, tablet, and desktop layouts

required_layouts:
  - PublicLayout
  - AuthenticationLayout
  - ApplicationLayout
  - TrainingLayout

required_pages:
  - LandingPage
  - LoginPage
  - RegisterPage
  - DashboardPage
  - TrainingPage
  - SessionReviewPage
  - HistoryPage
  - ProgressPage
  - SubscriptionPage
  - ProfilePage
  - SettingsPage

required_shared_components:
  - Button
  - FormField
  - Card
  - StatusIndicator
  - AppNavigation

required_feature_components:
  - CameraPreview
  - SessionControls
  - TrainingOverlay
  - CoachingFeedback
  - SessionSummary
  - CheckoutFlow

required_routes:
  - path: /
    page: LandingPage
    access: public
    layout: PublicLayout
  - path: /app/training
    page: TrainingPage
    access: protected
    layout: TrainingLayout

build_order:
  1. design foundation
  2. shared components
  3. feature components
  4. pages
  5. routing
  6. specialized feature integration
  7. responsive validation
  8. testing and verification
```

The actual plan must contain only the layouts, pages, components, and routes required by the frontend specification.
