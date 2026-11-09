import { Variables } from '../config/variables.js'

export function guardarToken(token) {
  try {
    localStorage.setItem(Variables.tokenKey, token)
  } catch {
    // sin almacenamiento disponible: la sesión dura solo mientras la página siga abierta
  }
}

export function leerToken() {
  try {
    return localStorage.getItem(Variables.tokenKey)
  } catch {
    return null
  }
}

export function borrarToken() {
  try {
    localStorage.removeItem(Variables.tokenKey)
  } catch {
    // nada que borrar
  }
}

export function usuarioDesdeToken(token) {
  if (!token) return null

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), (caracter) => caracter.charCodeAt(0))
    const datos = JSON.parse(new TextDecoder().decode(bytes))

    if (!datos.nombre || !datos.perfil || !datos.correo) return null
    if (datos.exp && datos.exp * 1000 < Date.now()) return null

    return { nombre: datos.nombre, perfil: datos.perfil, correo: datos.correo }
  } catch {
    return null
  }
}
