const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
