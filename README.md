# Roco Socks — web

Sitio web de **Roco Socks**, negocio ficticio de calcetines personalizados
para particulares y empresas.

Construido desde cero como demostración del flujo nativo de OpenClaw:
planificación → código → tests → repositorio → deployment.

## Stack

- HTML semántico (sin framework en runtime)
- CSS moderno con variables (`--brand`, `--ink`, etc.) y `clamp()` para tipografía fluida
- JavaScript vanilla (ESM)
- [Vite](https://vitejs.dev) como build tool y dev server
- 0 backend — el formulario de contacto usa `mailto:` (no requiere credenciales externas)

## Estructura

```
.
├── index.html        # Página única con todas las secciones
├── src/
│   ├── styles.css    # Diseño + responsive
│   └── main.js       # Interactividad (sticky header, menú móvil, formulario)
├── test/             # Tests automatizados
├── vite.config.js
├── package.json
└── README.md
```

## Secciones

1. **Hero** — Propuesta de valor + CTA
2. **Producto** — Qué se puede personalizar y cómo
3. **Ejemplos** — Galería de trabajos recientes
4. **Empresas** — Usos B2B (marketing, RR. HH., eventos, hospitality)
5. **Proceso** — Cómo se hace, paso a paso
6. **Contacto** — Formulario → `mailto:`

## Comandos

```bash
npm install     # instala Vite
npm run dev     # servidor de desarrollo en http://127.0.0.1:5173
npm run build   # compila la web a dist/
npm run preview # sirve dist/ localmente
npm test        # ejecuta los tests
```

## Deployment

Desplegado en **GitHub Pages**. Cada push a `main` se publica
automáticamente.

- Repositorio: [github.com/devopvila-hue/roco-socks](https://github.com/devopvila-hue/roco-socks)
- Web pública: ver URL en la sección "Pages" del repo

## Decisiones

- **Sin framework UI**: el sitio es marketing puro. Cargar React/Vue solo
  para esto sería sobreingeniería y penalizaría el LCP.
- **Vanilla JS en módulo**: pesa ~3 KB y cubre toda la interactividad
  (sticky header, menú móvil, formulario, año dinámico).
- **`mailto:` para el formulario**:
  - 0 dependencias externas
  - 0 credenciales
  - el usuario conserva copia automática en su cliente de email
  - para escalar a producción real se sustituiría por un endpoint
    serverless (sin cambios visibles al cliente)

## Licencia

Demo. Sin licencia explícita.
