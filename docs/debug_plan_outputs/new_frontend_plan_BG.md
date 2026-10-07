# Доклад от debug изпълнението на frontend планирането

## 1. Запис на изпълнението

- Команда: `debug_frontend_plan`.
- Изрично зададена спецификация: `docs/frontend/frontend.md`.
- Дата на изпълнение: `2026-10-07`; ново изпълнение, което заменя фиксираната двойка изходни файлове.
- Резултат от изпълнението: `blocked`; статус от независимата валидация: `invalid`; `validated_plan: null`.
- Извиквания на валидатора: 1. Опити за корекция: 0.
- Независимият валидатор върна пълен структуриран резултат с 9 грешки и 2 предупреждения. При това изпълнение не възникна отказът на валидатора от предишното изпълнение.
- Липсващите задължителни източници и необходимите решения по спецификацията спират цикъла за корекции според `.codex/workflows/frontend-planning.md`, раздел 3. Проектът по-долу е пълният отхвърлен вариант, запазен без промени; той не е одобрен за имплементация. Отбелязани остават и поправимите пропуски в плана.
- Предварително съществуващи untracked директории: `.agents/`, `.codex/`, `docs/debug_plan_outputs/`. Това изпълнение записва само двата файла с доклада.

### Прегледани източници и доказателства

Прегледани инструкции за планиране: `AGENTS.md`, `.agents/skills/debug-frontend-plan/SKILL.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md` и `.codex/references/frontend-architecture.md`.

Прегледани продуктови източници: `docs/frontend/frontend.md`, `docs/frontend/layouts.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`. Прегледан архитектурен контекст: входният документ, архитектурните правила, структурата/компонентите, жизненият цикъл/собствеността, workflow-ът за review и slider референцията в `claude/skills/frontend-code-architect/`; приложимите насоки за приоритет и дизайн в `claude/rules/frontend/frontend-design-system.md`.

Прегледът на изходния код обхвана `prototypes/design/index.html`, HTML заглавията и контролите на страници/layout-и/компоненти в `prototypes/design/`, общия `prototypes/design/style.css` и специализираните HTML прототипи за публична и authenticated навигация. Прегледаните приложими примерни реализации включват `prototypes/components/fields/TextField.vue`, `prototypes/composables/useField.js`, `prototypes/composables/useTextField.js`, `prototypes/components/forms/CollapseForm.vue`, `prototypes/components/navs/TopNav.vue`, `prototypes/components/training/TrainingCamera.vue`, `prototypes/design/components/buttons/Button.vue` и slider файловете `HomePageVideoSlider.vue` и `SliderController.js`. Независимият валидатор допълнително прегледа приложимите оригинални източници, включително `prototypes/components/modal/CameraPreviewModal.vue`. Директорията на приложението и липсващата HTML референция за slider-а бяха проверени на диска. Това е преглед на изходния код, а не проверка на визуализация в браузър.

Активните проектни инструкции запазват TypeScript. Основната спецификация и нейните авторитетни документи определят продуктовия обхват; специализираната навигация има предимство пред по-старите вградени примери, а прототипите имат предимство пред общите дизайн стойности по подразбиране. Референциите за страници, относителни спрямо каталога, се разрешават в `prototypes/design/pages/`. Липсващата slider референция не се заменя мълчаливо. Архитектурните решения следват наблюдаваното разделение между полета и composables, общите slot-based форми, споделената навигация, собствеността на slider ресурсите в рамките на feature-а и изключителната отговорност на backend за анализа.

## 2. План за frontend имплементация — отхвърлен частичен проект

### Тип на frontend

```text
new
```

Прегледаната директория на приложението `frontend/` съдържа само placeholder файлове. Това е частичен план за имплементация; неуточнените задължителни източници възпрепятстват одобрението.

### Структура на проекта

