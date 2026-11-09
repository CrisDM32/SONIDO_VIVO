import { leerToken } from '../utils/token.js'

/**
 * Petición al backend con el token de la sesión. Si falla, lanza un Error con el mensaje del backend y,
 * cuando existen, `status`, `campo` (dato duplicado o inválido) y `errores` (validación por campo).
 */
export async function peticionAutenticada(ruta, { metodo = 'GET', cuerpo } = {}) {
  const token = leerToken()
  const headers = { Accept: 'application/json' }
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servicio.')
  }

  // Las respuestas 204 no traen cuerpo.
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la acción.')
    error.status = respuesta.status
    error.campo = datos.campo
    error.errores = datos.errores
    throw error
  }

  return datos
}
