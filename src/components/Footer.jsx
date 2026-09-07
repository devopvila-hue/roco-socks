import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <span className="brand-name">Roco Socks</span>
          <p>Calcetines personalizados. Hechos con cuidado.</p>
        </div>
        <nav aria-label="Enlaces">
          <ul>
            <li><Link to="/productos">Tienda</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
            <li><Link to="/login">Entrar</Link></li>
          </ul>
        </nav>
        <p className="copy">© {new Date().getFullYear()} Roco Socks</p>
      </div>
    </footer>
  );
}
