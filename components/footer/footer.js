import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/footer/footer.html";

export async function mountFooter(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));
  const yearEl = root.querySelector('[data-field="year"]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
