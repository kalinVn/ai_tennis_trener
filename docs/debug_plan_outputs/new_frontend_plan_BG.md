# Доклад от debug изпълнението на frontend планирането

## 1. Запис на изпълнението

- Команда: `debug_frontend_plan`.
- Спецификация: `docs/frontend/frontend.md`.
- Дата на изпълнение: `2026-10-08`.
- Резултат: `blocked`; независима валидация на плана: `invalid`; `validated_plan: null`.
- Извиквания на валидатора: 1. Опити за корекция на плана: 0.
- Валидаторът откри 2 грешки и 2 предупреждения. Липсващото авторитетно решение за feedback ordering/replay спира correction loop-а незабавно според `.codex/workflows/frontend-planning.md`; пропускът в card contract-а също остава в този отхвърлен draft.
- Това изпълнение започна след промените по документацията в работното дърво. При планирането се записва само тази двойка доклади; промените в документацията бяха налични при старта.
- Имплементация, промени по приложния код, инсталиране на зависимости, build и deployment са извън обхвата на това изпълнение и не са извършвани.

### Източници и приоритет

Прочетени са `AGENTS.md`, `.codex/commands/debug_frontend_plan.md`, `.codex/workflows/frontend-planning.md`, `.codex/rules/frontend-planning.md`, `.codex/skills/plan-new-frontend-design.md`, `.codex/skills/frontend-plan-validator.md`, `.codex/skills/frontend-project-structure.md` и `.codex/references/frontend-architecture.md` заедно с приложимите архитектурни препратки в `claude/skills/frontend-code-architect/`.

Прочетени са авторитетните продуктови източници `docs/frontend/frontend.md`, `docs/frontend/pages-and-routes.md`, `docs/frontend/components.md`, `docs/frontend/layouts.md` и `docs/frontend/integration-contracts.md`. Визуалните и поведенческите източници включват каталога и посочените page/component/layout/navigation прототипи под `prototypes/design/`, както и съответните Vue и composable примери под `prototypes/components/` и `prototypes/composables/`. Проверена е директорията `frontend/`; тя съдържа placeholder съдържание, а не установена application имплементация.

Основните изисквания и изрично посочените авторитетни supporting документи имат предимство пред прототипите; специализираните navigation прототипи имат предимство пред вградените примери за навигация. Изходният код на прототипите показва визуално намерение и примерни поведения, а не production backend договор. Предложените integration примери са цел за планиране и frontend fixtures, а не доказателство за имплементирани endpoint-и или одобрение от backend екипа. Не е проверявано съответствие в рендериран браузър и не са изпълнявани имплементационни проверки.

## 2. План за имплементация на frontend-а

### Тип на frontend-а

`new` — Vue приложението ще бъде създадено под `frontend/`; съществуващият placeholder ще се запази до отделно разрешена имплементация. Този план не създава файлове.

### Структура на проекта

Използвайте `docs/frontend/frontend-project-structure.md` като единствен източник за физическата структура на frontend-а. Този доклад не я дефинира повторно.

### Layouts, routes, достъп и навигация

Имплементират се `PublicLayout`, `ApplicationLayout` и `TrainingLayout` според `docs/frontend/layouts.md`. Authentication остава dialog, хостван от Public Layout; не се създава неизползван самостоятелен Authentication Layout или login/register route. Application layout притежава authenticated header/sidebar. За изгледа и responsive поведението се използва специализираният authenticated navigation прототип.

| Път | Име | Страница | Layout | Достъп и параметри |
| --- | --- | --- | --- | --- |
| `/` | `home` | Home | Public Layout | Public |
| `/features` | `feature` | Features | Public Layout | Public |
| `/training` | `training` | Training | Training Layout | Authenticated |
| `/pricing` | `pricing` | Pricing | Public Layout | Public |
| `/dashboard` | `dashboard` | Dashboard | Authenticated Application Layout | Authenticated |
| `/history` | `history` | History | Authenticated Application Layout | Authenticated |
| `/sessions/:sessionId` | `session-review` | Session Review | Authenticated Application Layout | Authenticated; изисква непрозрачен `sessionId`; server разрешава достъпа |
| `/progress` | `progress` | Progress | Authenticated Application Layout | Authenticated; няма path параметър |
| `/subscription` | `subscription` | Subscription | Authenticated Application Layout | Authenticated |
| `/profile` | `profile` | Profile | Authenticated Application Layout | Authenticated |
| `/settings` | `settings` | Settings | Authenticated Application Layout | Authenticated |
| `/checkout` | `checkout` | Checkout | Authenticated Application Layout | Authenticated |
| `/not-found` | `not-found` | Not Found | Public Layout | Public; непознатите пътища се насочват тук |

