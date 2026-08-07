import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/hero/hero.html";

export async function mountHero(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
}
