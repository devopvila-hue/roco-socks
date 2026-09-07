import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { money } from "../lib/format.js";
import ProductVisual from "../components/ProductVisual.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.listProducts()
      .then((d) => setProducts(d.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Tienda</p>
          <h2>Todos los productos.</h2>
          <p className="section-lead">
            Elige el pack base y personaliza al añadirlo al carrito.
          </p>
        </header>

        {loading && <p className="muted">Cargando catálogo…</p>}
        {error && <p className="error">No se pudo cargar el catálogo: {error}</p>}

        <div className="product-grid">
          {products.map((p) => (
            <Link key={p.id} to={`/productos/${p.slug}`} className="product-card">
              <ProductVisual product={p} />
              <div className="product-card-body">
                <h3>{p.name}</h3>
                <p>{p.shortDesc}</p>
                <div className="product-card-foot">
                  <span className="price">desde {money(p.basePriceCents)}</span>
                  {p.badge && <span className="badge">{p.badge}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
