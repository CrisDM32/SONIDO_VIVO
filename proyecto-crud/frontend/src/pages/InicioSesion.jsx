import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSesion } from '../context/Sesion'
import { IniciarSesion } from '../service/sesionService'

const InicioSesion = () => {
  const { iniciar } = useSesion()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)

  const enviar = async (evento) => {
    evento.preventDefault()
    setError('')
    setEntrando(true)

    try {
      const datos = await IniciarSesion({ correo: correo.trim(), clave })
      iniciar(datos.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEntrando(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <section className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-teal-800">Almacén</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <form onSubmit={enviar} className="mt-6 space-y-4">
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-stone-800">
              Correo
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="username"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20"
            />
          </div>
          <div>
            <label htmlFor="clave" className="mb-1.5 block text-sm font-medium text-stone-800">
              Clave
            </label>
            <input
              id="clave"
              name="clave"
              type="password"
              autoComplete="current-password"
              value={clave}
              onChange={(evento) => setClave(evento.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20"
            />
          </div>
          <button
            type="submit"
            disabled={entrando}
            className="w-full rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
          >
            {entrando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default InicioSesion
