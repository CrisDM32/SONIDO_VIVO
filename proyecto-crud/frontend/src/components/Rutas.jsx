import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../context/Sesion'

export const RutaPublica = () => {
  const { activa } = useSesion()
  if (activa) return <Navigate to="/" replace />
  return <Outlet />
}

export const RutaPrivada = () => {
  const { activa } = useSesion()
  if (!activa) return <Navigate to="/login" replace />
  return <Outlet />
}
