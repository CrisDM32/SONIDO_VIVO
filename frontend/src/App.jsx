import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Pago from "./pages/Pago";
import Resumen from "./pages/Resumen";
import AdminUsuarios from "./pages/AdminUsuarios";

/* ==========================================================================
   App.jsx es el "mapa" del sitio: le dice a React qué componente mostrar
   según la URL. Es el equivalente, en una SPA, a tener varios archivos
   .html distintos — pero acá todo vive en un solo documento.

   Desde que existe el backend, las rutas ya no son todas iguales: el
   documento del cliente exige que NINGUNA vista sea accesible sin
   autenticación, excepto login y registro. Por eso todo lo demás queda
   envuelto en <ProtectedRoute>, y /admin/usuarios además exige el rol
   ADMINISTRADOR.
   ========================================================================== */
export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Únicas rutas públicas de todo el sistema. */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Cualquier usuario autenticado (Cliente, Vendedor o Administrador). */}
        <Route element={<ProtectedRoute />}>
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/resumen" element={<Resumen />} />
        </Route>

        {/* Solo rol ADMINISTRADOR (panel de administración, sección 0.1). */}
        <Route element={<ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]} />}>
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        </Route>

        {/* "/" solo redirige a /productos; si no hay sesión, ProtectedRoute
            se encarga de mandar a /login desde ahí. */}
        <Route path="/" element={<Navigate to="/productos" replace />} />
      </Routes>
    </>
  );
}
