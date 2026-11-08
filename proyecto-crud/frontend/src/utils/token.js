import { Variables } from '../config/variables'

export const GuardarToken = (token) => {
  localStorage.setItem(Variables.tokenKey, token)
}

export const LeerToken = () => localStorage.getItem(Variables.tokenKey)

export const BorrarToken = () => {
  localStorage.removeItem(Variables.tokenKey)
}

export const UsuarioDesdeToken = (token) => {
  if (!token) return null

  try {
    const parte = token.split('.')[1]
    const base64 = parte.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((caracter) => `%${caracter.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    const datos = JSON.parse(json)
    if (!datos.nombre || !datos.perfil || !datos.correo) return null
    if (datos.exp && datos.exp * 1000 < Date.now()) return null
    return { nombre: datos.nombre, perfil: datos.perfil, correo: datos.correo }
  } catch {
    return null
  }
}
