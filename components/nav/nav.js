import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { qsa } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/nav/nav.html";

export async function mountNav(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const nav = root.querySelector(".nav");
  const links = qsa("[data-route-link]", nav);

  const publishHeight = () => {
    document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
  };

  publishHeight();
  new ResizeObserver(publishHeight).observe(nav);

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
