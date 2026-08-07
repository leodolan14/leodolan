const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Adds `.is-visible` to elements matching `selector` once they scroll into
 * view. Used both for the whole-section fade/translate in `.reveal`
 * (`_mixins.scss`) and for smaller scroll-triggered effects, like an
 * underline drawing in, that key off the same class on their own elements.
 * Returns a disconnect function so callers can tear it down on unmount.
 *
 * @param {ParentNode} scope - root to search for targets.
 * @param {string} [selector] - defaults to the whole-section reveal class.
 */
export function initReveal(scope = document, selector = ".reveal") {
  const targets = Array.from(scope.querySelectorAll(selector));
  if (!targets.length) return () => {};

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
