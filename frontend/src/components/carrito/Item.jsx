import { useState } from 'react'
import { formatearPrecioCLP } from '../../utils/carrito.js'
import { productos } from '../../data/productos.js'

export default function CarritoItem({ item, onCantidad, onEliminar }) {
  // La imagen se busca por id en el catálogo (no se guarda en localStorage)
  const imagen = productos.find((producto) => producto.id === item.id)?.imagenes?.[0]

  // Texto mientras se edita el campo de cantidad (null = mostrar la cantidad real).
  // Así se puede borrar el número para escribir otro sin que salte a 1.
  const [borrador, setBorrador] = useState(null)

  function handleCantidad(evento) {
    const texto = evento.target.value
    if (texto === '') {
      setBorrador('')
      return
    }
    setBorrador(null)
    onCantidad(item.id, Number(texto) || 1)
  }

  return (
    <article className="grid grid-cols-[64px_minmax(0,1fr)_auto_minmax(120px,auto)_40px] items-center gap-5 rounded-[10px] border border-[rgb(18_18_18/10%)] bg-paper px-6 py-5 shadow-[0_4px_14px_rgb(18_18_18/8%)] *:min-w-0 tablet:grid-cols-[56px_minmax(130px,1fr)_auto_minmax(100px,auto)_36px] tablet:gap-3 tablet:p-4 mobile:grid-cols-[48px_minmax(0,1fr)_34px] mobile:gap-2.5 mobile:p-3.5">
      {imagen ? (
        <img
          className="block size-16 rounded-sv bg-page object-cover mobile:size-12"
          src={imagen}
          alt={item.nombre}
        />
      ) : (
        <div className="grid size-16 place-items-center rounded-sv bg-page text-[34px] mobile:size-12 mobile:text-[26px]" aria-hidden="true">{item.icono}</div>
      )}

      <div>
        <h2>{item.nombre}</h2>
        <p className="m-0 text-[#555]">{formatearPrecioCLP(item.precio)} c/u</p>
      </div>

      <div className="flex items-center gap-2 mobile:col-start-2" aria-label={`Cantidad de ${item.nombre}`}>
        <button
          type="button"
          className="grid size-[34px] cursor-pointer place-items-center rounded-sv border-0 bg-button text-[20px] text-paper"
          aria-label={`Reducir cantidad de ${item.nombre}`}
          onClick={() => onCantidad(item.id, item.cantidad - 1)}
        >
          -
        </button>
        <input
          type="number"
          className="h-[34px] w-[52px] rounded-sv border border-solid border-[#aaa] bg-white text-center text-ink [font:inherit]"
          aria-label={`Cantidad de ${item.nombre}`}
          value={borrador ?? item.cantidad}
          min="1"
          onChange={handleCantidad}
          onBlur={() => setBorrador(null)}
        />
        <button
          type="button"
          className="grid size-[34px] cursor-pointer place-items-center rounded-sv border-0 bg-button text-[20px] text-paper"
          aria-label={`Aumentar cantidad de ${item.nombre}`}
          onClick={() => onCantidad(item.id, item.cantidad + 1)}
        >
          +
        </button>
      </div>

      <p className="m-0 text-right font-bold text-ink mobile:col-start-2 mobile:text-left">
        {formatearPrecioCLP(item.precio * item.cantidad)}
      </p>

      <button
        type="button"
        className="size-9 cursor-pointer rounded-full border-0 bg-transparent text-[20px] text-[#7d2525] hover:bg-[#f3e1e1] mobile:col-start-3 mobile:row-start-1"
        aria-label={`Eliminar ${item.nombre} del carrito`}
        onClick={() => onEliminar(item.id)}
      >
        ✕
      </button>
    </article>
  )
}
