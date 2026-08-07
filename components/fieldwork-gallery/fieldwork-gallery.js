import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { initParallax } from "../../js/utils/parallax.js";
import { initReveal } from "../../js/utils/reveal.js";

const TEMPLATE_PATH = "components/fieldwork-gallery/fieldwork-gallery.html";

export async function mountFieldworkGallery(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const section = root.querySelector(".fieldwork-gallery");
  const disconnectParallax = initParallax(section);
  // Per-photo fade-in only actually shows below `tablet` (see the item's
  // `until(tablet)` opacity rule) — harmless no-op above that.
  const disconnectReveal = initReveal(section, ".fieldwork-gallery__item");

  return () => {
    disconnectParallax();
    disconnectReveal();
  };
}
