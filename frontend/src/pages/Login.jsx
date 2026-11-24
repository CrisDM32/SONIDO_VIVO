import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ==========================================================================
   Inicio de sesion. No existia ninguna version HTML previa de esta pagina:
   nace directamente junto con el backend, porque sin login no hay token
   JWT, y sin token el resto de la app (protegida por ProtectedRoute) queda
   inaccesible.
   ========================================================================== */

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      await iniciarSesion(form);
      navigate("/productos");
    } catch (err) {
      // err.message viene directo del backend (ej: "Correo o contrasena incorrectos")
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="contenedor-formulario">
      <h1>Iniciar sesión</h1>
      <p className="subtitulo">Ingresa con tu correo y contraseña para ver el catálogo y comprar.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
          />
        </div>

        {error && <small className="error">{error}</small>}

        <button type="submit" className="boton-principal" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="ir-login">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
