import { vi } from "vitest";
import { productos } from "../../data/productos";

// Lo que devuelve GET /api/v1/productos: los mismos 12 productos, sin código, imágenes ni descripción.
export const productosApi = productos.map(({ id, nombre, categoria, precio, icono, disponible }) => ({
  id,
  nombre,
  categoria,
  precio,
  icono,
  disponible,
}));

/** Simula el backend: el catálogo responde con `lista` (por defecto, los 12 productos). */
export function stubCatalogo(lista = productosApi) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(lista) }))
  );
}
