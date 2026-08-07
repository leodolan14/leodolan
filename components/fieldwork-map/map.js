// Standalone micro-app embedded via <iframe>. Renders a simplified Africa
// basemap (D3 + world-atlas topology) with clickable fieldwork markers.
// Isolated here deliberately: it's the only place in the project that pulls
// in an external charting library, kept out of the main vanilla-JS bundle.

const AFRICA_IDS = [
  12, 24, 204, 72, 854, 108, 132, 120, 140, 148, 174, 178, 180, 262, 818, 226,
  232, 748, 231, 266, 270, 288, 324, 624, 384, 404, 426, 430, 434, 450, 454,
  466, 478, 480, 504, 508, 516, 562, 566, 646, 678, 686, 690, 694, 706, 710,
  728, 729, 834, 768, 788, 800, 894, 716, 732,
];
const NORTH_AFRICA = [12, 818, 434, 504, 788, 732];

const SITES = {
  508: {
    name: "Maputo, Mozambique",
    img: "../../assets/images/maputo-street.png",
    text: "Archival fieldwork on labour and living standards under Portuguese colonial rule; the starting point of the wider Africa @ Work dataset.",
  },
  204: {
    name: "Ganvié, Benin",
    img: "../../assets/images/ganvie-boat.png",
    text: "Fieldwork in the lake village of Ganvié, part of comparative research into colonial labour systems across Francophone and Lusophone Africa.",
  },
  694: {
    name: "Freetown, Sierra Leone",
    img: "../../assets/images/freetown-stadium.png",
    text: "Comparative archival work on colonial labour institutions in British West Africa.",
  },
  710: {
    name: "Johannesburg / Cape Town, South Africa",
    img: "../../assets/images/wits-shutdown.png",
    text: "Extended research stay at the University of the Witwatersrand, contributing to comparative work on Southern African labour markets.",
  },
  24: {
    name: "Angola",
    img: "../../assets/images/benin-motorbikes.png",
    text: "Research on the transition from forced to free labour in colonial Angola’s diamond mines, published in Revista de Historia Industrial.",
  },
};

async function init() {
  const svg = d3.select("svg");
  const projection = d3.geoMercator();
  const path = d3.geoPath().projection(projection);
  const g = svg.append("g");

  const panelImg = document.getElementById("panelimg");
  const panelTitle = document.getElementById("paneltitle");
  const desc = document.getElementById("desc");
  const mapcol = document.getElementById("mapcol");
  const tooltip = document.getElementById("tooltip");

  let topology;
  try {
    topology = await d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json"
    );
  } catch {
    desc.textContent = "The basemap couldn't be loaded — check your connection.";
    return;
  }

  const all = topojson.feature(topology, topology.objects.countries).features;
  const africa = all.filter((f) => AFRICA_IDS.includes(+f.id));
  projection.fitSize([560, 600], { type: "FeatureCollection", features: africa });

  g.selectAll("path.country")
    .data(africa)
    .join("path")
    .attr("class", (f) => "country" + (NORTH_AFRICA.includes(+f.id) ? "" : " ssa"))
    .attr("d", path);

  const markerGroup = svg.append("g");
  const markerNodes = new Map();

  Object.keys(SITES).forEach((id) => {
    const feature = africa.find((f) => +f.id === +id);
    if (!feature) return;

    const [x, y] = path.centroid(feature);
    const node = markerGroup
      .append("g")
      .attr("class", "dot")
      .attr("tabindex", "0")
      .attr("role", "button")
      .attr("aria-label", `Show fieldwork details for ${SITES[id].name}`)
      .attr("transform", `translate(${x},${y})`)
      .on("click", () => selectSite(id))
      .on("mouseenter", () => showTooltip(id, node))
      .on("mouseleave", hideTooltip)
      .on("focus", () => showTooltip(id, node))
      .on("blur", hideTooltip)
      .on("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSite(id);
        }
      });

    node.append("circle").attr("r", 6);
    markerNodes.set(id, node);
  });

  function showTooltip(id, node) {
    const mapRect = mapcol.getBoundingClientRect();
    const dotRect = node.node().getBoundingClientRect();

    tooltip.textContent = SITES[id].name;
    tooltip.style.left = `${dotRect.left + dotRect.width / 2 - mapRect.left}px`;
    tooltip.style.top = `${dotRect.top - mapRect.top}px`;
    tooltip.classList.add("is-visible");
  }

  function hideTooltip() {
    tooltip.classList.remove("is-visible");
  }

  function selectSite(id) {
    markerNodes.forEach((node) => node.classed("active", false));
    markerNodes.get(id)?.classed("active", true);

    const site = SITES[id];
    panelImg.src = site.img;
    panelImg.alt = site.name;
    panelTitle.textContent = site.name;
    desc.textContent = site.text;
  }

  selectSite(Object.keys(SITES)[0]);
}

init();
