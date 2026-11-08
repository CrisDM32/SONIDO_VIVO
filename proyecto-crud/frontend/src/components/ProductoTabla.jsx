import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatoPrecio } from '../utils/formato'
import Miniatura from './Miniatura'

const ProductoTabla = ({ productos, onEliminar }) => {
  const [confirmando, setConfirmando] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  const confirmar = async (id) => {
    setEliminando(id)
    try {
      await onEliminar(id)
    } finally {
      setEliminando(null)
      setConfirmando(null)
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">Listado de productos</caption>
        <thead>
          <tr className="border-b border-stone-200 text-left text-stone-500">
            <th className="px-4 py-3 font-medium" scope="col">Imagen</th>
            <th className="px-4 py-3 font-medium" scope="col">Nombre</th>
            <th className="px-4 py-3 text-right font-medium" scope="col">Stock</th>
            <th className="px-4 py-3 text-right font-medium" scope="col">Precio</th>
            <th className="px-4 py-3 text-right font-medium" scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const enConfirmacion = confirmando === producto.id
            const ocupado = eliminando === producto.id
            return (
              <tr key={producto.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3">
                  <Miniatura src={producto.imagen} alt="" />
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{producto.nombre}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${producto.stock === 0 ? 'text-red-700' : 'text-stone-700'}`}>
                  {producto.stock}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                  {formatoPrecio(producto.precio)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {enConfirmacion ? (
                      <>
                        <span className="text-stone-500">¿Eliminar?</span>
                        <button
                          type="button"
                          className="font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
                          onClick={() => confirmar(producto.id)}
                          disabled={ocupado}
                        >
                          {ocupado ? 'Eliminando…' : 'Sí'}
                        </button>
                        <button
                          type="button"
                          className="font-medium text-stone-700 hover:text-stone-900"
                          onClick={() => setConfirmando(null)}
                          disabled={ocupado}
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/productos/${producto.id}/editar`}
                          className="font-medium text-teal-800 hover:text-teal-950"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="font-medium text-red-700 hover:text-red-900"
                          onClick={() => setConfirmando(producto.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductoTabla
