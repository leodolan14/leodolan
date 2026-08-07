import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { fillTemplate, qs } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/publications/publications.html";

// Citations are given verbatim, in full — this is the official citation text
// for each piece, not a display convenience, so the wording must match
// exactly. Author/year and journal name carry inline <strong>/<em> markup
// (rendered via innerHTML, not textContent — see renderList below).
const PUBLICATIONS = [
  {
    citation:
      "<strong>Dolan, L. (2025).</strong> Living standards and forced labour: A comparative study of colonial Africa, 1918–74. <em>The Economic History Review,</em> 78(4), 1039–1067.",
    link: "https://onlinelibrary.wiley.com/doi/full/10.1111/ehr.13415",
  },
  {
    citation:
      "<strong>Dolan, L. (2024).</strong> Explaining the transition from forced to free labour in colonial Angola's diamond mines. <em>Revista de Historia Industrial—Industrial History Review,</em> 33(92), 161–198.",
    link: "https://revistes.ub.edu/index.php/HistoriaIndustrial/article/view/44588",
  },
];

const WORKING_PAPERS = [
  {
    citation:
      "Dolan, L., Jones, S. & Gibbon, P. (forthcoming). The Price of Colonial Coercion: An Opportunity-Cost Framework for Reparations in Portuguese Africa. UNU-WIDER Working Paper Series.",
  },
  {
    citation:
      "Dolan, L., Jones, S. & Gibbon, P. (forthcoming). States, descendants and survivors: Differential constraints and outcomes in contemporary slavery- and colonialism-related reparation cases with African claimants.",
  },
];

/** Both lists share one template/style — only the entries (and whether each has a link) differ. */
function renderList(root, listName, entries) {
  const list = qs(`[data-list="${listName}"]`, root);
  const template = qs(".publications__item-template", root);

  entries.forEach((entry) => {
    const node = fillTemplate(template, entry);
    qs(".publications__citation", node).innerHTML = entry.citation;
    const link = qs(".publications__link", node);
    if (entry.link) {
      link.href = entry.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = entry.link;
    } else {
      link.remove();
    }
    list.appendChild(node);
  });
}

export async function mountPublications(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  renderList(root, "publications", PUBLICATIONS);
  renderList(root, "working-papers", WORKING_PAPERS);
}
