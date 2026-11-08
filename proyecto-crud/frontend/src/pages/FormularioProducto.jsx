import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Campo from '../components/Campo'
import Miniatura from '../components/Miniatura'
import { ActualizarProducto, CrearProducto, EliminarProducto, ObtenerProducto } from '../service/productoService'
import { payloadProducto, textoNumero } from '../utils/formularioProducto'

const VACIO = { imagen: '', nombre: '', stock: '', precio: '' }

const claseCampo = 'w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20'

const FormularioProducto = () => {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(VACIO)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false)

  useEffect(() => {
    document.title = esEdicion ? 'Editar producto · Almacén' : 'Nuevo producto · Almacén'
  }, [esEdicion])

  useEffect(() => {
    if (!esEdicion) return undefined

    let activo = true
    setCargando(true)
    setErrorCarga('')

    ObtenerProducto(id)
      .then((producto) => {
        if (!activo) return
        setForm({
          imagen: producto.imagen ?? '',
          nombre: producto.nombre ?? '',
          stock: textoNumero(producto.stock),
          precio: textoNumero(producto.precio),
        })
      })
      .catch((err) => {
        if (activo) setErrorCarga(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [esEdicion, id])

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setForm((actual) => ({ ...actual, [name]: value }))
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')
    setGuardando(true)

    try {
      if (esEdicion) {
        await ActualizarProducto(id, payloadProducto(form))
        navigate('/', { state: { aviso: 'Producto actualizado' } })
      } else {
        await CrearProducto(payloadProducto(form))
        navigate('/', { state: { aviso: 'Producto creado' } })
      }
    } catch (err) {
      if (!err.errores || Object.keys(err.errores).length === 0) {
        setErrorGeneral(err.message)
      }
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    setEliminando(true)
    setErrorGeneral('')
    try {
      await EliminarProducto(id)
      navigate('/', { state: { aviso: 'Producto eliminado' } })
    } catch (err) {
      setErrorGeneral(err.message)
      setConfirmarEliminacion(false)
    } finally {
      setEliminando(false)
    }
  }

  if (cargando) {
    return <p className="text-sm text-stone-500">Cargando producto…</p>
  }

  if (errorCarga) {
    return (
      <div className="space-y-3">
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {errorCarga}
        </p>
        <Link to="/" className="text-sm font-medium text-teal-800 hover:text-teal-950">
          Volver al listado
        </Link>
      </div>
    )
  }

  const ocupado = guardando || eliminando

  return (
    <section className="mx-auto max-w-xl">
      <Link to="/" className="text-sm font-medium text-teal-800 hover:text-teal-950">
        Volver al listado
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        {esEdicion ? 'Editar producto' : 'Nuevo producto'}
      </h1>
      <p className="mt-1 text-sm text-stone-600">Imagen (ruta), nombre, stock y precio.</p>

      <form onSubmit={enviar} className="mt-6 space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        {errorGeneral ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {errorGeneral}
          </p>
        ) : null}

        <Campo id="imagen" etiqueta="Imagen (ruta)">
          <input
            id="imagen"
            name="imagen"
            type="text"
            value={form.imagen}
            onChange={cambiar}
            placeholder="http://localhost:8080/imagenes/cafe.svg"
            className={claseCampo}
          />
          <div className="mt-3 flex items-center gap-3">
            <Miniatura src={form.imagen.trim()} alt="Vista previa de la imagen" className="h-16 w-16" />
            <p className="text-xs text-stone-500">Vista previa de la ruta indicada.</p>
          </div>
        </Campo>

        <Campo id="nombre" etiqueta="Nombre">
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={cambiar}
            className={claseCampo}
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="stock" etiqueta="Stock">
            <input
              id="stock"
              name="stock"
              type="text"
              inputMode="numeric"
              value={form.stock}
              onChange={cambiar}
              className={claseCampo}
            />
          </Campo>
          <Campo id="precio" etiqueta="Precio">
            <input
              id="precio"
              name="precio"
              type="text"
              inputMode="decimal"
              value={form.precio}
              onChange={cambiar}
              placeholder="8990 o 8990.50"
              className={claseCampo}
            />
          </Campo>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={ocupado}
            className="inline-flex items-center rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
          >
            Cancelar
          </Link>
          {esEdicion ? (
            confirmarEliminacion ? (
              <span className="flex items-center gap-3 text-sm">
                <span className="text-stone-500">¿Eliminar este producto?</span>
                <button
                  type="button"
                  onClick={eliminar}
                  disabled={ocupado}
                  className="font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
                >
                  {eliminando ? 'Eliminando…' : 'Sí'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarEliminacion(false)}
                  disabled={ocupado}
                  className="font-medium text-stone-700 hover:text-stone-900"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmarEliminacion(true)}
                disabled={ocupado}
                className="text-sm font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
              >
                Eliminar
              </button>
            )
          ) : null}
        </div>
      </form>
    </section>
  )
}

export default FormularioProducto
