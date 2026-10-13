function toggleDemo(button,first,second){button.dataset.active=button.dataset.active==='yes'?'no':'yes';button.textContent=button.dataset.active==='yes'?second:first;}
function showDemoNote(message){const n=document.getElementById('demo-note');if(n){n.textContent=message;n.hidden=false;}else alert(message);}

const prototypePagesURL = new URL('pages/', document.currentScript.src);
const prototypeAppScriptURL = new URL(document.currentScript.src);
const subscriptionPrototypeURL = new URL('components/subscription/subscription.html', prototypeAppScriptURL);
const checkoutPrototypeURL = new URL('components/checkout/checkout.html', prototypeAppScriptURL);
const isPrototypeApplicationPage = location.pathname.startsWith(prototypePagesURL.pathname) ||
  location.pathname === subscriptionPrototypeURL.pathname ||
  location.pathname === checkoutPrototypeURL.pathname;

// The HTML prototypes share no single Vue root. Load the same public feature
// entry from this common shell for every public/authenticated application page.
if (location.protocol !== 'file:' && isPrototypeApplicationPage) {
  const sourceEntry = new URL('../components/features/CookiePrivacyPolicy/mountCookiePrivacyPolicy.js', prototypeAppScriptURL).href;
  const buildEntry = new URL('../../assets/cookiePrivacyApp.js', prototypeAppScriptURL).href;
  import(sourceEntry).catch(() => import(buildEntry));
}

