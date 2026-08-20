import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

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

function copyRuntimeFetchedAssets() {
  return {
    name: "copy-runtime-fetched-assets",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve("dist");

      fs.cpSync(path.resolve("components"), path.join(outDir, "components"), {
        recursive: true,
        filter: (src) => fs.statSync(src).isDirectory() || src.endsWith(".html"),
      });

      fs.cpSync(path.resolve("assets/images"), path.join(outDir, "assets/images"), {
        recursive: true,
      });
    },
  };
}

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
