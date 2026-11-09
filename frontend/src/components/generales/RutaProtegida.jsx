import { Navigate } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion.js'

/** Deja pasar solo a quien tenga sesión y uno de los perfiles indicados. */
export default function RutaProtegida({ perfiles, children }) {
  const { usuario, activa } = useSesion()

  if (!activa) return <Navigate to="/iniciar-sesion" replace />
  if (!perfiles.includes(usuario.perfil)) return <Navigate to="/" replace />

  return children
}
