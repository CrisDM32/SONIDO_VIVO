const PERFIL_VACIO = {
  telefono: '',
  direccion: '',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
}

const clavePerfil = (correo) => `sv_perfil_${correo}`
const clavePedidos = (correo) => `sv_pedidos_${correo}`

function leerJson(clave, porDefecto) {
  try {
    const datos = localStorage.getItem(clave)
    return datos ? JSON.parse(datos) : porDefecto
  } catch {
    return porDefecto
  }
}

function guardarJson(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // sin almacenamiento disponible: los datos no se conservan
  }
}

export function obtenerPerfil(correo) {
  return { ...PERFIL_VACIO, ...leerJson(clavePerfil(correo), {}) }
}

export function guardarPerfil(correo, perfil) {
  guardarJson(clavePerfil(correo), perfil)
}

export function obtenerPedidos(correo) {
  const pedidos = leerJson(clavePedidos(correo), [])
  return Array.isArray(pedidos) ? pedidos : []
}

export function agregarPedido(correo, pedido) {
  guardarJson(clavePedidos(correo), [pedido, ...obtenerPedidos(correo)])
}
