import { useEffect, useState } from 'react'
import FormularioPersonal from './FormularioPersonal.jsx'
import TablaUsuarios from './TablaUsuarios.jsx'
import { buscarUsuarios, cambiarPerfil, crearPersonal, eliminarUsuario } from '../../service/adminService.js'
import { useSesion } from '../../hooks/useSesion.js'
import { botonPrincipal, botonSecundario, campoError, campoInput, mensajeExito } from '../../styles/clases.js'

export default function AdminUsuarios({ onError }) {
  const { usuario: yo } = useSesion()
  const [consulta, setConsulta] = useState({ q: '', page: 0 })
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [creando, setCreando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    buscarUsuarios(consulta)
      .then((datos) => {
        if (vigente) setResultado(datos)
      })
      .catch((fallo) => {
        if (vigente) setError(onError(fallo))
      })
    return () => {
      vigente = false
    }
    // `onError` cambia en cada render del panel; solo se recarga si cambia la consulta o se pide recargar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta, recarga])

  function handleBuscar(evento) {
    evento.preventDefault()
    setAviso('')
    setError('')
    setConsulta({ q: texto.trim(), page: 0 })
  }

  async function ejecutar(accion, mensaje) {
    setError('')
    setAviso('')
    try {
      await accion()
      setAviso(mensaje)
      setRecarga((n) => n + 1)
    } catch (fallo) {
      setError(onError(fallo))
      // El selector vuelve al valor real si el servidor rechazó el cambio.
      setRecarga((n) => n + 1)
    }
  }

  async function guardarPersonal(datos) {
    await crearPersonal(datos)
    setError('')
    setAviso('Usuario creado.')
    setCreando(false)
    setRecarga((n) => n + 1)
  }

  if (creando) {
    return <FormularioPersonal onGuardar={guardarPersonal} onCancelar={() => setCreando(false)} />
  }

  return (
    <section aria-label="Gestión de usuarios" className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleBuscar} role="search" className="flex min-w-0 flex-1 flex-wrap gap-3">
          <input
            type="search"
            aria-label="Buscar usuario"
            placeholder="Nombre, correo o RUT"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            className={`${campoInput(false)} !w-auto min-w-0 flex-1`}
          />
          <button type="submit" className={botonSecundario}>Buscar</button>
        </form>
        <button type="button" className={botonPrincipal} onClick={() => setCreando(true)}>
          Nuevo usuario
        </button>
      </div>

      {aviso && <p role="status" className={mensajeExito}>{aviso}</p>}
      {error && <p role="alert" className={`m-0 ${campoError}`}>{error}</p>}

      {resultado === null && !error ? (
        <p className="m-0 text-ink">Cargando usuarios…</p>
      ) : (
        resultado && (
          <>
            <TablaUsuarios
              usuarios={resultado.contenido}
              correoActual={yo?.correo}
              onCambiarPerfil={(u, perfil) =>
                ejecutar(() => cambiarPerfil(u.id, perfil), `Ahora ${u.nombre} tiene perfil ${perfil}.`)
              }
              onEliminar={(u) => ejecutar(() => eliminarUsuario(u.id), `Usuario ${u.nombre} eliminado.`)}
            />

            <div className="flex items-center justify-between gap-3 text-ink">
              <span>{resultado.total} usuario(s)</span>
              {resultado.totalPaginas > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={botonSecundario}
                    disabled={resultado.pagina === 0}
                    onClick={() => setConsulta((c) => ({ ...c, page: c.page - 1 }))}
                  >
                    Anterior
                  </button>
                  <span>Página {resultado.pagina + 1} de {resultado.totalPaginas}</span>
                  <button
                    type="button"
                    className={botonSecundario}
                    disabled={resultado.pagina + 1 >= resultado.totalPaginas}
                    onClick={() => setConsulta((c) => ({ ...c, page: c.page + 1 }))}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </>
        )
      )}
    </section>
  )
}
