import { Rutas } from './endpoints'

export const IniciarSesion = async ({ correo, clave }) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.login, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, clave }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servicio.')
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo iniciar sesión.')
  }

  return datos
}
