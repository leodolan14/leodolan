import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

// Component fragments (components/**/*.html) are fetched at runtime as plain
// markup, not navigated to as documents — Vite's HTML middleware doesn't know
// the difference and injects its HMR client script into every .html it
// serves. That script never executes (script tags inserted via innerHTML are
// inert) but it still clutters the fetched markup, so this plugin serves
// those specific files as raw static content instead, ahead of Vite's own
// HTML transform.
function serveComponentFragmentsRaw() {
  return {
    name: "serve-component-fragments-raw",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (!url.startsWith("/components/") || !url.endsWith(".html")) return next();

        const filePath = path.join(process.cwd(), url);
        fs.readFile(filePath, (err, data) => {
          if (err) return next();
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        });
      });
    },
  };
}

// Everything the JS bundle reaches via `import`/dynamic `import()` — every
// route module, main.scss — gets bundled and hashed by Vite automatically.
// But components fetch their own .html fragments and reference images by
// plain string paths (`fetch("components/nav/nav.html")`, `<img
// src="assets/images/...">`), which Vite's bundler has no way to see. This
// plugin copies exactly those files into the build output, unbundled, at
// the same relative paths the runtime code already expects.
function copyRuntimeFetchedAssets() {
  return {
    name: "copy-runtime-fetched-assets",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve("dist");

      fs.cpSync(path.resolve("components"), path.join(outDir, "components"), {
        recursive: true,
        filter: (src) => fs.statSync(src).isDirectory() || src.endsWith(".html") || src.endsWith("map.js"),
      });

      fs.cpSync(path.resolve("assets/images"), path.join(outDir, "assets/images"), {
        recursive: true,
      });
    },
  };
}

// Vite is the project's build tool for both dev and production: `npm run
// dev` compiles styles/main.scss on the fly (with HMR), and `npm run build`
// produces a deployable dist/. `base: "./"` keeps every asset reference
// relative, so the built site works whether it's served from a domain root
// or a GitHub Pages project subpath.
export default defineConfig({
  base: "./",
  plugins: [serveComponentFragmentsRaw(), copyRuntimeFetchedAssets()],
  server: {
    port: 4173,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