// Every application page uses the same consent record and one native-dialog
// modal for preferences and both policy views.
(() => {
  if (!isPrototypeApplicationPage) return;
  // Vite/browser builds mount CookiePrivacyPolicy.vue. Keep this implementation
  // only as a direct-file preview fallback where bare Vue imports cannot run.
  if (location.protocol !== 'file:') return;

  const storageKey = 'tennis-ai-coach.cookie-consent.v1';
  const readConsent = () => {
    try {
      const consent = JSON.parse(localStorage.getItem(storageKey));
      const categories = consent?.categories;
      if (
        consent?.version !== 1 || categories?.essential !== true ||
        typeof categories.analytics !== 'boolean' ||
        typeof categories.preference !== 'boolean' ||
        typeof categories.marketing !== 'boolean'
      ) return null;
      return consent;
    } catch {
      return null;
    }
  };

  const root = document.getElementById('cookie-consent-root') || document.createElement('div');
  root.id = 'cookie-consent-root';
  root.innerHTML = `
    <aside class="cookie-banner" aria-label="Cookie consent" role="region" hidden>
      <div class="cookie-banner__summary">
        <div>
          <div class="eyebrow">Your privacy choices</div>
          <h2>Cookies and related technologies</h2>
          <p>We use essential cookies for the application to work and, with your choice, cookies for analytics, preferences, and marketing or tracking.</p>
          <p class="cookie-banner__links">
            <button type="button" data-modal="cookie-policy">Cookie Policy</button>
            <button type="button" data-modal="privacy-policy">Privacy Policy</button>
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button class="btn primary" type="button" data-consent="accept_all">Accept All</button>
          <button class="btn" type="button" data-consent="reject_all">Reject All</button>
          <button class="btn ghost" type="button" data-modal="preferences" aria-haspopup="dialog">Manage Preferences</button>
        </div>
      </div>
    </aside>
    <dialog class="consent-modal" aria-labelledby="consent-modal-title">
      <section class="consent-modal__panel">
        <header class="consent-modal__header">
          <div><div class="eyebrow">Your privacy choices</div><h2 id="consent-modal-title"></h2></div>
          <button class="consent-modal__close" type="button" data-modal-close aria-label="Close">×</button>
        </header>
        <div class="consent-modal__body" data-modal-body></div>
        <footer class="consent-modal__footer" data-modal-footer></footer>
      </section>
    </dialog>`;
  if (!root.isConnected) document.body.append(root);

  const banner = root.querySelector('.cookie-banner');
  const modal = root.querySelector('.consent-modal');
  const modalTitle = root.querySelector('#consent-modal-title');
  const modalBody = root.querySelector('[data-modal-body]');
  const modalFooter = root.querySelector('[data-modal-footer]');
  const categoryField = name => root.querySelector(`[name="${name}"]`);
  const syncBanner = () => { banner.hidden = Boolean(readConsent()); };
  const closeModal = () => { if (modal.open) modal.close(); };

  const preferenceMarkup = `
    <div class="cookie-preference-grid">
      <label class="cookie-category"><strong>Essential <span class="pill">Always active</span></strong><span>Required for authentication, sessions, security, and application state.</span><input type="checkbox" checked disabled></label>
      <label class="cookie-category"><strong>Analytics</strong><span>Anonymous or aggregated product and traffic analytics.</span><input name="analytics" type="checkbox"></label>
      <label class="cookie-category"><strong>Preferences</strong><span>Optional interface and experience preferences.</span><input name="preference" type="checkbox"></label>
      <label class="cookie-category"><strong>Marketing</strong><span>Optional advertising, remarketing, pixels, or other tracking.</span><input name="marketing" type="checkbox"></label>
    </div>`;
  const cookiePolicyMarkup = `
    <p>This Cookie Policy explains how Tennis AI Coach uses cookies and similar browser technologies, what each category is intended to do, and how you can control your choices.</p>
    <h3>What are cookies and similar technologies?</h3>
    <p>Cookies are small data files stored by a website in your browser. Similar technologies include local storage, pixels, and device identifiers. This prototype currently uses browser local storage only to remember your consent choice and does not initialize analytics, advertising, or marketing services.</p>
    <h3>Categories we present</h3>
    <ul>
      <li><strong>Essential:</strong> required for authentication, session continuity, security, consent storage, and core application operation. This category cannot be disabled.</li>
      <li><strong>Analytics:</strong> optional measurement intended to help understand product usage, performance, and errors.</li>
      <li><strong>Preferences:</strong> optional storage intended to remember interface, language, accessibility, and experience settings.</li>
      <li><strong>Marketing:</strong> optional technologies intended for campaign measurement, remarketing, or other advertising-related activity.</li>
    </ul>
    <h3>Your consent choices</h3>
    <p>You can accept all optional categories, reject all optional categories, or select categories individually. Essential storage remains active. Opening or closing this policy does not save a consent decision.</p>
    <h3>Changing or withdrawing consent</h3>
    <p>Use <strong>Cookie Settings</strong> in the footer at any time to reopen Manage Preferences. A new saved selection replaces the previous browser-local consent record.</p>
    <h3>Storage duration</h3>
    <p>The prototype stores a versioned consent record in local storage until it is replaced, cleared through browser controls, or invalidated by a future consent version. Production cookie durations must be documented here before launch.</p>
    <h3>Third-party technologies</h3>
    <p>No third-party analytics or marketing provider is activated by this prototype. Any production vendors, purposes, cookie names, and retention periods must be listed here before those technologies are enabled.</p>
    <h3>Browser controls</h3>
    <p>You can also delete or block cookies and local storage through your browser settings. Blocking essential storage may prevent parts of the application from working correctly.</p>
    <h3>Updates and contact</h3>
    <p>Material changes to this policy should be reflected by a new effective date and, where required, a renewed consent request. Production controller identity and privacy contact details must be added before launch.</p>
    <h3>Prototype status</h3>
    <p>This content describes the intended consent experience and is not final legal advice or approved legal text. It requires legal review and production-specific controller, vendor, duration, and regional details.</p>`;
  const privacyPolicyMarkup = `
    <p>This Privacy Policy describes the personal data Tennis AI Coach is expected to process, why it may be needed, and the choices and rights available to users. The current visual prototype does not submit account or training data to a backend.</p>
    <h3>Who is responsible for your data?</h3>
    <p>The production policy must identify the legal entity acting as data controller, its registered address, and a working privacy contact before launch. Those details are intentionally not fabricated in this prototype.</p>
    <h3>Data we may process</h3>
    <ul>
      <li><strong>Account and identity:</strong> name, email address, phone number, authentication records, profile details, and account preferences.</li>
      <li><strong>Training and performance:</strong> session metadata, camera-derived pose and movement analysis, coaching feedback, and video retained under your settings.</li>
      <li><strong>Device and technical:</strong> browser or device information, security events, diagnostics, IP-derived technical data, and camera or microphone permission state.</li>
      <li><strong>Subscription and support:</strong> plan status, transaction references supplied by a payment provider, and messages sent to support. Raw payment-card data should be handled by the payment provider, not stored by this application.</li>
      <li><strong>Consent and preferences:</strong> cookie-category choices and product, accessibility, language, or notification settings.</li>
    </ul>
    <h3>Why we may use data</h3>
    <p>Expected purposes include providing and securing accounts, delivering live and recorded coaching features, managing subscriptions, responding to support, improving reliability, and meeting legal obligations. Production lawful bases must be mapped to each purpose after legal review.</p>
    <h3>Camera, microphone, and training analysis</h3>
    <p>Device access should occur only after a clear user action and browser permission. Production documentation must distinguish live processing, uploaded frames, retained recordings, derived pose data, and coaching results, including whether processing occurs locally or on a server.</p>
    <h3>Sharing and service providers</h3>
    <p>Data should be shared only with authorized service providers needed for hosting, storage, authentication, payments, communications, monitoring, or support, and when required by law. Production vendors and their roles must be documented before launch.</p>
    <h3>International transfers</h3>
    <p>If data is processed outside the user's country, the production policy must identify the transfer locations and applicable safeguards, such as adequacy decisions or contractual protections.</p>
    <h3>Retention</h3>
    <p>Personal data should be retained only as long as necessary for the stated purpose, account operation, security, dispute resolution, or legal obligations. Production retention periods for account, training, video, billing, support, and diagnostic data must be specified.</p>
    <h3>Security</h3>
    <p>Expected safeguards include access controls, encryption in transit, protected credentials, audit logging, and separation of video-processing workloads. No system can guarantee absolute security.</p>
    <h3>Your rights and choices</h3>
    <p>Depending on location, users may have rights to access, correct, delete, restrict, object to, or receive a copy of their data, and to withdraw consent without affecting earlier lawful processing. The production contact and request-verification process must be provided.</p>
    <h3>Children</h3>
    <p>The production service must define its permitted age range and any parental-consent process required by the regions where it operates. The prototype does not establish those rules.</p>
    <h3>Cookies and consent</h3>
    <p>Cookie Settings controls optional Analytics, Preferences, and Marketing categories. Essential storage remains active. See the Cookie Policy in this consent interface for more information.</p>
    <h3>Updates and contact</h3>
    <p>Material changes should be communicated with an effective date and, when required, renewed consent. Controller, privacy contact, complaint channel, and supervisory-authority information must be added before launch.</p>
    <h3>Prototype status</h3>
    <p>This content describes intended privacy boundaries and is not final legal advice or approved legal text. Legal review and production-specific facts remain required.</p>`;

  function openModal(name) {
    modal.dataset.view = name;
    modalTitle.textContent = name === 'preferences' ? 'Manage Cookie Preferences' : name === 'cookie-policy' ? 'Cookie Policy' : 'Privacy Policy';
    modalBody.classList.toggle('consent-modal__policy', name !== 'preferences');
    modalBody.innerHTML = name === 'preferences' ? preferenceMarkup : name === 'cookie-policy' ? cookiePolicyMarkup : privacyPolicyMarkup;
    if (name === 'preferences') {
      const consent = readConsent();
      for (const category of ['analytics', 'preference', 'marketing']) categoryField(category).checked = consent?.categories[category] ?? false;
      modalFooter.innerHTML = '<p>Your choice is stored in this browser. This prototype does not initialize tracking services.</p><button class="btn primary" type="button" data-consent="custom">Save Preferences</button>';
    } else {
      modalFooter.innerHTML = '<span></span><button class="btn" type="button" data-modal-close>Close</button>';
    }
    if (!modal.open) modal.showModal();
  }

  document.querySelectorAll('.public-footer .footer-row').forEach(footer => {
    if (footer.querySelector('[data-cookie-settings]')) return;
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'footer-link';
    settings.dataset.cookieSettings = '';
    settings.textContent = 'Cookie Settings';
    footer.append(settings);
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-cookie-settings]')) return;
    openModal('preferences');
  });

  root.addEventListener('click', event => {
    const modalName = event.target.closest('[data-modal]')?.dataset.modal;
    if (modalName) {
      openModal(modalName);
      return;
    }
    if (event.target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }

    const choice = event.target.closest('[data-consent]')?.dataset.consent;
    if (!choice) return;
    const enabled = name => choice === 'accept_all' || (choice === 'custom' && categoryField(name).checked);
    const consent = {
      version: 1,
      choice,
      categories: { essential: true, analytics: enabled('analytics'), preference: enabled('preference'), marketing: enabled('marketing') },
      updatedAt: new Date().toISOString(),
    };
    try { localStorage.setItem(storageKey, JSON.stringify(consent)); } catch {}
    banner.hidden = true;
    if (choice === 'custom') closeModal();
  });

  modal.addEventListener('cancel', event => {
    event.preventDefault();
    closeModal();
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey) syncBanner();
  });
  syncBanner();
})();

