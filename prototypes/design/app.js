// Resolve demo navigation from this shared script, including library subdirectories.
const prototypePagesURL = new URL('pages/', document.currentScript.src);

let authMode='login';
function openAuth(mode='login'){const m=document.getElementById('auth');if(!m)return; m.classList.add('open');setAuth(mode);document.getElementById('email')?.focus();}
function closeAuth(){document.getElementById('auth')?.classList.remove('open');}
function setAuth(mode){authMode=mode;const reg=mode==='register';const name=document.getElementById('nameField');if(name)name.hidden=!reg;const submit=document.getElementById('auth-submit');if(submit)submit.textContent=reg?'Create account (demo)':'Log in (demo)';document.getElementById('loginTab')?.classList.toggle('primary',!reg);document.getElementById('registerTab')?.classList.toggle('primary',reg);}
document.getElementById('auth-form')?.addEventListener('submit',e=>{e.preventDefault();window.location.href=new URL('dashboard.html',prototypePagesURL).href;});
document.getElementById('auth')?.addEventListener('click',e=>{if(e.target.id==='auth')closeAuth();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth();});
function toggleDemo(button,first,second){button.dataset.active=button.dataset.active==='yes'?'no':'yes';button.textContent=button.dataset.active==='yes'?second:first;}
function showDemoNote(message){const n=document.getElementById('demo-note');if(n){n.textContent=message;n.hidden=false;}else alert(message);}

// Sidebar links to Pricing and Checkout use the existing anchor navigation and styles.
const applicationLinks = document.querySelector('.app-shell .sidebar .side-links');
if (applicationLinks) {
  const pricingLink = document.createElement('a');
  pricingLink.href = new URL('pricing.html', prototypePagesURL).href;
  pricingLink.textContent = 'Pricing';
  if (location.pathname === new URL(pricingLink.href).pathname) pricingLink.setAttribute('aria-current', 'page');
  applicationLinks.append(pricingLink);
  const checkoutLink = document.createElement('a');
  checkoutLink.href = new URL('checkout.html', prototypePagesURL).href;
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
