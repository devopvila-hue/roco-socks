import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const { refresh } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(form.email.trim(), form.password, form.name.trim());
      await refresh();
      push({ tone: "success", message: "Cuenta creada. Bienvenido a Roco Socks." });
      navigate("/cuenta", { replace: true });
    } catch (err) {
      setError(err.message ?? "No se pudo crear la cuenta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section section-narrow">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Cuenta</p>
          <h1>Crear cuenta</h1>
          <p className="section-lead">Accede a tu historial de pedidos y a tu zona privada.</p>
        </header>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" type="text" required autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña (mín. 8 caracteres)</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Creando…" : "Crear cuenta"}
          </button>
          <div className="auth-aside">
            ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
