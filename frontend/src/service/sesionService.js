import { Rutas } from './endpoints.js'

export const registrarUsuario = async ({ nombre, correo, rut, telefono, clave }) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.registro, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, correo, rut, telefono, clave }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servicio.')
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo crear la cuenta.')
    // `campo` (rut/correo) llega en 409 y 400; `errores` en validaciones del backend.
    error.campo = datos.campo
    error.errores = datos.errores
    throw error
  }

  return datos
}

export const iniciarSesion =async ({ correo, clave }) => {
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
