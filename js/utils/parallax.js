const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives a subtle scroll-linked parallax on descendants of `container` that
 * carry a `data-parallax="<multiplier>"` attribute. The rAF loop only runs
 * while `container` is on screen, so idle pages cost nothing.
 *
 * @param {HTMLElement} container - reference element the scroll fraction is measured against.
 * @param {string} [selector] - selector for the elements to translate.
 * @returns {() => void} teardown function.
 */
export function initParallax(container, selector = "[data-parallax]") {
  if (!container || prefersReducedMotion()) return () => {};

  const els = Array.from(container.querySelectorAll(selector));
  if (!els.length) return () => {};

  let rafId = null;

  function tick() {
    const vh = window.innerHeight;
    const rect = container.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));

    els.forEach((el) => {
      const multiplier = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translateY(${(fraction - 0.5) * multiplier}px)`;
    });

    rafId = requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && rafId === null) {
        rafId = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  });

  observer.observe(container);

  return () => {
    observer.disconnect();
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}
