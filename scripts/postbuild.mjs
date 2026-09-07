// Post-build: copia index.html a 404.html para que GitHub Pages
// sirva el SPA en cualquier ruta desconocida.
import { copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, "../dist");
const indexPath = resolve(dist, "index.html");
const notFoundPath = resolve(dist, "404.html");

if (!existsSync(indexPath)) {
  console.error("postbuild: dist/index.html no existe. ¿corriste `vite build`?");
  process.exit(1);
}

copyFileSync(indexPath, notFoundPath);
console.log("postbuild: dist/404.html creado desde index.html (SPA fallback para GitHub Pages).");
