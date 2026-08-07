import { loadTemplate } from "../../js/utils/loadTemplate.js";
// import { mountFieldworkMap } from "../fieldwork-map/fieldwork-map.js"; // map section commented out for now
import { mountFieldworkGallery } from "../fieldwork-gallery/fieldwork-gallery.js";
import { initReveal } from "../../js/utils/reveal.js";

const TEMPLATE_PATH = "components/research/research.html";

export async function mountResearch(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
  // await mountFieldworkMap(root); // commented out — may come back later
  const disconnectParallax = await mountFieldworkGallery(root);

  const disconnectReveal = initReveal(root);
  return () => {
    disconnectReveal();
    disconnectParallax();
  };
}
