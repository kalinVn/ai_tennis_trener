tennis-ai-coach/
│
├── CLAUDE.md
├── README.md
├── PROJECT_STRUCTURE.md
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
│
│
│   # ============================================================
│   # CLAUDE CODE
│   # ============================================================
│
├── .claude/
│   │
│   ├── commands/
│   │   │
│   │   ├── build-app.md
│   │   ├── update-app.md
│   │   ├── build-analysis.md
│   │   ├── test-app.md
│   │   ├── review-code.md
│   │   └── fix-errors.md
│   │
│   ├── agents/
│   │   │
│   │   ├── architect-agent.md
│   │   ├── frontend-agent.md
│   │   ├── backend-agent.md
│   │   ├── auth-agent.md
│   │   ├── database-agent.md
│   │   ├── payments-agent.md
│   │   ├── admin-agent.md
│   │   ├── vision-agent.md
│   │   ├── realtime-agent.md
│   │   ├── tennis-coach-agent.md
│   │   ├── training-agent.md
│   │   ├── analysis-agent.md
│   │   ├── audio-agent.md
│   │   ├── security-agent.md
│   │   ├── testing-agent.md
│   │   └── performance-agent.md
│   │
│   ├── skills/
│   │   │
│   │   ├── vue3.md
│   │   ├── typescript.md
│   │   ├── authentication.md
│   │   ├── oauth.md
│   │   ├── two-factor-auth.md
│   │   ├── stripe.md
│   │   ├── database-design.md
│   │   ├── computer-vision.md
│   │   ├── pose-estimation.md
│   │   ├── ball-tracking.md
│   │   ├── racket-tracking.md
│   │   ├── court-detection.md
│   │   ├── trajectory-prediction.md
│   │   ├── tennis-biomechanics.md
│   │   ├── realtime-systems.md
│   │   ├── audio-feedback.md
│   │   ├── security.md
│   │   └── testing.md
│   │
│   └── rules/
│       │
│       ├── project-rules.md
│       ├── coding-rules.md
│       ├── architecture-rules.md
│       ├── frontend-rules.md
│       ├── backend-rules.md
│       ├── database-rules.md
│       ├── security-rules.md
│       ├── realtime-rules.md
│       ├── vision-rules.md
│       ├── payments-rules.md
│       └── testing-rules.md
│
│
│   # ============================================================
│   # DOCUMENTATION
│   # ============================================================
│
├── docs/
│   │
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── REQUIREMENTS.md
│   ├── MVP.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   │
│   ├── product/
│   │   ├── product-overview.md
│   │   ├── user-flows.md
│   │   ├── onboarding.md
│   │   ├── training-flow.md
│   │   ├── live-coaching-flow.md
│   │   ├── subscription-model.md
│   │   └── admin-flow.md
│   │
│   ├── auth/
│   │   ├── authentication.md
│   │   ├── email-login.md
│   │   ├── google-oauth.md
│   │   ├── apple-login.md
│   │   ├── two-factor-auth.md
│   │   ├── sessions.md
│   │   └── permissions.md
│   │
│   ├── payments/
│   │   ├── stripe.md
│   │   ├── subscriptions.md
│   │   ├── plans.md
│   │   ├── trials.md
│   │   ├── webhooks.md
│   │   └── billing-portal.md
│   │
│   ├── vision/
│   │   ├── vision-pipeline.md
│   │   ├── pose-estimation.md
│   │   ├── ball-detection.md
│   │   ├── racket-detection.md
│   │   ├── court-detection.md
│   │   ├── player-tracking.md
│   │   ├── ball-tracking.md
│   │   ├── trajectory-prediction.md
│   │   ├── camera-calibration.md
│   │   └── coordinate-system.md
│   │
│   ├── coaching/
│   │   ├── coach-engine.md
│   │   ├── state-machine.md
│   │   ├── realtime-feedback.md
│   │   ├── movement-analysis.md
│   │   ├── stroke-analysis.md
│   │   ├── error-detection.md
│   │   ├── instruction-priority.md
│   │   └── reference-technique.md
│   │
│   ├── training/
│   │   ├── training-engine.md
│   │   ├── training-plans.md
│   │   ├── exercises.md
│   │   ├── progression.md
│   │   └── player-levels.md
│   │
│   └── api/
│       ├── api-overview.md
│       ├── rest-api.md
│       ├── realtime-api.md
│       ├── websocket-events.md
│       ├── auth-api.md
│       └── admin-api.md
│
│
│   # ============================================================
│   # APPLICATIONS
│   # ============================================================
│
├── apps/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # USER APPLICATION - VUE 3
│   │   # --------------------------------------------------------
│   │
│   ├── client/
│   │   │
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   │
│   │   ├── src/
│   │   │   │
│   │   │   ├── main.ts
│   │   │   ├── App.vue
│   │   │   │
│   │   │   ├── router/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   ├── AuthLayout.vue
│   │   │   │   ├── AppLayout.vue
│   │   │   │   └── TrainingLayout.vue
│   │   │   │
│   │   │   ├── views/
│   │   │   │   │
│   │   │   │   ├── HomeView.vue
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginView.vue
│   │   │   │   │   ├── RegisterView.vue
│   │   │   │   │   ├── ForgotPasswordView.vue
│   │   │   │   │   ├── ResetPasswordView.vue
│   │   │   │   │   ├── VerifyEmailView.vue
│   │   │   │   │   └── TwoFactorView.vue
│   │   │   │   │
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── ProfileView.vue
│   │   │   │   ├── SettingsView.vue
│   │   │   │   │
│   │   │   │   ├── training/
│   │   │   │   │   ├── TrainingPlansView.vue
│   │   │   │   │   ├── TrainingSessionView.vue
│   │   │   │   │   ├── LiveCoachView.vue
│   │   │   │   │   └── SessionReviewView.vue
│   │   │   │   │
│   │   │   │   ├── analysis/
│   │   │   │   │   ├── AnalysisView.vue
│   │   │   │   │   ├── StrokeAnalysisView.vue
│   │   │   │   │   ├── ProgressView.vue
│   │   │   │   │   └── HistoryView.vue
│   │   │   │   │
│   │   │   │   └── billing/
│   │   │   │       ├── PlansView.vue
│   │   │   │       ├── CheckoutView.vue
│   │   │   │       ├── BillingView.vue
│   │   │   │       └── SubscriptionSuccessView.vue
│   │   │   │
│   │   │   ├── components/
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.vue
│   │   │   │   │   ├── RegisterForm.vue
│   │   │   │   │   ├── GoogleLoginButton.vue
│   │   │   │   │   ├── AppleLoginButton.vue
│   │   │   │   │   └── TwoFactorForm.vue
│   │   │   │   │
│   │   │   │   ├── camera/
│   │   │   │   │   ├── CameraPreview.vue
│   │   │   │   │   ├── CameraSetup.vue
│   │   │   │   │   └── CourtAlignment.vue
│   │   │   │   │
│   │   │   │   ├── coaching/
│   │   │   │   │   ├── LiveInstruction.vue
│   │   │   │   │   ├── CoachStatus.vue
│   │   │   │   │   └── FeedbackOverlay.vue
│   │   │   │   │
│   │   │   │   ├── training/
│   │   │   │   │   ├── TrainingPlanCard.vue
│   │   │   │   │   ├── ExerciseCard.vue
│   │   │   │   │   └── SessionSummary.vue
│   │   │   │   │
│   │   │   │   ├── analysis/
│   │   │   │   │   ├── StrokeAnalysis.vue
│   │   │   │   │   ├── ErrorList.vue
│   │   │   │   │   ├── PoseViewer.vue
│   │   │   │   │   └── ComparisonViewer.vue
│   │   │   │   │
│   │   │   │   └── billing/
│   │   │   │       ├── PricingCard.vue
│   │   │   │       ├── SubscriptionStatus.vue
│   │   │   │       └── BillingHistory.vue
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   ├── auth.store.ts
│   │   │   │   ├── user.store.ts
│   │   │   │   ├── training.store.ts
│   │   │   │   ├── camera.store.ts
│   │   │   │   ├── coaching.store.ts
│   │   │   │   └── subscription.store.ts
│   │   │   │
│   │   │   ├── composables/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCamera.ts
│   │   │   │   ├── useWebSocket.ts
│   │   │   │   ├── useLiveCoach.ts
│   │   │   │   ├── useAudioCoach.ts
│   │   │   │   ├── useTrainingSession.ts
│   │   │   │   └── useSubscription.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── training.service.ts
│   │   │   │   ├── vision.service.ts
│   │   │   │   ├── coaching.service.ts
│   │   │   │   ├── websocket.service.ts
│   │   │   │   └── subscription.service.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── pose.types.ts
│   │   │   │   ├── ball.types.ts
│   │   │   │   ├── racket.types.ts
│   │   │   │   ├── court.types.ts
│   │   │   │   ├── coaching.types.ts
│   │   │   │   ├── training.types.ts
│   │   │   │   └── subscription.types.ts
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── geometry.ts
│   │   │       ├── vectors.ts
│   │   │       ├── timestamps.ts
│   │   │       └── validators.ts
│   │   │
│   │   └── public/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # ADMIN PANEL - VUE 3
│   │   # --------------------------------------------------------
│   │
│   └── admin/
│       │
│       ├── package.json
│       ├── vite.config.ts
│       │
│       └── src/
│           ├── main.ts
│           ├── App.vue
│           │
│           ├── views/
│           │   ├── AdminLoginView.vue
│           │   ├── DashboardView.vue
│           │   ├── UsersView.vue
│           │   ├── UserDetailsView.vue
│           │   ├── SubscriptionsView.vue
│           │   ├── PaymentsView.vue
│           │   ├── TrainingSessionsView.vue
│           │   ├── VisionLogsView.vue
│           │   ├── SystemHealthView.vue
│           │   └── SettingsView.vue
│           │
│           ├── components/
│           ├── stores/
│           ├── services/
│           └── router/
│
│
│   # ============================================================
│   # BACKEND SERVICES
│   # ============================================================
│
├── services/
│   │
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── server/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   └── tests/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # AUTHENTICATION
│   │   # --------------------------------------------------------
│   │
│   ├── auth/
│   │   ├── src/
│   │   │   ├── email/
│   │   │   ├── password/
│   │   │   ├── oauth/
│   │   │   │   ├── google/
│   │   │   │   └── apple/
│   │   │   ├── two-factor/
│   │   │   ├── sessions/
│   │   │   ├── tokens/
│   │   │   ├── verification/
│   │   │   └── permissions/
│   │   └── tests/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # STRIPE / BILLING
│   │   # --------------------------------------------------------
│   │
│   ├── payments/
│   │   ├── src/
│   │   │   ├── stripe-client/
│   │   │   ├── checkout/
│   │   │   ├── subscriptions/
│   │   │   ├── plans/
│   │   │   ├── trials/
│   │   │   ├── billing-portal/
│   │   │   ├── invoices/
│   │   │   └── webhooks/
│   │   └── tests/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # REAL-TIME
│   │   # --------------------------------------------------------
│   │
│   ├── realtime/
│   │   ├── src/
│   │   │   ├── websocket/
│   │   │   ├── session-manager/
│   │   │   ├── frame-buffer/
│   │   │   ├── event-stream/
│   │   │   ├── latency-monitor/
│   │   │   └── realtime-protocol/
│   │   └── tests/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # COMPUTER VISION
│   │   # --------------------------------------------------------
│   │
│   ├── vision/
│   │   │
│   │   ├── models/
│   │   │   ├── pose/
│   │   │   ├── ball/
│   │   │   ├── racket/
│   │   │   └── court/
│   │   │
│   │   ├── detectors/
│   │   │   ├── pose_detector.py
│   │   │   ├── ball_detector.py
│   │   │   ├── racket_detector.py
│   │   │   └── court_detector.py
│   │   │
│   │   ├── tracking/
│   │   │   ├── player_tracker.py
│   │   │   ├── ball_tracker.py
│   │   │   └── racket_tracker.py
│   │   │
│   │   ├── geometry/
│   │   │   ├── court_geometry.py
│   │   │   ├── perspective.py
│   │   │   ├── coordinates.py
│   │   │   ├── distance.py
│   │   │   └── calibration.py
│   │   │
│   │   ├── trajectory/
│   │   │   ├── velocity.py
│   │   │   ├── direction.py
│   │   │   ├── bounce_detection.py
│   │   │   ├── contact_detection.py
│   │   │   └── trajectory_predictor.py
│   │   │
│   │   └── pipeline/
│   │       ├── vision_pipeline.py
│   │       └── frame_processor.py
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # TENNIS COACH ENGINE
│   │   # --------------------------------------------------------
│   │
│   ├── coach-engine/
│   │   │
│   │   ├── engine/
│   │   │   ├── coach_engine.py
│   │   │   ├── state_machine.py
│   │   │   ├── context.py
│   │   │   └── decision_engine.py
│   │   │
│   │   ├── rally/
│   │   │   ├── rally_state.py
│   │   │   ├── opponent_hit.py
│   │   │   ├── incoming_ball.py
│   │   │   ├── stroke_prediction.py
│   │   │   └── contact_prediction.py
│   │   │
│   │   ├── strokes/
│   │   │   ├── forehand.py
│   │   │   ├── backhand.py
│   │   │   ├── serve.py
│   │   │   ├── volley.py
│   │   │   └── smash.py
│   │   │
│   │   ├── movement/
│   │   │   ├── ready_position.py
│   │   │   ├── split_step.py
│   │   │   ├── footwork.py
│   │   │   ├── court_position.py
│   │   │   └── recovery.py
│   │   │
│   │   ├── biomechanics/
│   │   │   ├── joint_angles.py
│   │   │   ├── shoulder_rotation.py
│   │   │   ├── knee_bend.py
│   │   │   ├── body_rotation.py
│   │   │   ├── balance.py
│   │   │   └── weight_transfer.py
│   │   │
│   │   ├── rules/
│   │   │   ├── forehand_rules.py
│   │   │   ├── backhand_rules.py
│   │   │   ├── serve_rules.py
│   │   │   ├── footwork_rules.py
│   │   │   └── positioning_rules.py
│   │   │
│   │   ├── feedback/
│   │   │   ├── feedback_selector.py
│   │   │   ├── priority_engine.py
│   │   │   ├── instruction_timing.py
│   │   │   ├── instruction_queue.py
│   │   │   └── cooldown_manager.py
│   │   │
│   │   └── tests/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # AUDIO COACH
│   │   # --------------------------------------------------------
│   │
│   ├── audio-coach/
│   │   ├── instructions/
│   │   │   ├── bg/
│   │   │   └── en/
│   │   ├── audio_engine.py
│   │   ├── instruction_mapper.py
│   │   ├── audio_queue.py
│   │   └── speech_priority.py
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # TRAINING GENERATION
│   │   # --------------------------------------------------------
│   │
│   ├── training-engine/
│   │   ├── plans/
│   │   ├── exercises/
│   │   ├── session-builder/
│   │   ├── difficulty/
│   │   ├── personalization/
│   │   ├── progression/
│   │   └── recommendations/
│   │
│   │
│   │   # --------------------------------------------------------
│   │   # POST-SESSION ANALYSIS
│   │   # --------------------------------------------------------
│   │
│   └── analysis/
│       ├── stroke-analyzer/
│       ├── movement-analyzer/
│       ├── error-detector/
│       ├── reference-comparison/
│       ├── session-score/
│       ├── progress-tracker/
│       └── recommendations/
│
│
│   # ============================================================
│   # TENNIS KNOWLEDGE BASE
│   # ============================================================
│
├── tennis/
│   │
│   ├── strokes/
│   │   ├── forehand.yaml
│   │   ├── backhand.yaml
│   │   ├── serve.yaml
│   │   ├── volley.yaml
│   │   └── smash.yaml
│   │
│   ├── movement/
│   │   ├── ready-position.yaml
│   │   ├── split-step.yaml
│   │   ├── footwork.yaml
│   │   ├── positioning.yaml
│   │   └── recovery.yaml
│   │
│   ├── biomechanics/
│   │   ├── joints.yaml
│   │   ├── body-angles.yaml
│   │   └── technique-thresholds.yaml
│   │
│   ├── coaching/
│   │   ├── instructions.bg.yaml
│   │   ├── instructions.en.yaml
│   │   ├── priorities.yaml
│   │   └── timing.yaml
│   │
│   └── levels/
│       ├── beginner.yaml
│       ├── intermediate.yaml
│       └── advanced.yaml
│
│
│   # ============================================================
│   # REFERENCE MOVEMENTS
│   # ============================================================
│
├── reference-movements/
│   │
│   ├── forehand/
│   │   ├── reference.json
│   │   ├── phases.json
│   │   └── thresholds.json
│   │
│   ├── backhand/
│   │   ├── reference.json
│   │   ├── phases.json
│   │   └── thresholds.json
│   │
│   ├── serve/
│   │   ├── reference.json
│   │   ├── phases.json
│   │   └── thresholds.json
│   │
│   └── movement/
│       ├── ready-position.json
│       ├── split-step.json
│       └── recovery.json
│
│
│   # ============================================================
│   # DATABASE
│   # ============================================================
│
├── database/
│   │
│   ├── schema/
│   │   ├── users.sql
│   │   ├── user-profiles.sql
│   │   ├── auth-accounts.sql
│   │   ├── sessions.sql
│   │   ├── two-factor.sql
│   │   ├── subscriptions.sql
│   │   ├── payments.sql
│   │   ├── training-plans.sql
│   │   ├── training-sessions.sql
│   │   ├── strokes.sql
│   │   ├── coaching-feedback.sql
│   │   ├── player-progress.sql
│   │   └── audit-logs.sql
│   │
│   ├── migrations/
│   ├── seeds/
│   └── fixtures/
│
│
│   # ============================================================
│   # SHARED PACKAGES
│   # ============================================================
│
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   ├── geometry/
│   ├── tennis-types/
│   ├── realtime-protocol/
│   ├── auth-types/
│   └── billing-types/
│
│
│   # ============================================================
│   # TESTING
│   # ============================================================
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── auth/
│   ├── payments/
│   ├── realtime/
│   ├── vision/
│   ├── coach-engine/
│   ├── training/
│   ├── security/
│   └── performance/
│
│
│   # ============================================================
│   # DEVELOPMENT / TEST DATA
│   # ============================================================
│
├── datasets/
│   ├── samples/
│   ├── test-videos/
│   ├── pose-samples/
│   ├── ball-tracking/
│   ├── court-samples/
│   └── reference-strokes/
│
│
│   # ============================================================
│   # INFRASTRUCTURE
│   # ============================================================
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── deployment/
│   ├── monitoring/
│   ├── logging/
│   └── security/
│
│
│   # ============================================================
│   # SCRIPTS
│   # ============================================================
│
└── scripts/
    ├── setup.sh
    ├── dev.sh
    ├── build.sh
    ├── test.sh
    ├── seed-db.sh
    └── deploy.sh