/* ==========================================================================
   Cliente HTTP compartido para hablar con los microservicios Spring Boot.
   Centraliza 3 cosas que, si no, habria que repetir en cada llamada:
   1) agregar el header Authorization con el token JWT guardado en localStorage,
   2) convertir el body a JSON antes de enviarlo,
   3) leer el error que devuelve el backend (siempre en JSON) y convertirlo
      en un Error de JavaScript normal, para poder usar try/catch en los
      componentes.
   ========================================================================== */

const TOKEN_KEY = "sv_token";

export async function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const respuesta = await fetch(ruta, {
    method: opciones.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined,
  });

  // DELETE devuelve 204 sin cuerpo: no hay nada que parsear como JSON.
  const datos = respuesta.status === 204 ? null : await respuesta.json();

  if (!respuesta.ok) {
    // GlobalExceptionHandler, en ambos microservicios, siempre responde
    // { mensaje: "..." } cuando algo sale mal.
    throw new Error(datos?.mensaje || "Ocurrio un error inesperado. Intenta nuevamente.");
  }

  return datos;
}
