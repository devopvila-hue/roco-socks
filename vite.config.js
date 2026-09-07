import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages sirve el sitio bajo /<repo>/. En local/dev usamos "/".
// Override con VITE_BASE=/otro-prefix/ si quieres otra ruta.
const base = process.env.VITE_BASE || "/";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base,
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      proxy: {
        // En dev, Vite hace proxy /api → backend local para evitar CORS.
        // En producción (GitHub Pages), el frontend llama al backend público
        // directamente usando VITE_API_BASE.
        "/api": {
          target: env.VITE_API_BASE_LOCAL || "http://127.0.0.1:3300",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      assetsInlineLimit: 0,
    },
  };
});
