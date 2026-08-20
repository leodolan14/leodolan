const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isFinePointer = () =>
  window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, summary, label";

export function initCursor() {
  if (!isFinePointer()) return () => {};

  const el = document.createElement("div");
  el.className = "cursor";
  document.body.appendChild(el);

  const ease = prefersReducedMotion() ? 1 : 0.1;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let rafId = null;

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    el.classList.add("is-active");
  }

  function onOver(e) {
    if (e.target.closest(HOVER_SELECTOR)) el.classList.add("is-hover");
  }

  function onOut(e) {
    if (e.target.closest(HOVER_SELECTOR)) el.classList.remove("is-hover");
  }

  function onWindowOut(e) {
    if (!e.relatedTarget) el.classList.remove("is-active");
  }

  function tick() {
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseover", onOver);
  document.addEventListener("mouseout", onOut);
  window.addEventListener("mouseout", onWindowOut);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
    window.removeEventListener("mouseout", onWindowOut);
    el.remove();
  };
}