Запазват се Vue 3, TypeScript, Vite, Vue Router и Pinia. Всички предложени пътища на приложението са в `frontend/src/`; планирането им не означава, че съществуват. Споделените ресурси се разполагат в `components/`, `composables/`, `services/`, `stores/`, `router/`, `styles/` и `assets/`. Pinia се инициализира еднократно. API заявките се поставят в services, споделеното feature състояние/действия — в stores, а локалните взаимодействия — в composables. Vue изгледите съдържат шаблони, imports и минимално свързване; необходимото поведение е в отделни `.ts` файлове. Статичните изгледи не изискват празен файл за логика.

| Модул в `modules/` | Страници и отговорности | Предложено разположение на поведението и състоянието |
| --- | --- | --- |
| `public` | `pages/HomePage.vue`, `pages/FeaturesPage.vue`, `pages/PricingPage.vue`, `pages/NotFoundPage.vue`; начална страница и публично представяне | `composables/usePricingPage.ts` обработва избора на план; поведението на Home feature-а остава локално за неговите компоненти |
| `auth` | `components/AuthModal.vue`; интерфейсът за login/registration е подкрепен от прототипите, останалите provider интерфейси не са уточнени | `composables/useAuthForm.ts`, `services/authService.ts`; споделеният собственик на сесията `stores/AuthStore.ts` е извън модулите |
| `dashboard` | `pages/DashboardPage.vue`; обзор, следващо действие, последна активност и Session History | `composables/useDashboardPage.ts`, `stores/DashboardStore.ts`, `services/dashboardService.ts` в модула |
| `training` | `pages/TrainingPage.vue`, `components/TrainingCamera.vue`, `components/CameraPreviewModal.vue`; един training flow | `composables/useTrainingPage.ts`, `useCameraSession.ts`, `useVideoAnalysis.ts`, `useAudioOutput.ts`; `services/trainingTransport.ts`; `stores/TrainingSessionStore.ts` в модула |
| `sessions` | `pages/HistoryPage.vue`; договорът за екрана Session Review не е уточнен | `composables/useHistoryPage.ts`, `stores/TrainingHistoryStore.ts`, `services/sessionService.ts` в модула |
| `progress` | Изискваните тенденции, области за подобрение и следващ фокус; договорът за екран/route не е уточнен | Feature състоянието и service остават собственост на модула; конкретните файлове зависят от липсващия договор за екран/данни |
| `subscription` | `pages/SubscriptionPage.vue`, `pages/CheckoutPage.vue`; текущ план, billing и защитен checkout | `composables/useSubscriptionPage.ts`, `useCheckoutPage.ts`; `stores/SubscriptionStore.ts`, `CheckoutStore.ts`; `services/subscriptionService.ts` в модула |
| `account` | `pages/ProfilePage.vue`, `pages/SettingsPage.vue`; профил и предпочитания | `composables/useProfilePage.ts`, `useSettingsPage.ts`; `stores/UserStore.ts`, `services/accountService.ts` в модула |

Относителните имена на съседни файлове в клетките на таблицата използват изрично посочената директория. Това са предложени решения за собствеността, а не измислени backend интерфейси. Страниците и feature потребителите четат stores директно; общите преизползваеми компоненти получават props/events. Никога не се съхраняват пароли или secrets.

### Layout-и, routes и достъп

`PublicLayout.vue`, `AuthenticationLayout.vue`, `ApplicationLayout.vue` и `TrainingLayout.vue` се поставят в `layouts/`. Публичният и authentication layout притежават branding, публична навигация, responsive съдържание и footer. Application/training layout-ите притежават sidebar и основното съдържание; application header принадлежи на layout-а. Споделеното свързване на layout-а със сесията се поставя в `composables/useLayoutNavigation.ts`; навигационните компоненти притежават локалното поведение на menu/drawer.

