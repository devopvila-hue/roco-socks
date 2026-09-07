import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useToast } from "../contexts/ToastContext.jsx";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const { push } = useToast();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.resetPassword(token, password);
      push({ tone: "success", message: "Contraseña actualizada." });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message ?? "No se pudo restablecer la contraseña.");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <section className="section section-narrow">
        <div className="container">
          <p>Enlace inválido o caducado.</p>
          <Link to="/recuperar" className="btn btn-ghost">Pedir uno nuevo</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section section-narrow">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Cuenta</p>
          <h1>Nueva contraseña</h1>
        </header>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="password">Nueva contraseña (mín. 8 caracteres)</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </form>
      </div>
    </section>
  );
}
