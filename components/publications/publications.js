import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { qs } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/publications/publications.html";

// INSTRUCTIONS: how to add a new publication
// Copy one of the { ... } blocks below (including the comma after it) and
// paste it as a new entry in the list, then edit its text:
// - authorYear: e.g. "Dolan, L. (2025)."
// - title: the article's title (this becomes the clickable link text)
// - journal: the journal name, ending in a comma
// - meta: volume/issue/pages, e.g. "78(4), 1039–1067."
// - link: the web address the title should link to (the DOI page, if there is one)
// To remove a publication, delete its whole { ... } block.
const PUBLICATIONS = [
  {
    authorYear: "Dolan, L. (2025).",
    title: "Living standards and forced labour: A comparative study of colonial Africa, 1918–74.",
    journal: "The Economic History Review,",
    meta: "78(4), 1039–1067.",
    link: "https://onlinelibrary.wiley.com/doi/full/10.1111/ehr.13415",
  },
  {
    authorYear: "Dolan, L. (2024).",
    title: "Explaining the transition from forced to free labour in colonial Angola's diamond mines.",
    journal: "Revista de Historia Industrial—Industrial History Review,",
    meta: "33(92), 161–198.",
    link: "https://revistes.ub.edu/index.php/HistoriaIndustrial/article/view/44588",
  },
];

// INSTRUCTIONS: how to add a new working paper
// Copy one of the { ... } blocks below (including the comma after it) and
// paste it as a new entry, then edit its text:
// - title: the paper's title
// - coauthors: e.g. "with Samuel Jones and Peter Gibbon." (leave as an empty
//   string "" if there are no co-authors)
// To remove a working paper, delete its whole { ... } block.
const WORKING_PAPERS = [
    {
    title: "Unearthing Profit: Coercive Labour and Firm Performance in 20th Century African Diamond Mines", 
    coauthors: "with Dácil Juif and Leo Kukić.",
  },
  {
    title: "The Opportunity Cost of Contrato: Forced Wage Labour in Portuguese Africa, 1910–1974",
    coauthors: "with Samuel Jones and Peter Gibbon.",
  },
  {
    title: "Survivors, Indigenous Groups and States: Differential constraints and outcomes in contemporary Slavery- and Colonialism-related Reparation cases with Sub-Saharan African claimants",
    coauthors: "with Samuel Jones and Peter Gibbon.",
  },
];

function renderPublications(root, entries) {
  const list = qs('[data-list="publications"]', root);
  const template = qs(".publications__item-template", root);

  entries.forEach((entry) => {
    const node = template.content.firstElementChild.cloneNode(true);
    qs(".publications__citation", node).innerHTML =
      `<strong>${entry.authorYear}</strong> ` +
      `“<a class="publications__title-link" href="${entry.link}" target="_blank" rel="noopener">${entry.title}</a>” ` +
      `<em>${entry.journal}</em> ${entry.meta}`;
    list.appendChild(node);
  });
}

function renderWorkingPapers(root, entries) {
  const list = qs('[data-list="working-papers"]', root);
  const template = qs(".publications__item-template", root);

  entries.forEach((entry) => {
    const node = template.content.firstElementChild.cloneNode(true);
    qs(".publications__citation", node).innerHTML = `“${entry.title}” — ${entry.coauthors}`;
    list.appendChild(node);
  });
}

export async function mountPublications(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  renderPublications(root, PUBLICATIONS);
  renderWorkingPapers(root, WORKING_PAPERS);
}