Authenticated навигацията съдържа Dashboard, Training, History, Progress, Subscription, Profile, Settings и Checkout. Редовете за сесии в History и Dashboard водят към Session Review с върнатия от server session ID; Session Review е вложен в History и не е отделен елемент от основната навигация. В authenticated sidebar Progress е след History. Public навигацията показва Home, Training, Pricing и login dialog. По време на authentication се запазва валидирана вътрешна дестинация за връщане. Router guards подобряват само навигацията; backend authorization защитава всички данни и действия. Неуспешната проверка на сесията е unavailable, а не signed out; `401` и `403` остават различни.

### Shared компоненти и композиция на страниците

- `Button` осигурява presentation, UI state и излъчване на `click`. Запазват се документираните варианти `primary`, `secondary`, `ghost`; размери `small`, `medium`; типове `button`, `submit`, `reset`; Boolean `disabled` и `loading`. Loading/disabled спират активацията. Няма callback prop, business logic или `to`/RouterLink поведение. Родителят притежава действията и навигацията.
- Семейството shared fields включва `TextField`, `NumberField`, `SelectField`, `DateField`, според съществуващите field/composable конвенции. Запазват се parent-owned model стойности, native attributes, достъпни labels, `null` за празно числово поле, multiple selection и date string `YYYY-MM-DD` без timezone конверсия.
- `CollapseForm` е generic контейнер с title/description и default/footer slots, с native expanded/collapsed UI state; няма renderer за form schema. Profile и Settings притежават конфигурацията на секциите, стойностите, валидацията и действията.
- `TopNav` и `SidebarNav` запазват parent-owned линкове/current route и достъпното keyboard, focus, responsive drawer, Escape и cleanup поведение от съществуващите примери.
- `BaseTable` визуализира подадени title, columns, rows, row key и cell slots. `FeatureCard` показва номерираното feature съдържание. Нито един от тях няма достъп до stores или services.
- Един `PaymentCardPlan` се използва в Pricing и Subscription. Неговият `selected` prop променя само presentation; `statusLabel` независимо представя текущия абонамент. Родителят подава `planName`, форматиран `price`, optional `billingPeriod`, `description`/`features`, labels и обработва излъчените действия. `BillingDetailsCard` остава отделен billing panel само със съществуващите renewal и payment-method display полета. Checkout запазва отделните договори на `PerformanceCard`, `PaymentInformationCard` и `OrderSummaryCard`; disabled payment полетата приемат само sample/masked display текст и никога не събират данни за карта.
- Home използва повторно потвърдения `HomePageInfoSection` и Vue slider entry. Slider controller, renderer, timeline, configuration, styles и media остават в owning feature. Controller координира; renderer притежава графичните ресурси; всяка timeline притежава времето си; всеки resource owner извършва cleanup еднократно. Прегледът на източника не доказва готовност на lifecycle за production.
- Features използва повторно `FeatureCard` и `Button`; останалото съдържание на страницата остава page-level DOM. Dashboard, History, Subscription, Profile, Settings и Checkout следват page прототипите и конкретните composition правила в `pages-and-routes.md` и `components.md`.

### Integration договори и собственост

Използва се `docs/frontend/integration-contracts.md` като предложен пример за fixtures/API за authentication/session, training session lifecycle и versioned WebSocket analysis events, history/review/progress, dashboard/profile/settings, provider-hosted checkout и shared errors. Тези shapes са предложения, а не одобрени live backend interfaces. Frontend views и tests могат да бъдат планирани спрямо fixtures; live service интеграцията изисква потвърждение или адаптация от backend екипа.

