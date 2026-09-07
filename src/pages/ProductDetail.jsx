import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { money } from "../lib/format.js";
import ProductVisual from "../components/ProductVisual.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  const { add } = useCart();
  const { user } = useAuth();
  const { push } = useToast();

  useEffect(() => {
    setLoading(true);
    setVariantId("");
    api.getProduct(slug)
      .then((d) => setProduct(d.product))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const variants = product?.variants ?? [];
  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId],
  );

  // Agrupar variantes por color
  const byColor = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      if (!map.has(v.color)) map.set(v.color, []);
      map.get(v.color).push(v);
    }
    return Array.from(map.entries());
  }, [variants]);

  async function handleAdd() {
    if (!selectedVariant) {
      push({ tone: "warn", message: "Selecciona una talla." });
      return;
    }
    setBusy(true);
    try {
      await add(selectedVariant.id, quantity);
      push({
        tone: "success",
        title: "Añadido al carrito",
        message: `${selectedVariant.size} · ${selectedVariant.color} × ${quantity}`,
      });
    } catch (e) {
      push({ tone: "error", message: e.message ?? "No se pudo añadir." });
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyNow() {
    if (!user) {
      push({ tone: "info", message: "Inicia sesión para comprar." });
      navigate("/login", { state: { from: { pathname: `/productos/${slug}` } } });
      return;
    }
    await handleAdd();
    navigate("/carrito");
  }

  if (loading) return <section className="section"><div className="container"><p>Cargando…</p></div></section>;
  if (error) return <section className="section"><div className="container"><p className="error">{error}</p></div></section>;
  if (!product) return null;

  const unitPrice = selectedVariant
    ? product.basePriceCents + selectedVariant.priceDeltaCents
    : product.basePriceCents;

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/productos">Tienda</Link>
          <span aria-hidden="true">›</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-detail-visual">
            <ProductVisual product={product} size="lg" />
            {product.badge && <span className="badge badge-lg">{product.badge}</span>}
          </div>
          <div className="product-detail-body">
            <h1>{product.name}</h1>
            <p className="muted">{product.shortDesc}</p>
            <p className="price-big">{money(unitPrice)}</p>
            <p className="product-description">{product.description}</p>

            <div className="variant-section">
              <h3>Talla</h3>
              <div className="variant-group">
                {byColor.map(([color, group]) => (
                  <div key={color} className="variant-color">
                    <p className="variant-color-label">{color}</p>
                    <div className="size-list">
                      {group.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          className={`size-btn${variantId === v.id ? " is-selected" : ""}`}
                          onClick={() => setVariantId(v.id)}
                          aria-pressed={variantId === v.id}
                          disabled={v.stock <= 0}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="variant-section">
              <h3>Cantidad</h3>
              <div className="qty-control">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Reducir cantidad">−</button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                />
                <button type="button" onClick={() => setQuantity((q) => Math.min(100, q + 1))} aria-label="Aumentar cantidad">+</button>
              </div>
            </div>

            <div className="product-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleAdd}
                disabled={busy || !selectedVariant}
              >
                Añadir al carrito
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={handleBuyNow}
                disabled={busy || !selectedVariant}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
