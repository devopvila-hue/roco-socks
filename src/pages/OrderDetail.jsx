import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { dateShort, money, statusLabel } from "../lib/format.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getOrder(id)
      .then((d) => setOrder(d.order))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <section className="section"><div className="container"><p>Cargando…</p></div></section>;
  if (error) return <section className="section"><div className="container"><p className="error">{error}</p></div></section>;
  if (!order) return null;

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/pedidos">Mis pedidos</Link>
          <span aria-hidden="true">›</span>
          <span>#{order.id.slice(0, 8)}</span>
        </nav>

        <header className="section-head section-head-left">
          <p className="eyebrow">Pedido #{order.id.slice(0, 8)}</p>
          <h1>{statusLabel(order.status)}</h1>
          <p className="muted">Hecho el {dateShort(order.createdAt)}</p>
        </header>

        <div className="order-detail-grid">
          <div>
            <h2>Productos</h2>
            <ul className="order-lines">
              {order.lines.map((l) => (
                <li key={l.id} className="order-line">
                  <div>
                    <p className="order-line-name">{l.productName}</p>
                    <p className="muted small">{l.variantLabel} · SKU {l.sku}</p>
                  </div>
                  <div className="order-line-qty">× {l.quantity}</div>
                  <div className="order-line-total">{money(l.lineTotalCents)}</div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="cart-summary">
            <h3>Resumen</h3>
            <dl>
              <div><dt>Subtotal</dt><dd>{money(order.subtotalCents)}</dd></div>
              <div><dt>Envío</dt><dd>{money(order.shippingCents)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{money(order.totalCents)}</dd></div>
            </dl>
            <h3>Envío</h3>
            <p>{order.shipping.name}<br/>
              {order.shipping.addr1}{order.shipping.addr2 ? `, ${order.shipping.addr2}` : ""}<br/>
              {order.shipping.zip} {order.shipping.city}, {order.shipping.country}<br/>
              {order.shipping.email}
            </p>
            {order.notes && (
              <>
                <h3>Notas</h3>
                <p>{order.notes}</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
