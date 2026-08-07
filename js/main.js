import { mountNav } from "../components/nav/nav.js";
import { mountFooter } from "../components/footer/footer.js";
import { initCursor } from "../components/cursor/cursor.js";
import { createRouter } from "./router/router.js";

async function bootstrap() {
  const navRoot = document.getElementById("nav-root");
  const footerRoot = document.getElementById("footer-root");
  const outlet = document.getElementById("app");

  const [nav] = await Promise.all([mountNav(navRoot), mountFooter(footerRoot)]);

  initCursor();
  createRouter({ outlet, nav });
}

bootstrap();
