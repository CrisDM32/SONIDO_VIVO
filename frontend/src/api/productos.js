import { apiFetch } from "./client";

// "/api/productos" viaja hacia ms-productos (puerto 8082) via el proxy de Vite.

export function obtenerProductos() {
  return apiFetch("/api/productos");
}

export function obtenerProductoPorId(id) {
  return apiFetch(`/api/productos/${id}`);
}

export function crearProducto(producto) {
  return apiFetch("/api/productos", { method: "POST", body: producto });
}

export function actualizarProducto(id, producto) {
  return apiFetch(`/api/productos/${id}`, { method: "PUT", body: producto });
}

export function eliminarProducto(id) {
  return apiFetch(`/api/productos/${id}`, { method: "DELETE" });
}
