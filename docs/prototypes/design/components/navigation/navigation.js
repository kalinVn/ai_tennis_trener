// Visual preview controls only. No routing, authentication or session state.
const publicToggle = document.querySelector('.public-menu-toggle');
const publicLinks = document.getElementById('public-links');
function closePublicMenu() {
  publicLinks?.classList.remove('is-open');
  publicToggle?.setAttribute('aria-expanded', 'false');
  publicToggle?.setAttribute('aria-label', 'Open public navigation');
}
publicToggle?.addEventListener('click', () => {
  const open = publicLinks.classList.toggle('is-open');
  publicToggle.setAttribute('aria-expanded', String(open));
  publicToggle.setAttribute('aria-label', open ? 'Close public navigation' : 'Open public navigation');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && publicToggle?.getAttribute('aria-expanded') === 'true') {
    closePublicMenu();
    publicToggle.focus();
  }
});
matchMedia('(max-width:720px)').addEventListener('change', event => {
  if (event.matches && publicLinks?.contains(document.activeElement)) publicToggle.focus();
  if (!event.matches && document.activeElement === publicToggle) publicLinks.querySelector('a').focus();
  closePublicMenu();
});
// Reuse the existing sidebar on phone-sized viewports; desktop markup stays intact.
(() => {
  const shell = document.querySelector('.app-shell');
  const sidebar = shell?.querySelector('.sidebar');
  const main = shell?.querySelector('.app-main');
  const header = main?.querySelector('.app-top');
  if (!sidebar || !main || !header) return;

  // Keep this query in sync with the phone rules in styles.css.
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

