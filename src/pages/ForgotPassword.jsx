import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      setDone(true);
    } catch {
      setDone(true); // respuesta genérica para no enumerar cuentas
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section section-narrow">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Cuenta</p>
          <h1>Recuperar contraseña</h1>
        </header>

        {done ? (
          <div className="auth-form">
            <p className="info">
              Si el email existe en nuestro sistema, hemos enviado instrucciones
              para restablecer la contraseña.
            </p>
            <Link to="/login" className="btn btn-ghost">Volver al inicio de sesión</Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
              {busy ? "Enviando…" : "Enviar instrucciones"}
            </button>
            <div className="auth-aside">
              <Link to="/login">Volver al inicio de sesión</Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
