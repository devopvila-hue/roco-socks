import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { refresh } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/cuenta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      await refresh();
      push({ tone: "success", message: "Sesión iniciada." });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message ?? "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section section-narrow">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Cuenta</p>
          <h1>Entrar en tu cuenta</h1>
        </header>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
          <div className="auth-aside">
            <Link to="/recuperar">¿Olvidaste la contraseña?</Link>
            <span>·</span>
            <Link to="/registro">Crear cuenta</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