- Authentication service управлява cookie-backed login/registration/session/logout, provider redirects, second-factor challenges, expiry и безопасна вътрешна дестинация за връщане. Backend притежава authentication authority, authorization, OAuth secret handling и валидността на сесията.
- Training camera логиката притежава получените media tracks и избраното устройство. `useCameraSession.ts` изброява наличните `videoinput` устройства след permission, запазва избраното устройство за активния training flow и предоставя switch действие. Смяната първо придобива replacement stream, атомарно го прави авторитетен за preview/capture и след това освобождава предишния stream чрез този единствен track owner; при неуспех се запазва използваемият текущ stream или се отчита unavailable, когато няма такъв. Device-change обработката открива премахване на избраната камера и предлага изричен fallback/retry, без мълчаливо да сменя активния stream. Capture/resize/cancellation принадлежи на analysis composable; ограниченото WebSocket изпращане/приемане принадлежи на training transport service. Camera modal притежава dialog lifecycle, media attachment, local mute и визуализацията на feedback в съществуващия overlay slot, като иска освобождаването на tracks от camera owner-а. `TrainingSessionStore.ts` съхранява server-issued `player_feedback` events по `eventId`, игнорира duplicates, свързва ги с текущата session и следи само поддържаните successful-stroke, mistake и recommendation classifications. Completion изпраща събраните feedback event IDs; backend проверява ownership и връща canonical summary, което заменя всяка provisional client aggregation. Текущият прототип спира tracks както от `CameraPreviewModal.cleanup()`, така и от `useCameraSession.stopCamera()`; имплементацията трябва да премахне двойното спиране и да запази camera session owner-а като единствен авторитет за освобождаване на tracks. Спирането на анализа спира capture/sending, но запазва preview; излизането или затварянето спира анализа и освобождава tracks. Няма browser inference, LLM в per-frame path, microphone upload или измислени/low-confidence съвети.
- Audio playback е отделен training owner в `useAudioOutput.ts`. Той предоставя start, stop, pause, resume и interrupt операции плюс авторитетно idle/loading/playing/paused/error състояние. Обработва backend `coaching_audio` команди, предотвратява застъпване, заменя или прекъсва playback детерминистично за последната релевантна инструкция с по-висок priority, отчита unavailable ресурси/playback failure без промяна на analysis truth и освобождава притежаваните media ресурси отделно от transport.
- Session review и progress показват само подкрепени от server стойности с техните units, времеви диапазони, availability и confidence/provenance. В browser-а не се изчисляват coaching заключения.
- Subscription стартира provider-hosted checkout само с plan identifier. Backend/provider обработва чувствителните payment данни и транзакции; backend webhooks се проверяват и са idempotent. Checkout success се показва само след backend verification, никога само по redirect query. Frontend никога не съхранява/обработва сурови card стойности.

### Дизайн, състояния на приложението, достъпност и план за проверка

Прилагат се визуалните tokens и структура от посочените прототипи и shared design правилата: тъмнозелено `#07100c`, panel `#0d1913`, текст `#f4f7f5`, muted `#a8b5ae`, lime `#b7ff4a`, cyan `#65e8ff`, radius `22px`, Inter/system typography, public container `1160px`, sidebar `244px`. Това са примери, извлечени от източниците; йерархията и responsive поведението на всяка страница се запазват. Не е проверено съответствие на рендериран резултат.

Имплементира се матрицата за състояния и възстановяване от `pages-and-routes.md`: loading, empty/insufficient data, success, validation, recoverable error, unavailable, disconnected, pending и verified completion според приложимостта. Състоянията на camera, transport, session, analysis, auth и billing остават отделни. Не се показват измислени metrics, sessions, analysis или payment state.

Поддържат се desktop/tablet/mobile, използваема навигация и training оформление на тесен екран, липса на нежелан хоризонтален overflow, семантични контроли, свързани labels, keyboard достъп, видим focus, достатъчен contrast, достъпни имена за икони, известяване за асинхронни промени и reduced motion.

Бъдеща последователност за проверка: unit tests за routes/access guards, field/Button и component договори, session state, analysis cancellation и cleanup; service tests спрямо примерните fixtures; integration tests за authentication return/error състояния, camera permission, device enumeration, успешна atomic switching, selected-device retention, removed-device failure/fallback, sole-owner stream cleanup и stop/unmount; тестове за audio start/stop/pause/resume/interrupt, overlap prevention, priority replacement, failure state и resource release; натрупване на per-stroke feedback и completed-session summary, transport disconnect/reconnect и липса на frame изпращане след stop, overlay cleanup, server-verified checkout return; responsive Playwright навигация и screenshots; lint/static checks и production build. Тези проверки не са изпълнявани по време на планирането. Fixture-backed функционалността не се представя за live backend интеграция.

### Отворени въпроси и блокери

