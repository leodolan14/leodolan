import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { qsa } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/nav/nav.html";

/**
 * Mounts the site navigation into `root` and returns the control the
 * router uses to reflect the active route. The nav is `position: fixed`, so
 * it's out of document flow — a ResizeObserver keeps `--nav-height` (used by
 * `.page` for top padding) in sync whenever the nav's own height changes,
 * e.g. wrapping to two rows on narrow viewports.
 */
export async function mountNav(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const nav = root.querySelector(".nav");
  const links = qsa("[data-route-link]", nav);

  const publishHeight = () => {
    document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
  };

  publishHeight();
  new ResizeObserver(publishHeight).observe(nav);

  // Mobile hamburger: a full-screen overlay (.nav__links.is-open) toggled by
  // .nav__toggle. Body scroll is locked while it's open since the overlay
  // covers the viewport; closes on link choice, Escape, or resize past the
  // mobile breakpoint (so it can't get stuck open after a rotation/resize).
  const toggle = nav.querySelector(".nav__toggle");
  const menu = nav.querySelector(".nav__links");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 640 && toggle.getAttribute("aria-expanded") === "true") closeMenu();
  });

  function setActiveRoute(routeName) {
    links.forEach((link) => {
      const isActive = link.dataset.routeLink === routeName;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  return { setActiveRoute };
}