// The sidebar link to Checkout uses the existing anchor navigation and styles.
const applicationLinks = document.querySelector('.app-shell .sidebar .side-links');
if (applicationLinks) {
  const checkoutLink = document.createElement('a');
  checkoutLink.href = checkoutPrototypeURL.href;
  checkoutLink.textContent = 'Checkout';
  if (location.pathname === new URL(checkoutLink.href).pathname) checkoutLink.setAttribute('aria-current', 'page');
  applicationLinks.append(checkoutLink);
}

// Reuse the existing sidebar on phone-sized viewports; desktop markup stays intact.
(() => {
  const shell = document.querySelector('.app-shell');
  const sidebar = shell?.querySelector('.sidebar');
  const main = shell?.querySelector('.app-main');
  const header = main?.querySelector('.app-top');
  if (!sidebar || !main || !header) return;

  // Keep this query in sync with the phone rules in style.css.
  const phone = matchMedia('(max-width: 720px), (max-width: 950px) and (max-height: 500px) and (orientation: landscape)');
  sidebar.id = 'app-navigation';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'btn mobile-menu';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.setAttribute('aria-controls', sidebar.id);
  toggle.setAttribute('aria-haspopup', 'dialog');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span aria-hidden="true">☰</span>';
  const brand = document.createElement('span');
  brand.className = 'brand mobile-brand';
  brand.textContent = 'Tennis AI Coach';
  header.prepend(toggle, brand);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'btn sidebar-close';
  close.setAttribute('aria-label', 'Close navigation');
  close.innerHTML = '<span aria-hidden="true">×</span>';
  sidebar.prepend(close);
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  shell.append(overlay);
  shell.classList.add('mobile-nav-ready');

  let isOpen = false;
  let scrollPosition = 0;
  function closeNavigation(restoreFocus = true) {
    if (!isOpen) return;
    isOpen = false;
    main.inert = false;
    document.body.classList.remove('nav-open');
    document.body.style.removeProperty('--nav-scroll-top');
    window.scrollTo(0, scrollPosition);
    toggle.setAttribute('aria-expanded', 'false');
    overlay.hidden = true;
    if (restoreFocus) toggle.focus({ preventScroll: true });
    sidebar.inert = phone.matches;
    sidebar.setAttribute('aria-hidden', String(phone.matches));
    sidebar.removeAttribute('aria-modal');
  }
  function openNavigation() {
    if (!phone.matches || isOpen) return;
    isOpen = true;
    shell.classList.add('drawer-animated');
    scrollPosition = window.scrollY;
    document.body.style.setProperty('--nav-scroll-top', `-${scrollPosition}px`);
    document.body.classList.add('nav-open');
    overlay.hidden = false;
    sidebar.inert = false;
    sidebar.setAttribute('aria-hidden', 'false');
    sidebar.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    main.inert = true;
    // Focus after the browser applies visibility and removes the drawer's inert state.
    requestAnimationFrame(() => {
      if (isOpen) close.focus({ preventScroll: true });
    });
  }
  function syncViewport() {
    const active = document.activeElement;
    shell.classList.remove('drawer-animated');
    closeNavigation(false);
    sidebar.inert = phone.matches;
    if (phone.matches) {
      if (sidebar.contains(active)) toggle.focus({ preventScroll: true });
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-label', 'Application navigation');
      sidebar.setAttribute('aria-hidden', 'true');
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-label');
      sidebar.removeAttribute('aria-hidden');
      if (active === toggle || active === close) sidebar.querySelector('[aria-current="page"]').focus({ preventScroll: true });
    }
  }
  toggle.addEventListener('click', openNavigation);
  close.addEventListener('click', () => closeNavigation());
  overlay.addEventListener('click', () => closeNavigation());
  sidebar.addEventListener('click', event => {
    if (event.target.closest('a[href]')) closeNavigation();
  });
  document.addEventListener('keydown', event => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeNavigation();
    } else if (event.key === 'Tab') {
      const controls = [...sidebar.querySelectorAll('a[href], button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  phone.addEventListener('change', syncViewport);
  // A page restored from the back/forward cache must not retain a locked drawer.
  window.addEventListener('pageshow', syncViewport);
  syncViewport();
})();

// Wire only extracted library specimens; the original pages retain their handlers.
if (document.body.classList.contains('prototype-library')) {
  document.querySelectorAll('[data-demo]').forEach(button => {
    button.addEventListener('click', () => showDemoNote(button.dataset.demo));
  });
  const volume = document.getElementById('volume');
  const output = document.getElementById('volume-value');
  if (volume && output) {
    volume.addEventListener('input', () => { output.value = volume.value + '%'; });
  }
}

// Shared, panel-scoped demo forms; saved values exist only until page reload.
// An onSave override keeps specialized actions (such as passwords) out of snapshots.
function setupPanelForm(form, { onSave, afterReset } = {}) {
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const note = form.querySelector('[role="status"]');
  const capture = () => fields.map(field => ({
    value: field.value,
    checked: field.checked,
    files: field.type === 'file' ? field.files : null
  }));
  // Demo-only state: each panel owns its own saved values until reload.
  let saved = capture();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (onSave) { onSave(); return; }
    saved = capture();
    note.textContent = 'Changes saved for this panel in this preview only. No data was sent to a server; reloading clears these changes.';
    note.hidden = false;
  });
  form.addEventListener('reset', event => {
    event.preventDefault();
    fields.forEach((field, index) => {
      const state = saved[index];
      if (field.type === 'file') field.files = state.files;
      else field.value = state.value;
      if (field.type === 'checkbox' || field.type === 'radio') field.checked = state.checked;
    });
    afterReset?.();
    note.hidden = true;
  });
}
