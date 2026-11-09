import { createContext } from 'react'

const sinSesion = { usuario: null, activa: false, iniciar: () => {}, cerrar: () => {} }

export const SesionContext = createContext(sinSesion)
