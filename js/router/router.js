const ROUTES = {
  home: {
    title: "Leo Dolan — Economic Historian",
    load: () => import("../../components/home/home.js").then((m) => m.mountHome),
  },
  research: {
    title: "Research — Leo Dolan",
    load: () => import("../../components/research/research.js").then((m) => m.mountResearch),
  },
  publications: {
    title: "Publications — Leo Dolan",
    load: () => import("../../components/publications/publications.js").then((m) => m.mountPublications),
  },
  teaching: {
    title: "Teaching — Leo Dolan",
    load: () => import("../../components/teaching/teaching.js").then((m) => m.mountTeaching),
  },
  contact: {
    title: "Contact — Leo Dolan",
    load: () => import("../../components/contact/contact.js").then((m) => m.mountContact),
  },
};

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES[hash] ? hash : "home";
}

/**
 * Minimal hash router: swaps the content of `outlet`, replays the fade-up
 * entrance animation, and keeps `nav`'s active link in sync. Each route
 * module may return a cleanup function, which runs before the next route
 * mounts.
 */
export function createRouter({ outlet, nav }) {
  let cleanupCurrent = null;

  async function render() {
    const routeName = parseRoute();
    const route = ROUTES[routeName];

    if (typeof cleanupCurrent === "function") cleanupCurrent();

    outlet.innerHTML = "";
    const mount = await route.load();
    cleanupCurrent = (await mount(outlet)) || null;

    document.title = route.title;
    nav.setActiveRoute(routeName);

    window.scrollTo(0, 0);

    // Restart the CSS fade-up animation for the newly mounted route.
    outlet.classList.remove("fade-up");
    // eslint-disable-next-line no-unused-expressions
    outlet.offsetWidth;
    outlet.classList.add("fade-up");
  }

  window.addEventListener("hashchange", render);
  render();
}
