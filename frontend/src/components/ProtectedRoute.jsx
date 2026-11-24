import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ==========================================================================
   Restriccion de acceso del frontend (IE3.3.3 de la pauta de EP3).

   Se usa como "Route envoltorio" en App.jsx: las rutas hijas (<Outlet />)
   solo se dibujan si se cumplen las condiciones; si no, se redirige.

   - Sin `rolesPermitidos`: alcanza con estar autenticado (cualquier rol).
   - Con `rolesPermitidos`: ademas, el rol del usuario debe estar en esa
     lista (por ejemplo, el panel de administracion exige ["ADMINISTRADOR"]).
   ========================================================================== */
export default function ProtectedRoute({ rolesPermitidos }) {
  const { estaAutenticado, usuario } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    // Esta autenticado, pero no tiene el rol necesario: lo mandamos al
    // catalogo en vez de a login (ya probo que es un usuario valido).
    return <Navigate to="/productos" replace />;
  }

  return <Outlet />;
}
