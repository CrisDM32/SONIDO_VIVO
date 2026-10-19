import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="react-navbar">
      <NavLink to="/registro" className={({ isActive }) => (isActive ? "activo" : "")}>
        Crear cuenta
      </NavLink>
      <NavLink to="/productos" className={({ isActive }) => (isActive ? "activo" : "")}>
        Productos
      </NavLink>
      <NavLink to="/carrito" className={({ isActive }) => (isActive ? "activo" : "")}>
        Carrito
      </NavLink>
    </nav>
  );
}
