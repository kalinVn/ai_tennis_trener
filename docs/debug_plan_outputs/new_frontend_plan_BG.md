# Доклад от debug изпълнението на frontend планирането

## 1. Запис на изпълнението

- Команда: `debug_frontend_plan`.
- Спецификация: `docs/frontend/frontend.md`.
- Дата на изпълнение: `2026-10-08`.
- Резултат: `blocked`; независима валидация на плана: `invalid`; `validated_plan: null`.
- Извиквания на валидатора: 1. Завършени прегледи на плана спрямо източниците: 1. Опити за корекция на плана: 0.
- Структурираният резултат съдържа 6 грешки и 2 предупреждения. Необходимите продуктови решения и договори спират следващите опити за корекция според `.codex/workflows/frontend-planning.md`. Това е отхвърлен частичен план, а не одобрение за имплементация.
- При старта имаше съществуващи промени в документацията и те са запазени. Това изпълнение записва само двойката английски/български доклади.

### Източници и приоритет

Прегледан контекст за планиране: `AGENTS.md`, `.codex/skills/debug-frontend-plan/SKILL.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md`, `.codex/references/frontend-architecture.md` и приложимите му референции в `claude/skills/frontend-code-architect/`.

Продуктови източници: `docs/frontend/frontend.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`, `docs/frontend/layouts.md`. Старият `docs/frontend/design-plan.md` и предишните debug доклади не са авторитетни заместители на тези източници.

Доказателствата включват каталога, HTML страниците/layout-ите/компонентите и споделените стилове в `prototypes/design/`, специализираните навигационни прототипи, примерите за field/form/navigation/card/Button/camera, Vue входния компонент и controller на slider-а, `prototypes/home/main.js` и организационния auth пример в `prototypes/modules/user/`. Прототипният код подпомага решенията за преизползване и собственост на ресурсите, но не определя production backend договори. Действителната директория `frontend/` и реферираните пътища са проверени. Валидаторът независимо прочете текущите спецификации и приложимите оригинални прототипи/код. Не са извършвани рендериране в браузър или implementation тестове.

Активните инструкции запазват TypeScript и backend като авторитет. Текущите спецификации имат предимство пред прототипите; специализираната навигация има предимство пред вградената; действителните визуални референции имат предимство пред общите дизайн стойности по подразбиране. Текущата slider референция е съществуващият Vue компонент, Checkout е с име `checkout`, а Application Layout сочи към `prototypes/design/layouts/application.html`. Тези предишни дефектни дефиниции вече не блокират този проект.

## 2. План за frontend имплементация — отхвърлен частичен проект

### Тип на frontend

`new`. Директорията на приложението `frontend/` съдържа placeholder съдържание; предложените файлове по-долу са бъдеща работа. Това е частичен план, който очаква задължителни решения по източниците.

### Структура на проекта

Запазват се Vue 3, TypeScript, Vite, Vue Router и Pinia. Всички пътища по-долу са относителни спрямо `frontend/src/`. Pinia се инициализира еднократно. Шаблоните/минималното свързване остават във Vue, поведението — във външен TypeScript, API достъпът — в services, споделеното състояние/действия — в stores, а локалното UI състояние — в composables. Никога не се съхраняват secrets. Споделените `components/`, `composables/`, `services/`, `stores/`, `router/`, `styles/`, `assets/` остават извън модулите. Feature assets и helpers остават при собственика си; няма празни файлове за поведение на пасивни изгледи.

