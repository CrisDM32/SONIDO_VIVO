import { Variables } from '../config/variables.js'

export const Rutas = {
  login: `${Variables.apiUrl}/auth/login`,
  registro: `${Variables.apiUrl}/auth/registro`,
  productos: `${Variables.apiUrl}/productos`,
  adminProductos: `${Variables.apiUrl}/admin/productos`,
  adminUsuarios: `${Variables.apiUrl}/admin/usuarios`,
}
