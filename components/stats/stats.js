import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { fillTemplate, qs } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/stats/stats.html";

const STATS = [
  { value: "33", label: "Sub-Saharan African countries studied" },
  { value: "9", label: "Countries visited for archival research" },
  { value: "8+", label: "Universities taught at" },
  { value: "2", label: "Published journal articles" },
  { value: "ERC", label: "Africa@Work project funding" },
];

export async function mountStats(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const grid = qs(".stats__grid", root);
  const template = qs(".stats__item-template", grid);

  STATS.forEach((stat) => grid.appendChild(fillTemplate(template, stat)));
}