| Route | Страница | Layout | Достъп и име от източника |
| --- | --- | --- | --- |
| `/` | `HomePage.vue` | `PublicLayout` | Публичен; `home` |
| `/features` | `FeaturesPage.vue` | `PublicLayout` | Публичен; `feature` |
| `/pricing` | `PricingPage.vue` | `PublicLayout` | Публичен; `pricing` |
| `/training` | `TrainingPage.vue` | `TrainingLayout` | Authenticated; `training`; достъпът като гост задейства login |
| `/dashboard` | `DashboardPage.vue` | `ApplicationLayout` | Защитен; `dashboard` |
| `/history` | `HistoryPage.vue` | `ApplicationLayout` | Защитен; името не е посочено в източника |
| `/subscription` | `SubscriptionPage.vue` | `ApplicationLayout` | Защитен; името не е посочено в източника |
| `/profile` | `ProfilePage.vue` | `ApplicationLayout` | Защитен; `profile` |
| `/settings` | `SettingsPage.vue` | `ApplicationLayout` | Защитен; `settings` |
| `/checkout` | `CheckoutPage.vue` | `ApplicationLayout` | Защитен; източникът погрешно дублира `settings` |
| `/not-found` | `NotFoundPage.vue` | `PublicLayout` | Публичен; `not-found` |

За регистрацията се използва `router/index.ts`, а за поведението при достъп/връщане — `router/guards.ts`. Непознатите URL адреси водят към Not Found. Не се измислят routes за Session Review, Progress или authentication. Публичната навигация съдържа Home, Training, Pricing и Login Modal; authenticated навигацията съдържа Dashboard, Training, History, Subscription, Profile, Settings и Checkout. Липсващите екрани/навигационни цели се уточняват преди окончателното routing.

### Компоненти и композиция

- Споделеният `components/buttons/Button.vue` запазва primary/secondary, small/medium/large, default/hover/active/disabled/loading, button/submit и действия, управлявани от родителя. Отделно документираната употреба на ghost се уточнява преди финализиране на вариантите.
- Споделената `components/fields/` съдържа `TextField.vue`, `NumberField.vue`, `SelectField.vue`, `DateField.vue`; `composables/useField.ts` и съответните field composables притежават общото/специализираното поведение на стойностите. Запазват се управляваният от родителя model, IDs, native attributes, празната числова стойност, multiple selection и date strings без timezone conversion.
- Споделеният `components/forms/CollapseForm.vue` притежава само native expanded/collapsed състоянието; title/description и default/footer slots пренасят съдържанието, притежавано от страницата. Няма schema или store в контейнера и няма празен файл за поведение.
- Споделените `components/navs/TopNav.vue` и `SidebarNav.vue` използват `composables/useTopNav.ts` и `useSidebarNav.ts`. Родителят подава цели/текущо състояние; менютата притежават Escape, focus, scroll lock и почистването на listeners. Специализираните навигационни прототипи определят представянето; по-старото допълнително registration действие се съгласува с тях.
- Споделеният `components/tables/BaseTable.vue` получава title, columns, rows, row key и cell slots; няма service/store или ненужен composable. Споделеният `components/cards/FeatureCard.vue` получава number/title/description. `PaymentPlanCard.vue` в същото семейство обслужва Pricing и Subscription чрез display props и обработвано от родителя действие; няма payment логика.
- Home разполага `HomePageInfoSection.vue` с `composables/useHomePageInfoSection.ts` в public модула и `HomePageVideoSlider.vue` с неговите feature-local controller/rendering/timeline collaborators в `public/components/home-page-video-slider/`. Запазват се refs, async lifecycle, собствеността и изричното почистване; необходимото поведение се пренася към TypeScript. Визуалното съпоставяне на slider-а остава блокирано от липсващия рефериран HTML. Противоречията в Home композицията/CTA изискват разрешаване преди финализиране на секцията.
- Checkout притежава `subscription/components/PerformanceCard.vue`, `PaymentInformationCard.vue`, `OrderSummaryCard.vue`. Запазват се display-only props, уникалните IDs, disabled примерните payment полета и управляваното от родителя приключване; няма допълнителни файлове за поведение на пасивните карти. Уточнява се формулировката SelectedPlanCard спрямо PerformanceCard.
- Training композира директно съществуващия camera entry и панелите Coaching Cue, Connection и Session. Преизползва се един TrainingCamera/CameraPreviewModal flow; не се измислят collapsible форми или втори camera flow. Pricing запазва цялото съдържание извън PaymentPlanCard като DOM на страницата; Features преизползва само feature cards/buttons; Dashboard и History запазват статичните секции в DOM на страницата, с BaseTable за History. Subscription изисква все още неуточнен StatCard договор.
- Profile използва четири CollapseForm секции от своя прототип; Settings използва действителните секции от своя прототип. Page composables притежават field configuration, validation, save/reset и store actions; slot съдържанието остава в шаблоните на страниците. Не се създават компоненти за отделни секции и не се измислят полета.

