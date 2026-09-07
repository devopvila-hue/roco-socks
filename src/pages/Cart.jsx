import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { money } from "../lib/format.js";
import ProductVisual from "../components/ProductVisual.jsx";

const SHIPPING_CENTS = 350;

export default function Cart() {
  const { cart, loading, refresh, update, remove } = useCart();
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const items = cart?.items ?? [];
  const subtotal = cart?.totalCents ?? 0;
  const shipping = items.length > 0 ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  async function changeQty(itemId, newQty) {
    if (newQty < 1) {
      await remove(itemId);
      push({ tone: "info", message: "Producto eliminado." });
      return;
    }
    try {
      await update(itemId, newQty);
    } catch (e) {
      push({ tone: "error", message: e.message });
    }
  }

  async function removeItem(itemId) {
    try {
      await remove(itemId);
      push({ tone: "info", message: "Producto eliminado." });
    } catch (e) {
      push({ tone: "error", message: e.message });
    }
  }

  function goCheckout() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/carrito" } } });
      return;
    }
    navigate("/checkout");
  }

  if (loading && !cart) {
    return <section className="section"><div className="container"><p>Cargando carrito…</p></div></section>;
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Carrito</p>
          <h2>Tu carrito.</h2>
        </header>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Tu carrito está vacío.</p>
            <Link to="/productos" className="btn btn-primary">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map((it) => (
                <article key={it.id} className="cart-item">
                  <div className="cart-item-visual">
                    <ProductVisual product={it.product} size="sm" />
                  </div>
                  <div className="cart-item-body">
                    <Link to={`/productos/${it.product.slug}`} className="cart-item-title">
                      {it.product.name}
                    </Link>
                    <p className="muted">{it.variant.size} · {it.variant.color}</p>
                    {it.variant.sku && <p className="sku">SKU: {it.variant.sku}</p>}
                    <p className="price">{money(it.unitPriceCents)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button type="button" onClick={() => changeQty(it.id, it.quantity - 1)} aria-label="Reducir cantidad">−</button>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={it.quantity}
                        onChange={(e) => changeQty(it.id, Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                      />
                      <button type="button" onClick={() => changeQty(it.id, it.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button type="button" className="link-btn danger" onClick={() => removeItem(it.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Resumen</h3>
              <dl>
                <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>Envío</dt><dd>{money(shipping)}</dd></div>
                <div className="total"><dt>Total</dt><dd>{money(total)}</dd></div>
              </dl>
              <button type="button" className="btn btn-primary btn-lg" onClick={goCheckout}>
                Tramitar pedido
              </button>
              <p className="muted small">Pagos: integración preparada, no activa por defecto.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