| Модул | Изгледи в pages/ на модула | Поведение, services и състояние в същия модул |
| --- | --- | --- |
| `public` | `HomePage.vue`, `FeaturesPage.vue`, `PricingPage.vue`, `NotFoundPage.vue` | `composables/usePricingPage.ts` делегира действията за планове към subscription; Home поведението принадлежи на неговите features |
| `auth` | Login/registration използва `components/AuthModal.vue`; provider/challenge интерфейсите очакват договори | `composables/useAuthForm.ts`, `services/authService.ts`; споделеният собственик на сесията е общият за приложението `stores/AuthStore.ts` |
| `dashboard` | `DashboardPage.vue` | `composables/useDashboardPage.ts`, `stores/DashboardStore.ts`, `services/dashboardService.ts` притежават loading и обзорните данни |
| `training` | `TrainingPage.vue` | `composables/useTrainingPage.ts`, `stores/TrainingSessionStore.ts`; camera/analysis/audio collaborators са изброени по-долу |
| `sessions` | `HistoryPage.vue`; интерфейсът Session Review не е уточнен | `composables/useHistoryPage.ts`, `stores/TrainingHistoryStore.ts`, `services/sessionService.ts` |
| `progress` | Интерфейсът не е уточнен | Модулът притежава представянето на trends и next-focus; конкретните файлове очакват решения за екран/данни |
| `subscription` | `SubscriptionPage.vue`, `CheckoutPage.vue` | `composables/useSubscriptionPage.ts`, `composables/useCheckoutPage.ts`, `stores/SubscriptionStore.ts`, `stores/CheckoutStore.ts`, `services/subscriptionService.ts` |
| `account` | `ProfilePage.vue`, `SettingsPage.vue` | `composables/useProfilePage.ts`, `composables/useSettingsPage.ts`, `stores/UserStore.ts`, `services/accountService.ts` |

Основните директории на модулите са `modules/<module>/`. Stores извикват services и притежават споделените действия; страниците/features четат своя store директно. Общите компоненти запазват props/events. Локалните менюта, временните field стойности и collapse състоянието не се превръщат в application stores.

### Layout-и, routes и навигация

Използват се `layouts/PublicLayout.vue`, `AuthenticationLayout.vue`, `ApplicationLayout.vue`, `TrainingLayout.vue`. Public/auth layout-ите притежават branding, публична навигация, responsive съдържание/footer. Application/training притежават sidebar и основно съдържание; application притежава своя header. Споделеното свързване със сесията принадлежи в `composables/useLayoutNavigation.ts`. Визуалната Application референция е `prototypes/design/layouts/application.html`; специализираната навигация има предимство пред вградените примери.

| Път | Страница | Layout | Достъп / route име |
| --- | --- | --- | --- |
| `/` | HomePage | PublicLayout | Публичен / `home` |
| `/features` | FeaturesPage | PublicLayout | Публичен / `feature` |
| `/pricing` | PricingPage | PublicLayout | Публичен / `pricing` |
| `/training` | TrainingPage | TrainingLayout | Authenticated / `training` |
| `/dashboard` | DashboardPage | ApplicationLayout | Authenticated / `dashboard` |
| `/history` | HistoryPage | ApplicationLayout | Authenticated / няма зададено задължително име |
| `/subscription` | SubscriptionPage | ApplicationLayout | Authenticated / няма зададено задължително име |
| `/profile` | ProfilePage | ApplicationLayout | Authenticated / `profile` |
| `/settings` | SettingsPage | ApplicationLayout | Authenticated / `settings` |
| `/checkout` | CheckoutPage | ApplicationLayout | Authenticated / `checkout` |
| `/not-found` | NotFoundPage | PublicLayout | Публичен / `not-found` |

Регистрацията се реализира в `router/index.ts`, обработката на достъп/връщане — в `router/guards.ts`; непознатите URL адреси използват Not Found. Не се измислят Session Review/Progress/auth routes. Публичната навигация е Home, Training, Pricing, Login Modal; authenticated навигацията е Dashboard, Training, History, Subscription, Profile, Settings, Checkout. Поискани destinations се запазват през sign-in, навигацията се обновява незабавно при промяна на сесията и authenticated потребителите се пренасочват от auth, когато е приложимо. Backend остава авторитетът за authorization. Session Review и Progress са authenticated Application Layout интерфейси, чието точно разположение като страници/вградени интерфейси, paths/names, parameters и entry points остават изрично неуточнени в route спецификацията.

### Компоненти и композиция на страниците

