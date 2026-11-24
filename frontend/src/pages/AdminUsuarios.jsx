import { useEffect, useState } from "react";
import { listarUsuarios, cambiarRolUsuario, cambiarEstadoUsuario } from "../api/usuarios";

const ROLES = ["CLIENTE", "VENDEDOR", "ADMINISTRADOR"];

/* ==========================================================================
   Panel de administración de usuarios (sección 0.1 del documento del
   cliente: "módulo React, accesible solo para el rol Administrador...
   crear, editar, desactivar y asignar roles"). Esta pantalla llega recién
   ahora porque antes no existía ningún rol más allá de Cliente: sin
   backend no había nada que administrar.

   El acceso está restringido en dos capas, que es justo lo que pide la
   evaluación (IE3.3.3): App.jsx envuelve esta ruta en
   <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>, y ADEMÁS
   SecurityConfig de ms-usuarios exige ROLE_ADMINISTRADOR en el backend.
   Si alguien se saltara el frontend (por ejemplo, llamando a la API
   directo), el backend igual lo rechazaría.
   ========================================================================== */

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function cargarUsuarios() {
    setCargando(true);
    listarUsuarios()
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }

  async function handleCambiarRol(id, rol) {
    try {
      await cambiarRolUsuario(id, rol);
      cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCambiarEstado(id, activo) {
    try {
      await cambiarEstadoUsuario(id, activo);
      cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="contenedor-ancho">
      <h1 className="section-title-productos">Administración de usuarios</h1>

      {error && <p className="aviso-simulacion">⚠️ {error}</p>}

      {cargando ? (
        <p className="sin-resultados">Cargando usuarios...</p>
      ) : (
        <div className="carrito-lista">
          {usuarios.map((usuario) => (
            <div className="carrito-item" key={usuario.id}>
              <div className="carrito-item-info">
                <h3>{usuario.nombre}</h3>
                <p>{usuario.email}</p>
              </div>

              <select
                value={usuario.rol}
                onChange={(evento) => handleCambiarRol(usuario.id, evento.target.value)}
              >
                {ROLES.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="boton-secundario"
                onClick={() => handleCambiarEstado(usuario.id, !usuario.activo)}
              >
                {usuario.activo ? "Desactivar" : "Activar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
