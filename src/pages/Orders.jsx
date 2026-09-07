import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { dateShort, money, statusLabel } from "../lib/format.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listOrders()
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Zona privada</p>
          <h1>Mis pedidos</h1>
        </header>

        {loading && <p>Cargando…</p>}
        {!loading && orders.length === 0 && (
          <p>No tienes pedidos todavía. <Link to="/productos">Ir a la tienda</Link>.</p>
        )}
        {!loading && orders.length > 0 && (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(0, 8)}</td>
                  <td>{dateShort(o.createdAt)}</td>
                  <td><span className={`status-pill status-${o.status}`}>{statusLabel(o.status)}</span></td>
                  <td>{money(o.totalCents)}</td>
                  <td><Link to={`/pedidos/${o.id}`} className="link-btn">Ver detalle</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