- `components/buttons/Button.vue` използва `composables/ButtonController.ts`, адаптирайки прегледания `useButtonController`. Props: variant primary/secondary/ghost, size small/medium, type button/submit/reset, disabled/loading. Състояния: default, hover, active, focus-visible, disabled, loading. Disabled/loading предотвратяват активация; loading показва busy/spinner състояние. Излъчва се `click` с DOM event; няма callback props или business logic. Start Training и View Progress са употреби, а не компоненти. Няма съществуващ `to`/RouterLink режим; навигацията остава в parent handlers или link компоненти.
- `components/fields/` притежава TextField, NumberField, SelectField, DateField Vue изгледите. Споделеният `composables/useField.ts` заедно с `useTextField.ts`, `useNumberField.ts`, `useSelectField.ts`, `useDateField.ts` притежава UI обработката на стойности. Запазват се parent models, IDs, native attributes, празна числова стойност null, multiple selection, date strings без timezone conversion и достъпни labels.
- `components/forms/CollapseForm.vue` притежава само native expanded/collapsed състоянието, title/description и default/footer slots; няма behavior файл или schema renderer. Profile притежава конфигурациите и полетата на четирите си секции; Settings притежава действителните си prototype секции, validation/save/reset и slots. Не се извличат компоненти за секции.
- `components/navs/TopNav.vue`, `SidebarNav.vue` използват споделените `composables/useTopNav.ts`, `useSidebarNav.ts`. Запазват се parent destinations/current state, keyboard/Escape, responsive drawer focus containment, scroll locking и cleanup. Специализираната публична навигация определя видимите действия; legacy register event не изисква още един видим бутон.
- `components/tables/BaseTable.vue` притежава presentation title/columns/rows/rowKey/cell slots. `components/cards/FeatureCard.vue` притежава number/title/description. Никой от двата не достъпва services/stores и не изисква placeholder behavior файлове.
- `components/cards/PaymentPlanCard.vue` е единственият shared plan card за Pricing и Subscription. Boolean `selected` е false по подразбиране и променя само CSS; `active` представя текущия абонамент независимо от него. Родителят подава plan/price/features и обработва излъченото действие чрез shared Button. Последващата имплементация запазва PaymentPlanCard за избор на план и отделния PerformanceCard за Checkout summaries; BillingDetailsCard притежава отделния billing панел. Старото изискване за обединяване на props между различните концепции е отменено.
- `modules/subscription/components/PaymentInformationCard.vue` и `OrderSummaryCard.vue` запазват подадените от страницата display props, уникалните IDs, disabled masked/sample payment полета и parent-owned completion; няма placeholder composables. Checkout запазва PerformanceCard вляво над payment information, а summary е вдясно.
- Home използва `modules/public/components/HomePageInfoSection.vue` и `modules/public/composables/useHomePageInfoSection.ts` за съществуващото alignment/cleanup и parent-owned CTA действия чрез Button. `modules/public/components/home-page-video-slider/HomePageVideoSlider.vue` адаптира реалния Vue входен компонент. Локалните му `SliderController.ts`, `PixiRenderer.ts`, `VideoTimelineController.ts`, `PlayerAnalysisTimeline.ts`, `AnimationTimeline.ts`, `AudioTimeline.ts`, `AIMotionTrackingPanel.ts`, `SliderLifecycle.ts`, configuration, styles и media остават заедно. Controller композира, renderer притежава geometry/GPU ресурсите, timelines притежават timing, а всеки собственик почиства еднократно. Запазват се предвиденото playback и илюстративното status поведение; прегледът на кода не доказва, че prototype lifecycle е готов за production.
- Pricing използва Starter/Performance/Pro инстанции на shared card; околният DOM остава в страницата. Features преизползва FeatureCard/Button, а останалото съдържание е inline; използването на StatCard е None. Dashboard запазва статичните секции и Session History в страницата; layout осигурява header/sidebar. History използва BaseTable. Subscription използва shared plan card и BillingDetailsCard. Training запазва camera entry и панелите Coaching Cue, Connection и Session inline, с един съществуващ camera/modal flow и без измислени collapsible секции.

### Собственост при Training, Auth и интеграцията

В `modules/training/` компонентът `components/TrainingCamera.vue` използва `composables/useCameraSession.ts` за permission, запазване/смяна на избраното устройство, tracks, initialization cancellation и device errors. `components/CameraPreviewModal.vue` използва `composables/useCameraPreviewModal.ts` за dialog/scroll lifecycle, media attachment, local microphone mute, feedback derivation и close. Preview е muted; не се измисля microphone upload. Modal заявява освобождаване на tracks чрез camera owner. Closing/Escape/device loss/unmount освобождава всички ресурси; спирането само на analysis запазва preview.

