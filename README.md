# Roco Socks — tienda online

Tienda online funcional de **Roco Socks**, calcetines personalizados
para particulares y empresas. Registro, login, catálogo, carrito
persistente, pedidos, historial y zona privada de cliente.

## URLs

- **Tienda pública:** https://devopvila-hue.github.io/roco-socks/
- **API:** https://api.roco-socks.164.68.100.183.sslip.io
- **Repositorio:** https://github.com/devopvila-hue/roco-socks

## Arquitectura

```
Frontend  →  GitHub Pages  →  https://devopvila-hue.github.io/roco-socks/
                                    │
                                    │  HTTPS (CORS + cookies httpOnly)
                                    ▼
Backend   →  Fastify + Postgres  ←  self-hosted en este host
           ↳  Caddy vhost (HTTPS automático vía Let's Encrypt)
           ↳  sslip.io (DNS dinámico que resuelve al host público)
```

Stack:

- **Frontend:** React 18 + Vite + React Router 6 (SPA)
- **Backend:** Fastify 5 (Node 22) + Postgres 16 (Docker)
- **Auth:** bcrypt + JWT firmado (HS256, cookie `HttpOnly; Secure; SameSite=Lax`)
- **DB:** Postgres con schema dedicado `roco`, RLS-friendly, volumen persistente
- **Hosting:** GitHub Pages (frontend) + Caddy vhost (backend)

## Funcionalidades

| Feature | Ruta | Estado |
|---|---|---|
| Home | `/` | ✅ |
| Catálogo | `/productos` | ✅ |
| Ficha producto | `/productos/:slug` | ✅ con selección talla y color |
| Carrito | `/carrito` | ✅ persistente por usuario |
| Checkout | `/checkout` | ✅ |
| Registro | `/registro` | ✅ |
| Login | `/login` | ✅ |
| Logout | header | ✅ |
| Recuperar contraseña | `/recuperar` | ✅ |
| Reset contraseña | `/restablecer?token=...` | ✅ |
| Mi cuenta | `/cuenta` | ✅ protegida por sesión |
| Mis pedidos | `/pedidos` | ✅ protegida |
| Detalle pedido | `/pedidos/:id` | ✅ protegida |

Aislamiento: cada usuario sólo ve SU carrito y SUS pedidos. Cross-user
access denegado server-side (probado).

## Pagos

Arquitectura preparada para integrar Stripe (campo `payment_intent_id`
planeado en `orders`). El botón "Confirmar pedido" deja el pedido en
estado `pending`. La integración real NO está activa (no se procesan
cobros, no se guardan datos sensibles).

## Variables de entorno

Frontend (build-time):

- `VITE_BASE=/roco-socks/` — base path para GitHub Pages
- `VITE_API_BASE=https://api.roco-socks.164.68.100.183.sslip.io` — API

Backend (server-side):

- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — Postgres
- `JWT_SECRET` — HMAC para firmar tokens
- `COOKIE_SECRET` — cookie parser secret
- `ALLOWED_ORIGINS` — CSV de orígenes CORS permitidos
- `NODE_ENV`, `PORT`, `HOST`, `LOG_LEVEL`

## Comandos

```bash
# Frontend
npm install
npm run dev     # http://127.0.0.1:5173
npm run build   # produce dist/ (incluye 404.html para SPA fallback)
npm test        # 9 tests de integridad
```

```bash
# Backend (en /root/.openclaw/workspace/roco-socks-backend)
npm install
node scripts/migrate.js   # crea schema roco
node scripts/seed.js      # inserta catálogo demo
node src/server.js        # http://127.0.0.1:3300
```

## Aislamiento

- Schema Postgres dedicado (`roco`).
- Caddy vhost propio (`/etc/caddy/conf.d/roco-socks.caddy`) — no toca
  los vhosts de Departify, Noxo, etc.
- Repo GitHub propio (`devopvila-hue/roco-socks`) — no modifica otros.
- Variables en `/opt/roco-socks-backend.env` (host, fuera del repo).

## Catálogo demo

4 productos seed:

- Clásicos Personalizados (desde 14,00 €)
- Deportivos Personalizados (desde 18,00 €)
- Pack Empresa (115,00 €, 50 uds)
- Pack Evento (69,00 €, 30 uds)

## Estado de tests

```
$ npm test
✔ package.json expone scripts mínimos y dependencias React
✔ vite.config.js usa @vitejs/plugin-react y base path
✔ index.html apunta a /src/main.jsx (entry React)
✔ Todas las páginas existen
✔ Contextos React existen
✔ API client llama a /api endpoints
✔ Componentes base existen
✔ CSS responsive y accesible
✔ .gitignore cubre dist y node_modules
ℹ tests 9 / pass 9 / fail 0
```

## Verificación e2e (manual vía curl)

```
✓ Register → 201, usuario creado
✓ Login → 200, cookie HttpOnly Secure
✓ /me con cookie → 200, usuario identificado
✓ Catálogo → 4 productos, 18 variantes
✓ Add to cart → 200, items persistidos
✓ Create order → 201, líneas creadas
✓ Order history → 1 pedido visible
✓ Logout → 204, cookie invalidada
✓ /me tras logout → 401 no_session
✓ Cross-user → María NO ve pedidos de Juan
✓ CORS preflight desde origin de GitHub Pages → 204 OK
```

## Decisiones técnicas

- **React en vez de vanilla JS:** la complejidad (rutas, contextos,
  formularios, carrito) ya no encajaba en un main.js monolítico.
- **React Router (BrowserRouter):** SPA con URLs limpias. GitHub Pages
  sirve 404.html como fallback para rutas internas.
- **JWT en cookie HttpOnly:** seguro frente a XSS; el frontend nunca
  toca el token directamente (lo gestiona el navegador).
- **CORS allowlist explícito:** sólo los orígenes configurados pueden
  hablar con el backend.
- **Sin framework backend:** Fastify con zod cubre auth + CRUD básico
  sin la sobrecarga de NestJS/Express+ORM.
- **Postgres (no SQLite):** la app tendrá múltiples usuarios
  concurrentes; SQLite no escala bien para este caso.
- **Catálogo seed reproducible:** cualquier dev puede clonar, migrar
  y sembrar con un comando.

## Limitaciones conocidas

- No hay panel de admin para marcar pedidos como pagados (la
  arquitectura lo soporta, falta la UI).
- No hay notificaciones por email (los tokens de verificación y reset
  se loguean al backend para debug manual).
- No hay imágenes reales: los productos usan gradientes CSS
  (`gradient_c1`, `gradient_c2` en seed).
- Idioma: español únicamente.
- Sin tests E2E automatizados en CI (los manuales por curl pasan).
