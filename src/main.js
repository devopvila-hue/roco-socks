// Roco Socks — interactividad ligera
// - Sticky header shadow toggle
// - Menú móvil
// - Formulario que abre un email pre-redactado (mailto:)
// - Año dinámico en footer

const CONTACT_EMAIL = "hola@rocosocks.test";

// ----- Sticky header shadow -----
const header = document.querySelector("[data-header]");
const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ----- Mobile nav -----
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
  });
  // Cierra al hacer click en un link
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    }),
  );
}

// ----- Año dinámico en footer -----
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ----- Contact form → mailto -----
const form = document.querySelector("[data-contact-form]");
const hint = document.querySelector("[data-form-hint]");
if (form && hint) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const type = (data.get("type") || "").toString().trim();
    const quantity = (data.get("quantity") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !type || !message) {
      hint.textContent = "Por favor, rellena los campos obligatorios.";
      hint.style.color = "var(--brand-strong)";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      hint.textContent = "El email no parece válido.";
      hint.style.color = "var(--brand-strong)";
      return;
    }

    const subject = `Presupuesto Roco Socks — ${type}`;
    const body =
      `Hola Roco Socks,\n\n` +
      `Soy ${name} (${email}).\n\n` +
      `Tipo de proyecto: ${type}\n` +
      `Cantidad estimada: ${quantity || "—"}\n\n` +
      `${message}\n\n` +
      `Gracias.`;

    const mailto =
      `mailto:${encodeURIComponent(CONTACT_EMAIL)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Feedback visual
    const ok = document.createElement("div");
    ok.className = "form-success";
    ok.textContent =
      "¡Listo! Hemos abierto tu cliente de correo con la solicitud. Si no se abre automáticamente, escríbenos a hola@rocosocks.test";
    form.appendChild(ok);
    hint.textContent = "";

    // Abre el cliente de email
    window.location.href = mailto;
  });
}
