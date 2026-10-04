// Keep the content boundaries aligned with the rendered headline in any system font.
(() => {
  const copy = document.querySelector('.hero-copy');
  const headline = copy.querySelector('h1');
  function alignHero() {
    for (const name of ['win', 'train']) {
      const width = headline.querySelector(`[data-align="${name}"]`).getBoundingClientRect().width;
      copy.style.setProperty(`--${name}-boundary`, `${width}px`);
    }
  }
  alignHero();
  new ResizeObserver(alignHero).observe(headline);
  window.addEventListener('resize', alignHero);
  document.fonts.ready.then(alignHero);
})();
