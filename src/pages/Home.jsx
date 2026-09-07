import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import ProductVisual from "../components/ProductVisual.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.listProducts().then((d) => setProducts(d.products)).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Tienda online · Envíos a toda Europa</p>
            <h1>Calcetines con tu logo, tus colores y tu historia.</h1>
            <p className="lead">
              Para particulares que quieren un regalo original y para empresas
              que buscan merchandising útil y diferenciador. Diseño propio,
              producción cuidada, plazos cortos.
            </p>
            <div className="hero-cta">
              <Link to="/productos" className="btn btn-primary">
                Ver tienda
              </Link>
              <a href="#destacados" className="btn btn-ghost">
                Destacados
              </a>
            </div>
            <ul className="hero-trust">
              <li><strong>Sin mínimo</strong> para particulares</li>
              <li><strong>Producción local</strong> y trazable</li>
              <li><strong>Entrega</strong> en 7–14 días</li>
            </ul>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="sock sock-1"></div>
            <div className="sock sock-2"></div>
            <div className="sock sock-3"></div>
          </div>
        </div>
      </section>

      <section id="destacados" className="section">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Catálogo</p>
            <h2>Elige tu estilo.</h2>
            <p className="section-lead">
              Empieza por uno de nuestros packs base. Personalizamos colores,
              tallas, bordados y packaging en cada pedido.
            </p>
          </header>

          <div className="product-grid">
            {products.map((p) => (
              <Link key={p.id} to={`/productos/${p.slug}`} className="product-card">
                <ProductVisual product={p} />
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <p>{p.shortDesc}</p>
                  <div className="product-card-foot">
                    <span className="price">{(p.basePriceCents / 100).toFixed(2)} €</span>
                    {p.badge && <span className="badge">{p.badge}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Cómo se hace</p>
            <h2>De la idea al calcetín en tu casa.</h2>
          </header>
          <ol className="steps">
            <li className="step"><span className="step-num">1</span><h3>Elige</h3><p>Navega el catálogo y selecciona el pack que mejor encaje.</p></li>
            <li className="step"><span className="step-num">2</span><h3>Personaliza</h3><p>Talla, cantidad y notas del diseño que quieras aplicar.</p></li>
            <li className="step"><span className="step-num">3</span><h3>Pide</h3><p>Crea cuenta, confirma el carrito y tramita el pedido.</p></li>
            <li className="step"><span className="step-num">4</span><h3>Recibe</h3><p>Producción y envío con seguimiento desde tu zona de cliente.</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}
