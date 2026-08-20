import { loadTemplate } from "../../js/utils/loadTemplate.js";
import { fillTemplate, qs } from "../../js/utils/dom.js";

const TEMPLATE_PATH = "components/teaching/teaching.html";

// INSTRUCTIONS: how to add a new teaching experience
// Copy one of the { ... } lines below (including the comma after it) and
// paste it as a new entry, then edit its text:
// - years: e.g. "2024" for a single year, or "2024–2026" for a range
// - institution: the school or university's name
// - location: the country (or country and city)
// Entries appear on the page in the same order they're listed here, so
// place the new one wherever you'd like it to show up in the timeline.
// To remove an experience, delete its whole { ... } line.
const TEACHING_ENTRIES = [
  { years: "2024–2026", institution: "Universidad Carlos III de Madrid", location: "Spain" },
  { years: "2021–2025", institution: "Hult International Business School", location: "United Kingdom and United Arab Emirates" },
  { years: "2024", institution: "African School of Economics", location: "Benin" },
  { years: "2020–2021", institution: "Comillas Pontifical University", location: "Spain" },
  { years: "2020–2021", institution: "Nebrija University", location: "Spain" },
  { years: "2019–2021", institution: "CEU San Pablo University", location: "Spain" },
  { years: "2018", institution: "University of Antioquia", location: "Colombia" },
  { years: "2018", institution: "RMIT University", location: "Australia" },
];

export async function mountTeaching(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const timeline = qs(".teaching__timeline", root);
  const template = qs(".teaching__entry-template", timeline);
  TEACHING_ENTRIES.forEach((entry) => timeline.appendChild(fillTemplate(template, entry)));
}
