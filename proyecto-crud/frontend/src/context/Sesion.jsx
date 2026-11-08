import { createContext, useContext, useState } from 'react'
import { BorrarToken, GuardarToken, LeerToken, UsuarioDesdeToken } from '../utils/token'

const SesionContext = createContext(null)

const tokenInicial = () => {
  const guardado = LeerToken()
  if (!UsuarioDesdeToken(guardado)) {
    BorrarToken()
    return null
  }
  return guardado
}

export const SesionProvider = ({ children }) => {
  const [token, setToken] = useState(tokenInicial)
  const usuario = UsuarioDesdeToken(token)

  const iniciar = (nuevoToken) => {
    GuardarToken(nuevoToken)
    setToken(nuevoToken)
  }

  const cerrar = () => {
    BorrarToken()
    setToken(null)
  }

  return (
    <SesionContext.Provider value={{ usuario, activa: Boolean(usuario), iniciar, cerrar }}>
      {children}
    </SesionContext.Provider>
  )
}

export const useSesion = () => useContext(SesionContext)
