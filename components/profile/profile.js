import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/profile/profile.html";

export async function mountProfile(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
}
