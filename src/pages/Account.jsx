import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { dateShort } from "../lib/format.js";
import { api } from "../api/client.js";

export default function Account() {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listOrders()
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    push({ tone: "info", message: "Has cerrado sesión." });
    navigate("/");
  }

  return (
    <section className="section">
      <div className="container account-grid">
        <aside className="account-side">
          <div className="account-card">
            <p className="muted small">Conectado como</p>
            <p className="account-name">{user?.name}</p>
            <p className="muted">{user?.email}</p>
          </div>
          <nav className="account-nav">
            <Link to="/pedidos">Mis pedidos</Link>
            <Link to="/carrito">Mi carrito</Link>
            <button type="button" className="link-btn danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </nav>
        </aside>
        <div className="account-main">
          <h1>Mi cuenta</h1>
          <p className="muted">Aquí ves un resumen de tu actividad reciente.</p>

          <h2>Últimos pedidos</h2>
          {loading && <p>Cargando…</p>}
          {!loading && orders.length === 0 && (
            <p>Todavía no has hecho ningún pedido. <Link to="/productos">Ir a la tienda</Link>.</p>
          )}
          {!loading && orders.length > 0 && (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/pedidos/${o.id}`}>#{o.id.slice(0, 8)}</Link></td>
                    <td>{dateShort(o.createdAt)}</td>
                    <td>{o.status}</td>
                    <td>{(o.totalCents / 100).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {orders.length > 5 && (
            <p><Link to="/pedidos">Ver todos los pedidos →</Link></p>
          )}
        </div>
      </div>
    </section>
  );
}
