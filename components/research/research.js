import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { mountFieldworkGallery } from "../fieldwork-gallery/fieldwork-gallery.js";
import { initReveal } from "../../js/utils/reveal.js";

const TEMPLATE_PATH = "components/research/research.html";

export async function mountResearch(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
  const disconnectParallax = await mountFieldworkGallery(root);

  const disconnectReveal = initReveal(root);
  return () => {
    disconnectReveal();
    disconnectParallax();
  };
}
