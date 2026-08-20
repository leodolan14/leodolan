const cache = new Map();

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
