import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/contact/contact.html";

export async function mountContact(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
}
