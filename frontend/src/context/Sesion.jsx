import { useState } from 'react'
import { SesionContext } from './sesionContexto.js'
import { borrarToken, guardarToken, leerToken, usuarioDesdeToken } from '../utils/token.js'

function tokenInicial() {
  const guardado = leerToken()
  if (!usuarioDesdeToken(guardado)) {
    borrarToken()
    return null
  }
  return guardado
}

export function SesionProvider({ children }) {
  const [token, setToken] = useState(tokenInicial)
  const usuario = usuarioDesdeToken(token)

  function iniciar(nuevoToken) {
    guardarToken(nuevoToken)
    setToken(nuevoToken)
  }

  function cerrar() {
    borrarToken()
    setToken(null)
  }

  return (
    <SesionContext.Provider value={{ usuario, activa: Boolean(usuario), iniciar, cerrar }}>
      {children}
    </SesionContext.Provider>
  )
}
