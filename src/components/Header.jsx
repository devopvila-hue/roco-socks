import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [navigate]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-row">
        <Link to="/" className="brand" aria-label="Roco Socks — Inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="32" height="32">
              <rect width="64" height="64" rx="14" fill="currentColor" />
              <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                <path d="M20 18c0-3 2-5 5-5s5 2 5 5v18c0 7 4 12 9 12" />
              </g>
            </svg>
          </span>
          <span className="brand-name">Roco Socks</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Abrir menú</span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav id="primary-nav" className={`primary-nav${open ? " is-open" : ""}`}>
          <ul>
            <li><NavLink to="/productos">Tienda</NavLink></li>
            {user && <li><NavLink to="/pedidos">Mis pedidos</NavLink></li>}
            <li>
              <NavLink to="/carrito" className="cart-link">
                Carrito{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </NavLink>
            </li>
            {!loading && (user ? (
              <>
                <li><NavLink to="/cuenta">Mi cuenta</NavLink></li>
                <li>
                  <button type="button" className="link-btn" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/login">Entrar</NavLink></li>
                <li><NavLink to="/registro" className="btn btn-primary btn-sm">Crear cuenta</NavLink></li>
              </>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
