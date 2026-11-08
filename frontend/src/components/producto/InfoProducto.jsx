import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function InfoProducto({ producto }) {
  return (
    <>
      <p className="producto-categoria">{producto.categoria}</p>
      <h1>{producto.nombre}</h1>
      <p className="producto-codigo">Código: {producto.codigo}</p>
      <p className="producto-precio">{formatearPrecioCLP(producto.precio)}</p>
      <p className={`producto-stock ${producto.disponible ? 'disponible' : 'agotado'}`}>
        {producto.disponible ? 'En stock' : 'Agotado'}
      </p>
      <p className="producto-descripcion">{producto.descripcion}</p>
    </>
  )
}
