export default function ProductVisual({ product, size = "md" }) {
  const { c1, c2 } = product.gradient ?? { c1: "#ff6a3d", c2: "#ffffff" };
  return (
    <div
      className={`product-visual product-visual-${size}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${c2} 0 24%, transparent 26%),
                     radial-gradient(circle at 70% 70%, ${c2} 0 18%, transparent 20%),
                     linear-gradient(135deg, ${c1}, ${c1})`,
      }}
      aria-hidden="true"
    >
      <div className="product-visual-pattern" />
    </div>
  );
}
