import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ==========================================================================
   Barra de navegación mínima — NO fue parte de ningún pedido.
   La agrego solo porque una SPA de React necesita algo que dispare los
   cambios de ruta (el equivalente a hacer clic en un <a href="..."> del
   sitio HTML). No reemplaza el header.html real del proyecto.

   NavLink es como un <a>, pero React Router intercepta el clic y cambia
   de componente sin recargar la página (por eso es una SPA: Single Page
   Application, "una sola página" que cambia su contenido por dentro).
   El prop `className` como función permite agregar la clase "activo"
   automáticamente al link de la ruta en la que estás parado.

   Desde que existe sesión (AuthContext), el menú cambia según quién está
   conectado: sin sesión solo se ven Login/Crear cuenta; con sesión se ve
   Productos/Carrito/Cerrar sesión; y el link de Administración solo
   aparece si el rol del usuario es ADMINISTRADOR (ocultar el link no
   reemplaza la restricción real, que la hace ProtectedRoute + el backend,
   pero evita mostrar opciones que ese usuario no podría usar).
   ========================================================================== */
export default function NavBar() {
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/login");
  }

  return (
    <nav className="react-navbar">
      {estaAutenticado ? (
        <>
          <NavLink to="/productos" className={({ isActive }) => (isActive ? "activo" : "")}>
            Productos
          </NavLink>
          <NavLink to="/carrito" className={({ isActive }) => (isActive ? "activo" : "")}>
            Carrito
          </NavLink>
          {usuario?.rol === "ADMINISTRADOR" && (
            <NavLink to="/admin/usuarios" className={({ isActive }) => (isActive ? "activo" : "")}>
              Administración
            </NavLink>
          )}
          <span className="nav-usuario">Hola, {usuario?.nombre?.split(" ")[0]}</span>
          <button type="button" className="nav-cerrar-sesion" onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "activo" : "")}>
            Iniciar sesión
          </NavLink>
          <NavLink to="/registro" className={({ isActive }) => (isActive ? "activo" : "")}>
            Crear cuenta
          </NavLink>
        </>
      )}
    </nav>
  );
}
