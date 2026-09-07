// Tests mínimos del frontend Roco Socks.
// Ejecutar: node --test test/*.test.mjs
// Verifican la integridad del proyecto React sin red.

import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function load(rel) {
  const p = resolve(root, rel);
  if (!existsSync(p)) return null;
  return readFileSync(p, "utf8");
}

test("package.json expone scripts mínimos y dependencias React", () => {
  const pkg = JSON.parse(load("package.json"));
  for (const script of ["dev", "build", "preview", "test"]) {
    assert.ok(pkg.scripts[script], `falta script: ${script}`);
  }
  assert.ok(pkg.dependencies.react, "react debe estar como dependencia");
  assert.ok(pkg.dependencies["react-router-dom"], "react-router-dom debe estar");
  assert.ok(pkg.devDependencies["@vitejs/plugin-react"], "plugin-react debe estar");
});

test("vite.config.js usa @vitejs/plugin-react y base path", () => {
  const cfg = load("vite.config.js");
  assert.ok(cfg.includes("@vitejs/plugin-react"), "debe usar plugin-react");
  assert.ok(cfg.includes("base"), "debe configurar base path");
});

test("index.html apunta a /src/main.jsx (entry React)", () => {
  const html = load("index.html");
  assert.match(html, /\/src\/main\.jsx/, "debe cargar main.jsx");
  assert.match(html, /<div id="root">/, "debe tener root div");
});

test("Todas las páginas existen", () => {
  const pages = [
    "Home.jsx", "Products.jsx", "ProductDetail.jsx", "Cart.jsx",
    "Login.jsx", "Register.jsx", "ForgotPassword.jsx", "ResetPassword.jsx",
    "Account.jsx", "Orders.jsx", "OrderDetail.jsx", "Checkout.jsx",
  ];
  for (const p of pages) {
    assert.ok(existsSync(resolve(root, `src/pages/${p}`)), `falta página ${p}`);
  }
});

test("Contextos React existen", () => {
  for (const c of ["AuthContext", "CartContext", "ToastContext"]) {
    assert.ok(existsSync(resolve(root, `src/contexts/${c}.jsx`)), `falta contexto ${c}`);
  }
});

test("API client llama a /api endpoints", () => {
  const api = load("src/api/client.js");
  assert.ok(api.includes("/api/auth/me"));
  assert.ok(api.includes("/api/products"));
  assert.ok(api.includes("/api/cart"));
  assert.ok(api.includes("/api/orders"));
  assert.ok(api.includes("credentials: \"include\""), "debe enviar cookies");
});

test("Componentes base existen", () => {
  for (const c of ["Header", "Footer", "ProductVisual", "RequireAuth"]) {
    assert.ok(existsSync(resolve(root, `src/components/${c}.jsx`)), `falta componente ${c}`);
  }
});

test("CSS responsive y accesible", () => {
  const css = load("src/styles.css");
  assert.ok(css.includes(":root"), "debe haber :root con variables");
  assert.match(css, /@media\s*\(max-width:\s*860px\)/, "debe haber breakpoints responsive");
  assert.match(css, /prefers-reduced-motion/, "debe respetar prefers-reduced-motion");
  assert.match(css, /:focus-visible/, "debe definir focus visible");
});

test(".gitignore cubre dist y node_modules", () => {
  const gi = load(".gitignore");
  assert.ok(gi.includes("node_modules/"));
  assert.ok(gi.includes("dist/"));
  assert.ok(gi.includes(".env"));
});
