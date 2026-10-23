import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function CarritoItem({ item, onCantidad, onEliminar }) {
  return (
    <article className="carrito-item">
      <div className="carrito-item-icono" aria-hidden="true">{item.icono}</div>

      <div className="carrito-item-info">
        <h2>{item.nombre}</h2>
        <p>{formatearPrecioCLP(item.precio)} c/u</p>
      </div>

      <div className="carrito-item-cantidad" aria-label={`Cantidad de ${item.nombre}`}>
        <button
          type="button"
          className="btn-cantidad"
          aria-label={`Reducir cantidad de ${item.nombre}`}
          onClick={() => onCantidad(item.id, item.cantidad - 1)}
        >
          -
        </button>
        <input
          type="number"
          className="input-cantidad"
          aria-label={`Cantidad de ${item.nombre}`}
          value={item.cantidad}
          min="1"
          onChange={(evento) => onCantidad(item.id, Number(evento.target.value) || 1)}
        />
        <button
          type="button"
          className="btn-cantidad"
          aria-label={`Aumentar cantidad de ${item.nombre}`}
          onClick={() => onCantidad(item.id, item.cantidad + 1)}
        >
          +
        </button>
      </div>

      <p className="carrito-item-subtotal">
        {formatearPrecioCLP(item.precio * item.cantidad)}
      </p>

      <button
        type="button"
        className="btn-eliminar"
        aria-label={`Eliminar ${item.nombre} del carrito`}
        onClick={() => onEliminar(item.id)}
      >
        ✕
      </button>
    </article>
  )
}
