const ROUTES = {
  home: {
    title: "Leo Dolan — Economic Historian",
    description:
      "Leo Dolan is an economic historian and Postdoctoral Researcher at the University of Groningen, working on labour, living standards and long-run development in Africa and the Global South.",
    load: () => import("../../components/home/home.js").then((m) => m.mountHome),
  },
  research: {
    title: "Research — Leo Dolan",
    description:
      "Leo Dolan's research on colonial labour and living standards, the Africa@Work occupational-history project, and ongoing work on reparations and colonial injustice.",
    load: () => import("../../components/research/research.js").then((m) => m.mountResearch),
  },
  publications: {
    title: "Publications — Leo Dolan",
    description:
      "Peer-reviewed publications and working papers by Leo Dolan on colonial labour systems, living standards and reparations, in the Economic History Review and elsewhere.",
    load: () => import("../../components/publications/publications.js").then((m) => m.mountPublications),
  },
  teaching: {
    title: "Teaching — Leo Dolan",
    description:
      "Leo Dolan's teaching across undergraduate, postgraduate and executive education in economic history, political and social history, corporate strategy and crisis management.",
    load: () => import("../../components/teaching/teaching.js").then((m) => m.mountTeaching),
  },
  contact: {
    title: "Contact — Leo Dolan",
    description: "Contact details for Leo Dolan, Postdoctoral Researcher at the University of Groningen.",
    load: () => import("../../components/contact/contact.js").then((m) => m.mountContact),
  },
};

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES[hash] ? hash : "home";
}

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
    document.querySelector('meta[name="description"]')?.setAttribute("content", route.description);
    nav.setActiveRoute(routeName);

    window.scrollTo(0, 0);

    outlet.classList.remove("fade-up");
    outlet.offsetWidth;
    outlet.classList.add("fade-up");
  }

  window.addEventListener("hashchange", render);
  render();
}
