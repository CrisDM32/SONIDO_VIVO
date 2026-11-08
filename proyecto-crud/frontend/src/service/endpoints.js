import { Variables } from '../config/variables'

export const Rutas = {
  login: `${Variables.apiUrl}/auth/login`,
  productos: `${Variables.apiUrl}/productos`,
  producto: (id) => `${Variables.apiUrl}/productos/${id}`,
}
