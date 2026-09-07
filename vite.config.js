import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // se adapta en el rebuild para GitHub Pages con base relativo
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});
