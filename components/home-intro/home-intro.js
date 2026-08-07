import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/home-intro/home-intro.html";

export async function mountHomeIntro(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
}
