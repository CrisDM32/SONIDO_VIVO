import { apiFetch } from "./client";

// Gracias al proxy configurado en vite.config.js, "/api/auth/..." viaja
// automaticamente hacia ms-usuarios (puerto 8081) sin que el componente
// tenga que saber esa URL.

export function registrar(datos) {
  return apiFetch("/api/auth/registro", { method: "POST", body: datos });
}

export function iniciarSesion(credenciales) {
  return apiFetch("/api/auth/login", { method: "POST", body: credenciales });
}
