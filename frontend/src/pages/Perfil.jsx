import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import DatosCuenta from '../components/perfil/DatosCuenta.jsx'
import FormularioPerfil from '../components/perfil/FormularioPerfil.jsx'
import HistorialPedidos from '../components/perfil/HistorialPedidos.jsx'
import { regionesChile } from '../data/regionesChile.js'
import { useSesion } from '../hooks/useSesion.js'
import { guardarPerfil, obtenerPedidos, obtenerPerfil } from '../utils/perfil.js'
import { validarPerfil } from '../utils/validacionPerfil.js'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

export default function Perfil() {
  const { usuario, activa, cerrar } = useSesion()
  const [saliendo, setSaliendo] = useState(false)

  if (!activa) {
    return <Navigate to={saliendo ? '/' : '/iniciar-sesion'} replace />
  }

  function handleCerrarSesion() {
    setSaliendo(true)
    cerrar()
  }

  return <PerfilUsuario usuario={usuario} onCerrarSesion={handleCerrarSesion} />
}

function PerfilUsuario({ usuario, onCerrarSesion }) {
  const [formulario, setFormulario] = useState(() => obtenerPerfil(usuario.correo))
  const [errores, setErrores] = useState({})
  const [guardado, setGuardado] = useState(false)
  const [pedidos] = useState(() => obtenerPedidos(usuario.correo))

  function handleCambio(evento) {
    const { name, value } = evento.target
    setGuardado(false)
    setFormulario((anterior) => {
      const estado = { ...anterior, [name]: value }

      if (name === 'region') {
        estado.comuna = (regionesChile[value] || [])[0] || ''
      }

      return estado
    })
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nuevosErrores = validarPerfil(formulario)
    setErrores(nuevosErrores)
    setGuardado(false)

    if (Object.keys(nuevosErrores).length > 0) return

    guardarPerfil(usuario.correo, formulario)
    setGuardado(true)
  }

  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Mi perfil</h1>

      <div className="grid gap-6">
        <DatosCuenta usuario={usuario} onCerrarSesion={onCerrarSesion} />
        <FormularioPerfil
          formulario={formulario}
          errores={errores}
          guardado={guardado}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
        />
        <HistorialPedidos pedidos={pedidos} />
      </div>
    </main>
  )
}