### Интеграция и жизнен цикъл

Auth поддържа email/password, Google, Apple и 2FA според активните инструкции. Планират се required-field validation, backend requests, възстановяване на сесията докато е валидна, незабавно обновяване на навигацията, protected-route login/return, пренасочване на влезли потребители от auth, logout/expiry cleanup и ясни грешки. Backend притежава credential checks, валидността на сесията и permissions; provider/session протоколите остават неуточнени.

Camera притежава избора на устройство, permissions, tracks и cancellation по време на инициализация. Избраното устройство се запазва до промяна и се обработват denied/unavailable/lost устройства. Analysis притежава paced capture/resize/formatting и cancellation; transport притежава връзката и bounded sending. Спирането на analysis оставя preview достъпен; затваряне, Escape, загуба на устройство и unmount освобождават analysis и media ресурсите. Прототипните JPEG/WebSocket съобщения са само доказателство, а не одобрен production протокол.

Training session state натрупва backend stroke feedback, успехи, грешки, препоръки и обобщение. Audio логиката е отделена от transport: play/stop/pause/resume/interrupt, без припокриване, с приоритет на последната приложима инструкция, обработка на грешки и почистване на ресурсите. Координаторът притежава глобалната политика; всеки child почиства ресурсите си еднократно. Няма browser inference, per-frame LLM, измислени метрики или low-confidence съвети.

Checkout заявява създаден от backend provider-hosted checkout или protected provider fields; обхваща success, cancellation, failure и retry. Никога не се събират/съхраняват raw card data и отговорността за billing не се премества локално. Data services и contract tests очакват одобрени schemas; само липсата на backend имплементация не блокира изолирани frontend тестове.

### Дизайн, състояния и проверка

