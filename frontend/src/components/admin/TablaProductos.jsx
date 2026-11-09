import { useState } from 'react'
import { formatearPrecioCLP } from '../../utils/carrito.js'

const STOCK_BAJO = 5

const celda = 'px-3 py-2.5 align-middle'
const botonFila =
  'cursor-pointer rounded-sv border border-solid border-button bg-transparent px-3 py-1.5 text-[14px] font-semibold text-button hover:bg-button hover:text-paper disabled:cursor-not-allowed disabled:opacity-50'
const botonPeligro =
  'cursor-pointer rounded-sv border border-solid border-[#b42318] bg-transparent px-3 py-1.5 text-[14px] font-semibold text-[#b42318] hover:bg-[#b42318] hover:text-paper'

function Etiqueta({ children, tono }) {
  const colores = {
    rojo: 'bg-[#fde8e8] text-[#b42318]',
    ambar: 'bg-[#fff4d6] text-[#8a5a00]',
    gris: 'bg-[#e6e4e4] text-[#555]',
  }
  return <span className={`ml-2 rounded-full px-2 py-0.5 text-[12px] font-semibold ${colores[tono]}`}>{children}</span>
}

function FilaProducto({ producto, onEditar, onCambiarStock, onCambiarActivo, onCambiarDestacado }) {
  const [stock, setStock] = useState(String(producto.stock))
  const [confirmando, setConfirmando] = useState(false)

  const stockNumero = Number(stock)
  const stockValido = stock !== '' && Number.isInteger(stockNumero) && stockNumero >= 0
  const cambio = stockValido && stockNumero !== producto.stock

  return (
    <tr className={`border-b border-[rgb(18_18_18/10%)] ${producto.activo ? '' : 'bg-[#f3f1f1] text-[#777]'}`}>
      <td className={celda}>
        <span aria-hidden="true" className="mr-2">{producto.icono}</span>
        <strong>{producto.nombre}</strong>
        {producto.codigo && <span className="ml-2 text-[13px] text-[#555]">{producto.codigo}</span>}
        {!producto.activo && <Etiqueta tono="gris">Inactivo</Etiqueta>}
      </td>
      <td className={celda}>{producto.categoria}</td>
      <td className={celda}>{formatearPrecioCLP(producto.precio)}</td>
      <td className={celda}>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min="0"
            aria-label={`Stock de ${producto.nombre}`}
            value={stock}
            onChange={(evento) => setStock(evento.target.value)}
            className="w-20 rounded-lg border border-solid border-[#bbb] bg-white px-2 py-1.5 text-ink"
          />
          <button
            type="button"
            className={botonFila}
            disabled={!cambio}
            aria-label={`Guardar stock de ${producto.nombre}`}
            onClick={() => onCambiarStock(producto, stockNumero)}
          >
            Guardar
          </button>
          {producto.stock === 0 && <Etiqueta tono="rojo">Sin stock</Etiqueta>}
          {producto.stock > 0 && producto.stock <= STOCK_BAJO && <Etiqueta tono="ambar">Stock bajo</Etiqueta>}
        </div>
      </td>
      <td className={`${celda} text-center`}>
        <input
          type="checkbox"
          className="size-[18px] cursor-pointer accent-[#3b3a3a]"
          aria-label={`Destacado: ${producto.nombre}`}
          checked={producto.destacado}
          onChange={(evento) => onCambiarDestacado(producto, evento.target.checked)}
        />
      </td>
      <td className={celda}>
        {confirmando ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Confirmar desactivar ${producto.nombre}`}>
            <span className="text-[14px]">¿Desactivar?</span>
            <button
              type="button"
              className={botonPeligro}
              onClick={() => {
                setConfirmando(false)
                onCambiarActivo(producto, false)
              }}
            >
              Sí, desactivar
            </button>
            <button type="button" className={botonFila} onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={botonFila} aria-label={`Editar ${producto.nombre}`} onClick={() => onEditar(producto)}>
              Editar
            </button>
            {producto.activo ? (
              <button type="button" className={botonPeligro} aria-label={`Desactivar ${producto.nombre}`} onClick={() => setConfirmando(true)}>
                Desactivar
              </button>
            ) : (
              <button type="button" className={botonFila} aria-label={`Reactivar ${producto.nombre}`} onClick={() => onCambiarActivo(producto, true)}>
                Reactivar
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}

export default function TablaProductos({ productos, onEditar, onCambiarStock, onCambiarActivo, onCambiarDestacado }) {
  if (productos.length === 0) {
    return <p className="m-0 rounded-lg bg-[#efeded] px-4 py-3.5 text-ink">No hay productos que coincidan.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-ink">
        <thead>
          <tr className="border-b-2 border-[rgb(18_18_18/20%)] text-[14px]">
            <th className={celda}>Producto</th>
            <th className={celda}>Categoría</th>
            <th className={celda}>Precio</th>
            <th className={celda}>Stock</th>
            <th className={`${celda} text-center`}>Destacado</th>
            <th className={celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            // La clave incluye el stock para reiniciar el campo editable cuando el servidor confirma un cambio.
            <FilaProducto
              key={`${producto.id}-${producto.stock}`}
              producto={producto}
              onEditar={onEditar}
              onCambiarStock={onCambiarStock}
              onCambiarActivo={onCambiarActivo}
              onCambiarDestacado={onCambiarDestacado}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
