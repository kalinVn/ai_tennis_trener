## Required Pages and Routes


### Home Page
- purpose: `Main public entry page of the application`
- route: `/`
- layout: `Public Layout`
- Example Prototype: `design/pages/index.html`
- name: `home`
- required sections: `Left Section: application branding and introductory information, main headline, short introductory description, two primary action buttons, small statistic or information cards. Right Section: Animated Demo Banner, animated visual preview of the Tennis AI Coach training and AI analysis experience.`
- required shared components: `Button`, `StatCard`
- required feature components: `DemoBanner`
- dependencies: None

### Features
- purpose: `Public page that presents the core capabilities of the product and helps users understand what it can do.`
- route: `/features`
- layout: `Public Layout`
- Example Prototype: `design/pages/features.html`
- name: `feature`
- required sections: `Main Section: headline, short description, three StatCard items, two primary buttons.`
- required shared components: `Button`, `StatCard`
- required feature components: None
- dependencies: None

### Training
- purpose: `Primary page for real-time training where the user records strokes, sees instant analysis, and receives guidance.`
- route: `/training`
- layout: `Training Layout`
- Example Prototype: `design/pages/training.html`
- name: `training`
- required sections: `Main Section: headline, short description, three StatCard items, two primary buttons.`
- required shared components: `Button`, `StatCard`
- required feature components: None
- dependencies: None

### Pricing
- purpose: `Pricing page, presents the available subscription plans and helps users choose the right plan`
- route: `/pricing`
- Layout: `Public Layout`
- Example Prototype: `design/pages/pricing.html`
- name: `pricing`
- required sections: `The main section of the pricing page includes the page heading, a short introductory text, and three plan cards: Starter, Performance, and Pro.`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None

### Dashboard
- purpose: `Provides the user with an overview of their training activity, recent sessions, progress, and quick access to the main application features.`
- route: `/dashboard`
- layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/dashboard.html`
- name: `dashboard`
- required sections: `Overview Cards Section - contains three summary cards in a single row. Main Dashboard Section - contains one large primary card with the main dashboard information. Information Section - contains additional supporting information. Sidebar and top header are provided by the Authenticated Application Layout and are not part of the page sections..`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None


### History
- purpose: `allows the user to review previous training sessions, results, performance metrics, and past coaching feedback`
- Route: `/history`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/history.html`
- required sections: `Required Sections: History Section – contains the page heading and a short introductory description, and uses a grid layout with two components: TrainingSession and SessionInsights.`
- required shared components: `StatCard`, `BaseTable`
- required feature components: None
- dependencies: `TrainingHistoryStore`

### Subscription
- purpose: `allows the user to view their current subscription plan, manage billing details, and change or upgrade their subscription.`
- Route: `/subscription`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/subscription.html`
- required sections: `Required section is the Subscription section, which includes a page heading, a short description, and two main cards: the Current Subscription Card and the Billing or Plan Management Card.`
- required shared components: `StatCard`
- required feature components: None
- dependencies: None

### Profile
- purpose: `Allow authenticated users to view and manage their profile and account information.`
- Route: `/profile`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/profile.html`
- name: `profile`
- required sections: `The page contains a profile form with four collapsible forms`
- required shared components: `CollapsibleForm`
- required feature components: None
- dependencies: `UserStore`

### Settings

- Route: `/settings`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/settings.html`
- name: `settings`
- required sections: `The page contains a profile form with seven collapsible panels`
- required shared components: `CollapsibleForm`
- required feature components: None
- dependencies: `UserStore`

### Not Found

- Route: `/not-found`
- Layout: `Public Layout`
- Example Prototype: `design/pages/not-found.html`
- name: `not-found`
- required sections: `The page show 404 not found`
- required shared components: None
- required feature components: None
- dependencies: None


### Checkout

- Route: `/checkout`
- Layout: `Authenticated Application Layout`
- Example Prototype: `design/pages/checkout.html`
- name: `settings`
- required sections: `The Checkout page contains two main sections: a left section with SelectedPlanCard and PaymentInformationCard components stacked vertically, and a right section with an OrderSummaryCard component`
- required shared components:  None
- required feature components: `CollapsibleForm`, `PaymentInformationCard`, `OrderSummaryCard`
- dependencies: `CheckoutStore`

---