Tokens се извеждат от прегледаните прототипи: тъмнозелено `#07100c`, панели `#0d1913`, текст `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, panel radius `22px`, Inter/system typography, public container `1160px` и desktop sidebar `244px`. Запазват се визуалната йерархия, spacing, responsive grids и приоритетът на специализираната навигация. Тези наблюдения от изходния код не са визуална проверка на рендерирано съдържание.

Планират се desktop/tablet/mobile, безопасно mobile training състояние, липса на нежелан overflow, semantic labels, keyboard/focus, достъпни имена на икони, достатъчен контраст, async announcements и reduced motion. Включват се приложимите initial/loading/empty/success/validation/recoverable-error/unavailable/disconnected състояния. Прототипните данни остават изрично илюстративни.

Планират се Vitest route/access, component contracts и lifecycle тестове; Playwright routes, navigation, login returns, camera permission/switch/start/stop/exit, outgoing payload и result mocks, audio cleanup, checkout states, responsive и visual проверки. Включват се lint/static checks и production build. По време на планирането не са изпълнявани тестове, builds или проверки в браузър.

### Отворени въпроси и блокери

| ID | Въпрос и източник | Засегнати елементи / въздействие | Блокира ли | Необходимо разрешаване |
| --- | --- | --- | --- | --- |
| B1 | HomePageVideoSlider връзката в `docs/frontend/components.md` сочи към липсващия `prototypes/components/sliders/home-page-video-slider/index.html` | Задължителният визуален източник за slider-а е недостъпен | Да | Предоставяне или изрично коригиране на задължителната референция |
| B2 | Settings и Checkout в `docs/frontend/pages-and-routes.md` задават еднакво route име `settings` | Уникалното routing е невъзможно според зададеното | Да | Потвърждаване на коригираното Checkout име |
| B3 | User Types и Frontend Modules в `docs/frontend/frontend.md` изискват Session Review и Progress, които липсват в route спецификацията | Пълното покритие на екрани/навигация/достъп не може да бъде финализирано | Да | Определяне на екран, път, параметри, layout и цели; уточняване на останалите auth интерфейси |
| B4 | Application layout в `docs/frontend/layouts.md` сочи към authentication прототип | Описанието и референцията на layout-а си противоречат | Да, за окончателното визуално съпоставяне | Потвърждаване на правилния визуален източник при запазване на приоритета на специализираната навигация |
| B5 | Subscription в `docs/frontend/pages-and-routes.md` изисква недефиниран StatCard | Преизползването/props/разположението са непълни | Да | Определяне на предвидения компонент и договор |
| B6 | CameraPreviewModal в `docs/frontend/components.md` изрично няма реален backend transport договор; другите изисквани services нямат одобрен договор в предоставените frontend източници | Production analysis/audio/auth/data/checkout интеграцията не може да бъде специфицирана безопасно | Да, за интеграцията | Предоставяне на одобрени endpoint/auth/message/data/error/provider договори, без да се изисква backend имплементация тук |
| B7 | Home описанието/списъкът с компоненти спрямо HomePageInfoSection детайлите; Button вариантите спрямо CollapseForm ghost употребата; TopNav действията спрямо специализираната навигация; Checkout SelectedPlanCard спрямо PerformanceCard | Несъответствия в композицията и договорите на компонентите | Да, когато приоритетът не ги разрешава | Прилагане на декларирания навигационен приоритет; уточняване на неразрешените противоречия между авторитетните компонентни изисквания |

### Ред за изграждане

Само условна бъдеща работа:

1. Разрешаване на задължителните пропуски в източниците и договорите и независима валидация на пълен план.
2. Създаване на структурата/tooling на приложението, Pinia/router, design tokens и layout-и.
3. Адаптиране на споделените primitives и необходимите им договори за поведение.
4. Изграждане на module state/services и feature components спрямо одобрените договори.
5. Композиране на страници и routes с навигация и достъп, съобразени със сесията.
6. Интегриране на auth, camera/analysis/audio, данни и защитен checkout.
7. Проверка на responsive, accessibility и всички приложими състояния на приложението.
8. Изпълнение на необходимите тестове, static checks, production build и review за съответствие с източниците; отделно отчитане на оставащата backend работа.

## 3. Констатации от валидацията

Независим резултат: `status: invalid`, `validated_plan: null`. Всяка грешка блокира одобрението; зависещите от източниците грешки изискват информация извън корекциите на планиращия.

| ID | Засегнат раздел / изискване и източник | Установен проблем | Необходимо действие |
| --- | --- | --- | --- |
| E1 | B1 / задължителни визуални източници; `docs/frontend/components.md`, HomePageVideoSlider; planner, Resolve the Visual Prototypes | Задължителният slider HTML не съществува; записването на блокера не завършва валидацията на визуалния източник | Предоставяне на файла или изрично коригиране на референцията, след което преглед на одобрения източник |
| E2 | B2 / последователни routes; `docs/frontend/pages-and-routes.md`, Settings и Checkout | И двете route имена са `settings` | Потвърждаване на коригираното Checkout име и последователното му прилагане в routing, navigation и тестовете |
| E3 | B3 / задължителни екрани и цели; `docs/frontend/frontend.md`, User Types, Navigation Requirements, Frontend Modules; route спецификацията | За Session Review и Progress липсват дефинирани записи за екран/route | Уточняване дали са отделни страници или вградени интерфейси, след което задаване на paths или entry points, parameters, layout, access и destinations |
| E4 | B4 / последователно съпоставяне на layout; `docs/frontend/layouts.md`, Authenticated Application Layout; `prototypes/design/layouts/authentication.html` | Изискването за sidebar layout противоречи на свързания authentication пример | Потвърждаване на предвидената референция; `prototypes/design/layouts/application.html` е възможна корекция, а не одобрен заместител |
| E5 | B5 / договори на преизползваеми компоненти; route спецификацията, Subscription; компонентната спецификация; `prototypes/design/pages/subscription.html` | StatCard не е дефиниран, включително връзката му с картите за текущ абонамент и billing | Уточняване на името, потребителите, отговорностите и договора на компонента |
| E6 | B6 / одобрени integration договори; основните Analysis Client, Audio Output и Authentication; компонентът CameraPreviewModal; `AGENTS.md`, Product architecture | Production transport е изрично недефиниран; authentication/provider/session протоколите остават неуточнени | Посочване на одобрени analysis/audio/authentication договори, transport authentication, messages, errors и session/provider behavior; разграничаване на пропуските в договорите от недостъпна backend имплементация |
| E7 | B7 / последователни авторитетни компонентни изисквания; route Home и Checkout; компонентите Button, CollapseForm и HomePageInfoSection | Директна Home-left композиция спрямо задължителната секция, shared спрямо inline Home buttons, ghost спрямо изброените Button варианти, SelectedPlanCard спрямо PerformanceCard | Разрешаване на всяко авторитетно противоречие и записване на едно конкретно решение за композиция/вариант |
| E8 | Project Structure и Components / външно поведение за всеки компонент; planner Output Contract; `prototypes/design/components/buttons/Button.vue`; `prototypes/components/modal/CameraPreviewModal.vue` | За Button липсва външен файл за поведение; за CameraPreviewModal липсва изрично разпределение на собствеността/файловете за lifecycle, media attachment, mute, feedback derivation и closure | Разпределяне на Button loading/disabled/click поведението и modal поведението към външни TypeScript собственици без дублиране на собствеността на media ресурсите |
| E9 | Integration and Lifecycle / modal controls и results; основните Feature Components, Frontend Modules, Frontend / Backend Boundary; компонентът CameraPreviewModal и Vue прототипът му | Microphone capture/local mute, muted preview и backend-result overlay договорът не са изрично включени в проекта | Включване на тези controls и собственост в плана; определяне на подаването на results към overlays, без да се измисля microphone upload или browser inference |

| ID | Засегнат раздел / източник | Неблокиращо предупреждение | Препоръчано действие |
| --- | --- | --- | --- |
| W1 | B7 навигация; основните Navigation Requirements; `prototypes/design/components/navigation/public-navigation.html` | Приоритетът на специализираната навигация вече разрешава разликата с по-старото registration действие, въпреки че проектът я групира с противоречията | Отделяне на това разрешено визуално решение от неразрешените авторитетни противоречия; за тази разлика не е нужно уточнение от потребителя |
| W2 | Design, States and Verification; planning rules, Source Resolution; основните Verification and Testing | Review обхвана source markup, CSS и приложимата логика, а не рендерирания резултат в браузър; проектът правилно посочва това ограничение | Запазване на уточнението и изпълнение на responsive/visual сравнението при отделно разрешена проверка на имплементацията |

Не са изпълнявани implementation тестове, dependency installations, builds или проверки в браузър. Бъдещите тестове в плана не са резултати от преминали проверки. Тъй като остават задължителни блокери в източниците/решенията, не е предприета корекция или втора валидация.

## 4. Статус на спиране

`STOP`: само планиране; имплементация не е започната. Английският доклад се записва в `docs/debug_plan_outputs/new_frontend_plan_N.md`, а точно този записан доклад се превежда в `docs/debug_plan_outputs/new_frontend_plan_BG.md`. Запазват се структурата, стъпките, техническите идентификатори, пътищата, решенията и всички констатации. Единствените разрешени промени при това изпълнение са тази двойка доклади.
