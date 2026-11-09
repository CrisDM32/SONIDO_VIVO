import { useEffect, useState } from 'react'
import FormularioProducto from './FormularioProducto.jsx'
import TablaProductos from './TablaProductos.jsx'
import {
  cambiarActivo,
  cambiarStock,
  crearProducto,
  editarProducto,
  listarProductos,
} from '../../service/adminService.js'
import { categorias } from '../../data/categorias.js'
import { botonPrincipal, campoError, campoInput, mensajeExito } from '../../styles/clases.js'

export default function AdminProductos({ onError }) {
  const [productos, setProductos] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    listarProductos()
      .then((datos) => {
        if (vigente) setProductos(datos)
      })
      .catch((fallo) => {
        if (vigente) setError(onError(fallo))
      })
    return () => {
      vigente = false
    }
    // `onError` cambia en cada render del panel; solo se recarga cuando se pide explícitamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recarga])

  // Ejecuta una acción sobre un producto y refresca la lista con lo que el servidor confirma.
  async function ejecutar(accion, mensaje) {
    setError('')
    setAviso('')
    try {
      await accion()
      setAviso(mensaje)
      setRecarga((n) => n + 1)
    } catch (fallo) {
      setError(onError(fallo))
    }
  }

  async function guardarProducto(datos) {
    if (formulario.producto) {
      await editarProducto(formulario.producto.id, datos)
      setAviso('Producto actualizado.')
    } else {
      await crearProducto(datos)
      setAviso('Producto creado.')
    }
    setError('')
    setFormulario(null)
    setRecarga((n) => n + 1)
  }

  const texto = busqueda.trim().toLowerCase()
  const visibles = (productos ?? []).filter(
    (p) => (categoria === '' || p.categoria === categoria) && (texto === '' || p.nombre.toLowerCase().includes(texto))
  )

  if (formulario) {
    return (
      <FormularioProducto
        key={formulario.producto?.id ?? 'nuevo'}
        producto={formulario.producto}
        onGuardar={guardarProducto}
        onCancelar={() => setFormulario(null)}
      />
    )
  }

  return (
    <section aria-label="Gestión de productos" className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          aria-label="Buscar producto"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className={`${campoInput(false)} !w-auto min-w-0 flex-1`}
        />
        <select
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
          className={`${campoInput(false)} !w-auto`}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.slug} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>
        <button type="button" className={botonPrincipal} onClick={() => setFormulario({ producto: null })}>
          Nuevo producto
        </button>
      </div>

      {aviso && <p role="status" className={mensajeExito}>{aviso}</p>}
      {error && <p role="alert" className={`m-0 ${campoError}`}>{error}</p>}

      {productos === null && !error ? (
        <p className="m-0 text-ink">Cargando productos…</p>
      ) : (
        <TablaProductos
          productos={visibles}
          onEditar={(producto) => setFormulario({ producto })}
          onCambiarStock={(producto, stock) => ejecutar(() => cambiarStock(producto.id, stock), `Stock de "${producto.nombre}" actualizado.`)}
          onCambiarActivo={(producto, activo) =>
            ejecutar(() => cambiarActivo(producto.id, activo), activo ? `"${producto.nombre}" reactivado.` : `"${producto.nombre}" desactivado.`)
          }
        />
      )}
    </section>
  )
}
