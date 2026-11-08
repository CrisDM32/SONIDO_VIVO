import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductoTabla from '../components/ProductoTabla'
import { EliminarProducto, ListarProductos } from '../service/productoService'

const ListaProductos = () => {
  const location = useLocation()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState(location.state?.aviso ?? '')

  useEffect(() => {
    document.title = 'Productos · Almacén'
  }, [])

  useEffect(() => {
    if (location.state?.aviso) {
      window.history.replaceState({}, '')
    }
  }, [location.state])

  useEffect(() => {
    let activo = true

    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const data = await ListarProductos()
        if (activo) setProductos(data)
      } catch (err) {
        if (activo) setError(err.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [])

  const eliminar = async (id) => {
    setError('')
    setAviso('')
    try {
      await EliminarProducto(id)
      setProductos((actual) => actual.filter((producto) => producto.id !== id))
      setAviso('Producto eliminado')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="mt-1 text-sm text-stone-600">
            {cargando ? 'Cargando inventario…' : `${productos.length} en inventario`}
          </p>
        </div>
        <Link
          to="/productos/nuevo"
          className="inline-flex items-center rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
        >
          Nuevo producto
        </Link>
      </div>

      {aviso ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900" role="status">
          {aviso}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      {cargando ? <p className="text-sm text-stone-500">Cargando productos…</p> : null}

      {!cargando && !error && productos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-12 text-center">
          <p className="text-sm text-stone-600">No hay productos en el inventario.</p>
          <Link to="/productos/nuevo" className="mt-3 inline-block text-sm font-medium text-teal-800 hover:text-teal-950">
            Crear el primero
          </Link>
        </div>
      ) : null}

      {!cargando && productos.length > 0 ? (
        <ProductoTabla productos={productos} onEliminar={eliminar} />
      ) : null}
    </section>
  )
}

export default ListaProductos
