import { Rutas } from './endpoints.js'
import { peticionAutenticada } from './http.js'

// ---------- Productos (administrador y vendedor) ----------
export const listarProductos = () => peticionAutenticada(Rutas.adminProductos)

export const crearProducto = (datos) =>
  peticionAutenticada(Rutas.adminProductos, { metodo: 'POST', cuerpo: datos })

export const editarProducto = (id, datos) =>
  peticionAutenticada(`${Rutas.adminProductos}/${id}`, { metodo: 'PUT', cuerpo: datos })

export const cambiarStock = (id, stock) =>
  peticionAutenticada(`${Rutas.adminProductos}/${id}/stock`, { metodo: 'PATCH', cuerpo: { stock } })

export const cambiarActivo = (id, activo) =>
  peticionAutenticada(`${Rutas.adminProductos}/${id}/activo`, { metodo: 'PATCH', cuerpo: { activo } })

// ---------- Usuarios (solo administrador) ----------
export const buscarUsuarios = ({ q = '', page = 0 } = {}) => {
  const parametros = new URLSearchParams({ q, page: String(page) })
  return peticionAutenticada(`${Rutas.adminUsuarios}?${parametros}`)
}

export const crearPersonal = (datos) =>
  peticionAutenticada(Rutas.adminUsuarios, { metodo: 'POST', cuerpo: datos })

export const cambiarPerfil = (id, perfil) =>
  peticionAutenticada(`${Rutas.adminUsuarios}/${id}/perfil`, { metodo: 'PATCH', cuerpo: { perfil } })

export const eliminarUsuario = (id) =>
  peticionAutenticada(`${Rutas.adminUsuarios}/${id}`, { metodo: 'DELETE' })
