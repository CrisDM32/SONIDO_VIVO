import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function TarjetaProducto({ producto, agregado, onAgregar }) {
  return (
    <article className="product-item">
      <div className="producto-icono" aria-hidden="true">{producto.icono}</div>
      <p className="producto-categoria">{producto.categoria}</p>
      <h2>{producto.nombre}</h2>
      <p className="producto-precio">{formatearPrecioCLP(producto.precio)}</p>
      <p className={`producto-stock ${producto.disponible ? 'disponible' : 'agotado'}`}>
        {producto.disponible ? 'En stock' : 'Agotado'}
      </p>
      <button
        type="button"
        className="carrito-button"
        disabled={!producto.disponible}
        onClick={() => onAgregar(producto)}
      >
        {!producto.disponible ? 'Agotado' : agregado ? '¡Agregado! ✓' : 'Agregar al carrito'}
      </button>
    </article>
  )
}
