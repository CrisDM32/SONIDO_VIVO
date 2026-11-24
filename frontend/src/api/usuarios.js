import { apiFetch } from "./client";

// Todo este archivo habla con ms-usuarios y requiere rol ADMINISTRADOR
// (SecurityConfig de ms-usuarios lo exige del lado del servidor; el
// frontend ademas oculta estas pantallas con ProtectedRoute).

export function listarUsuarios() {
  return apiFetch("/api/usuarios");
}

export function cambiarRolUsuario(id, rol) {
  return apiFetch(`/api/usuarios/${id}/rol`, { method: "PUT", body: { rol } });
}

export function cambiarEstadoUsuario(id, activo) {
  return apiFetch(`/api/usuarios/${id}/estado`, { method: "PUT", body: { activo } });
}
