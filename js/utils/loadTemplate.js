const cache = new Map();

/**
 * Fetches a component's HTML fragment once and caches the parsed result so
 * repeated route visits don't re-request the same markup.
 *
 * @param {string} path - URL to the component's .html fragment.
 * @returns {Promise<DocumentFragment>} a fresh clone of the parsed markup.
 */
export async function loadTemplate(path) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
          return res.text();
        })
        .then((html) => {
          const template = document.createElement("template");
          template.innerHTML = html.trim();
          return template.content;
        })
    );
  }

  const content = await cache.get(path);
  return content.cloneNode(true);
}
