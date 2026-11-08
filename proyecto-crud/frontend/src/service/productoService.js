import { Variables } from '../config/variables'
import { Rutas } from './endpoints'

export const ListarProductos = async () => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.productos, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem(Variables.tokenKey)}`,
      },
    })
  } catch {
    const error = new Error('No se pudo conectar con el servicio de productos.')
    error.errores = {}
    throw error
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la operación.')
    error.errores = datos.errores || {}
    throw error
  }

  return datos
}

export const ObtenerProducto = async (id) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.producto(id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem(Variables.tokenKey)}`,
      },
    })
  } catch {
    const error = new Error('No se pudo conectar con el servicio de productos.')
    error.errores = {}
    throw error
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la operación.')
    error.errores = datos.errores || {}
    throw error
  }

  return datos
}

export const CrearProducto = async (producto) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.productos, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(Variables.tokenKey)}`,
      },
      body: JSON.stringify(producto),
    })
  } catch {
    const error = new Error('No se pudo conectar con el servicio de productos.')
    error.errores = {}
    throw error
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la operación.')
    error.errores = datos.errores || {}
    throw error
  }

  return datos
}

export const ActualizarProducto = async (id, producto) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.producto(id), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(Variables.tokenKey)}`,
      },
      body: JSON.stringify(producto),
    })
  } catch {
    const error = new Error('No se pudo conectar con el servicio de productos.')
    error.errores = {}
    throw error
  }

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la operación.')
    error.errores = datos.errores || {}
    throw error
  }

  return datos
}

export const EliminarProducto = async (id) => {
  let respuesta

  try {
    respuesta = await fetch(Rutas.producto(id), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem(Variables.tokenKey)}`,
      },
    })
  } catch {
    const error = new Error('No se pudo conectar con el servicio de productos.')
    error.errores = {}
    throw error
  }

  if (respuesta.status === 204) return null

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'No se pudo completar la operación.')
    error.errores = datos.errores || {}
    throw error
  }

  return datos
}
