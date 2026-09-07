import { defineConfig } from "vite";

// GitHub Pages sirve el sitio bajo /<repo>/ — los assets deben usar esa
// base. En local (vite dev) y en preview, Vite ignora `base` salvo al
// construir, así que `dev` sigue funcionando sin prefijo.
const repoName = process.env.GHPAGES_REPO ?? "roco-socks";

export default defineConfig({
  base: `/${repoName}/`,
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});