| Въпрос или липсваща информация | Засегнати елементи на плана | Въздействие върху имплементацията | Блокиращо | Необходимо разрешаване |
| --- | --- | --- | --- | --- |
| Backend/product собствениците не са потвърдили предложените endpoint имена, schemas, transport semantics, authentication детайли, units, limits и provider mappings в `docs/frontend/integration-contracts.md`. | Live auth, training analysis/audio, session данни, progress, account данни, billing интеграция. | Frontend може да имплементира UI и fixtures спрямо примерите, но live service интеграцията трябва да изчака съгласуване с backend екипа. | Не за frontend структура/UI/fixture-backed работа; да за свързването на live services. | Backend собствениците потвърждават или адаптират всеки примерен договор преди live интеграцията му; договореното се записва при integration boundary. |

### Ред на изграждане

1. Преглед и запазване на съществуващия frontend placeholder; изграждане на плитката Vue/TypeScript/Vite структура и еднократна инициализация на router/Pinia.
2. Дефиниране на design tokens, accessibility основа, shared компоненти, Public/Application/Training layouts и auth dialog host.
3. Имплементиране на public страниците и authentication/session state спрямо примерните договори и честните pending/error състояния.
4. Имплементиране на Dashboard, History, Session Review и Progress страниците/routes със server-owned данни и управление на състоянието.
5. Имплементиране на Training camera lifecycle, ограничен analysis transport, feedback overlay, audio playback и cleanup граници.
6. Имплементиране на Profile и Settings спрямо account service договорите.
7. Имплементиране на Subscription и provider-hosted Checkout с backend-verified return състояния.
8. Проверка на responsive/accessibility и resource lifecycle поведението; изпълнение на tests, lint/static checks, production build и преглед спрямо източниците.
9. Всеки unavailable backend integration се отчита отделно; simulated функционалността не се обявява за завършена и не се прави deployment.

## 3. Констатации от валидацията

Независимият резултат е `status: invalid`, `validated_plan: null` след 1 извикване и 0 опита за корекция.

| Раздел и източник | Блокиращ проблем | Необходимо разрешаване |
| --- | --- | --- |
| Training feedback — `docs/frontend/frontend.md`, Coaching Feedback и Analysis Client; `docs/frontend/integration-contracts.md`, training transport/reconnect | `player_feedback` вече дефинира identity, deduplication и canonical completion, но няма ordering guarantee или replay/resume/catch-up правило след reconnect. Client-ът не може да знае дали са пропуснати events или дали изпратените `feedbackEventIds` са пълни. | Дефиниране на авторитетна monotonic sequence и resume cursor/replay поведение или изричен snapshot/review reconciliation contract, включително completion поведение при оставащи delivery gaps. След това се обновяват ownership и deterministic reconnect/completion tests. |
| Shared cards — `docs/frontend/components.md`, PaymentCardPlan и BillingDetailsCard | Планът именува shared cards, но пропуска част от новите им авторитетни props/events, така че downstream builders трябва да отварят източниците отново или да гадаят. | Записване на `PaymentCardPlan` props `planName`, `price`, `billingPeriod`, `description`, `features`, `statusLabel`, `selected`, `selectedLabel`, `actionLabel` и payload-free `action`; записване на `BillingDetailsCard` props `title`, `renewalText`, `paymentMethodText`, `actionLabel` и payload-free `action`, с page-owned behavior. |

| ID | Източник | Неблокиращо предупреждение | Необходимо последващо действие |
| --- | --- | --- | --- |
| W1 | `docs/frontend/integration-contracts.md` — Contract adoption; `docs/frontend/frontend.md` — Acceptance Criterion 9 | Endpoint names, schemas, limits, authentication details, transport semantics, units и provider mappings остават непотвърдени. Fixture-backed frontend работата може да продължи; live service connection остава блокиран. | Получаване на backend/product потвърждение или адаптация преди включване или заявяване на live integration. |
| W2 | `docs/frontend/frontend.md` — Acceptance Criterion 3; `.codex/skills/frontend-plan-validator.md` — Design and prototypes | Source markup/styles са проверими, но при планирането няма rendered-browser comparison. | Изпълнение на планираните Playwright screenshots и visual review след имплементацията; rendered alignment не се заявява преди тази проверка. |

Не са изпълнявани implementation tests, build, dependency installation, browser rendering или live integration checks по време на тази planning команда.

## 4. Статус на спиране

`STOP`: само планиране. Английски изход: `docs/debug_plan_outputs/new_frontend_plan_N.md`. Български изход: `docs/debug_plan_outputs/new_frontend_plan_BG.md`, преведен от този записан английски доклад. Това изпълнение не включва имплементация, създаване на source структура, инсталиране на зависимости, build или deployment.
