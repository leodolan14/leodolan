import { loadTemplate } from "../../js/utils/loadTemplate.js";

const TEMPLATE_PATH = "components/fieldwork-map/fieldwork-map.html";

/**
 * The map iframe (components/fieldwork-map/map.html) is same-origin, so its
 * true content height is readable directly — no postMessage handshake
 * needed. Sized to fit rather than a fixed breakpoint height so panel copy
 * of any length (longer country names, longer fieldwork descriptions) never
 * gets clipped, particularly in the stacked mobile layout.
 */
export async function mountFieldworkMap(root) {
  root.appendChild(await loadTemplate(TEMPLATE_PATH));

  const frame = root.querySelector(".fieldwork-map__frame");

  const syncHeight = () => {
    const body = frame.contentDocument?.body;
    if (body) frame.style.height = `${body.scrollHeight}px`;
  };

  frame.addEventListener("load", () => {
    syncHeight();
    new ResizeObserver(syncHeight).observe(frame.contentDocument.body);
  });
}
