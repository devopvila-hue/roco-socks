import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { money } from "../lib/format.js";
import { api } from "../api/client.js";

const SHIPPING_CENTS = 350;

export default function Checkout() {
  const { cart, refresh } = useCart();
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    addr1: "",
    addr2: "",
    city: "",
    zip: "",
    country: "ES",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const items = cart?.items ?? [];
  const subtotal = cart?.totalCents ?? 0;
  const shipping = items.length > 0 ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api.createOrder({
        shipping: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          addr1: form.addr1.trim(),
          addr2: form.addr2.trim() || undefined,
          city: form.city.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
        },
        notes: form.notes.trim() || undefined,
      });
      await refresh();
      push({ tone: "success", message: "Pedido creado correctamente." });
      navigate(`/pedidos/${data.order.id}`, { replace: true });
    } catch (err) {
      setError(err.message ?? "No se pudo crear el pedido.");
    } finally {
      setBusy(false);
    }
  }

  if (!loading_cart(cart) && items.length === 0) {
    return (
      <section className="section section-narrow">
        <div className="container">
          <p>Tu carrito está vacío. <Link to="/productos">Ir a la tienda</Link>.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Checkout</p>
          <h1>Tramitar pedido</h1>
        </header>

        <form className="checkout-grid" onSubmit={onSubmit}>
          <div className="checkout-form">
            <h2>Datos de envío</h2>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Nombre completo</label>
                <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="country">País</label>
                <input id="country" required value={form.country} onChange={(e) => update("country", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="addr1">Dirección</label>
              <input id="addr1" required value={form.addr1} onChange={(e) => update("addr1", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="addr2">Complemento (opcional)</label>
              <input id="addr2" value={form.addr2} onChange={(e) => update("addr2", e.target.value)} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="zip">Código postal</label>
                <input id="zip" required value={form.zip} onChange={(e) => update("zip", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="city">Ciudad</label>
                <input id="city" required value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="notes">Notas del pedido (opcional)</label>
              <textarea id="notes" rows="3" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </div>

            <h2>Pago</h2>
            <div className="payment-notice">
              <p>
                <strong>Pagos:</strong> arquitectura preparada (Stripe-ready),
                pasarela no integrada. El pedido queda en estado
                <em> pendiente de pago</em> hasta que un operador lo marque como
                abonado en el panel interno.
              </p>
            </div>

            {error && <p className="error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
              {busy ? "Creando pedido…" : "Confirmar pedido"}
            </button>
          </div>

          <aside className="cart-summary">
            <h3>Tu pedido</h3>
            <ul className="summary-list">
              {items.map((it) => (
                <li key={it.id}>
                  <span>{it.product.name} · {it.variant.size}/{it.variant.color} × {it.quantity}</span>
                  <span>{money(it.lineTotalCents)}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div><dt>Envío</dt><dd>{money(shipping)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
          </aside>
        </form>
      </div>
    </section>
  );
}

function loading_cart(c) { return !c; }
