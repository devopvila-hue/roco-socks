// Tests mínimos automatizados para Roco Socks web.
// Ejecutar: node --test test/
// Verifican la integridad del HTML/CSS/JS sin necesidad de red.

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

test("package.json expone scripts mínimos", () => {
  const pkg = JSON.parse(load("package.json"));
  assert.equal(pkg.type, "module");
  for (const script of ["dev", "build", "preview", "test"]) {
    assert.ok(pkg.scripts[script], `falta script: ${script}`);
  }
  assert.ok(pkg.devDependencies.vite, "vite debe estar como devDependency");
});

test("index.html tiene las secciones requeridas por la misión", () => {
  const html = load("index.html");
  assert.ok(html, "index.html debe existir");
  const required = [
    "#producto",
    "#ejemplos",
    "#empresas",
    "#proceso",
    "#contacto",
  ];
  for (const sel of required) {
    assert.ok(
      html.includes(`id="${sel.slice(1)}"`),
      `falta sección ${sel} en index.html`,
    );
  }
  // CTA claro
  assert.match(html, /Pide presupuesto/i, "debe haber un CTA de presupuesto");
  // form de contacto
  assert.match(html, /<form[^>]*data-contact-form/, "debe haber un formulario");
});

test("CSS referencia variables modernas y responsive", () => {
  const css = load("src/styles.css");
  assert.ok(css.includes(":root"), "debe haber un bloque :root con variables");
  assert.match(css, /@media\s*\(max-width:\s*860px\)/, "debe haber breakpoints responsive");
  assert.match(css, /prefers-reduced-motion/, "debe respetar prefers-reduced-motion");
});

test("JS exporta interactividad mínima", () => {
  const js = load("src/main.js");
  for (const item of [
    "[data-header]",
    "[data-nav-toggle]",
    "[data-nav]",
    "[data-contact-form]",
    "[data-year]",
  ]) {
    assert.ok(js.includes(item), `JS debe manejar ${item}`);
  }
  // El formulario debe prevenir submit por defecto (usa mailto:)
  assert.match(js, /event\.preventDefault\(\)/, "form debe prevenir submit nativo");
});

test("Archivo .gitignore existe y cubre node_modules/dist", () => {
  const gi = load(".gitignore");
  assert.ok(gi.includes("node_modules/"), "debe ignorar node_modules");
  assert.ok(gi.includes("dist/"), "debe ignorar dist");
});

test("vite.config.js existe y apunta al host loopback", () => {
  const cfg = load("vite.config.js");
  assert.ok(cfg.includes('host: "127.0.0.1"'));
  assert.ok(cfg.includes('port: 5173'));
});