`composables/useVideoAnalysis.ts` притежава paced capture/resize/formatting/cancellation; `services/trainingTransport.ts` притежава bounded transmission и connection/message lifecycle. Прототипните JPEG/WebSocket и JSON events не са одобрен production договор. Backend results се подават през съществуващия overlay slot и session feedback state. `composables/useAudioOutput.ts` притежава play/stop/pause/resume/interrupt, latest relevant cue, no overlap, errors и release отделно от transport. TrainingSessionStore натрупва stroke successes, mistakes, recommendations и summary; coordinator притежава global failure, а children почистват собствените си ресурси. Няма browser inference, per-frame LLM, измислени results или low-confidence съвети.

Auth обхваща email/password, Google, Apple, 2FA, required-field validation, requests, restoration докато сесията е валидна, session expiry/logout cleanup, errors и routing. Protocol/provider/challenge детайлите остават външни зависимости. Никога не се съхраняват credentials. Checkout използва създаден от backend provider-hosted checkout или protected provider fields със success/cancellation/failure/recovery състояния; няма raw card data или frontend billing authority. Data/transport договорите трябва да бъдат одобрени преди интеграцията; само недостъпната backend имплементация не блокира независимо тествана frontend работа.

### Дизайн, състояния и проверка

Използват се извлечените от източниците тъмнозелено `#07100c`, панели `#0d1913`, текст `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, radius `22px`, Inter/system typography, public container `1160px`, sidebar `244px`. Запазват се prototype spacing/hierarchy, responsive stacking и специализираните navigation breakpoints. Не е проверено съответствие на рендерирания резултат.

Обхващат се desktop/tablet/mobile, безопасно mobile Training състояние, липса на нежелан overflow, semantic labels, keyboard/focus, достъпни икони, достатъчен контраст, async announcements и reduced motion. Приложими състояния: initial/loading/empty/success/validation/recoverable error/unavailable/disconnected. Прототипните metrics/prices остават илюстративни.

Планират се Vitest route/access, component contracts и lifecycle тестове; Playwright page/navigation/login-return проверки, camera start/switch/permission/stop/exit, transport payload mocks, липса на transmission след stop, overlay/audio cleanup, checkout states, responsive screenshots и visual review. Включват се приложимите ESLint/static checks и production build. Използват се mocks спрямо одобрени договори, неразрешената backend работа се отчита отделно и симулирана функционалност не се представя като завършена. По време на планирането не се изпълняват implementation проверки.

### Отворени въпроси и блокери

| ID | Липсващо решение / източник | Въздействие и блокиране | Необходимо разрешаване |
| --- | --- | --- | --- |
| R1 | Записите Session Review и Progress в `docs/frontend/pages-and-routes.md` са изрично неуточнени | Блокира пълното покритие на екрани/routes/навигация | Определяне на отделни спрямо вградени интерфейси, component contract, paths/names при необходимост, parameters и entry points |
| R2 | CameraPreviewModal в `docs/frontend/components.md` няма production transport; основните auth/audio/data/checkout изискват договори | Блокира засегнатите интеграции и окончателните contract tests | Предоставяне или посочване на одобрени transport/auth/session/audio/data/payment договори; липсващ backend runtime не се смесва с липсващ договор |
| R3 | Историческа констатация за обединяване на plan cards | Отменена от последващия Pricing/Subscription обхват | Използват се текущите PaymentPlanCard и BillingDetailsCard договори; запазва се отделният Checkout PerformanceCard |

Старият slider HTML, дублираното Checkout име, грешната Application layout референция, Subscription StatCard изискването, противоречивите Button variants/ownership и липсващото Button/modal behavior mapping не се пренасят като текущи блокери. Features определя използването на StatCard като None и преизползва само FeatureCard/Button; предишното предупреждение за формулировката е разрешено.

### Ред за изграждане

1. Разрешаване на необходимите source decisions/contracts и независима валидация на пълния план.
2. Създаване на необходимите application structure, tooling, Pinia/router и design foundation/layouts.
3. Адаптиране на shared components и изричните им UI behavior договори.
4. Изграждане на module stores/services и feature components спрямо одобрените договори.
5. Композиране на pages/routes и session-aware navigation/access.
6. Интегриране на auth, camera/analysis/audio, данни и защитен checkout.
7. Проверка на responsive/accessibility/application states и resource lifecycle.
8. Изпълнение на необходимите тестове, static checks, production build и source-alignment review; разграничаване на завършената frontend работа от чакащата backend работа.

## 3. Констатации от валидацията

Независимият валидатор прочете текущите спецификации и оригиналните референции и върна `status: invalid`, `validated_plan: null`. Workflow-ът спря преди корекция, защото грешките за routes/surfaces и integration contracts изискват авторитетни потребителски или продуктови решения.

| ID | Засегнат раздел и източник | Проблем / блокиращо въздействие | Необходимо разрешаване |
| --- | --- | --- | --- |
| R1 | Layouts/routes — `docs/frontend/pages-and-routes.md`, Session Review | Окончателните surface, route/name, session-selection parameters и entry point са неуточнени | Решение за separate спрямо embedded presentation, component/page contract, route path/name ако е separate, session identifier/selection и navigation entry point |
| R2 | Layouts/routes — `docs/frontend/pages-and-routes.md`, Progress | Задължителните surface, route/name, parameters и navigation destination са неуточнени; Dashboard/prototype evidence изрично е недостатъчно | Определяне на Progress page или embedded contract, path/name ако е separate, parameters и authenticated entry point |
| R3 | Training integration — `docs/frontend/components.md`, CameraPreviewModal; основните Analysis Client и Acceptance Criterion 4 | Прототипният JPEG/WebSocket flow не е одобрен production contract; липсват endpoint, authentication, schemas, confidence/error, cancellation и reconnection правила | Определяне на авторитетен analysis transport contract, който покрива всички тези поведения |
| R4 | Auth/session/data/audio/checkout — основните Authentication, Audio Output, Coaching Feedback, Subscription и backend boundary | Google/Apple/2FA, session lifecycle, application data, audio commands и secure checkout/customer-portal договорите не са идентифицирани | Предоставяне на авторитетни backend/provider договори и mapping на request/response/error/cancellation states без обработка на raw card данни |
| R5 | Project Structure и Layouts — `docs/frontend/layouts.md`, Authentication Layout | `AuthenticationLayout.vue` е планиран, но няма определени page, route, modal host или друг consumer | Определяне как участва в modal auth, включително owner и composition, или авторитетната му замяна без добавяне на неподдържан auth route |
| R6 | Design, States and Verification — основните Required Application States и Acceptance Criterion 6 | Глобалният списък със states не е съпоставен към всяка data-bearing страница/интеграция, нейния owner, recovery action или non-fabrication behavior | Добавяне на state matrix или еквивалентни детайли за Dashboard, History, Session Review, Progress, Subscription, Profile, Settings, auth и checkout |

| ID | Източник | Неблокиращо предупреждение | Действие |
| --- | --- | --- | --- |
| W1 | Основните visual acceptance criteria и `.codex/rules/frontend-planning.md` | Source inspection не установява rendered desktop/tablet/mobile или interaction alignment | Изпълнение на планираните Playwright screenshots и semantic visual review по време на имплементацията |
| W2 | Open Questions and Blockers; `docs/frontend/pages-and-routes.md`, Features | Разрешено: Features вече определя използването на StatCard като None | Запазване на текущите PaymentPlanCard/BillingDetailsCard/PerformanceCard договори; не е необходим StatCard компонент |

Коригираната slider референция, уникалното Checkout route име, Application Layout референцията, shared Button договорът и разположението на Button/modal поведението са подкрепени от текущите източници. Старото Subscription StatCard изискване е премахнато. Нова self-validation оценка не заменя независимия резултат и нито един бъдещ тест не е отчетен като преминал.

## 4. Статус на спиране

`STOP`: само планиране. Английски изход: `docs/debug_plan_outputs/new_frontend_plan_N.md`. Български изход: `docs/debug_plan_outputs/new_frontend_plan_BG.md`, преведен от точния записан английски доклад. По време на това изпълнение не са извършвани source/specification/configuration промени, имплементация, builds, dependency installations или deployment.
